import { useState } from "react";
import {
  PackageCheck,
  RefreshCw,
  Search,
  AlertCircle,
  Receipt,
  Banknote,
} from "lucide-react";
import { useStockReceipts } from "../../hooks/useStockReceipts";
import CreateStockReceiptModal from "./components/CreateStockReceiptModal";

const StockReceiving = () => {
  const { receipts, loading, error, fetchReceipts } = useStockReceipts();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalQuantity = receipts.reduce(
    (total, receipt) =>
      total +
      receipt.stock_receipt_items.reduce(
        (itemTotal, item) => itemTotal + Number(item.quantity || 0),
        0,
      ),
    0,
  );

  const totalValue = receipts.reduce(
    (total, receipt) =>
      total +
      receipt.stock_receipt_items.reduce(
        (itemTotal, item) => itemTotal + Number(item.line_total || 0),
        0,
      ),
    0,
  );

  const filteredReceipts = receipts.filter((receipt) => {
    const search = searchTerm.toLowerCase();

    return (
      receipt.receipt_number.toLowerCase().includes(search) ||
      receipt.farms?.name.toLowerCase().includes(search) ||
      receipt.suppliers?.name.toLowerCase().includes(search) ||
      receipt.supplier_reference?.toLowerCase().includes(search)
    );
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-MW", {
      style: "currency",
      currency: "MWK",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col gap-4 sm:flex-row
        sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Receiving</h1>
          <p className="mt-1 text-sm text-gray-500">
            Record and track inventory received from suppliers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchReceipts}
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
            <PackageCheck size={17} />
            Receive Stock
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
              <p className="text-sm text-gray-500">Total Receipts</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {receipts.length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Receipt size={22} className="text-blue-700" />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quantity Received</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {totalQuantity.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <PackageCheck size={22} className="text-green-700" />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock Value</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <Banknote size={22} className="text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
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
            <h2 className="font-semibold text-gray-900">Stock Receipts</h2>
            <p className="mt-1 text-sm text-gray-500">
              View all recorded stock deliveries.
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
              placeholder="Search receipts..."
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
              Unable to load stock receipts
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={fetchReceipts}
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
              Loading stock receipts...
            </span>
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <PackageCheck size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-medium text-gray-900">
              No stock receipts found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search."
                : "Your received stock records will appear here."}
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
                  <th className="px-5 py-3 font-semibold">Receipt</th>
                  <th className="px-5 py-3 font-semibold">Farm</th>
                  <th className="px-5 py-3 font-semibold">Supplier</th>
                  <th className="px-5 py-3 font-semibold">Received Date</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Quantity</th>
                  <th className="px-5 py-3 font-semibold">Total Value</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredReceipts.map((receipt) => {
                  const quantity = receipt.stock_receipt_items.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0,
                  );

                  const value = receipt.stock_receipt_items.reduce(
                    (total, item) => total + Number(item.line_total || 0),
                    0,
                  );

                  return (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {receipt.receipt_number}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {receipt.supplier_reference || "No reference"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {receipt.farms?.name || "—"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {receipt.suppliers?.name || "—"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {new Date(
                          `${receipt.received_date}T00:00:00`,
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {receipt.stock_receipt_items.length}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {quantity.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {formatCurrency(value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showCreateModal && (
        <CreateStockReceiptModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchReceipts}
        />
      )}
    </div>
  );
};

export default StockReceiving;
