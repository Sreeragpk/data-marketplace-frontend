import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaDatabase, FaUpload, FaUser, FaDownload } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import UserMenu from "./components/UserMenu";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="lg:flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg p-5 border-r border-gray-200 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={handleCloseSidebar} className="text-gray-600 text-2xl">
            <IoMdClose />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-indigo-700 mb-8 tracking-tight">
          🧠 DataHub
        </h2>
        <nav className="space-y-3">
          <SidebarLink to="/dashboard/datasets" icon={<FaDatabase />} label="Browse" />
          <SidebarLink to="/dashboard/upload" icon={<FaUpload />} label="Upload" />
          <SidebarLink to="/dashboard/my-datasets" icon={<FaUser />} label="My Datasets" />
          <SidebarLink to="/dashboard/purchased" icon={<FaDownload />} label="Purchased" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Hamburger icon for mobile */}
            <button
              className="text-2xl text-gray-600 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 hidden lg:block">Dashboard</h1>
          </div>

          {/* User Menu */}
          <div>
            <UserMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable NavLink
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
    onClick={() => window.innerWidth < 1024 && document.activeElement?.blur()} // optional auto-close logic
  >
    <span className="text-xl mr-3">{icon}</span>
    {label}
  </NavLink>
);

export default Dashboard;
