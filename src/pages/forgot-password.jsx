import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    setMessage('');

    try {
      const res = await fetch('https://data-marketplace-backend-production.up.railway.app/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('✅ Reset link sent to your email!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send reset link');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden md:flex md:flex-row md:justify-between">
        {/* Left side - Info Section */}
        <div className="w-full md:w-1/2 px-6 py-10 md:px-12 md:py-16 space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Forgot your password?</h2>
          <p className="text-lg text-gray-600">
            No worries! Enter your email and we'll send you instructions to reset it.
          </p>
          <p className="text-md text-gray-500">
            Facteyes Data Marketplace keeps your data secure and your access easy.
          </p>
        </div>

        {/* Right side - Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 md:p-10 bg-white rounded-lg shadow-lg border border-gray-200 mx-auto md:mx-0 md:w-1/2"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">Forgot Password</h2>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition duration-300 ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-700">
            Remember your password?{' '}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
