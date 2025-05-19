import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, LogIn, ChevronRight,LogOut,  LayoutDashboard } from "lucide-react";
import useClientMode from "../../hooks/useClientMode";
import useAuthStore from "../../hooks/useAuthStore";
import {STORAGE_URL } from "../../utils/constants";
const Navbar = ({ home,isTransparent }: { home: boolean; isTransparent: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const {isClientMode,toggleMode} = useClientMode();
  const {isAuthenticated ,LogOut:logout, user} = useAuthStore();
  const navigate = useNavigate()
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        (isTransparent || !home) ? "bg-transparent" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider"><img className="h-14 w-14" src="/light_logo.png" alt="Logo" /></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/*Wishlist Button */}
           {!isAuthenticated && <Link to="/wishlist" className="hidden md:flex items-center gap-1 text-gray-700 hover:text-[#1F4B43] transition-colors">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Wishlist</span>
            </Link>}
            {/*User Menu */}
           {isAuthenticated && <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="User menu"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('http') || user.avatar.startsWith('https')
                    ? user.avatar
                    : `${STORAGE_URL}${user.avatar}`}
                  alt="User Avatar"
                  className="w-full h-full p-[0.15rem] rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-700" />
              )}
                      </button>
                        {isUserMenuOpen && (
                          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden transform transition-all duration-300 ease-in-out">
                          {/*Header with user info */}

                          <div className={`p-2 border-b border-gray-100 flex items-start space-x-3`}>
                          <div className={`bg-indigo-100 w-10 h-10  rounded-full ${user?.avatar? "":"p-2"}`}>
                          {user?.avatar ? (
                          <img
                            src={
                              user.avatar.startsWith('http') || user.avatar.startsWith('https')
                                ? user.avatar
                                : `${STORAGE_URL}${user.avatar}`
                            }
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-700" />
                        )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.fullName || "Houssem Elimam"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "houssem@gmail.com"}
                  </p>
                </div>
                </div>
                {/*Menu items */}
                <div className="py-2">
                  <Link to="/profile" className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 group transition-all duration-200">
                    <User className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                    <span className="group-hover:text-blue-600 transition-colors duration-200">Profile</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                  <Link to="/wishlist" className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 group transition-all duration-200">
                    <Heart className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                    <span className="group-hover:text-blue-600 transition-colors duration-200">Wishlist</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                  <Link to="/dashboard" className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 group transition-all duration-200">
                    <LayoutDashboard className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                    <span className="group-hover:text-blue-600 transition-colors duration-200">Dashboard</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                  {/*User Mode Toggle */}
                  { user?.role !== "client" && <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100 mt-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="text-gray-700">Client Mode</span>
                    </div>
                    {/*Toggle Switch */}
                    <button 
                        onClick={() => {
                          toggleMode();
                  
                          navigate("/");
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isClientMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                      >
                      <span className="sr-only">Toggle Client Mode</span>
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isClientMode ? 'translate-x-6' : 'translate-x-1'}`} 
                      />
                    </button>
                  </div>}
                </div>
                
                <div className="border-t border-gray-100 mt-1">
                  <button onClick={()=>{logout();navigate("/auth")}} className="flex w-full items-center px-5 py-3 text-gray-700 hover:bg-gray-50 group transition-all duration-200">
                    <LogOut className="h-4 w-4 mr-3 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                    <span className="group-hover:text-red-500 transition-colors duration-200">Sign out</span>
                  </button>
                </div>
              </div>
              )}
            </div>}
            {/*Login Button */}
           {!isAuthenticated && <Link to="/auth?login=true" className="hidden md:flex items-center gap-2 bg-[#1F4B43] hover:bg-[#183832] text-white px-4 py-2 rounded-md transition-colors">
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Login</span>
            </Link>}

         
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;