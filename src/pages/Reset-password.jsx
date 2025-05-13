import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid reset link.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://data-marketplace-backend-production.up.railway.app/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "❌ Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🔐 Reset Password
        </h1>

        {message && (
          <div className="text-sm text-center text-red-600 bg-red-100 border border-red-300 p-2 rounded-md mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-md transition duration-300"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          If you continue to experience issues, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
