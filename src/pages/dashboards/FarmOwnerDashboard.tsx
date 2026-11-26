
import {
  Beef,
  Wallet,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Users,
  ArrowUpRight,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Livestock',
    value: '—',
    description: 'Animals currently registered',
    icon: Beef,
  },
  {
    title: 'Farm Income',
    value: '—',
    description: 'Total recorded income',
    icon: TrendingUp,
  },
  {
    title: 'Farm Expenses',
    value: '—',
    description: 'Total recorded expenses',
    icon: TrendingDown,
  },
  {
    title: 'Farm Balance',
    value: '—',
    description: 'Income less expenses',
    icon: Wallet,
  },
]

function FarmOwnerDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          Farm Owner Overview
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.first_name || 'Farm Owner'}
        </h1>

        <p className="text-gray-500 mt-1">
          Here's how your farm is performing.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statistics.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <div className="bg-green-50 text-green-700 p-2 rounded-lg">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-4">
                {stat.value}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Farm overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Farm Performance
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your farm operations
              </p>
            </div>

            <ArrowUpRight size={20} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <Beef size={21} className="text-green-700 mb-3" />
              <p className="text-sm text-gray-500">
                Livestock Management
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting livestock data
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <HeartPulse size={21} className="text-red-500 mb-3" />
              <p className="text-sm text-gray-500">
                Animal Health
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting health records
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <Users size={21} className="text-blue-600 mb-3" />
              <p className="text-sm text-gray-500">
                Farm Staff
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting staff records
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <Wallet size={21} className="text-amber-600 mb-3" />
              <p className="text-sm text-gray-500">
                Financial Performance
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting financial records
              </p>
            </div>
          </div>
        </div>

        {/* Quick information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            Farm Summary
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Important farm information
          </p>

          <div className="mt-8 text-center py-6">
            <Beef
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm font-medium text-gray-600 mt-3">
              No farm data available
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Your farm summary will appear here once connected.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FarmOwnerDashboard
