import { useState, useEffect } from 'react'
import { 
  BanknotesIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import blockchainService from '../services/blockchain'
import toast from 'react-hot-toast'

interface Vault {
  id: string
  collateralType: string
  collateralAmount: number
  debtAmount: number
  collateralizationRatio: number
  liquidationPrice: number
  riskLevel: 'safe' | 'warning' | 'danger'
}

export default function Vaults() {
  const [vaults, setVaults] = useState<Vault[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [isCreatingVault, setIsCreatingVault] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [collateralType, setCollateralType] = useState('CREATE')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [selectedVault, setSelectedVault] = useState<string>('')

  useEffect(() => {
    const unsubscribe = blockchainService.subscribe((service) => {
      setIsConnected(service.isConnected && !!service.selectedAccount)
      setSelectedAccount(service.selectedAccount?.address || '')
    })

    loadVaults()
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isConnected && selectedAccount) {
      loadVaults()
    }
  }, [isConnected, selectedAccount])

  const loadVaults = async () => {
    if (!isConnected || !selectedAccount) return

    try {
      const vaultData = await blockchainService.getVaults(selectedAccount)
      
      // Convert blockchain data to UI format
      const formattedVaults: Vault[] = vaultData.map((vault: any) => {
        const collateralAmount = parseInt(vault.collateralAmount || '0') / 1e12
        const debtAmount = parseInt(vault.debtAmount || '0') / 1e12
        const ratio = debtAmount > 0 ? (collateralAmount / debtAmount) * 100 : 0
        
        return {
          id: vault.id,
          collateralType: vault.collateralType || 'CREATE',
          collateralAmount,
          debtAmount,
          collateralizationRatio: ratio,
          liquidationPrice: ratio > 0 ? collateralAmount * 0.9 / debtAmount : 0,
          riskLevel: ratio > 200 ? 'safe' : ratio > 150 ? 'warning' : 'danger'
        }
      })
      
      setVaults(formattedVaults)
    } catch (error) {
      console.error('Failed to load vaults:', error)
    }
  }

  const createVault = async () => {
    if (!collateralAmount || !isConnected) {
      toast.error('Please enter collateral amount and connect wallet')
      return
    }

    setIsCreatingVault(true)
    try {
      const amount = (parseFloat(collateralAmount) * 1e12).toString()
      await blockchainService.createVault(collateralType, amount)
      
      toast.success('Vault created successfully!')
      setCollateralAmount('')
      loadVaults()
    } catch (error: any) {
      console.error('Vault creation failed:', error)
      toast.error(error.message || 'Vault creation failed')
    } finally {
      setIsCreatingVault(false)
    }
  }

  const mintFI = async () => {
    if (!selectedVault || !mintAmount || !isConnected) {
      toast.error('Please select vault and enter mint amount')
      return
    }

    setIsMinting(true)
    try {
      const amount = (parseFloat(mintAmount) * 1e12).toString()
      await blockchainService.mintFI(parseInt(selectedVault), amount)
      
      toast.success('FI tokens minted successfully!')
      setMintAmount('')
      loadVaults()
    } catch (error: any) {
      console.error('FI minting failed:', error)
      toast.error(error.message || 'FI minting failed')
    } finally {
      setIsMinting(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'danger': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'bg-green-900/50 border-green-600 text-green-300'
      case 'warning': return 'bg-yellow-900/50 border-yellow-600 text-yellow-300'
      case 'danger': return 'bg-red-900/50 border-red-600 text-red-300'
      default: return 'bg-gray-900/50 border-gray-600 text-gray-300'
    }
  }

  const totalCollateral = vaults.reduce((sum, vault) => sum + vault.collateralAmount, 0)
  const totalDebt = vaults.reduce((sum, vault) => sum + vault.debtAmount, 0)
  const averageRatio = totalDebt > 0 ? (totalCollateral / totalDebt) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FI Stablecoin Vaults</h1>
          <p className="text-gray-400">Manage your collateralized FI stablecoin positions</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Collateral</div>
          <div className="text-2xl font-bold text-white">{totalCollateral.toFixed(2)} CREATE</div>
        </div>
      </div>

      {!isConnected && (
        <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-300">Connect your wallet to view and manage vaults</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Vaults</p>
              <p className="text-2xl font-bold text-white">{vaults.length}</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Debt</p>
              <p className="text-2xl font-bold text-white">{totalDebt.toFixed(2)} FI</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Ratio</p>
              <p className={`text-2xl font-bold ${getRiskColor(averageRatio > 200 ? 'safe' : averageRatio > 150 ? 'warning' : 'danger')}`}>
                {averageRatio.toFixed(1)}%
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
              %
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">At Risk Vaults</p>
              <p className="text-2xl font-bold text-red-400">
                {vaults.filter(v => v.riskLevel === 'danger').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Vault */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Vault
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Collateral Type</label>
              <select 
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={collateralType}
                onChange={(e) => setCollateralType(e.target.value)}
              >
                <option value="CREATE">CREATE Token</option>
                <option value="USDT">USDT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Collateral Amount</label>
              <input
                type="number"
                placeholder="0.0"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 110% collateralization ratio required
              </p>
            </div>

            <button
              onClick={createVault}
              disabled={!isConnected || !collateralAmount || isCreatingVault}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isCreatingVault ? 'Creating...' : 'Create Vault'}
            </button>
          </div>
        </div>

        {/* Mint FI */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mint FI Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Vault</label>
              <select 
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={selectedVault}
                onChange={(e) => setSelectedVault(e.target.value)}
              >
                <option value="">Select a vault...</option>
                {vaults.map((vault) => (
                  <option key={vault.id} value={vault.id}>
                    Vault #{vault.id} ({vault.collateralType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">FI Amount to Mint</label>
              <input
                type="number"
                placeholder="0.0"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
            </div>

            <button
              onClick={mintFI}
              disabled={!isConnected || !selectedVault || !mintAmount || isMinting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isMinting ? 'Minting...' : 'Mint FI'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Info</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Liquidation Ratio</span>
              <span className="text-white">110%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interest Rate</span>
              <span className="text-white">5% APR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Min Collateral</span>
              <span className="text-white">1 CREATE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vault Creation Fee</span>
              <span className="text-white">0.05 FI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vaults List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Your Vaults</h3>
        </div>
        
        {vaults.length === 0 ? (
          <div className="p-8 text-center">
            <BanknotesIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No vaults found</p>
            <p className="text-sm text-gray-500">Create your first vault to start minting FI stablecoins</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {vaults.map((vault) => (
              <div key={vault.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BanknotesIcon className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">Vault #{vault.id}</h4>
                      <p className="text-gray-400 text-sm">{vault.collateralType} Collateral</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm ${getRiskBadgeColor(vault.riskLevel)}`}>
                    {vault.riskLevel.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Collateral</p>
                    <p className="text-white font-semibold">{vault.collateralAmount.toFixed(4)} {vault.collateralType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Debt</p>
                    <p className="text-white font-semibold">{vault.debtAmount.toFixed(4)} FI</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Ratio</p>
                    <p className={`font-semibold ${getRiskColor(vault.riskLevel)}`}>
                      {vault.collateralizationRatio.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Liquidation Price</p>
                    <p className="text-white font-semibold">${vault.liquidationPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}