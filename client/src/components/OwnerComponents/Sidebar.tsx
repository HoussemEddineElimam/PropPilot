import { BarChart2, Building, DollarSignIcon, Home, PiIcon, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }:{isOpen:boolean,onClose:()=>void}) => {
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: "/dashboard" },
    { icon: <Building size={20} />, label: 'Properties', path: "/dashboard/properties" },
    { icon: <Users size={20} />, label: 'Clients', path: "/dashboard/clients" },
    { icon: <DollarSignIcon size={20} />, label: 'Financials', path: "/dashboard/financials" },
  ];
  const reportItems = [
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: "/dashboard/analytics" },
  ];

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-all duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b w-full border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2">
              <img className="h-22 w-22 mx-auto" src="/light_logo.png" alt="logo" />
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${location.pathname === item.path 
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Reports</p>
            <div className="mt-2 space-y-1">
              {reportItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${location.pathname === item.path 
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                  `}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};


export default Sidebar;