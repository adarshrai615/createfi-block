import { useState, useEffect } from 'react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function WalletConnect() {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    const savedAccount = localStorage.getItem('createfi-wallet-account')
    if (savedAccount) {
      const account = JSON.parse(savedAccount)
      setSelectedAccount(account)
      setIsConnected(true)
    }
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Enable Polkadot extension
      await web3Enable('CREATEFI DApp')
      
      // Get accounts
      const allAccounts = await web3Accounts()
      setAccounts(allAccounts)
      
      if (allAccounts.length === 0) {
        toast.error('No accounts found. Please create an account in your wallet extension.')
        return
      }
      
      // Auto-select first account
      const account = allAccounts[0]
      setSelectedAccount(account)
      setIsConnected(true)
      localStorage.setItem('createfi-wallet-account', JSON.stringify(account))
      
      toast.success(`Connected: ${account.meta.name}`)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet. Please make sure you have a Polkadot wallet extension installed.')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setSelectedAccount(null)
    setIsConnected(false)
    localStorage.removeItem('createfi-wallet-account')
    toast.success('Wallet disconnected')
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="btn-primary flex items-center space-x-2"
      >
        {isLoading ? (
          <div className="spinner w-4 h-4"></div>
        ) : (
          <div className="w-4 h-4 bg-white rounded-full"></div>
        )}
        <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsConnected(!isConnected)}
        className="btn-secondary flex items-center space-x-2"
      >
        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
        <span>{selectedAccount?.meta.name || 'Account'}</span>
        <span className="text-secondary-300">
          {formatAddress(selectedAccount?.address || '')}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      
      {/* Account dropdown */}
      {isConnected && (
        <div className="absolute right-0 mt-2 w-64 bg-secondary-800 border border-secondary-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-secondary-700">
            <div className="text-sm text-secondary-300">Connected Account</div>
            <div className="text-white font-medium">{selectedAccount?.meta.name}</div>
            <div className="text-sm text-secondary-400 font-mono">
              {selectedAccount?.address}
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={disconnectWallet}
              className="w-full text-left px-3 py-2 text-sm text-danger-400 hover:bg-secondary-700 rounded"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}