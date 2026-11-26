import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Income',
    value: '—',
    description: 'Recorded farm income',
    icon: TrendingUp,
    color: 'text-green-600',
    background: 'bg-green-50',
  },
  {
    title: 'Total Expenses',
    value: '—',
    description: 'Recorded farm expenses',
    icon: TrendingDown,
    color: 'text-red-600',
    background: 'bg-red-50',
  },
  {
    title: 'Current Balance',
    value: '—',
    description: 'Available farm balance',
    icon: Wallet,
    color: 'text-blue-600',
    background: 'bg-blue-50',
  },
  {
    title: 'Transactions',
    value: '—',
    description: 'Recorded transactions',
    icon: Receipt,
    color: 'text-purple-600',
    background: 'bg-purple-50',
  },
]

function AccountantDashboard() {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          Financial Management
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user.first_name || 'Accountant'}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your farm's financial performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statistics.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className={`${stat.background} ${stat.color} p-2 rounded-lg`}>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Financial Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Summary of income and expenses
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-lg bg-green-50 p-5">
              <div className="flex items-center gap-2 text-green-700">
                <ArrowUpRight size={20} />
                <p className="text-sm font-medium">Income</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">—</p>
              <p className="text-xs text-gray-500 mt-1">
                Total recorded income
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <div className="flex items-center gap-2 text-red-700">
                <ArrowDownRight size={20} />
                <p className="text-sm font-medium">Expenses</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">—</p>
              <p className="text-xs text-gray-500 mt-1">
                Total recorded expenses
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center">
            <CalendarDays size={30} className="mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mt-3">
              Financial reports coming soon
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Your financial summaries will appear here.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest recorded financial activity
          </p>

          <div className="py-10 text-center">
            <Receipt size={32} className="mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mt-3">
              No transactions available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Recent transactions will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountantDashboard