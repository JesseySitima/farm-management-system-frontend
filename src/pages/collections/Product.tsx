import { useMemo, useState } from "react";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import CreateProductModal from "./components/CreateProductModal";

const Products = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_active) ||
        (statusFilter === "inactive" && !product.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const activeProducts = products.filter((product) => product.is_active).length;

  const inactiveProducts = products.filter(
    (product) => !product.is_active,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the shared catalogue of farm products.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Products"
          value={products.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Active Products"
          value={activeProducts}
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="Inactive Products"
          value={inactiveProducts}
          icon={<XCircle size={20} />}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Catalogue
            </h2>
            <p className="text-sm text-gray-500">All registered products.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-green-600 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <Package size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="font-medium text-gray-700">No products found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="px-5 py-3 font-medium">Product Code</th>
                  <th className="px-5 py-3 font-medium">Product Name</th>
                  <th className="px-5 py-3 font-medium">Unit of Measure</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {product.product_code}
                    </td>

                    <td className="px-5 py-4 text-gray-900">{product.name}</td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.unit_of_measure}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showCreateModal && (
              <CreateProductModal
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchProducts}
              />
            )}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-3 text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="rounded-lg bg-green-50 p-2 text-green-700">{icon}</div>
    </div>

    <p className="mt-3 text-2xl font-bold text-gray-900">
      {value.toLocaleString("en-MW")}
    </p>
  </div>
);

export default Products;
