import { NavLink, Outlet } from "react-router-dom";
import { FaDatabase, FaUpload, FaUser, FaDownload } from "react-icons/fa";
import UserMenu from "./components/UserMenu";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col border-r border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-8 tracking-tight">
            🧠 DataHub
          </h2>
          <nav className="space-y-3">
            <SidebarLink to="/dashboard/datasets" icon={<FaDatabase />} label="Browse" />
            <SidebarLink to="/dashboard/upload" icon={<FaUpload />} label="Upload" />
            <SidebarLink to="/dashboard/my-datasets" icon={<FaUser />} label="My Datasets" />
            <SidebarLink to="/dashboard/purchased" icon={<FaDownload />} label="Purchased" />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 shadow-sm flex justify-end items-center sticky top-0 z-10">
          <UserMenu />
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable NavLink component
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        isActive
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
      }`
    }
  >
    <span className="text-xl mr-3">{icon}</span>
    {label}
  </NavLink>
);

export default Dashboard;
