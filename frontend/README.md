# CREATEFI BlockBuild Frontend

Professional DeFi interface for the CREATEFI blockchain ecosystem.

## 🚀 Features

### **Trading Interface**
- **TradingView-style Charts**: Interactive candlestick charts using lightweight-charts
- **Live Trade Feed**: Real-time buy/sell order display with animations
- **Order Book**: Real-time bid/ask visualization
- **Multiple Trading Pairs**: CREATE/FI, CREATE/USDT, FI/USDT

### **Analytics Dashboard**
- **TVL Tracking**: Total Value Locked charts and metrics
- **Volume Analytics**: 24h trading volume with historical data
- **Token Rankings**: Market cap, price, and performance metrics
- **Pool Analytics**: APR, fees, and liquidity metrics

### **DAO Governance**
- **Proposal Management**: Create, view, and vote on governance proposals
- **Voting Interface**: Intuitive voting with CREATE token weight
- **Proposal Tracking**: Real-time status and vote progress
- **Treasury Management**: DAO fund allocation and tracking

### **FI Stablecoin Vaults**
- **Vault Management**: Deposit, withdraw, mint, and repay operations
- **Collateral Monitoring**: Real-time collateral ratio tracking
- **Liquidation Alerts**: Warning system for risky positions
- **Multi-Collateral Support**: CREATE, USDT, and other assets

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Routing**: Wouter (lightweight router)
- **Styling**: Tailwind CSS + Headless UI
- **Charts**: Lightweight Charts (TradingView-style)
- **State Management**: Zustand + React Query
- **Blockchain Integration**: Polkadot.js API
- **Build Tool**: Vite
- **Icons**: Heroicons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_RPC_ENDPOINT=ws://127.0.0.1:9944
VITE_CHAIN_NAME=CREATEFI
VITE_NETWORK_ID=1
```

### Blockchain Connection
The frontend connects to the CREATEFI blockchain node running on `ws://127.0.0.1:9944` by default.

## 🎨 UI Components

### Design System
- **Color Palette**: Professional dark theme with blue accent
- **Typography**: Inter font family for readability
- **Components**: Consistent card, button, and input styles
- **Responsive**: Mobile-first design approach

### Key Components
- `Layout`: Main application layout with sidebar navigation
- `WalletConnect`: Polkadot wallet integration
- `TradingChart`: Interactive trading charts
- `TradeFeed`: Live trade display
- `OrderBook`: Bid/ask visualization
- `AnalyticsChart`: TVL and volume charts
- `ProposalCard`: Governance proposal display
- `VaultCard`: Vault management interface

## 🔌 Blockchain Integration

### Polkadot.js API
```typescript
import { ApiPromise, WsProvider } from '@polkadot/api'

const provider = new WsProvider('ws://127.0.0.1:9944')
const api = await ApiPromise.create({ provider })
```

### Pallet Integration
- **pallet-fee-engine**: Fee collection and distribution
- **pallet-create-token**: CREATE token operations
- **pallet-fi-stablecoin**: FI stablecoin vaults
- **pallet-dex**: Decentralized exchange
- **pallet-dao**: Governance and proposals

## 📱 Pages

### Dashboard (`/`)
- Overview of all CREATEFI features
- Quick stats and recent activity
- Network status and quick actions

### Trading (`/trading`)
- Interactive trading charts
- Order book and trade feed
- Multiple trading pair support

### Analytics (`/analytics`)
- TVL and volume charts
- Token rankings and metrics
- Pool performance analytics

### Governance (`/governance`)
- DAO proposal management
- Voting interface
- Treasury tracking

### Vaults (`/vaults`)
- FI stablecoin vault management
- Collateral monitoring
- Risk management tools

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🔒 Security

### Wallet Security
- Polkadot wallet extension integration
- Secure transaction signing
- No private key storage in frontend

### Input Validation
- Form validation with Zod schemas
- Sanitized user inputs
- Error handling for failed transactions

## 📊 Performance

### Optimization
- Code splitting with React.lazy()
- Optimized bundle size with Vite
- Efficient chart rendering
- Debounced API calls

### Monitoring
- Error tracking with console logging
- Performance metrics
- User interaction analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join the CREATEFI community

---

**CREATEFI BlockBuild Frontend** - Professional DeFi interface for the complete blockchain ecosystem.