import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('data-marketplace-backend-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        const role = decoded.role;

        setMessage('Login successful. Redirecting...');

        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin/');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed due to a network error');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Left Side */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-700 animate__animated animate__fadeIn animate__delay-1s">
            Welcome to Facteyes Data Marketplace
          </h2>
          <p className="text-lg text-gray-500 animate__animated animate__fadeIn animate__delay-2s">
            Discover powerful data solutions to elevate your business.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="z-10 w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-gray-200"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
            Welcome Back 👋
          </h2>

          {message && (
            <div className="mb-4 text-center text-sm text-red-600">{message}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          {/* Password with toggle */}
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition duration-300"
          >
            Log In
          </button>

          <p className="mt-4 text-center text-sm text-gray-700">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-indigo-600 hover:underline"
            >
              Forgot Password?
            </button>
          </p>

          <p className="mt-4 text-center text-sm text-gray-700">
            Don’t have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
