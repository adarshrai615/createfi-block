import { useState, useEffect, useRef } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import blockchainService from '../services/blockchain'
import toast from 'react-hot-toast'

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
  const [selectedPool, setSelectedPool] = useState<any>(null)
  const [swapAmount, setSwapAmount] = useState('')
  const [tokenIn, setTokenIn] = useState('CREATE')
  const [estimatedOut, setEstimatedOut] = useState('0')
  const [isSwapping, setIsSwapping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    // Subscribe to blockchain service
    const unsubscribe = blockchainService.subscribe((service) => {
      setIsConnected(service.isConnected && !!service.selectedAccount)
    })

    // Load pools when connected
    loadPools()

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 400,
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

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      })

      chartInstanceRef.current = chart
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
        chart.applyOptions({ width: chartRef.current!.clientWidth })
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    }
  }, [])

  const loadPools = async () => {
    try {
      if (blockchainService.getState().isConnected) {
        const poolData = await blockchainService.getPools()
        // TODO: Implement pool management
        if (poolData.length > 0) {
          setSelectedPool(poolData[0])
        }
      }
    } catch (error) {
      console.error('Failed to load pools:', error)
    }
  }

  const executeSwap = async () => {
    if (!selectedPool || !swapAmount || !isConnected) {
      toast.error('Please connect wallet and select a pool')
      return
    }

    setIsSwapping(true)
    try {
      const amountIn = (parseFloat(swapAmount) * 1e12).toString() // Convert to blockchain units
      const minAmountOut = (parseFloat(estimatedOut) * 0.95 * 1e12).toString() // 5% slippage
      
      await blockchainService.executeSwap(
        selectedPool.id,
        tokenIn,
        amountIn,
        minAmountOut
      )

      toast.success('Swap executed successfully!')
      
      // Add to trades list
      const newTrade: Trade = {
        id: Date.now().toString(),
        type: 'buy',
        amount: parseFloat(swapAmount),
        price: 10.50, // Mock price
        timestamp: new Date()
      }
      setTrades(prev => [newTrade, ...prev.slice(0, 9)])
      
      // Reset form
      setSwapAmount('')
      setEstimatedOut('0')
      
    } catch (error: any) {
      console.error('Swap failed:', error)
      toast.error(error.message || 'Swap failed')
    } finally {
      setIsSwapping(false)
    }
  }

  const createNewPool = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    const tokenA = prompt('Enter first token symbol:')
    const tokenB = prompt('Enter second token symbol:')
    const liquidityA = prompt('Enter first token liquidity amount:')
    const liquidityB = prompt('Enter second token liquidity amount:')

    if (tokenA && tokenB && liquidityA && liquidityB) {
      try {
        const amountA = (parseFloat(liquidityA) * 1e12).toString()
        const amountB = (parseFloat(liquidityB) * 1e12).toString()
        
        await blockchainService.createPool(tokenA, tokenB, amountA, amountB)
        toast.success('Pool created successfully!')
        loadPools() // Reload pools
      } catch (error: any) {
        console.error('Pool creation failed:', error)
        toast.error(error.message || 'Pool creation failed')
      }
    }
  }

  // Estimate swap output (simple calculation)
  useEffect(() => {
    if (swapAmount && selectedPool) {
      const amount = parseFloat(swapAmount)
      const estimated = amount * 0.997 // 0.3% fee
      setEstimatedOut(estimated.toFixed(6))
    } else {
      setEstimatedOut('0')
    }
  }, [swapAmount, selectedPool])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading</h1>
          <p className="text-gray-400">Trade tokens with automated market making</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
          >
            <option value="CREATE/FI">CREATE/FI</option>
            <option value="CREATE/USDT">CREATE/USDT</option>
            <option value="FI/USDT">FI/USDT</option>
          </select>
          <button
            onClick={createNewPool}
            disabled={!isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Pool
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trading Chart */}
        <div className="lg:col-span-3 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{selectedPair} Chart</h3>
            <div className="text-2xl font-bold text-white">
              $10.50 <span className="text-green-400 text-sm ml-2">+2.5%</span>
            </div>
          </div>
          <div ref={chartRef} className="w-full"></div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Swap Interface */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Swap Tokens</h3>
            
            {!isConnected && (
              <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg">
                <p className="text-yellow-300 text-sm">Connect your wallet to start trading</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">From</label>
                <div className="flex space-x-2">
                  <select 
                    className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 flex-1"
                    value={tokenIn}
                    onChange={(e) => setTokenIn(e.target.value)}
                  >
                    <option value="CREATE">CREATE</option>
                    <option value="FI">FI</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full mt-2 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
              </div>

              <div className="flex justify-center">
                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">To</label>
                <div className="bg-gray-700 rounded-lg px-3 py-2">
                  <div className="text-white">{tokenIn === 'CREATE' ? 'FI' : 'CREATE'}</div>
                  <div className="text-xl text-white mt-1">{estimatedOut}</div>
                </div>
              </div>

              <button
                onClick={executeSwap}
                disabled={!isConnected || !swapAmount || isSwapping}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isSwapping ? 'Swapping...' : 'Swap'}
              </button>

              {selectedPool && (
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Pool: {selectedPool.token_pair || 'CREATE-FI'}</div>
                  <div>Fee: 0.01 FI + 0.3% trading fee</div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trades.length === 0 ? (
                <p className="text-gray-400 text-sm">No trades yet</p>
              ) : (
                trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {trade.type === 'buy' ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-white">{trade.amount.toFixed(4)}</span>
                    </div>
                    <div className="text-gray-400">
                      ${trade.price.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Book */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-red-400 mb-2">Asks</h4>
                {orderBook.asks.map((ask, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-white">{ask.price.toFixed(2)}</span>
                    <span className="text-gray-400">{ask.amount}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm text-green-400 mb-2">Bids</h4>
                {orderBook.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-white">{bid.price.toFixed(2)}</span>
                    <span className="text-gray-400">{bid.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}