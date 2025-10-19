#!/usr/bin/env node

import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contract ABIs
const TICKET_NFT_ABI = [
  "constructor()",
  "function mint(address to, string memory uri) public returns (uint256)",
  "function verify(address user) public view returns (bool)",
];

const TICKET_MARKETPLACE_ABI = [
  "constructor(address nftAddress)",
  "function createEvent(string memory name, uint256 ticketPrice, uint256 maxTickets) public returns (uint256)",
  "function purchaseTicket(uint256 eventId) public payable",
];

// Read contract files
const ticketNFTPath = path.join(__dirname, "contracts", "TicketNFT.sol");
const ticketMarketplacePath = path.join(__dirname, "contracts", "TicketMarketplace.sol");

let ticketNFTCode = fs.readFileSync(ticketNFTPath, "utf8");
let marketplaceCode = fs.readFileSync(ticketMarketplacePath, "utf8");

// Extract bytecode and ABI (for compiled contracts in artifacts)
const artifactsDir = path.join(__dirname, "artifacts", "contracts");

let ticketNFTArtifact = null;
let marketplaceArtifact = null;

if (
  fs.existsSync(path.join(artifactsDir, "TicketNFT.sol", "TicketNFT.json"))
) {
  ticketNFTArtifact = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "TicketNFT.sol", "TicketNFT.json"),
      "utf8"
    )
  );
}

if (
  fs.existsSync(
    path.join(artifactsDir, "TicketMarketplace.sol", "TicketMarketplace.json")
  )
) {
  marketplaceArtifact = JSON.parse(
    fs.readFileSync(
      path.join(
        artifactsDir,
        "TicketMarketplace.sol",
        "TicketMarketplace.json"
      ),
      "utf8"
    )
  );
}

async function main() {
  console.log("🚀 Deploying ProofPass Contracts to Moca Chain Testnet...\n");

  const privateKey = process.env.MOCA_PRIVATE_KEY;
  const rpcUrl = "https://testnet-rpc.mocachain.org/";

  if (!privateKey) {
    throw new Error("❌ MOCA_PRIVATE_KEY not set in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📝 Deployer Address:", wallet.address);
  console.log("🔗 Network: Moca Chain Testnet (222888)");
  console.log("🌐 RPC URL:", rpcUrl);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account Balance:", ethers.formatEther(balance), "MOCA\n");

  if (balance === 0n) {
    console.log("⚠️  Account has no balance. Please fund it first.");
    console.log(`   Send MOCA to: ${wallet.address}`);
    process.exit(1);
  }

  if (!ticketNFTArtifact || !marketplaceArtifact) {
    console.error("❌ Contract artifacts not found!");
    console.error("   Please compile contracts first:");
    console.error("   npx hardhat compile");
    console.error("");
    console.error("   If Hardhat fails, try a simpler approach:");
    console.error("   npm install -g truffle");
    console.error("   truffle compile");
    process.exit(1);
  }

  try {
    console.log(
      "1️⃣  Deploying TicketNFT contract..."
    );

    const ticketNFTFactory = new ethers.ContractFactory(
      ticketNFTArtifact.abi,
      ticketNFTArtifact.bytecode,
      wallet
    );

    const ticketNFT = await ticketNFTFactory.deploy();
    const deploymentTx = ticketNFT.deploymentTransaction();
    console.log("   Transaction:", deploymentTx?.hash);
    console.log("   Waiting for confirmation...");

    const ticketNFTReceipt = await deploymentTx?.wait();
    const ticketNFTAddress = await ticketNFT.getAddress();

    console.log("✅ TicketNFT deployed at:", ticketNFTAddress);
    console.log("   Gas used:", ticketNFTReceipt?.gasUsed.toString(), "\n");

    // Deploy TicketMarketplace
    console.log(
      "2️⃣  Deploying TicketMarketplace contract..."
    );

    const marketplaceFactory = new ethers.ContractFactory(
      marketplaceArtifact.abi,
      marketplaceArtifact.bytecode,
      wallet
    );

    const marketplace = await marketplaceFactory.deploy(ticketNFTAddress);
    const marketplaceTx = marketplace.deploymentTransaction();
    console.log("   Transaction:", marketplaceTx?.hash);
    console.log("   Waiting for confirmation...");

    const marketplaceReceipt = await marketplaceTx?.wait();
    const marketplaceAddress = await marketplace.getAddress();

    console.log("✅ TicketMarketplace deployed at:", marketplaceAddress);
    console.log("   Gas used:", marketplaceReceipt?.gasUsed.toString(), "\n");

    // Update .env file
    const envPath = path.join(__dirname, ".env");
    let envContent = fs.readFileSync(envPath, "utf8");

    envContent = envContent.replace(
      /NEXT_PUBLIC_TICKET_NFT_ADDRESS=.*/,
      `NEXT_PUBLIC_TICKET_NFT_ADDRESS=${ticketNFTAddress}`
    );

    envContent = envContent.replace(
      /NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=.*/,
      `NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=${marketplaceAddress}`
    );

    envContent = envContent.replace(
      /NEXT_PUBLIC_RPC_URL=.*/,
      `NEXT_PUBLIC_RPC_URL=https://testnet-rpc.mocachain.org/`
    );

    envContent = envContent.replace(
      /NEXT_PUBLIC_CHAIN_ID=.*/,
      `NEXT_PUBLIC_CHAIN_ID=222888`
    );

    fs.writeFileSync(envPath, envContent);

    // Save deployment report
    const deploymentReport = {
      timestamp: new Date().toISOString(),
      network: "Moca Chain Testnet",
      chainId: 222888,
      rpcUrl: rpcUrl,
      deployer: wallet.address,
      contracts: {
        TicketNFT: {
          address: ticketNFTAddress,
          txHash: deploymentTx?.hash,
          gasUsed: ticketNFTReceipt?.gasUsed.toString(),
        },
        TicketMarketplace: {
          address: marketplaceAddress,
          txHash: marketplaceTx?.hash,
          gasUsed: marketplaceReceipt?.gasUsed.toString(),
        },
      },
      blockExplorer: "https://testnet-scan.mocachain.org/",
    };

    fs.writeFileSync(
      path.join(__dirname, "DEPLOYMENT_REPORT.json"),
      JSON.stringify(deploymentReport, null, 2)
    );

    console.log("📊 Deployment Report:");
    console.log("════════════════════════════════════════");
    console.log("✅ Deployment completed successfully!");
    console.log("");
    console.log("Contract Addresses:");
    console.log(`  TicketNFT:          ${ticketNFTAddress}`);
    console.log(`  TicketMarketplace:  ${marketplaceAddress}`);
    console.log("");
    console.log("View on Block Explorer:");
    console.log(
      `  https://testnet-scan.mocachain.org/address/${ticketNFTAddress}`
    );
    console.log(
      `  https://testnet-scan.mocachain.org/address/${marketplaceAddress}`
    );
    console.log("");
    console.log("✓ .env file updated with contract addresses");
    console.log("✓ Deployment report saved to DEPLOYMENT_REPORT.json");
    console.log("════════════════════════════════════════");

    return {
      ticketNFT: ticketNFTAddress,
      marketplace: marketplaceAddress,
    };
  } catch (error) {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
