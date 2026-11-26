
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Beef,
  CalendarDays,
  AlertCircle,
  Activity,
} from 'lucide-react'

const statistics = [
  {
    title: 'My Tasks',
    value: '—',
    description: 'Total assigned tasks',
    icon: ClipboardList,
  },
  {
    title: 'Completed',
    value: '—',
    description: 'Tasks completed today',
    icon: CheckCircle2,
  },
  {
    title: 'Pending',
    value: '—',
    description: 'Tasks awaiting completion',
    icon: Clock,
  },
  {
    title: 'My Livestock',
    value: '—',
    description: 'Animals assigned to me',
    icon: Beef,
  },
]

function FarmWorkerDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem('user') || '{}'
  )

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          My Farm Workspace
        </p>

        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user.first_name || 'Farm Worker'}
        </h1>

        <p className="text-gray-500 mt-1">
          Here's what you need to focus on today.
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

      {/* My work */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            My Daily Activities
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Activities assigned to you
          </p>

          <div className="mt-8 text-center py-6">
            <CalendarDays
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="text-sm font-medium text-gray-600 mt-3">
              No activities available
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Your daily activities will appear here.
            </p>
          </div>
        </div>

        {/* Task status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">
            My Work Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your current work overview
          </p>

          <div className="space-y-5 mt-7">

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-amber-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Pending Tasks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tasks waiting for completion.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Completed Tasks
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tasks you have finished.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Issues to Report
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Report livestock or farm concerns.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity size={20} className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Daily Progress
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Track your completed activities.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default FarmWorkerDashboard
