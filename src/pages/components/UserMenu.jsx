import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

const UserMenu = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);
    }
  }, []);

  if (!userInfo) return null;

  const displayName = userInfo.name || userInfo.email?.split("@")[0];

  return (
    <div className="relative inline-block text-left group">
      {/* Trigger + Dropdown wrapper is now the hover group */}
      <div className="flex items-center space-x-2 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200">
        <FaUserCircle className="text-2xl text-gray-600 group-hover:text-indigo-700" />
        <span className="font-medium text-gray-700">{displayName}</span>
      </div>

      {/* Dropdown - stays visible when hovering over it */}
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 z-50">
        <div className="px-4 py-2 text-sm text-gray-600">
          Signed in as <br />
          <span className="font-semibold">{displayName}</span>
        </div>
        <div className="border-t border-gray-100"></div>
        <div className="px-4 py-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
