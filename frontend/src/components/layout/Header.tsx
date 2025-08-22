import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-md">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AdShield AI</span>
          </Link>
          
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link 
              to="/learn" 
              className={`text-sm sm:text-base transition-colors ${
                location.pathname === '/learn'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Learn
            </Link>
            <Link 
              to="/settings" 
              className={`text-sm sm:text-base transition-colors ${
                location.pathname === '/settings'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
