import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Temporary mock interface while we get the app running
interface MockAccount {
  address: string
  meta: {
    name: string
  }
}

export default function WalletConnect() {
  const [selectedAccount, setSelectedAccount] = useState<MockAccount | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      // Mock connection - in reality this would connect to Polkadot.js
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAccount: MockAccount = {
        address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
        meta: { name: 'Mock Account' }
      }
      
      setSelectedAccount(mockAccount)
      setIsConnected(true)
      toast.success('Wallet connected (mock)')
    } catch (error) {
      toast.error('Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setSelectedAccount(null)
    setIsConnected(false)
    toast.success('Wallet disconnected')
  }

  if (isConnected && selectedAccount) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">
            {selectedAccount.meta.name}
          </span>
          <span className="text-xs text-gray-500">
            {selectedAccount.address.slice(0, 6)}...{selectedAccount.address.slice(-4)}
          </span>
        </div>
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
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
    >
      {isLoading ? (
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
  )
}