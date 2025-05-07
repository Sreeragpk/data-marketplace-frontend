import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FiSearch,
  FiLogOut,
  FiDatabase,
  FiUsers,
  FiShoppingCart,
  FiHome,
} from "react-icons/fi";
import { MdArrowDownward, MdArrowUpward, MdDelete } from "react-icons/md";
import UserMenu from "./components/UserMenu";

const AdminDashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("dashboard"); // default tab
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [recentPurchases, setRecentPurchases] = useState([]);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await fetch("data-marketplace-backend-production.up.railway.app/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load stats");
    }
  };
  const fetchRecentPurchases = async () => {
    try {
      const res = await fetch(
        "data-marketplace-backend-production.up.railway.app/api/admin/recent-purchases",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setRecentPurchases(data);
    } catch (err) {
      console.error("Failed to fetch recent purchases", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentPurchases();
    if (tab === "datasets") fetchDatasets();
    else if (tab === "users") fetchUsers();
  }, [tab]);

  const fetchDatasets = async () => {
    try {
      const res = await fetch("data-marketplace-backend-production.up.railway.app/api/admin/datasets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDatasets(data);
    } catch (err) {
      setError("Failed to fetch datasets");
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("data-marketplace-backend-production.up.railway.app/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
      console.log(err);
    }
  };

  const deleteDataset = async (id) => {
    if (!window.confirm("Delete this dataset?")) return;
    await fetch(`data-marketplace-backend-production.up.railway.app/api/admin/datasets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDatasets();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`data-marketplace-backend-production.up.railway.app/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    await fetch(`data-marketplace-backend-production.up.railway.app/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    fetchUsers();
    fetchStats();
  };

  const filteredDatasets = datasets.filter((dataset) =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;

    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    if (tab === "datasets") fetchDatasets();
    else if (tab === "users") fetchUsers();
    fetchStats();
  }, [tab]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex space-x-6 items-center">
          <button
            onClick={() => setTab("dashboard")}
            className="hover:text-gray-200 flex items-center space-x-1"
          >
            <FiHome /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setTab("datasets")}
            className="hover:text-gray-200 flex items-center space-x-1"
          >
            <FiDatabase /> <span>Datasets</span>
          </button>
          <button
            onClick={() => setTab("users")}
            className="hover:text-gray-200 flex items-center space-x-1"
          >
            <FiUsers /> <span>Users</span>
          </button>
          <button
            onClick={() => setTab("purchases")}
            className="hover:text-gray-200 flex items-center space-x-1"
          >
            <FiShoppingCart /> <span>Purchase List</span>
          </button>
        </div>
        <UserMenu />
      </nav>

      {/* Page Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 capitalize">{tab}</h1>

        {/* Dashboard */}
        {tab === "dashboard" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-4 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold">📁 Total Datasets</h3>
              <p className="text-3xl">{stats.totalDatasets}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <h3 className="text-lg font-semibold">👥 Total Users</h3>
              <p className="text-3xl">{stats.totalUsers}</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg col-span-full">
              <h3 className="text-lg font-semibold mb-2">
                📈 Uploads Over Time
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.uploadsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4C6EB1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                🛒 Recent Purchases
              </h2>

              {recentPurchases.length === 0 ? (
                <p className="text-gray-500 italic">No recent purchases yet.</p>
              ) : (
                <ul className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <li
                      key={purchase.id}
                      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800">
                            <span className="font-medium text-blue-700">
                              {purchase.buyer_name}
                            </span>{" "}
                            purchased{" "}
                            <span className="font-semibold">
                              {purchase.dataset_title}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(purchase.purchased_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                          New
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        {(tab === "datasets" || tab === "users") && (
          <div className="flex mb-6">
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-3 bg-blue-600 text-white rounded-r-lg">
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dataset Table */}
        {tab === "datasets" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Datasets</h2>
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Uploaded By</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.map((ds) => (
                  <tr key={ds.id} className="border-t">
                    <td className="p-2">{ds.id}</td>
                    <td className="p-2">{ds.title}</td>
                    <td className="p-2">{ds.uploaded_by}</td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteDataset(ds.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div>
            {/* Search and Role Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Users Table */}
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2 space-x-3 flex items-center">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="text-blue-600 hover:text-blue-800"
                        title={
                          user.role === "admin"
                            ? "Demote to User"
                            : "Promote to Admin"
                        }
                      >
                        {user.role === "admin" ? (
                          <MdArrowDownward className="w-5 h-5" />
                        ) : (
                          <MdArrowUpward className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Purchases (Placeholder) */}
        {tab === "purchases" && (
          <div className="text-center p-10 text-gray-600">
            <p>🛒 Purchase list will be displayed here!</p>
            <p className="mt-2 text-sm">
              [Coming soon - needs API integration]
            </p>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 mt-6">{error}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
