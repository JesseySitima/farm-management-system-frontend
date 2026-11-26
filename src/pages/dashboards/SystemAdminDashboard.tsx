
import {
  Warehouse,
  Users,
  Beef,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Farms',
    value: '—',
    description: 'Registered farms',
    icon: Warehouse,
  },
  {
    title: 'System Users',
    value: '—',
    description: 'Registered users',
    icon: Users,
  },
  {
    title: 'Total Livestock',
    value: '—',
    description: 'Across all farms',
    icon: Beef,
  },
  {
    title: 'System Activity',
    value: '—',
    description: 'Activities recorded today',
    icon: Activity,
  },
]

function SystemAdminDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  return (
    <div className="space-y-8">

      {/* Welcome section */}
      <div>
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <ShieldCheck size={20} />
          <span className="text-sm font-medium">
            System Administration
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.first_name || 'Administrator'}
        </h1>

        <p className="text-gray-500 mt-1">
          Here's an overview of your farm management system.
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

      {/* Main dashboard sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* System overview */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                System Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                General system information
              </p>
            </div>

            <ArrowUpRight size={20} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Farm registrations
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting data connection
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                User registrations
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting data connection
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Livestock records
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting data connection
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                System health
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting monitoring integration
              </p>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            Recent Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest activities across the system
          </p>

          <div className="mt-8 text-center py-6">
            <Activity
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm font-medium text-gray-600 mt-3">
              No activity to display
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Activity records will appear here once connected.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SystemAdminDashboard
