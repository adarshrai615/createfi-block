import { useState, useEffect, useRef } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface Trade {
  id: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: Date
}

export default function Trading() {
  const [selectedPair, setSelectedPair] = useState('CREATE/FI')
  const [trades, setTrades] = useState<Trade[]>([])
  const [orderBook] = useState({
    bids: [{ price: 10.50, amount: 1000 }, { price: 10.45, amount: 500 }],
    asks: [{ price: 10.55, amount: 800 }, { price: 10.60, amount: 1200 }]
  })
  
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  // Trading pairs
  const tradingPairs = [
    { symbol: 'CREATE/FI', name: 'CREATE Token / FI Stablecoin' },
    { symbol: 'CREATE/USDT', name: 'CREATE Token / USDT' },
    { symbol: 'FI/USDT', name: 'FI Stablecoin / USDT' },
  ]

  useEffect(() => {
    if (chartContainerRef.current) {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#1f2937' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
        },
      })

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })

      chartRef.current = chart
      candlestickSeriesRef.current = candlestickSeries

      // Generate sample data
      const data: any[] = []
      let basePrice = 10.50
      const now = new Date()
      
      for (let i = 0; i < 100; i++) {
        const time = new Date(now.getTime() - (100 - i) * 60000)
        const change = (Math.random() - 0.5) * 0.1
        const prevPrice = basePrice
        basePrice += change
        
        data.push({
          time: (time.getTime() / 1000) as any,
          open: prevPrice,
          high: Math.max(prevPrice, basePrice) + Math.random() * 0.05,
          low: Math.min(prevPrice, basePrice) - Math.random() * 0.05,
          close: basePrice,
        })
      }

      candlestickSeries.setData(data)

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    }
  }, [selectedPair])

  // Generate sample trades
  useEffect(() => {
    const generateTrade = (): Trade => ({
      id: Math.random().toString(36).substr(2, 9),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      amount: Math.random() * 1000 + 100,
      price: 10.50 + (Math.random() - 0.5) * 0.2,
      timestamp: new Date(),
    })

    const initialTrades = Array.from({ length: 20 }, generateTrade)
    setTrades(initialTrades)

    // Simulate new trades
    const interval = setInterval(() => {
      setTrades(prev => [generateTrade(), ...prev.slice(0, 19)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Trading</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="input-field"
          >
            {tradingPairs.map((pair) => (
              <option key={pair.symbol} value={pair.symbol}>
                {pair.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">{selectedPair} Chart</h2>
            </div>
            <div ref={chartContainerRef} className="tradingview-chart h-96"></div>
          </div>
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
            
            {/* Asks */}
            <div className="space-y-1 mb-4">
              <div className="text-sm text-secondary-300 font-medium">Asks</div>
              {orderBook.asks.map((ask, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-danger-400">{ask.price.toFixed(2)}</span>
                  <span className="text-white">{ask.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="border-t border-secondary-700 pt-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-300">Spread</span>
                <span className="text-white">0.05 (0.48%)</span>
              </div>
            </div>

            {/* Bids */}
            <div className="space-y-1">
              <div className="text-sm text-secondary-300 font-medium">Bids</div>
              {orderBook.bids.map((bid, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-success-400">{bid.price.toFixed(2)}</span>
                  <span className="text-white">{bid.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Feed */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {trades.map((trade) => (
            <div key={trade.id} className="trade-feed-item flex items-center justify-between py-2 border-b border-secondary-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                {trade.type === 'buy' ? (
                  <ArrowUpIcon className="h-4 w-4 text-success-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-danger-400" />
                )}
                <span className={`text-sm font-medium ${
                  trade.type === 'buy' ? 'text-success-400' : 'text-danger-400'
                }`}>
                  {trade.type.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white font-medium">
                  {trade.price.toFixed(2)} FI
                </div>
                <div className="text-xs text-secondary-400">
                  {trade.amount.toLocaleString()} CREATE
                </div>
              </div>
              <div className="text-xs text-secondary-400">
                {trade.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}