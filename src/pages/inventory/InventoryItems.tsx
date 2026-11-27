import { useState } from "react";
import { Package, Plus, RefreshCw, Search, AlertCircle } from "lucide-react";
import { useInventoryItems } from "../../hooks/useInventoryItems";
import CreateInventoryItemModal from "./components/CreateInventoryItemModal";

const InventoryItems = () => {
  const { items, loading, error, fetchItems } = useInventoryItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeItems = items.filter((item) => item.is_active).length;
  const inactiveItems = items.length - activeItems;

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.name.toLowerCase().includes(search) ||
      item.item_code.toLowerCase().includes(search) ||
      item.inventory_categories?.name.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center
        sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage farm supplies, feeds, medicines, and other inventory items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchItems}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg
              border border-gray-300 bg-white px-4 py-2.5
              text-sm font-medium text-gray-700 hover:bg-gray-50
              disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg
    bg-green-700 px-4 py-2.5 text-sm font-medium
    text-white hover:bg-green-800"
          >
            <Plus size={17} />
            Add Item
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {items.length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Package className="text-blue-700" size={22} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Items</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {activeItems}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <Package className="text-green-700" size={22} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Items</p>
              <p className="mt-2 text-2xl font-bold text-gray-700">
                {inactiveItems}
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <Package className="text-gray-600" size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div
        className="overflow-hidden rounded-xl border
        border-gray-200 bg-white shadow-sm"
      >
        <div
          className="flex flex-col gap-3 border-b
          border-gray-200 p-5 sm:flex-row sm:items-center
          sm:justify-between"
        >
          <div>
            <h2 className="font-semibold text-gray-900">All Inventory Items</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your registered inventory items.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2
                -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search inventory items..."
              className="w-full rounded-lg border
                border-gray-300 py-2.5 pl-9 pr-3 text-sm
                outline-none focus:border-green-600
                focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {error ? (
          <div
            className="flex flex-col items-center
            justify-center px-6 py-12 text-center"
          >
            <AlertCircle size={32} className="text-red-500" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              Unable to load inventory items
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={fetchItems}
              className="mt-4 text-sm font-medium text-green-700
                hover:text-green-800"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw size={22} className="animate-spin text-green-700" />
            <span className="ml-3 text-sm text-gray-500">
              Loading inventory items...
            </span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-medium text-gray-900">
              No inventory items found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search."
                : "Your registered inventory items will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className="bg-gray-50 text-xs
                uppercase text-gray-500"
              >
                <tr>
                  <th className="px-5 py-3 font-semibold">Item</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Unit</th>
                  <th className="px-5 py-3 font-semibold">Minimum Stock</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.item_code}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {item.inventory_categories?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {item.unit_of_measure}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {item.minimum_stock_level ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full
                        px-2.5 py-1 text-xs font-medium ${
                          item.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showCreateModal && (
        <CreateInventoryItemModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
};

export default InventoryItems;
