#!/usr/bin/env python3
"""
Deploy ProofPass Contracts to Moca Chain Testnet
Uses web3.py to deploy compiled contracts directly
"""

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from web3 import Web3

# Load environment variables
load_dotenv()

# Configuration
RPC_URL = "https://testnet-rpc.mocachain.org/"
CHAIN_ID = 222888
PRIVATE_KEY = os.getenv("MOCA_PRIVATE_KEY")
EXPLORER_URL = "https://testnet-scan.mocachain.org"

def main():
    if not PRIVATE_KEY:
        print("❌ MOCA_PRIVATE_KEY not set in .env")
        sys.exit(1)

    print("🚀 Deploying ProofPass Contracts to Moca Chain Testnet...\n")

    # Initialize Web3
    w3 = Web3(Web3.HTTPProvider(RPC_URL))

    if not w3.is_connected():
        print("❌ Failed to connect to RPC URL")
        sys.exit(1)

    # Get account
    account = w3.eth.account.from_key(PRIVATE_KEY)
    deployer_address = account.address

    print(f"📝 Deployer Address: {deployer_address}")
    print(f"🔗 Network: Moca Chain Testnet ({CHAIN_ID})")

    # Check balance
    balance_wei = w3.eth.get_balance(deployer_address)
    balance_moca = w3.from_wei(balance_wei, "ether")
    print(f"💰 Balance: {balance_moca} MOCA\n")

    if balance_moca == 0:
        print("⚠️  Account has no balance. Please fund it first.")
        print(f"   Send MOCA to: {deployer_address}")
        sys.exit(1)

    # Load compiled contracts
    out_dir = Path("out")
    if not out_dir.exists():
        print("❌ Compiled contracts not found in 'out' directory")
        print("   Run: forge build")
        sys.exit(1)

    # Load TicketNFT contract
    ticket_nft_json = json.loads(
        (out_dir / "TicketNFT.sol" / "TicketNFT.json").read_text()
    )
    ticket_nft_abi = ticket_nft_json.get("abi", [])
    ticket_nft_bytecode = ticket_nft_json.get("bytecode", {}).get("object", "")

    if not ticket_nft_bytecode:
        print("❌ TicketNFT bytecode not found")
        sys.exit(1)

    print("1️⃣  Deploying TicketNFT contract...")
    print("   Bytecode:", ticket_nft_bytecode[:66], "...")

    try:
        # Create contract factory
        ticket_nft_contract = w3.eth.contract(
            abi=ticket_nft_abi, bytecode=ticket_nft_bytecode
        )

        # Build deployment transaction
        deploy_tx = ticket_nft_contract.constructor().build_transaction({
            "from": deployer_address,
            "nonce": w3.eth.get_transaction_count(deployer_address),
            "gas": 3000000,
            "gasPrice": w3.eth.gas_price,
            "chainId": CHAIN_ID,
        })

        # Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(deploy_tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        print(f"   Transaction sent: {tx_hash.hex()}")
        print("   Waiting for confirmation...")

        # Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)

        if receipt.status == 1:
            ticket_nft_address = receipt.contractAddress
            print(f"✅ TicketNFT deployed at: {ticket_nft_address}")
            print(f"   Gas used: {receipt.gasUsed}")
        else:
            print("❌ Deployment failed!")
            sys.exit(1)

    except Exception as e:
        print(f"❌ Deployment error: {e}")
        sys.exit(1)

    print("\n2️⃣  Deploying TicketMarketplace contract...")

    # Load TicketMarketplace contract
    try:
        marketplace_json = json.loads(
            (out_dir / "TicketMarketplace.sol" / "TicketMarketplace.json").read_text()
        )
        marketplace_abi = marketplace_json.get("abi", [])
        marketplace_bytecode = marketplace_json.get("bytecode", {}).get("object", "")

        if not marketplace_bytecode:
            print("❌ TicketMarketplace bytecode not found")
            sys.exit(1)

        print(f"   Using TicketNFT address: {ticket_nft_address}")

        # Create contract factory
        marketplace_contract = w3.eth.contract(
            abi=marketplace_abi, bytecode=marketplace_bytecode
        )

        # Build deployment transaction with TicketNFT address as constructor arg
        deploy_tx = marketplace_contract.constructor(
            Web3.to_checksum_address(ticket_nft_address)
        ).build_transaction({
            "from": deployer_address,
            "nonce": w3.eth.get_transaction_count(deployer_address),
            "gas": 3000000,
            "gasPrice": w3.eth.gas_price,
            "chainId": CHAIN_ID,
        })

        # Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(deploy_tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        print(f"   Transaction sent: {tx_hash.hex()}")
        print("   Waiting for confirmation...")

        # Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)

        if receipt.status == 1:
            marketplace_address = receipt.contractAddress
            print(f"✅ TicketMarketplace deployed at: {marketplace_address}")
            print(f"   Gas used: {receipt.gasUsed}")
        else:
            print("❌ Deployment failed!")
            sys.exit(1)

    except Exception as e:
        print(f"❌ Deployment error: {e}")
        sys.exit(1)

    # Update .env file
    print("\n📝 Updating .env file...")
    env_file = Path(".env")
    env_content = env_file.read_text()

    # Update or add contract addresses
    env_content = update_env_var(
        env_content, "NEXT_PUBLIC_TICKET_NFT_ADDRESS", ticket_nft_address
    )
    env_content = update_env_var(
        env_content,
        "NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS",
        marketplace_address,
    )
    env_content = update_env_var(
        env_content, "NEXT_PUBLIC_RPC_URL", "https://testnet-rpc.mocachain.org/"
    )
    env_content = update_env_var(env_content, "NEXT_PUBLIC_CHAIN_ID", "222888")

    env_file.write_text(env_content)

    # Save deployment report
    report = {
        "timestamp": str(Path(".").stat().st_mtime),
        "network": "Moca Chain Testnet",
        "chainId": CHAIN_ID,
        "rpcUrl": RPC_URL,
        "deployer": deployer_address,
        "contracts": {
            "TicketNFT": {
                "address": ticket_nft_address,
                "deploymentTx": tx_hash.hex() if "tx_hash" in locals() else "",
            },
            "TicketMarketplace": {
                "address": marketplace_address,
                "deploymentTx": tx_hash.hex() if "tx_hash" in locals() else "",
            },
        },
        "blockExplorer": EXPLORER_URL,
    }

    Path("DEPLOYMENT_REPORT.json").write_text(json.dumps(report, indent=2))

    # Print summary
    print("\n📊 Deployment Report:")
    print("════════════════════════════════════════")
    print("✅ Deployment completed successfully!")
    print("")
    print("Contract Addresses:")
    print(f"  TicketNFT:          {ticket_nft_address}")
    print(f"  TicketMarketplace:  {marketplace_address}")
    print("")
    print("View on Block Explorer:")
    print(f"  {EXPLORER_URL}/address/{ticket_nft_address}")
    print(f"  {EXPLORER_URL}/address/{marketplace_address}")
    print("")
    print("✓ .env file updated with contract addresses")
    print("✓ Deployment report saved to DEPLOYMENT_REPORT.json")
    print("════════════════════════════════════════")


def update_env_var(content: str, key: str, value: str) -> str:
    """Update or add environment variable in content"""
    lines = content.split("\n")
    updated_lines = []
    found = False

    for line in lines:
        if line.startswith(f"{key}="):
            updated_lines.append(f"{key}={value}")
            found = True
        else:
            updated_lines.append(line)

    if not found:
        updated_lines.append(f"{key}={value}")

    return "\n".join(updated_lines)


if __name__ == "__main__":
    main()
