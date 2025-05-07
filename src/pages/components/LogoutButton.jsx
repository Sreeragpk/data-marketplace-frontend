import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Optional: icon for logout

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token or any other session data
    localStorage.removeItem('token');

    // Redirect user to the login page after logout
    navigate('/login'); // Or wherever you want to redirect after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-600 hover:text-red-800 font-medium p-2"
    >
      <FaSignOutAlt className="mr-2" /> Log Out
    </button>
  );
};

export default LogoutButton;
