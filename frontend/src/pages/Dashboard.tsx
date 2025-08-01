import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface QuickStat {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: any
}

interface RecentActivity {
  id: string
  type: string
  description: string
  amount: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

export default function Dashboard() {
  const [quickStats, setQuickStats] = useState<QuickStat[]>([
    {
      name: 'Total Value Locked',
      value: '$19.5M',
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    },
    {
      name: 'CREATE Token Price',
      value: '$10.50',
      change: '+5.2%',
      changeType: 'positive',
      icon: ChartBarIcon
    },
    {
      name: 'Active Vaults',
      value: '1,247',
      change: '+23',
      changeType: 'positive',
      icon: BanknotesIcon
    },
    {
      name: 'DAO Members',
      value: '892',
      change: '+12',
      changeType: 'positive',
      icon: UsersIcon
    }
  ])

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'Trade',
      description: 'CREATE/FI Pool - Added Liquidity',
      amount: '+$2,500',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'Vault',
      description: 'Opened new FI Vault',
      amount: '$1,000',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'Governance',
      description: 'Voted on Proposal #42',
      amount: '1,000 CREATE',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '4',
      type: 'Staking',
      description: 'Staked CREATE Tokens',
      amount: '+5,000 CREATE',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'completed'
    }
  ])

  const features = [
    {
      name: 'Trading',
      description: 'Trade tokens with AMM pools and order book',
      icon: ChartBarIcon,
      href: '/trading',
      color: 'bg-primary-600'
    },
    {
      name: 'Analytics',
      description: 'View detailed analytics and market data',
      icon: FireIcon,
      href: '/analytics',
      color: 'bg-success-600'
    },
    {
      name: 'Governance',
      description: 'Participate in DAO governance and voting',
      icon: CogIcon,
      href: '/governance',
      color: 'bg-warning-600'
    },
    {
      name: 'Vaults',
      description: 'Manage FI stablecoin vaults',
      icon: BanknotesIcon,
      href: '/vaults',
      color: 'bg-danger-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to CREATEFI</h1>
        <p className="text-primary-100 text-lg">
          The complete DeFi ecosystem with fixed fees, governance, and stablecoin vaults
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-300">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-4 w-4 text-success-400 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-danger-400 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-success-400' : 'text-danger-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <stat.icon className="h-8 w-8 text-secondary-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.name} href={feature.href}>
            <div className="card hover:bg-secondary-700 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                  <p className="text-secondary-300">{feature.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-secondary-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-success-400' :
                    activity.status === 'pending' ? 'bg-warning-400' : 'bg-danger-400'
                  }`}></div>
                  <div>
                    <div className="text-white font-medium">{activity.type}</div>
                    <div className="text-secondary-400 text-sm">{activity.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{activity.amount}</div>
                  <div className="text-secondary-400 text-xs">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/trading">
              <button className="w-full btn-primary text-left">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Start Trading</span>
                </div>
              </button>
            </Link>
            
            <Link href="/vaults">
              <button className="w-full btn-secondary text-left">
                <div className="flex items-center space-x-3">
                  <BanknotesIcon className="h-5 w-5" />
                  <span>Open Vault</span>
                </div>
              </button>
            </Link>
            
            <Link href="/governance">
              <button className="w-full btn-secondary text-left">
                <div className="flex items-center space-x-3">
                  <CogIcon className="h-5 w-5" />
                  <span>View Proposals</span>
                </div>
              </button>
            </Link>
            
            <Link href="/analytics">
              <button className="w-full btn-secondary text-left">
                <div className="flex items-center space-x-3">
                  <FireIcon className="h-5 w-5" />
                  <span>View Analytics</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-secondary-300">Block Height</span>
              <span className="text-white font-mono">1,234,567</span>
            </div>
          </div>
          <div className="bg-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-secondary-300">Network Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                <span className="text-success-400">Online</span>
              </div>
            </div>
          </div>
          <div className="bg-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-secondary-300">Active Validators</span>
              <span className="text-white">24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}