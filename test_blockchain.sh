#!/bin/bash

echo "🧪 Testing CREATEFI Blockchain"
echo "================================"

# Check if the node binary exists
if [ ! -f "./target/release/solochain-template-node" ]; then
    echo "❌ Node binary not found. Please build the project first with 'cargo build --release'"
    exit 1
fi

echo "✅ Node binary found: ./target/release/solochain-template-node"

# Test node version
echo "📋 Node version:"
./target/release/solochain-template-node --version

echo ""
echo "🔧 Available pallets in the runtime:"
echo "- pallet-fee-engine: Fixed fee system for all operations"
echo "- pallet-create-token: CREATE token management (mint, burn, transfer, stake)"
echo "- pallet-fi-stablecoin: FI stablecoin with vault system"
echo "- pallet-dex: Decentralized exchange with AMM pools"
echo "- pallet-dao: Decentralized autonomous organization"
echo "- pallet-balances: Native token balances"
echo "- pallet-timestamp: Block timestamp"
echo "- pallet-sudo: Administrative functions"

echo ""
echo "🚀 To start the blockchain node, run:"
echo "./target/release/solochain-template-node --dev --tmp"
echo ""
echo "🌐 To access the Polkadot.js Apps interface:"
echo "1. Start the node with the command above"
echo "2. Open https://polkadot.js.org/apps/"
echo "3. Connect to 'Local Node' (ws://127.0.0.1:9944)"
echo ""
echo "📚 Available functions:"
echo "- Fee Engine: collect_fee, withdraw_founder_fees, withdraw_dao_fees"
echo "- CREATE Token: mint_tokens, burn_tokens, transfer_tokens, stake_tokens, unstake_tokens"
echo "- FI Stablecoin: open_vault, mint_fi, repay_fi, liquidate_vault"
echo "- DEX: create_pool, add_liquidity, remove_liquidity, amm_trade"
echo "- DAO: create_proposal, vote, execute_proposal, fund_treasury"

echo ""
echo "✅ CREATEFI Blockchain is ready for testing!"