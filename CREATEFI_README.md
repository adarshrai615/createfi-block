# CREATEFI Blockchain 🚀

A comprehensive Substrate-based blockchain implementing a complete DeFi ecosystem with fee management, token launchpad, stablecoin, DEX, and DAO governance.

## 🌟 Features

### 1. **Fee Engine System** 💰
- **Fixed Fee Structure**: Predictable fees for all operations
- **Fee Distribution**: 15% to founder, 85% to DAO treasury
- **Transaction Types**: Gas fees, bridge operations, DEX trading, NFT minting, token creation, vault operations, governance proposals
- **Fee Management**: Automatic fee collection and distribution system

### 2. **CREATE Token Launchpad** 🪙
- **Token Management**: Complete CREATE token lifecycle (mint, burn, transfer)
- **Staking System**: Stake tokens to earn rewards and gain governance power
- **Governance Integration**: Staked tokens provide voting power in DAO
- **Reward Distribution**: Automated reward calculation and distribution
- **Lock Mechanisms**: Staking and governance locks for security

### 3. **FI Stablecoin System** 🏦
- **Vault System**: Over-collateralized stablecoin with vault management
- **Collateral Management**: Support for multiple collateral types
- **Liquidation System**: Automated liquidation of under-collateralized vaults
- **Stability Mechanisms**: Dynamic fees and liquidation penalties
- **Risk Management**: Minimum collateral ratio enforcement

### 4. **Decentralized Exchange (DEX)** 📈
- **AMM Pools**: Automated Market Maker pools for token trading
- **Liquidity Provision**: Add and remove liquidity from pools
- **Price Discovery**: Automated price calculation using constant product formula
- **Trading Pairs**: Support for multiple token pairs
- **Fee Collection**: Trading fees distributed to liquidity providers

### 5. **DAO Governance** 🏛️
- **Proposal System**: Create and vote on governance proposals
- **Voting Mechanism**: Weighted voting based on staked tokens
- **Treasury Management**: Fund allocation and proposal execution
- **Member Management**: Add and remove DAO members
- **Transparent Governance**: All proposals and votes are on-chain

## 🏗️ Architecture

### Pallets Overview

| Pallet | Purpose | Key Functions |
|--------|---------|---------------|
| `pallet-fee-engine` | Fee collection and distribution | `collect_fee`, `withdraw_founder_fees`, `withdraw_dao_fees` |
| `pallet-create-token` | CREATE token management | `mint_tokens`, `stake_tokens`, `claim_rewards` |
| `pallet-fi-stablecoin` | FI stablecoin system | `open_vault`, `mint_fi`, `liquidate_vault` |
| `pallet-dex` | Decentralized exchange | `create_pool`, `amm_trade`, `add_liquidity` |
| `pallet-dao` | Governance and treasury | `create_proposal`, `vote`, `execute_proposal` |

### Runtime Configuration

```rust
// Fee Engine Configuration
type FounderAccount = FounderAccount;
type DaoTreasuryAccount = DaoTreasuryAccount;

// CREATE Token Configuration
type MaxWalletPercentage = ConstU32<5>;
type MinGovernanceStake = ConstU128<1_000_000_000_000_000_000_000>;
type StakingLockId = StakingLockId;
type GovernanceLockId = CreateTokenGovernanceLockId;

// FI Stablecoin Configuration
type MinCollateralRatio = ConstU128<1500000000000000000>; // 150%
type LiquidationPenalty = ConstU128<100000000000000000>; // 10%
type StabilityFee = ConstU128<50000000000000000>; // 5%

// DAO Configuration
type MinProposalDeposit = ConstU128<1000000000000000000000>;
type MaxProposalDescription = ConstU32<1024>;
type GovernanceLockId = DaoGovernanceLockId;
```

## 🚀 Getting Started

### Prerequisites

- Rust 1.82.0 or later
- Cargo
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd polkadot-sdk-solochain-template
   ```

2. **Install Rust dependencies**
   ```bash
   rustup target add wasm32-unknown-unknown
   rustup component add rust-src
   ```

3. **Build the project**
   ```bash
   cargo build --release
   ```

4. **Test the blockchain**
   ```bash
   ./test_blockchain.sh
   ```

### Running the Node

```bash
# Start development node
./target/release/solochain-template-node --dev --tmp

# Start with custom configuration
./target/release/solochain-template-node \
  --base-path /tmp/node \
  --chain dev \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --validator \
  --name "CREATEFI Node"
