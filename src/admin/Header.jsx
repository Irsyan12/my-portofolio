import React from 'react';
import { LogOut, User } from 'lucide-react';
import { logout } from "../firebase/auth"; 
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#1E1E1E] border-b border-gray-800 p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 mr-4">
          <User className="text-gray-400" size={20} />
          <span className="text-gray-300">Admin</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-gray-300 hover:text-color1 transition-colors flex items-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;