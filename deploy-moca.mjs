import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("🚀 Deploying ProofPass Contracts to Moca Chain Testnet...\n");

  // Setup
  const privateKey = process.env.MOCA_PRIVATE_KEY;
  const rpcUrl = "https://testnet-rpc.mocachain.org/";

  if (!privateKey) {
    throw new Error("❌ MOCA_PRIVATE_KEY not set in .env");
  }

  // Connect to network
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("📝 Deployer Address:", wallet.address);

  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Account Balance:", ethers.formatEther(balance), "MOCA\n");

  // Read contracts
  const ticketNFTPath = path.join(__dirname, "../contracts/TicketNFT.sol");
  const ticketMarketplacePath = path.join(
    __dirname,
    "../contracts/TicketMarketplace.sol"
  );

  // Read ABI from artifacts (after compilation)
  let ticketNFTAbi, ticketMarketplaceAbi;

  try {
    const artifactsDir = path.join(__dirname, "../artifacts/contracts");
    const ticketNFTJson = JSON.parse(
      fs.readFileSync(
        path.join(artifactsDir, "TicketNFT.sol/TicketNFT.json"),
        "utf8"
      )
    );
    const ticketMarketplaceJson = JSON.parse(
      fs.readFileSync(
        path.join(
          artifactsDir,
          "TicketMarketplace.sol/TicketMarketplace.json"
        ),
        "utf8"
      )
    );

    ticketNFTAbi = ticketNFTJson.abi;
    ticketNFTBytecode = ticketNFTJson.bytecode;
    ticketMarketplaceAbi = ticketMarketplaceJson.abi;
    ticketMarketplaceBytecode = ticketMarketplaceJson.bytecode;
  } catch (e) {
    console.log("⚠️  Artifacts not found. Please compile contracts first with:");
    console.log("   npx hardhat compile");
    process.exit(1);
  }

  // Deploy TicketNFT
  console.log("1️⃣  Deploying TicketNFT...");
  const ticketNFTFactory = new ethers.ContractFactory(
    ticketNFTAbi,
    ticketNFTBytecode,
    wallet
  );
  const ticketNFT = await ticketNFTFactory.deploy();
  const ticketNFTTx = await ticketNFT.waitForDeployment();
  const ticketNFTAddress = await ticketNFT.getAddress();
  console.log("✅ TicketNFT deployed at:", ticketNFTAddress);

  // Deploy TicketMarketplace
  console.log("\n2️⃣  Deploying TicketMarketplace...");
  const ticketMarketplaceFactory = new ethers.ContractFactory(
    ticketMarketplaceAbi,
    ticketMarketplaceBytecode,
    wallet
  );
  const ticketMarketplace = await ticketMarketplaceFactory.deploy(
    ticketNFTAddress
  );
  const ticketMarketplaceTx = await ticketMarketplace.waitForDeployment();
  const ticketMarketplaceAddress = await ticketMarketplace.getAddress();
  console.log("✅ TicketMarketplace deployed at:", ticketMarketplaceAddress);

  // Update environment
  updateEnvFile(ticketNFTAddress, ticketMarketplaceAddress);

  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(70));
  console.log("\n📋 Contract Addresses:");
  console.log(`   TicketNFT: ${ticketNFTAddress}`);
  console.log(`   TicketMarketplace: ${ticketMarketplaceAddress}`);
  console.log("\n🔗 View on Block Explorer:");
  console.log(
    `   https://testnet-scan.mocachain.org/address/${ticketNFTAddress}`
  );
  console.log(
    `   https://testnet-scan.mocachain.org/address/${ticketMarketplaceAddress}`
  );
  console.log("\n✅ Environment updated in .env");
}

function updateEnvFile(ticketNFTAddress, ticketMarketplaceAddress) {
  const envPath = path.join(__dirname, "../.env");
  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(
    /NEXT_PUBLIC_TICKET_NFT_ADDRESS=.*/,
    `NEXT_PUBLIC_TICKET_NFT_ADDRESS=${ticketNFTAddress}`
  );

  envContent = envContent.replace(
    /NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=.*/,
    `NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS=${ticketMarketplaceAddress}`
  );

  fs.writeFileSync(envPath, envContent);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
