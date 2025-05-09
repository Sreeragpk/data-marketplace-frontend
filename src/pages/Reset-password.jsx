import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search); // Extract query params
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid reset link.");
    }
  }, [token, email]);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://data-marketplace-backend-production.up.railway.app/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }), // Make sure the body contains the correct parameters
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful reset
        }, 2000);
      } else {
        setMessage(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full sm:w-96 p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Reset Your Password
        </h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="New Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
