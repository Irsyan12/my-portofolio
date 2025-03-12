import React from 'react';
import { Home, Briefcase, File, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Briefcase, label: 'Experiences', href: '/admin/experiences' },
    { icon: File, label: 'Projects', href: '/admin/projects' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' }
  ];

  return (
    <div className="w-64 bg-[#1E1E1E] border-r border-gray-800 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-color1 text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className="flex items-center p-3 mb-2 hover:bg-gray-800 rounded-md transition-colors group"
          >
            <item.icon 
              className="mr-3 text-gray-400 group-hover:text-color1 transition-colors" 
              size={20} 
            />
            <span className="text-gray-300 group-hover:text-color1 transition-colors">
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;