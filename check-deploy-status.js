#!/usr/bin/env node

const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Minimal ERC721 bytecode (compiled empty contract for demo)
// In production, you would compile actual contracts with hardhat
const TICKET_NFT_ABI = [
  { "inputs": [], "name": "TicketNFT", "outputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{"indexed": true, "name": "tokenId", "type": "uint256"}, {"indexed": true, "name": "holder", "type": "address"}], "name": "TicketMinted", "type": "event" },
];

const TICKET_MARKETPLACE_ABI = [
  { "inputs": [{"name": "_nftAddress", "type": "address"}], "name": "TicketMarketplace", "outputs": [], "stateMutability": "nonpayable", "type": "constructor" },
];

async function deployContracts() {
  console.log("🚀 Deploying ProofPass Contracts to Moca Chain Testnet...\n");

  const privateKey = process.env.MOCA_PRIVATE_KEY;
  const rpcUrl = "https://testnet-rpc.mocachain.org/";

  if (!privateKey) {
    console.error("❌ MOCA_PRIVATE_KEY not set in .env");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📝 Deployer Address:", wallet.address);
  console.log("🔗 Network: Moca Chain Testnet (222888)");
  console.log("🌐 RPC URL:", rpcUrl);

  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account Balance:", ethers.formatEther(balance), "MOCA\n");

  if (balance === 0n) {
    console.error("⚠️  Account has no balance. Please fund it first.");
    console.error(`   Send MOCA to: ${wallet.address}`);
    process.exit(1);
  }

  console.log("⚠️  Note: For proper smart contract deployment, please use:");
  console.log("   1. Hardhat with compiled contracts");
  console.log("   2. Truffle framework");
  console.log("   3. ethers.js with precompiled bytecode\n");

  console.log("📋 Deployment Configuration:");
  console.log("  ✓ Deployer:", wallet.address);
  console.log("  ✓ Balance:", ethers.formatEther(balance), "MOCA");
  console.log("  ✓ Network: Moca Chain Testnet");
  console.log("  ✓ Chain ID: 222888");
  console.log("  ✓ RPC: https://testnet-rpc.mocachain.org/");
  console.log("  ✓ Block Explorer: https://testnet-scan.mocachain.org/");

  console.log("\n🔧 Next Steps to Deploy Contracts:");
  console.log("────────────────────────────────────");
  console.log("1. Fix Hardhat configuration for ESM support:");
  console.log("   npm install --legacy-peer-deps");
  console.log("");
  console.log("2. Compile contracts:");
  console.log("   npx hardhat compile --network mocaTestnet");
  console.log("");
  console.log("3. Deploy to Moca Testnet:");
  console.log("   npx hardhat run scripts/deploy.js --network mocaTestnet");
  console.log("");
  console.log("4. Verify deployment:");
  console.log("   Open https://testnet-scan.mocachain.org/");
  console.log("   and search for your deployer address");
}

deployContracts().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
