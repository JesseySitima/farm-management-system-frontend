import {
  Boxes,
  AlertTriangle,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
} from 'lucide-react'

const statistics = [
  {
    title: 'Stock Items',
    value: '—',
    description: 'Total inventory items',
    icon: Boxes,
    color: 'text-blue-600',
    background: 'bg-blue-50',
  },
  {
    title: 'Low Stock Alerts',
    value: '—',
    description: 'Items needing restocking',
    icon: AlertTriangle,
    color: 'text-amber-600',
    background: 'bg-amber-50',
  },
  {
    title: 'Stock Movements',
    value: '—',
    description: 'Recorded stock movements',
    icon: Package,
    color: 'text-purple-600',
    background: 'bg-purple-50',
  },
  {
    title: 'Suppliers',
    value: '—',
    description: 'Registered suppliers',
    icon: Truck,
    color: 'text-green-600',
    background: 'bg-green-50',
  },
]

function StorekeeperDashboard() {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700 mb-2">
          Inventory Management
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user.first_name || 'Storekeeper'}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your farm inventory and stock activities.
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
          <h2 className="font-semibold text-gray-900">Inventory Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Current stock levels and inventory status
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <div className="rounded-lg bg-blue-50 p-5">
              <div className="flex items-center gap-2 text-blue-700">
                <ArrowDownToLine size={20} />
                <p className="text-sm font-medium">Stock Received</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">—</p>
              <p className="text-xs text-gray-500 mt-1">
                Items added to inventory
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-5">
              <div className="flex items-center gap-2 text-purple-700">
                <ArrowUpFromLine size={20} />
                <p className="text-sm font-medium">Stock Issued</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">—</p>
              <p className="text-xs text-gray-500 mt-1">
                Items issued from inventory
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center">
            <Boxes size={30} className="mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mt-3">
              Inventory data coming soon
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Your stock levels will appear here.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Recent Stock Movements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest inventory activity
          </p>

          <div className="py-10 text-center">
            <ClipboardList size={32} className="mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mt-3">
              No stock movements available
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Recent stock activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorekeeperDashboard