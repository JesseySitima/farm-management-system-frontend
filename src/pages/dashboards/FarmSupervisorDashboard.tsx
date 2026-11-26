
import {
  Beef,
  ClipboardList,
  CheckCircle2,
  Clock,
  HeartPulse,
  Users,
  CalendarDays,
  AlertCircle,
} from 'lucide-react'

const statistics = [
  {
    title: 'Assigned Livestock',
    value: '—',
    description: 'Animals under your supervision',
    icon: Beef,
  },
  {
    title: 'Pending Tasks',
    value: '—',
    description: 'Tasks awaiting completion',
    icon: ClipboardList,
  },
  {
    title: 'Completed Tasks',
    value: '—',
    description: 'Tasks completed today',
    icon: CheckCircle2,
  },
  {
    title: 'Workers Supervised',
    value: '—',
    description: 'Workers under your supervision',
    icon: Users,
  },
]

function FarmSupervisorDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          Farm Supervision
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.first_name || 'Supervisor'}
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor your assigned livestock, workers and daily farm activities.
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

      {/* Daily supervision */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            Daily Supervision
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Overview of today's farm activities
          </p>

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
              <Clock size={21} className="text-amber-600 mb-3" />
              <p className="text-sm text-gray-500">
                Pending Tasks
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting task records
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <HeartPulse size={21} className="text-red-500 mb-3" />
              <p className="text-sm text-gray-500">
                Animal Health Observations
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting health observations
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <Users size={21} className="text-purple-600 mb-3" />
              <p className="text-sm text-gray-500">
                Worker Activities
              </p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                Awaiting worker activity records
              </p>
            </div>

          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            Issues to Report
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Livestock and operational concerns
          </p>

          <div className="mt-8 text-center py-6">
            <AlertCircle
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm font-medium text-gray-600 mt-3">
              No reported issues
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Reported concerns will appear here.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FarmSupervisorDashboard
