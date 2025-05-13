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
  const [tab, setTab] = useState("dashboard");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchPurchases = async () => {
    if (tab !== "purchases") return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://data-marketplace-backend-production.up.railway.app/api/admin/purchases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch purchases");
      }

      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      setError(err.message || "Error fetching purchase data.");
    } finally {
      setLoading(false);
    }
  };

  fetchPurchases();
}, [tab]);



  const fetchStats = async () => {
    try {
      const res = await fetch(
        "https://data-marketplace-backend-production.up.railway.app/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load stats");
    }
  };

  const fetchRecentPurchases = async () => {
    try {
      const res = await fetch(
        "https://data-marketplace-backend-production.up.railway.app/api/admin/recent-purchases",
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

  const fetchDatasets = async () => {
    try {
      const res = await fetch(
        "https://data-marketplace-backend-production.up.railway.app/api/admin/datasets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setDatasets(data);
    } catch {
      setError("Failed to fetch datasets");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://data-marketplace-backend-production.up.railway.app/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentPurchases();
    if (tab === "datasets") fetchDatasets();
    else if (tab === "users") fetchUsers();
  }, [tab]);

  const deleteDataset = async (id) => {
    if (!window.confirm("Delete this dataset?")) return;
    await fetch(
      `https://data-marketplace-backend-production.up.railway.app/api/admin/datasets/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchDatasets();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(
      `https://data-marketplace-backend-production.up.railway.app/api/admin/users/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUsers();
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    await fetch(
      `https://data-marketplace-backend-production.up.railway.app/api/admin/users/${id}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    fetchUsers();
    fetchStats();
  };

  const filteredDatasets = datasets.filter((ds) =>
    ds.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex flex-wrap justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-wide">
            📊 Admin Panel
          </span>
          <div className="flex gap-3 ml-4">
            {[
              ["dashboard", <FiHome />, "Dashboard"],
              ["datasets", <FiDatabase />, "Datasets"],
              ["users", <FiUsers />, "Users"],
              ["purchases", <FiShoppingCart />, "Purchases"],
            ].map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 ${
                  tab === key
                    ? "bg-white text-blue-700 font-semibold shadow"
                    : "hover:bg-white hover:text-blue-700"
                }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <UserMenu />
      </nav>

      {/* Page Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 capitalize">
          {tab}
        </h1>

        {tab === "dashboard" && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
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
            </div>

            <div className="mt-8 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow p-6 border border-blue-100">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">
                🛒 Recent Purchases
              </h2>
              {recentPurchases.length === 0 ? (
                <p className="text-gray-500 italic">No recent purchases yet.</p>
              ) : (
                <ul className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <li
                      key={purchase.id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-start flex-col sm:flex-row">
                        <div>
                          <p>
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
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 mt-2 sm:mt-0 rounded-full text-sm font-medium">
                          New
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Search and Filter */}
     {(tab === "datasets" || tab === "users") && (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-10">
    <input
      type="text"
      placeholder={`Search ${tab}...`}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="p-3 border border-gray-300 rounded-xl w-full sm:w-auto flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
   {tab === "users" && (
  <div className="relative">
    <select
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 border border-gray-300 text-gray-700 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    >
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
    {/* Chevron Icon */}
    <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)}

  </div>
)}

      {/* Dataset Table */}
      {tab === "datasets" && (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-50 border-b border-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Uploaded By</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map((ds, index) => (
                <tr
                  key={ds.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors border-t border-gray-100`}
                >
                  <td className="px-4 py-2">{ds.id}</td>
                  <td className="px-4 py-2">{ds.title}</td>
                  <td className="px-4 py-2">{ds.uploaded_by}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteDataset(ds.id)}
                      className="text-red-600 hover:text-red-800 hover:underline transition font-medium"
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

      {/* Users Table */}
      {tab === "users" && (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white mt-6">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-green-50 border-b border-green-100 text-green-900">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors border-t border-gray-100`}
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete User"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      className="text-blue-500 hover:text-blue-700 transition"
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

       {tab === "purchases" && (
  <div className="p-4">
    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
      🛒 All Purchases
    </h2>

    {loading ? (
      <div className="text-center text-gray-500">Loading...</div>
    ) : error ? (
      <div className="text-center text-red-500">{error}</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">User Email</th>
              <th className="py-2 px-4 border">Dataset</th>
              <th className="py-2 px-4 border">Dataset ID</th>
              <th className="py-2 px-4 border">Purchased At</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.id} className="text-center">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{purchase.email}</td>
                <td className="py-2 px-4 border">{purchase.dataset_title}</td>
                <td className="py-2 px-4 border">{purchase.dataset_id}</td>
                <td className="py-2 px-4 border">
                  {new Date(purchase.purchased_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No purchases found.</p>
        )}
      </div>
    )}
  </div>
)}

        {error && <p className="text-red-500 mt-6">{error}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
