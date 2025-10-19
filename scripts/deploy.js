import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🚀 Starting ProofPass Contract Deployment to Moca Chain Testnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MOCA\n");

  // Deploy TicketNFT
  console.log("1️⃣  Deploying TicketNFT...");
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy();
  await ticketNFT.waitForDeployment();
  const ticketNFTAddress = await ticketNFT.getAddress();
  console.log("✅ TicketNFT deployed at:", ticketNFTAddress);
  console.log("   Transaction hash:", ticketNFT.deploymentTransaction().hash);

  // Deploy TicketMarketplace
  console.log("\n2️⃣  Deploying TicketMarketplace...");
  const TicketMarketplace = await hre.ethers.getContractFactory("TicketMarketplace");
  const ticketMarketplace = await TicketMarketplace.deploy(ticketNFTAddress);
  await ticketMarketplace.waitForDeployment();
  const ticketMarketplaceAddress = await ticketMarketplace.getAddress();
  console.log("✅ TicketMarketplace deployed at:", ticketMarketplaceAddress);
  console.log("   Transaction hash:", ticketMarketplace.deploymentTransaction().hash);

  // Set marketplace as verifier in TicketNFT
  console.log("\n3️⃣  Setting TicketMarketplace as verifier in TicketNFT...");
  const addVerifierTx = await ticketNFT.addVerifier(ticketMarketplaceAddress);
  await addVerifierTx.wait();
  console.log("✅ Verifier added successfully");
  console.log("   Transaction hash:", addVerifierTx.hash);

  // Save addresses to .env
  console.log("\n4️⃣  Updating environment variables...");
  updateEnvFile(ticketNFTAddress, ticketMarketplaceAddress);
  console.log("✅ Environment variables updated in .env");

  // Create deployment report
  const deploymentReport = {
    network: "Moca Chain Testnet",
    chainId: 222888,
    rpcUrl: "https://testnet-rpc.mocachain.org/",
    blockExplorer: "https://testnet-scan.mocachain.org/",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      TicketNFT: {
        address: ticketNFTAddress,
        deploymentHash: ticketNFT.deploymentTransaction().hash,
      },
      TicketMarketplace: {
        address: ticketMarketplaceAddress,
        deploymentHash: ticketMarketplace.deploymentTransaction().hash,
      },
    },
    verification: {
      ticketNFTVerifier: ticketMarketplaceAddress,
      status: "TicketMarketplace added as verifier",
    },
  };

  // Save deployment report
  const reportPath = path.join(__dirname, "DEPLOYMENT_REPORT.json");
  fs.writeFileSync(reportPath, JSON.stringify(deploymentReport, null, 2));
  console.log("✅ Deployment report saved to DEPLOYMENT_REPORT.json");

  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(70));
  console.log("\n📋 Deployment Summary:");
  console.log(`   Network: ${deploymentReport.network}`);
  console.log(`   Chain ID: ${deploymentReport.chainId}`);
  console.log(`   Deployer: ${deploymentReport.deployer}`);
  console.log(`\n📋 Contract Addresses:`);
  console.log(`   TicketNFT: ${ticketNFTAddress}`);
  console.log(`   TicketMarketplace: ${ticketMarketplaceAddress}`);
  console.log(`\n🔗 View on Block Explorer:`);
  console.log(`   TicketNFT: https://testnet-scan.mocachain.org/address/${ticketNFTAddress}`);
  console.log(`   TicketMarketplace: https://testnet-scan.mocachain.org/address/${ticketMarketplaceAddress}`);
  console.log("\n" + "=".repeat(70));
}

function updateEnvFile(ticketNFTAddress, ticketMarketplaceAddress) {
  const envPath = path.join(__dirname, ".env");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Update contract addresses
  envContent = envContent.replace(
    /NEXT_PUBLIC_TICKET_NFT_ADDRESS=.*/,
    `NEXT_PUBLIC_TICKET_NFT_ADDRESS=${ticketNFTAddress}`
  );

  envContent = envContent.replace(
    /NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=.*/,
    `NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=${ticketMarketplaceAddress}`
  );

  // Update RPC URL to Moca Chain
  envContent = envContent.replace(
    /NEXT_PUBLIC_RPC_URL=.*/,
    `NEXT_PUBLIC_RPC_URL=https://testnet-rpc.mocachain.org/`
  );

  // Update Chain ID to Moca Chain
  envContent = envContent.replace(
    /NEXT_PUBLIC_CHAIN_ID=.*/,
    `NEXT_PUBLIC_CHAIN_ID=222888`
  );

  fs.writeFileSync(envPath, envContent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
