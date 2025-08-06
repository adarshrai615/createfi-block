import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import blockchainService, { BlockchainService } from '../services/blockchain'

export default function WalletConnect() {
  const [service, setService] = useState<BlockchainService>(blockchainService.getState())
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    const unsubscribe = blockchainService.subscribe(setService)
    
    // Auto-connect to blockchain on component mount
    const initializeConnection = async () => {
      const connected = await blockchainService.connect()
      if (connected) {
        console.log('🔗 Auto-connected to CREATEFI blockchain')
      }
    }
    
    initializeConnection()
    
    return unsubscribe
  }, [])

  useEffect(() => {
    // Update balance when account changes
    const updateBalance = async () => {
      if (service.selectedAccount && service.isConnected) {
        try {
          const bal = await blockchainService.getBalance(service.selectedAccount.address)
          setBalance(bal)
        } catch (error) {
          console.error('Failed to fetch balance:', error)
        }
      }
    }
    
    updateBalance()
  }, [service.selectedAccount, service.isConnected])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // First ensure blockchain connection
      if (!service.isConnected) {
        const blockchainConnected = await blockchainService.connect()
        if (!blockchainConnected) {
          toast.error('Failed to connect to CREATEFI blockchain. Make sure the node is running.')
          return
        }
      }

      // Then connect wallet
      const walletConnected = await blockchainService.connectWallet()
      if (walletConnected) {
        toast.success(`Wallet connected: ${service.selectedAccount?.meta.name}`)
      } else {
        toast.error('Failed to connect wallet. Please install Polkadot{.js} extension.')
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      toast.error(error.message || 'Failed to connect')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    blockchainService.disconnect()
    setBalance('0')
    toast.success('Wallet disconnected')
  }

  const formatBalance = (balance: string) => {
    const bal = BigInt(balance)
    const formatted = Number(bal) / 1e12 // Assuming 12 decimal places
    return formatted.toFixed(4)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (service.selectedAccount && service.isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-300">
              {service.selectedAccount.meta.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatAddress(service.selectedAccount.address)}
            </span>
          </div>
          <div className="ml-2 text-right">
            <div className="text-xs text-gray-400">Balance</div>
            <div className="text-sm text-white font-mono">
              {formatBalance(balance)} UNIT
            </div>
          </div>
        </div>
        
        {service.accounts.length > 1 && (
          <select 
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            value={service.selectedAccount.address}
            onChange={(e) => {
              const account = service.accounts.find(acc => acc.address === e.target.value)
              if (account) blockchainService.selectAccount(account)
            }}
          >
            {service.accounts.map(account => (
              <option key={account.address} value={account.address}>
                {account.meta.name}
              </option>
            ))}
          </select>
        )}
        
        <button
          onClick={handleDisconnect}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {!service.isConnected && (
        <div className="flex items-center space-x-2 text-sm text-yellow-400">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Blockchain disconnected</span>
        </div>
      )}
      
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span>Connect Wallet</span>
            <ChevronDownIcon className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}