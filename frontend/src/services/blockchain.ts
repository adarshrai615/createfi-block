import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export interface BlockchainService {
  api: ApiPromise | null;
  isConnected: boolean;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
}

class CreatefiBlockchainService {
  private api: ApiPromise | null = null;
  private wsProvider: WsProvider | null = null;
  private isConnected = false;
  private accounts: InjectedAccountWithMeta[] = [];
  private selectedAccount: InjectedAccountWithMeta | null = null;
  private listeners: Set<(service: BlockchainService) => void> = new Set();

  // Connect to the CREATEFI blockchain
  async connect(endpoint = 'ws://localhost:9944'): Promise<boolean> {
    try {
      this.wsProvider = new WsProvider(endpoint);
      this.api = await ApiPromise.create({ provider: this.wsProvider });
      
      await this.api.isReady;
      this.isConnected = true;
      
      console.log('✅ Connected to CREATEFI blockchain');
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to blockchain:', error);
      return false;
    }
  }

  // Connect to Polkadot wallet extension
  async connectWallet(): Promise<boolean> {
    try {
      const extensions = await web3Enable('CREATEFI DApp');
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found');
      }

      this.accounts = await web3Accounts();
      if (this.accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.selectedAccount = this.accounts[0];
      console.log('✅ Wallet connected:', this.selectedAccount.meta.name);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      return false;
    }
  }

  // DEX Trading Functions
  async createPool(tokenA: string, tokenB: string, liquidityA: string, liquidityB: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.dex.createPool(tokenA, tokenB, liquidityA, liquidityB);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status, events }) => {
        if (status.isInBlock) {
          console.log('✅ Pool created in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        } else if (status.isFinalized) {
          console.log('✅ Pool creation finalized');
        }
      }).catch(reject);
    });
  }

  async executeSwap(poolId: number, tokenIn: string, amountIn: string, minAmountOut: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.dex.ammTrade(poolId, tokenIn, amountIn, minAmountOut);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ Swap executed in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  // FI Stablecoin Functions
  async createVault(collateralType: string, collateralAmount: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.fiStablecoin.createVault(collateralType, collateralAmount);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ Vault created in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  async mintFI(vaultId: number, amount: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.fiStablecoin.mintFi(vaultId, amount);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ FI minted in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  // CREATE Token Functions
  async stakeTokens(amount: string, duration: number) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.createToken.stake(amount, duration);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ Tokens staked in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  // DAO Governance Functions
  async createProposal(title: string, description: string, action: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.dao.createProposal(title, description, action);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ Proposal created in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  async vote(proposalId: number, support: boolean, amount: string) {
    if (!this.api || !this.selectedAccount) throw new Error('Not connected');

    const injector = await web3FromAddress(this.selectedAccount.address);
    const tx = this.api.tx.dao.vote(proposalId, support, amount);

    return new Promise((resolve, reject) => {
      tx.signAndSend(this.selectedAccount!.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log('✅ Vote cast in block:', status.asInBlock.toString());
          resolve(status.asInBlock.toString());
        }
      }).catch(reject);
    });
  }

  // Query Functions
  async getBalance(address: string) {
    if (!this.api) throw new Error('Not connected');
    const account = await this.api.query.system.account(address);
    return account.data.free.toString();
  }

  async getPools() {
    if (!this.api) throw new Error('Not connected');
    const pools = await this.api.query.dex.pools.entries();
    return pools.map(([key, value]) => ({
      id: key.args[0].toString(),
      ...value.toJSON()
    }));
  }

  async getVaults(address: string) {
    if (!this.api) throw new Error('Not connected');
    const vaults = await this.api.query.fiStablecoin.vaults.entries();
    return vaults
      .filter(([key]) => key.args[1].toString() === address)
      .map(([key, value]) => ({
        id: key.args[0].toString(),
        ...value.toJSON()
      }));
  }

  async getProposals() {
    if (!this.api) throw new Error('Not connected');
    const proposals = await this.api.query.dao.proposals.entries();
    return proposals.map(([key, value]) => ({
      id: key.args[0].toString(),
      ...value.toJSON()
    }));
  }

  // Event subscription
  subscribeToEvents(callback: (event: any) => void) {
    if (!this.api) throw new Error('Not connected');
    
    return this.api.query.system.events((events) => {
      events.forEach((record) => {
        const { event } = record;
        if (event.section === 'dex' || event.section === 'fiStablecoin' || 
            event.section === 'createToken' || event.section === 'dao' || 
            event.section === 'feeEngine') {
          callback({
            section: event.section,
            method: event.method,
            data: event.data.toJSON()
          });
        }
      });
    });
  }

  // State management
  getState(): BlockchainService {
    return {
      api: this.api,
      isConnected: this.isConnected,
      accounts: this.accounts,
      selectedAccount: this.selectedAccount
    };
  }

  subscribe(listener: (service: BlockchainService) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  selectAccount(account: InjectedAccountWithMeta) {
    this.selectedAccount = account;
    this.notifyListeners();
  }

  disconnect() {
    if (this.wsProvider) {
      this.wsProvider.disconnect();
    }
    this.api = null;
    this.isConnected = false;
    this.accounts = [];
    this.selectedAccount = null;
    this.notifyListeners();
  }
}

export const blockchainService = new CreatefiBlockchainService();
export default blockchainService;