import { useState } from 'react'
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  amount: number
  recipient: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  votesFor: number
  votesAgainst: number
  totalVotes: number
  endTime: Date
  createdAt: Date
}

export default function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 42,
      title: 'Increase CREATE Token Staking Rewards',
      description: 'Proposal to increase staking rewards from 5% to 7% APR to incentivize more token staking and governance participation.',
      proposer: '0x1234...5678',
      amount: 500000,
      recipient: '0x5678...9012',
      status: 'active',
      votesFor: 1250000,
      votesAgainst: 300000,
      totalVotes: 1550000,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 41,
      title: 'Add USDC as Collateral for FI Vaults',
      description: 'Proposal to add USDC as an accepted collateral type for FI stablecoin vaults to increase liquidity options.',
      proposer: '0x2345...6789',
      amount: 1000000,
      recipient: '0x6789...0123',
      status: 'passed',
      votesFor: 2000000,
      votesAgainst: 500000,
      totalVotes: 2500000,
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 40,
      title: 'Reduce DEX Trading Fees',
      description: 'Proposal to reduce DEX trading fees from 0.3% to 0.2% to increase trading volume and attract more users.',
      proposer: '0x3456...7890',
      amount: 750000,
      recipient: '0x7890...1234',
      status: 'rejected',
      votesFor: 800000,
      votesAgainst: 1200000,
      totalVotes: 2000000,
      endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ])

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [voteAmount, setVoteAmount] = useState('')
  const [voteType, setVoteType] = useState<'for' | 'against' | null>(null)

  const stats = [
    {
      name: 'Total Proposals',
      value: '42',
      icon: UserGroupIcon
    },
    {
      name: 'Active Proposals',
      value: '1',
      icon: ClockIcon
    },
    {
      name: 'DAO Treasury',
      value: '$2.5M',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Total Votes Cast',
      value: '6.05M',
      icon: CheckIcon
    }
  ]

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-warning-400'
      case 'passed': return 'text-success-400'
      case 'rejected': return 'text-danger-400'
      case 'executed': return 'text-primary-400'
      default: return 'text-secondary-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <ClockIcon className="h-4 w-4" />
      case 'passed': return <CheckIcon className="h-4 w-4" />
      case 'rejected': return <XMarkIcon className="h-4 w-4" />
      case 'executed': return <CheckIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const handleVote = () => {
    if (!selectedProposal || !voteAmount || !voteType) return
    
    // Here you would integrate with the blockchain to cast the vote
    console.log(`Voting ${voteType} on proposal ${selectedProposal.id} with ${voteAmount} CREATE tokens`)
    
    // Reset form
    setVoteAmount('')
    setVoteType(null)
    setSelectedProposal(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">DAO Governance</h1>
        <button className="btn-primary">
          Create Proposal
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

      {/* Proposals */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Proposals</h3>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-secondary-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">#{proposal.id} {proposal.title}</h4>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span className="capitalize">{proposal.status}</span>
                    </div>
                  </div>
                  <p className="text-secondary-300 text-sm mb-2">{proposal.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-secondary-400">
                    <span>Proposed by: {proposal.proposer}</span>
                    <span>Amount: ${proposal.amount.toLocaleString()}</span>
                    <span>Created: {proposal.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                {proposal.status === 'active' && (
                  <button
                    onClick={() => setSelectedProposal(proposal)}
                    className="btn-primary text-sm"
                  >
                    Vote
                  </button>
                )}
              </div>

              {/* Vote Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-300">Vote Progress</span>
                  <span className="text-white">{proposal.totalVotes.toLocaleString()} votes</span>
                </div>
                <div className="flex space-x-1">
                  <div 
                    className="h-2 bg-success-400 rounded-l"
                    style={{ width: `${getVotePercentage(proposal.votesFor, proposal.totalVotes)}%` }}
                  ></div>
                  <div 
                    className="h-2 bg-danger-400 rounded-r"
                    style={{ width: `${getVotePercentage(proposal.votesAgainst, proposal.totalVotes)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-success-400">
                    For: {proposal.votesFor.toLocaleString()} ({getVotePercentage(proposal.votesFor, proposal.totalVotes).toFixed(1)}%)
                  </span>
                  <span className="text-danger-400">
                    Against: {proposal.votesAgainst.toLocaleString()} ({getVotePercentage(proposal.votesAgainst, proposal.totalVotes).toFixed(1)}%)
                  </span>
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="mt-3 pt-3 border-t border-secondary-600">
                  <div className="flex items-center space-x-2 text-sm text-secondary-300">
                    <ClockIcon className="h-4 w-4" />
                    <span>Ends: {proposal.endTime.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vote Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Vote on Proposal #{selectedProposal.id}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Vote Amount (CREATE tokens)
                </label>
                <input
                  type="number"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter amount to vote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Vote Type
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setVoteType('for')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      voteType === 'for'
                        ? 'bg-success-600 border-success-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <CheckIcon className="h-4 w-4 inline mr-2" />
                    Vote For
                  </button>
                  <button
                    onClick={() => setVoteType('against')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      voteType === 'against'
                        ? 'bg-danger-600 border-danger-500 text-white'
                        : 'bg-secondary-700 border-secondary-600 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <XMarkIcon className="h-4 w-4 inline mr-2" />
                    Vote Against
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVote}
                  disabled={!voteAmount || !voteType}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}