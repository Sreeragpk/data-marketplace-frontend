import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

const UserMenu = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);
    }
  }, []);

  if (!userInfo) return null;

  const displayName = userInfo.name || userInfo.email?.split("@")[0];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <FaUserCircle className="text-2xl text-gray-700" />
        <span className="font-medium text-gray-700 hidden sm:inline">
          {displayName}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
          onMouseLeave={closeMenu}
        >
          <div className="px-4 py-3 text-sm text-gray-600">
            Signed in as <br />
            <span className="font-semibold">{displayName}</span>
          </div>
          <div className="border-t border-gray-100"></div>
          <div className="px-4 py-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
