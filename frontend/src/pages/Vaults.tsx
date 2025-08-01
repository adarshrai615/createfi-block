import { useState } from 'react'
import { 
  PlusIcon, 
  MinusIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Vault {
  id: string
  collateralType: string
  collateralAmount: number
  fiDebt: number
  collateralRatio: number
  liquidationPrice: number
  status: 'safe' | 'warning' | 'danger'
  createdAt: Date
}

export default function Vaults() {
  const [vaults, setVaults] = useState<Vault[]>([
    {
      id: '1',
      collateralType: 'CREATE',
      collateralAmount: 10000,
      fiDebt: 5000,
      collateralRatio: 210,
      liquidationPrice: 5.25,
      status: 'safe',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      collateralType: 'USDT',
      collateralAmount: 15000,
      fiDebt: 10000,
      collateralRatio: 150,
      liquidationPrice: 0.67,
      status: 'safe',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      collateralType: 'CREATE',
      collateralAmount: 5000,
      fiDebt: 4000,
      collateralRatio: 125,
      liquidationPrice: 8.00,
      status: 'warning',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ])

  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'mint' | 'repay' | null>(null)
  const [amount, setAmount] = useState('')

  const stats = [
    {
      name: 'Total Vaults',
      value: '1,247',
      icon: BanknotesIcon
    },
    {
      name: 'Total Collateral',
      value: '$45.2M',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Total FI Debt',
      value: '$28.7M',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Average Collateral Ratio',
      value: '157%',
      icon: BanknotesIcon
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success-400'
      case 'warning': return 'text-warning-400'
      case 'danger': return 'text-danger-400'
      default: return 'text-secondary-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-success-400'
      case 'warning': return 'bg-warning-400'
      case 'danger': return 'bg-danger-400'
      default: return 'bg-secondary-400'
    }
  }

  const handleVaultAction = () => {
    if (!selectedVault || !action || !amount) return
    
    // Here you would integrate with the blockchain to perform the action
    console.log(`${action} ${amount} on vault ${selectedVault.id}`)
    
    // Reset form
    setAmount('')
    setAction(null)
    setSelectedVault(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">FI Stablecoin Vaults</h1>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Open New Vault
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-300">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-secondary-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Vaults List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Your Vaults</h3>
        <div className="space-y-4">
          {vaults.map((vault) => (
            <div key={vault.id} className="bg-secondary-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusBg(vault.status)}`}></div>
                  <h4 className="text-lg font-semibold text-white">Vault #{vault.id}</h4>
                  <span className="text-secondary-400">({vault.collateralType})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getStatusColor(vault.status)}`}>
                    {vault.collateralRatio.toFixed(1)}% CR
                  </span>
                  <button
                    onClick={() => setSelectedVault(vault)}
                    className="btn-secondary text-sm"
                  >
                    Manage
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-sm text-secondary-300">Collateral</p>
                  <p className="text-white font-medium">
                    {vault.collateralAmount.toLocaleString()} {vault.collateralType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-300">FI Debt</p>
                  <p className="text-white font-medium">
                    {vault.fiDebt.toLocaleString()} FI
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-300">Liquidation Price</p>
                  <p className="text-white font-medium">
                    ${vault.liquidationPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-300">Created</p>
                  <p className="text-white font-medium">
                    {vault.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {vault.status === 'warning' && (
                <div className="bg-warning-900 border border-warning-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-warning-400" />
                    <span className="text-warning-200 text-sm">
                      Warning: Your vault is approaching the liquidation threshold. Consider adding more collateral or repaying debt.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vault Management Modal */}
      {selectedVault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Manage Vault #{selectedVault.id}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAction('deposit')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      action === 'deposit'
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Deposit
                  </button>
                  <button
                    onClick={() => setAction('withdraw')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      action === 'withdraw'
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <MinusIcon className="h-4 w-4 inline mr-2" />
                    Withdraw
                  </button>
                  <button
                    onClick={() => setAction('mint')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      action === 'mint'
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Mint FI
                  </button>
                  <button
                    onClick={() => setAction('repay')}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      action === 'repay'
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <MinusIcon className="h-4 w-4 inline mr-2" />
                    Repay
                  </button>
                </div>
              </div>

              {action && (
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field w-full"
                    placeholder={`Enter ${action} amount`}
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedVault(null)
                    setAction(null)
                    setAmount('')
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVaultAction}
                  disabled={!action || !amount}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action ? `${action.charAt(0).toUpperCase() + action.slice(1)}` : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}