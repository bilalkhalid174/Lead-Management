import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Symbol and Name */}
        <div className="flex items-center gap-2">
          {/* Symbol (SVG) */}
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          {/* Brand Name */}
          <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-tight">
            Lead Management
          </span>
        </div>

        {/* Right Side (Optional Space for Menu/User) */}
        <div className="hidden sm:block">
          <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
