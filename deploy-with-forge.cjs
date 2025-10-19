#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const RPC_URL = "https://testnet-rpc.mocachain.org/";
const CHAIN_ID = 222888;
const PRIVATE_KEY = process.env.MOCA_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ MOCA_PRIVATE_KEY not set in .env");
  process.exit(1);
}

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    console.error(error.message);
    throw error;
  }
}

async function deploy() {
  console.log("🚀 Deploying ProofPass Contracts to Moca Chain Testnet\n");

  // Get deployer address
  const deployer = exec(`cast wallet address --private-key ${PRIVATE_KEY}`);
  console.log(`📝 Deployer: ${deployer}`);
  console.log(`🔗 Network: Moca Chain Testnet (${CHAIN_ID})`);
  console.log(`🌐 RPC: ${RPC_URL}`);

  // Check balance
  const balanceWei = exec(`cast balance ${deployer} --rpc-url ${RPC_URL}`);
  const balanceMoca = (BigInt(balanceWei) / BigInt(10) ** BigInt(18)).toString();
  console.log(`💰 Balance: ${balanceMoca} MOCA\n`);

  if (BigInt(balanceWei) === 0n) {
    console.error("⚠️  Account has no balance. Please fund it first.");
    process.exit(1);
  }

  // Get bytecode from Forge build output
  const ticketNFTJson = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "out/TicketNFT.sol/TicketNFT.json"),
      "utf8"
    )
  );
  const marketplaceJson = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "out/TicketMarketplace.sol/TicketMarketplace.json"),
      "utf8"
    )
  );

  const ticketNFTBytecode = ticketNFTJson.bytecode.object;
  const marketplaceBytecode = marketplaceJson.bytecode.object;

  console.log("1️⃣  Deploying TicketNFT contract...");

  // Deploy TicketNFT
  let ticketNFTTx, ticketNFTAddress;
  try {
    ticketNFTTx = exec(
      `cast send --rpc-url ${RPC_URL} --private-key ${PRIVATE_KEY} --create ${ticketNFTBytecode} --json`
    );
    const txData = JSON.parse(ticketNFTTx);
    ticketNFTAddress = txData.contractAddress;
    console.log(`✅ TicketNFT deployed at: ${ticketNFTAddress}`);
    console.log(`   TX: ${txData.transactionHash}\n`);
  } catch (error) {
    console.error("Failed to deploy TicketNFT");
    throw error;
  }

  console.log("2️⃣  Deploying TicketMarketplace contract...");

  // Encode constructor argument (TicketNFT address)
  const nftAddressEncoded = exec(
    `cast abi-encode "constructor(address)" ${ticketNFTAddress}`
  );

  // Deploy TicketMarketplace
  let marketplaceTx, marketplaceAddress;
  try {
    marketplaceTx = exec(
      `cast send --rpc-url ${RPC_URL} --private-key ${PRIVATE_KEY} --create ${marketplaceBytecode}${nftAddressEncoded.slice(2)} --json`
    );
    const txData = JSON.parse(marketplaceTx);
    marketplaceAddress = txData.contractAddress;
    console.log(`✅ TicketMarketplace deployed at: ${marketplaceAddress}`);
    console.log(`   TX: ${txData.transactionHash}\n`);
  } catch (error) {
    console.error("Failed to deploy TicketMarketplace");
    throw error;
  }

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
    `NEXT_PUBLIC_RPC_URL=${RPC_URL}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_CHAIN_ID=.*/,
    `NEXT_PUBLIC_CHAIN_ID=${CHAIN_ID}`
  );

  fs.writeFileSync(envPath, envContent);

  // Save deployment report
  const report = {
    timestamp: new Date().toISOString(),
    network: "Moca Chain Testnet",
    chainId: CHAIN_ID,
    rpcUrl: RPC_URL,
    deployer,
    contracts: {
      TicketNFT: {
        address: ticketNFTAddress,
        txHash: JSON.parse(ticketNFTTx).transactionHash,
      },
      TicketMarketplace: {
        address: marketplaceAddress,
        txHash: JSON.parse(marketplaceTx).transactionHash,
      },
    },
    blockExplorer: "https://testnet-scan.mocachain.org/",
  };

  fs.writeFileSync(
    path.join(__dirname, "DEPLOYMENT_REPORT.json"),
    JSON.stringify(report, null, 2)
  );

  console.log("✅ Deployment completed successfully!\n");
  console.log("📊 Summary:");
  console.log("════════════════════════════════════════");
  console.log(`TicketNFT:       ${ticketNFTAddress}`);
  console.log(`TicketMarketplace: ${marketplaceAddress}`);
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
}

deploy().catch((error) => {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
});