```

### Web Interface

1. Start the node
2. Open [Polkadot.js Apps](https://polkadot.js.org/apps/)
3. Connect to "Local Node" (ws://127.0.0.1:9944)
4. Explore the blockchain functionality

## 📚 Usage Examples

### Fee Engine

```rust
// Collect fees for a transaction
FeeEngine::collect_fee(
    RuntimeOrigin::signed(account),
    TX_TYPE_GAS_FEE,
    amount
);

// Withdraw founder fees
FeeEngine::withdraw_founder_fees(RuntimeOrigin::signed(founder));

// Withdraw DAO fees
FeeEngine::withdraw_dao_fees(RuntimeOrigin::signed(dao_treasury));
```

### CREATE Token

```rust
// Mint tokens
CreateToken::mint_tokens(
    RuntimeOrigin::signed(admin),
    recipient,
    amount
);

// Stake tokens
CreateToken::stake_tokens(
    RuntimeOrigin::signed(account),
    amount
);

// Claim rewards
CreateToken::claim_rewards(RuntimeOrigin::signed(account));
```

### FI Stablecoin

```rust
// Open a vault
FiStablecoin::open_vault(
    RuntimeOrigin::signed(account),
    collateral_amount
);

// Mint FI tokens
FiStablecoin::mint_fi(
    RuntimeOrigin::signed(account),
    fi_amount
);

// Repay FI debt
FiStablecoin::repay_fi(
    RuntimeOrigin::signed(account),
    amount
);
```

### DEX

```rust
// Create a trading pool
Dex::create_pool(
    RuntimeOrigin::signed(account),
    token_a,
    token_b,
    initial_liquidity_a,
    initial_liquidity_b
);

// Trade tokens
Dex::amm_trade(
    RuntimeOrigin::signed(account),
    pool_id,
    token_in,
    amount_in,
    min_amount_out
);
```

### DAO

```rust
// Create a proposal
Dao::create_proposal(
    RuntimeOrigin::signed(proposer),
    description,
    amount,
    recipient
);

// Vote on a proposal
Dao::vote(
    RuntimeOrigin::signed(voter),
    proposal_id,
    approve
);

// Execute a proposal
Dao::execute_proposal(
    RuntimeOrigin::signed(executor),
    proposal_id
);
```

## 🔧 Development

### Project Structure

```
├── pallets/
│   ├── fee-engine/          # Fee collection and distribution
│   ├── create-token/        # CREATE token management
│   ├── fi-stablecoin/       # FI stablecoin system
│   ├── dex/                 # Decentralized exchange
│   ├── dao/                 # Governance and treasury
│   └── template/            # Template pallet
├── runtime/
│   └── src/
│       └── lib.rs           # Runtime configuration
├── node/
│   └── src/
│       └── main.rs          # Node implementation
└── test_blockchain.sh       # Testing script
```

### Adding New Features

1. **Create a new pallet**
   ```bash
   cd pallets
   cargo new pallet-new-feature
   ```

2. **Configure the runtime**
   - Add pallet to `runtime/src/lib.rs`
   - Configure pallet parameters
   - Add to `construct_runtime!` macro

3. **Test the implementation**
   ```bash
   cargo test -p pallet-new-feature
   cargo check
   cargo build --release
   ```

### Testing

```bash
# Run all tests
cargo test

# Test specific pallet
cargo test -p pallet-fee-engine

# Check compilation
cargo check

# Build release version
cargo build --release
```

## 🛡️ Security Considerations

### Fee Engine
- Fee collection is automatic and transparent
- Founder and DAO accounts are configurable
- Fee rates can be updated through governance

### CREATE Token
- Staking locks prevent immediate unstaking
- Governance power is tied to staked amount
- Maximum wallet percentage prevents concentration

### FI Stablecoin
- Over-collateralization requirement (150%)
- Automated liquidation system
- Dynamic stability fees

### DEX
- Constant product formula for price calculation
- Slippage protection
- Liquidity provider incentives

### DAO
- Proposal deposit requirements
- Weighted voting system
- Execution delays for security

## 📈 Performance

- **Block Time**: 6 seconds
- **Transaction Throughput**: ~1000 TPS
- **Storage**: Optimized for on-chain data
- **WASM Runtime**: Efficient execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0.

## 🆘 Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the test examples

---

**CREATEFI Blockchain** - Building the future of decentralized finance on Substrate! 🚀