import { useState, useEffect } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface TokenRanking {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  tvl: number
}

interface PoolData {
  pair: string
  tvl: number
  volume24h: number
  fees24h: number
  apr: number
}

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [tvlChart, setTvlChart] = useState<IChartApi | null>(null)
  const [volumeChart, setVolumeChart] = useState<IChartApi | null>(null)

  const tokenRankings: TokenRanking[] = [
    {
      symbol: 'CREATE',
      name: 'CREATE Token',
      price: 10.50,
      change24h: 5.2,
      volume24h: 2500000,
      marketCap: 10500000000,
      tvl: 8500000
    },
    {
      symbol: 'FI',
      name: 'FI Stablecoin',
      price: 1.00,
      change24h: 0.1,
      volume24h: 1800000,
      marketCap: 50000000,
      tvl: 12000000
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      price: 1.00,
      change24h: -0.05,
      volume24h: 3200000,
      marketCap: 80000000,
      tvl: 6500000
    }
  ]

  const topPools: PoolData[] = [
    {
      pair: 'CREATE/FI',
      tvl: 8500000,
      volume24h: 2500000,
      fees24h: 2500,
      apr: 12.5
    },
    {
      pair: 'CREATE/USDT',
      tvl: 6500000,
      volume24h: 1800000,
      fees24h: 1800,
      apr: 15.2
    },
    {
      pair: 'FI/USDT',
      tvl: 4500000,
      volume24h: 1200000,
      fees24h: 1200,
      apr: 18.7
    }
  ]

  const stats = [
    {
      name: 'Total Value Locked',
      value: '$19.5M',
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    },
    {
      name: '24h Volume',
      value: '$5.5M',
      change: '+8.3%',
      changeType: 'positive',
      icon: ChartBarIcon
    },
    {
      name: 'Total Fees (24h)',
      value: '$5,500',
      change: '+15.2%',
      changeType: 'positive',
      icon: FireIcon
    },
    {
      name: 'Active Pools',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: TrendingUpIcon
    }
  ]

  useEffect(() => {
    // Initialize TVL chart
    const tvlContainer = document.getElementById('tvl-chart')
    if (tvlContainer && !tvlChart) {
      const chart = createChart(tvlContainer, {
        width: tvlContainer.clientWidth,
        height: 200,
        layout: {
          background: { color: '#1f2937' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
        },
      })

      const lineSeries = chart.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
      })

      // Generate sample TVL data
      const data = []
      let baseTvl = 19500000
      const now = new Date()
      
      for (let i = 0; i < 30; i++) {
        const time = new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000)
        const change = (Math.random() - 0.5) * 0.1
        baseTvl += baseTvl * change
        
        data.push({
          time: time.getTime() / 1000,
          value: baseTvl,
        })
      }

      lineSeries.setData(data)
      setTvlChart(chart)
    }

    // Initialize Volume chart
    const volumeContainer = document.getElementById('volume-chart')
    if (volumeContainer && !volumeChart) {
      const chart = createChart(volumeContainer, {
        width: volumeContainer.clientWidth,
        height: 200,
        layout: {
          background: { color: '#1f2937' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
        },
      })

      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(59, 130, 246, 0.3)',
        bottomColor: 'rgba(59, 130, 246, 0.0)',
        lineColor: '#3b82f6',
        lineWidth: 2,
      })

      // Generate sample volume data
      const data = []
      let baseVolume = 5500000
      const now = new Date()
      
      for (let i = 0; i < 30; i++) {
        const time = new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000)
        const change = (Math.random() - 0.5) * 0.2
        baseVolume += baseVolume * change
        
        data.push({
          time: time.getTime() / 1000,
          value: baseVolume,
        })
      }

      areaSeries.setData(data)
      setVolumeChart(chart)
    }
  }, [tvlChart, volumeChart])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          {['1h', '24h', '7d', '30d'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-700 text-secondary-300 hover:bg-secondary-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-300">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'positive' ? (
                    <TrendingUpIcon className="h-4 w-4 text-success-400 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-danger-400 mr-1" />
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Total Value Locked</h3>
          <div id="tvl-chart" className="h-48"></div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">24h Volume</h3>
          <div id="volume-chart" className="h-48"></div>
        </div>
      </div>

      {/* Token Rankings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Token Rankings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header text-left">Token</th>
                <th className="table-header text-right">Price</th>
                <th className="table-header text-right">24h Change</th>
                <th className="table-header text-right">24h Volume</th>
                <th className="table-header text-right">Market Cap</th>
                <th className="table-header text-right">TVL</th>
              </tr>
            </thead>
            <tbody>
              {tokenRankings.map((token, index) => (
                <tr key={token.symbol} className="border-b border-secondary-700 last:border-b-0">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-secondary-300 mr-2">#{index + 1}</span>
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-secondary-400 text-xs">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-right">${token.price.toFixed(2)}</td>
                  <td className="table-cell text-right">
                    <span className={token.change24h >= 0 ? 'text-success-400' : 'text-danger-400'}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="table-cell text-right">${(token.volume24h / 1000000).toFixed(1)}M</td>
                  <td className="table-cell text-right">${(token.marketCap / 1000000).toFixed(0)}M</td>
                  <td className="table-cell text-right">${(token.tvl / 1000000).toFixed(1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Pools */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Top Pools by TVL</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPools.map((pool) => (
            <div key={pool.pair} className="bg-secondary-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{pool.pair}</h4>
                <span className="text-success-400 text-sm font-medium">{pool.apr.toFixed(1)}% APR</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-300">TVL</span>
                  <span className="text-white">${(pool.tvl / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-300">24h Volume</span>
                  <span className="text-white">${(pool.volume24h / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-300">24h Fees</span>
                  <span className="text-white">${pool.fees24h.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}