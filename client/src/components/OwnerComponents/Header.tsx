import React, { useState } from 'react';
import { NotificationsMenu } from './NotificationsMenu';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, User, Mail, LogOut, ChevronDown, BellIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useClientMode from '../../hooks/useClientMode';
import { API_URL } from '../../utils/constants';
import useAuthStore from '../../hooks/useAuthStore';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isClientMode, toggleMode } = useClientMode();
  const { user, LogOut : Logout } = useAuthStore(); 
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-4 bg-white dark:bg-gray-800">
        {/*Your PropPilot or brand name can go here */}
      </div>

      <div className="flex items-center justify-center space-x-4 md:space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationsMenu>
          <div className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <BellIcon className='text-xl text-gray-800 dark:text-gray-100'/>
          </div>
        </NotificationsMenu>

        {/*Profile */}
        <div className="relative">
        <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex cursor-pointer items-center gap-3 focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={
                  user.avatar.startsWith('http') || user.avatar.startsWith('https')
                    ? user.avatar
                    : `${API_URL}${user.avatar}`
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-xl ring-2 ring-green-500 transition-all duration-200 hover:ring-4 dark:ring-green-600 dark:hover:ring-green-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl ring-2 ring-green-500 flex items-center justify-center bg-gray-200 dark:bg-gray-700 dark:ring-green-600">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            <div className="hidden sm:block text-left">
              <div className="font-medium text-gray-800 dark:text-gray-100">
                {user?.fullName || 'Guest'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {user?.role || 'User'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-300" />
          </button>

          {isProfileMenuOpen && (
            <div
              className={`
                absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-1 z-50
                transition-all duration-200 transform origin-top-right
                ${isProfileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                bg-white dark:bg-slate-800 dark:shadow-lg dark:border dark:border-gray-700
              `}
            >
              {/*User Info Section */}
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {user?.fullName || 'Guest'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email || 'No email'}
                </div>
              </div>
        {/*Menu Items */}
        {[
          { icon: <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Profile', path: 'profile' },
          { icon: <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />, label: 'Messages', path: 'messages' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`
              flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm transition-all duration-200
              hover:translate-x-1
              text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-700
            `}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/*Client Mode Toggle */}
        <div className="flex items-center justify-between px-6 py-4 rounded-lg bg-white dark:bg-gray-800 transition-shadow duration-300">
          <span className="font-medium text-md text-gray-800 dark:text-gray-200">Client Mode</span>
          <button
            onClick={() => {
              toggleMode();
              if (theme === "dark") toggleTheme();
              navigate("/");
            }}
            className={`
              relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out
              ${isClientMode ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            `}
            aria-pressed={isClientMode}
            aria-label="Toggle client mode"
          >
            <span
              className={`
                absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-sm
                transform transition-transform duration-300 ease-in-out
                ${isClientMode ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
            <span className="sr-only">
              {isClientMode ? 'Disable client mode' : 'Enable client mode'}
            </span>
          </button>
        </div>

        {/*Sign Out Button */}
        <button
          onClick={Logout}
          className={`
            flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm transition-all duration-200
            hover:translate-x-1
            text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
            hover:bg-red-50 dark:hover:bg-red-900/20
          `}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    )}
            </div>
      </div>
    </header>
  );
};

export default Header;