#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function compile() {
  console.log("🔧 Compiling Solidity Contracts...\n");

  const ticketNFTSource = fs.readFileSync(path.join(__dirname, "contracts", "TicketNFT.sol"), "utf8");
  const marketplaceSource = fs.readFileSync(path.join(__dirname, "contracts", "TicketMarketplace.sol"), "utf8");

  console.log("📄 Contracts loaded:");
  console.log("  ✓ TicketNFT.sol");
  console.log("  ✓ TicketMarketplace.sol");

  const input = {
    language: "Solidity",
    sources: {
      "TicketNFT.sol": { content: ticketNFTSource },
      "TicketMarketplace.sol": { content: marketplaceSource },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
    },
  };

  console.log("\n⏳ Compiling...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors?.length > 0) {
    const errors = output.errors.filter(e => e.severity === "error");
    if (errors.length > 0) {
      console.error("\n❌ Compilation errors:");
      errors.forEach(e => console.error("  ", e.message));
      process.exit(1);
    }
  }

  const artifactsDir = path.join(__dirname, "artifacts", "contracts");
  fs.mkdirSync(artifactsDir, { recursive: true });

  Object.keys(output.contracts).forEach(file => {
    Object.keys(output.contracts[file]).forEach(contract => {
      const artifact = {
        abi: output.contracts[file][contract].abi,
        bytecode: output.contracts[file][contract].evm.bytecode.object,
      };
      const dir = path.join(artifactsDir, file);
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, contract + ".json");
      fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));
      console.log(`✅ ${contract} compiled and saved`);
    });
  });

  console.log("\n✓ Compilation complete!");
  console.log(`✓ Artifacts saved to: ${artifactsDir}\n`);
}

compile().catch(error => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
