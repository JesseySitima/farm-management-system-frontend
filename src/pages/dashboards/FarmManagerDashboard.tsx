
import {
  Beef,
  HeartPulse,
  ClipboardList,
  Users,
  CalendarDays,
  AlertTriangle,
  Activity,
  ArrowUpRight,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Livestock',
    value: '—',
    description: 'Animals under management',
    icon: Beef,
  },
  {
    title: 'Health Alerts',
    value: '—',
    description: 'Animals requiring attention',
    icon: HeartPulse,
  },
  {
    title: 'Pending Tasks',
    value: '—',
    description: 'Tasks awaiting completion',
    icon: ClipboardList,
  },
  {
    title: 'Farm Workers',
    value: '—',
    description: 'Active farm workers',
    icon: Users,
  },
]

function FarmManagerDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          Farm Operations
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.first_name || 'Farm Manager'}
        </h1>

        <p className="text-gray-500 mt-1">
          Here's what's happening across your farm today.
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

      {/* Operations overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Farm Operations Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Monitor important farm activities
              </p>
            </div>

            <ArrowUpRight size={20} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-lg p-4">
              <CalendarDays size={21} className="text-blue-600 mb-3" />
              <p className="text-sm text-gray-500">
                Daily Activities
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting activity records
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
              <Activity size={21} className="text-green-700 mb-3" />
              <p className="text-sm text-gray-500">
                Breeding Activities
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting breeding records
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <Users size={21} className="text-purple-600 mb-3" />
              <p className="text-sm text-gray-500">
                Staff Management
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting staff records
              </p>
            </div>

          </div>
        </div>

        {/* Attention required */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            Attention Required
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Issues requiring your attention
          </p>

          <div className="mt-8 text-center py-6">
            <AlertTriangle
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm font-medium text-gray-600 mt-3">
              No alerts available
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Farm alerts will appear here once connected.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FarmManagerDashboard
