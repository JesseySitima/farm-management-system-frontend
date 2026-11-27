import { useState } from "react";
import RegisterFlockModal from "./components/CreateFlockModal";
import { useLivestockFlocks } from "../../../hooks/useLivestockFlocks";
import { Beef, Activity, Users, Mars, Venus, Plus } from "lucide-react";

const Flocks = () => {
  const { flocks, loading, error, fetchFlocks } = useLivestockFlocks();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const totalFlocks = flocks.length;

  const activeFlocks = flocks.filter(
    (flock) => flock.status === "active",
  ).length;

  const totalAnimals = flocks.reduce(
    (total, flock) => total + flock.total_quantity,
    0,
  );

  const totalMales = flocks.reduce(
    (total, flock) => total + (flock.male_quantity || 0),
    0,
  );

  const totalFemales = flocks.reduce(
    (total, flock) => total + (flock.female_quantity || 0),
    0,
  );

  const stats = [
    {
      label: "Total Flocks",
      value: totalFlocks,
      icon: Beef,
    },
    {
      label: "Active Flocks",
      value: activeFlocks,
      icon: Activity,
    },
    {
      label: "Total Animals",
      value: totalAnimals,
      icon: Users,
    },
    {
      label: "Male Animals",
      value: totalMales,
      icon: Mars,
    },
    {
      label: "Female Animals",
      value: totalFemales,
      icon: Venus,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livestock Flocks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage poultry and other flock-managed livestock.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus size={18} />
          Register Flock
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <div className="rounded-lg bg-green-50 p-2">
                  <Icon size={19} className="text-green-700" />
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-900 mt-3">
                {loading ? "—" : stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Registered Flocks</h2>
            <p className="text-sm text-gray-500 mt-1">
              All flock-managed livestock across your farms.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchFlocks}
            disabled={loading}
            className="text-sm font-medium text-green-700 hover:text-green-800 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading livestock flocks...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchFlocks}
              className="mt-3 text-sm font-medium text-green-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : flocks.length === 0 ? (
          <div className="p-10 text-center">
            <Beef size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              No livestock flocks registered yet.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Register your first flock to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Flock Code</th>
                  <th className="px-5 py-3 font-medium">Species</th>
                  <th className="px-5 py-3 font-medium">Farm</th>
                  <th className="px-5 py-3 font-medium">Breed</th>
                  <th className="px-5 py-3 font-medium">Purpose</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Males</th>
                  <th className="px-5 py-3 font-medium">Females</th>
                  <th className="px-5 py-3 font-medium">Date Established</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {flocks.map((flock) => (
                  <tr key={flock.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {flock.flock_code}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.species?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.farms?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.breed || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.purpose || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.total_quantity.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.male_quantity.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.female_quantity.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {flock.date_established
                        ? new Date(flock.date_established).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          flock.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {flock.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showRegisterModal && (
        <RegisterFlockModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            fetchFlocks();
          }}
        />
      )}
    </div>
  );
};

export default Flocks;
