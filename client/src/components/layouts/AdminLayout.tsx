import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Wallet2,
  Shield,
  BarChart3,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Mail,
  LayoutDashboard,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import useClientMode from "../../hooks/useClientMode";
import useAuthStore from "../../hooks/useAuthStore";
import { STORAGE_URL } from "../../utils/constants";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showScrollShadow, setShowScrollShadow] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === "dark";
  const { isClientMode, toggleMode } = useClientMode();
  const navigate = useNavigate();
  const {user , LogOut:logout} = useAuthStore()
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollShadow(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      id: "overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      tooltip: "Platform overview",
      path: "",
    },
    {
      id: "user-management",
      icon: <Users className="w-5 h-5" />,
      label: "User Management",
      tooltip: "Manage Users",
      path: "users",
    },
    {
      id: "property-management",
      icon: <Building2 className="w-5 h-5" />,
      label: "Property Management",
      tooltip: "Manage Properties",
      path: "properties",
    },
    {
      id: "payment-management",
      icon: <Wallet2 className="w-5 h-5" />,
      label: "Payment Management",
      tooltip: "Manage Payments",
      path: "payment",
    },
    {
      id: "security-management",
      icon: <Shield className="w-5 h-5" />,
      label: "Fraud & Security",
      tooltip: "Security Management",
      path: "security",
    },
    // {
    //   id: "reports-analytics",
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   label: "Reports & Analytics",
    //   tooltip: "View Reports",
    //   path: "reports",
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      {/*Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${isSidebarOpen ? "opacity-100 z-40" : "opacity-0 -z-10"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`
        fixed z-50 flex flex-col h-[92vh] transition-all duration-300 ease-in-out
        bg-white/95 backdrop-blur dark:bg-slate-800/95
        ${showScrollShadow ? "shadow-2xl" : "shadow-lg"}
        lg:left-6 lg:top-6 lg:bottom-6 lg:rounded-2xl
        ${isSidebarOpen ? "left-0 top-0 bottom-0 w-72" : "-left-72"}
        lg:w-20 lg:translate-x-0
      `}
      >
        <div className="p-6 lg:p-4">
          <div className="flex items-center justify-between">
            <Link
              to={""}
              className="text-blue-600 font-bold text-2xl hover:scale-105 transition-transform duration-200 lg:text-xl"
            >
              <img className="h-12 w-12" src="/light_logo.png" alt="logo" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              to={`/dashboard/${item.path}`}
              key={item.id}
              className={`
                w-full flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group relative
                text-gray-700 hover:bg-gray-100
                dark:text-gray-300 dark:hover:bg-slate-700/50
                lg:justify-center lg:px-2
              `}
              title={item.tooltip}
            >
              <div className="transition-transform cursor-pointer duration-200 group-hover:scale-105">
                {item.icon}
              </div>
              <span className="lg:hidden font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={toggleTheme}
            className={`
              w-full flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 group
              text-gray-600 hover:text-gray-900 hover:bg-gray-100
              dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-700/50
              lg:justify-center lg:px-2
            `}
            title="Toggle theme"
          >
            <div className="transition-transform duration-200 group-hover:scale-105">
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <span className="lg:hidden">{isDarkTheme ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>

      {/*Main Content */}
      <div className="lg:ml-28 p-6">

    <div
      className={`
        sticky top-0 z-40 -mx-6 px-6 py-4 mb-6
        transition-all duration-200
        bg-gray-50/95 backdrop-blur dark:bg-slate-900/95
        ${showScrollShadow ? 'shadow-md' : ''}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/*Notifications */}
          <Link
            to={'notifications'}
            className="p-2 rounded-xl cursor-pointer transition-all duration-200 relative text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          {/*Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex cursor-pointer items-center gap-3 focus:outline-none"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('http') || user.avatar.startsWith('https') ? user.avatar : `${STORAGE_URL}${user.avatar}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl ring-2 ring-blue-500 transition-all duration-200 hover:ring-4"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl ring-2 ring-blue-500 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="font-medium">{user?.fullName || 'Guest'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.role || 'User'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isProfileMenuOpen && (
              <div
                className={`
                  absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-1 z-50
                  transition-all duration-200 transform origin-top-right
                  ${isProfileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                  bg-white dark:bg-slate-800
                `}
              >
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <div className="font-medium">{user?.fullName || 'Guest'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email || 'No email'}
                  </div>
                </div>

                {[
                  { icon: <User className="w-4 h-4" />, label: 'Profile', path: 'profile' },
                  { icon: <Mail className="w-4 h-4" />, label: 'Messages', path: 'messages' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`
                      flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm transition-all duration-200
                      hover:translate-x-1
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                {/*Client mode toggler */}
                <div className="flex items-center justify-between px-6 py-4 rounded-lg bg-white dark:bg-gray-800 transition-shadow duration-300">
                  <span className="font-medium text-md dark:text-gray-200">Client Mode</span>
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

                {/*Sign Out */}
                <button
                  onClick={logout}
                  className={`
                    flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm transition-all duration-200
                    hover:translate-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>


        {/*Main Content Area */}
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;