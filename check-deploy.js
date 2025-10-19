#!/usr/bin/env node

const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying ProofPass Contracts to Moca Chain Testnet...\n");

  const privateKey = process.env.MOCA_PRIVATE_KEY;
  const rpcUrl = "https://testnet-rpc.mocachain.org/";

  if (!privateKey) {
    throw new Error("❌ MOCA_PRIVATE_KEY not set in .env");
  }

  // Connect to network
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📝 Deployer Address:", wallet.address);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(
    "💰 Account Balance:",
    ethers.formatEther(balance),
    "MOCA"
  );

  if (balance === 0n) {
    console.log("⚠️  Account has no balance. Please fund it first.");
    console.log(`   Send MOCA to: ${wallet.address}`);
    process.exit(1);
  }

  // Read contract code
  const ticketNFTCode = fs.readFileSync(
    path.join(__dirname, "contracts/TicketNFT.sol"),
    "utf8"
  );
  const ticketMarketplaceCode = fs.readFileSync(
    path.join(__dirname, "contracts/TicketMarketplace.sol"),
    "utf8"
  );

  console.log("\n✓ Contracts read successfully");
  console.log("  - TicketNFT.sol loaded");
  console.log("  - TicketMarketplace.sol loaded");

  console.log(
    "\n⚠️  Note: Direct Solidity compilation requires solc compiler."
  );
  console.log(
    "   For production deployment, use Hardhat with: npx hardhat run scripts/deploy.js --network mocaTestnet"
  );

  console.log("\n📋 Deployment Configuration:");
  console.log(`   Network: Moca Chain Testnet`);
  console.log(`   Chain ID: 222888`);
  console.log(`   RPC URL: ${rpcUrl}`);
  console.log(`   Deployer: ${wallet.address}`);
  console.log(`   Balance: ${ethers.formatEther(balance)} MOCA`);

  console.log(
    "\n💡 Next Steps for Contract Deployment:"
  );
  console.log("   1. Compile contracts with Hardhat:");
  console.log("      npx hardhat compile");
  console.log("   2. Deploy to Moca Testnet:");
  console.log("      npx hardhat run scripts/deploy.js --network mocaTestnet");
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
