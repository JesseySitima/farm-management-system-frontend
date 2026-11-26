import SystemAdminDashboard from "./SystemAdminDashboard";
import FarmOwnerDashboard from "./FarmOwnerDashboard";
import FarmManagerDashboard from "./FarmManagerDashboard";
import FarmSupervisorDashboard from "./FarmSupervisorDashboard";
import FarmWorkerDashboard from "./FarmWorkerDashboard";
import AccountantDashboard from "./AccountantDashboard";
import StorekeeperDashboard from "./StoreKeeperDashboard";

function Dashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  switch (user.role_name) {
    case "System Administrator":
      return <SystemAdminDashboard />;

    case "Farm Owner":
      return <FarmOwnerDashboard />;

    case "Farm Manager":
      return <FarmManagerDashboard />;

    case "Farm Supervisor":
      return <FarmSupervisorDashboard />;

    case "Farm Worker":
      return <FarmWorkerDashboard />;

    case "Accountant":
      return <AccountantDashboard />;

    case "Storekeeper":
      return <StorekeeperDashboard />;

    default:
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard unavailable
          </h1>
          <p className="mt-2 text-gray-500">
            Your account does not have a recognised role.
          </p>
        </div>
      );
  }
}

export default Dashboard;