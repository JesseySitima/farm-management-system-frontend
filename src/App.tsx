
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboards/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";

import UsersPage from "./pages/users/Users";
import FarmsPage from "./pages/farms/Farms";
import SpeciesPage from "./pages/farms/species/Species";
import LivestockPage from "./pages/livestock/Livestock";
import FlocksPage from "./pages/farms/flocks/Flocks";

import InventoryCategoriesPage from "./pages/inventory/InventoryCategories";
import Suppliers from "./pages/inventory/Suppliers";
import InventoryItems from "./pages/inventory/InventoryItems";
import StockReceiving from "./pages/inventory/StockReceiving";
import StockMovements from "./pages/inventory/StockMovements";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/species" element={<SpeciesPage />} />
            <Route path="/livestock" element={<LivestockPage />} />
            <Route path="/flocks" element={<FlocksPage />} />

            <Route
              path="/inventory/categories"
              element={<InventoryCategoriesPage />}
            />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/inventory/items" element={<InventoryItems />} />
            <Route
              path="/inventory/stock-receiving"
              element={<StockReceiving />}
            />
            <Route
              path="/inventory/stock-movements"
              element={<StockMovements />}
            />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
