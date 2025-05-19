import { useState, useEffect } from 'react';
import { User, Mail, CheckCircle, Camera, Edit2, Save, X, Shield } from 'lucide-react';
import UserModel from '../models/User';
import useAuthStore from '../hooks/useAuthStore';
import UserService from '../services/UserService';
import { API_URL } from '../utils/constants';

const ClientProfile = () => {
  const { user: authUser, login, LogOut } = useAuthStore();
  const [user, setUser] = useState<UserModel>({
    _id: authUser?._id!,
    fullName: authUser?.fullName!,
    email: authUser?.email!,
    isVerified: authUser?.isVerified!,
    role: authUser?.role!,
    avatar: authUser?.avatar,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserModel>(user);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (authUser) {
      setUser({
        _id: authUser._id,
        fullName: authUser.fullName,
        email: authUser.email,
        isVerified: authUser.isVerified,
        role: authUser.role,
        avatar: authUser.avatar,
      });
      setEditedUser({
        _id: authUser._id,
        fullName: authUser.fullName,
        email: authUser.email,
        isVerified: authUser.isVerified,
        role: authUser.role,
        avatar: authUser.avatar,
      });
    }
  }, [authUser]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };
  const handleSaveChanges = async () => {
    try {
      if (!authUser) throw new Error('User not authenticated');
      const updatedUser = await UserService.update(authUser._id, editedUser);
      setUser(updatedUser);
      setIsEditing(false);
      login(updatedUser.email, 'password');
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      if (!authUser) throw new Error('User not authenticated');
      console.log(currentPassword);
      await UserService.update(authUser._id, { password: newPassword });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleLogOut = () => {
    LogOut();
    window.location.href = '/login';
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-[#f8fbff] to-[#f0f7ff]">
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row items-start md:items-end">
              <div className="relative mb-4 md:mb-0">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                  {user.avatar ? (
                    <img
                      src={user.avatar.startsWith("http") || user.avatar.startsWith("https")
                        ? user.avatar
                        : API_URL+user.avatar
                      }
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="text-gray-500" size={48} />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
                      <Camera className="text-white" size={20} />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                    <div className="flex items-center mt-1">
                      <Mail size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-600 text-sm">{user.email}</span>
                      {user.isVerified && (
                        <div className="ml-2 flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-[#1F4B43] text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'security'
                    ? 'border-b-2 border-[#1F4B43] text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center text-sm font-medium text-[#1F4B43] hover:text-[#183832]"
                  >
                    {isEditing ? (
                      <>
                        <X size={16} className="mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 size={16} className="mr-1" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editedUser.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4B43] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{user.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4B43] focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-md capitalize">{user.role}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-md flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          Verified
                        </>
                      ) : (
                        <>
                          <X size={16} className="text-red-500 mr-2" />
                          Not Verified
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center bg-[#1F4B43] text-white py-2 px-4 rounded-md hover:bg-[#183832] transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="text-gray-500 mr-3" size={20} />
                        <div>
                          <h3 className="font-medium">Password</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const currentPassword = prompt('Enter your current password:');
                          const newPassword = prompt('Enter your new password:');
                          if (currentPassword && newPassword) {
                            handlePasswordChange(currentPassword, newPassword);
                          }
                        }}
                        className="text-[#1F4B43] hover:text-[#183832] font-medium text-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="text-gray-500 mr-3" size={20} />
                        <div>
                          <h3 className="font-medium">LogOut</h3>
                          <p className="text-sm text-gray-500">Sign out of your account</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogOut}
                        className="text-[#1F4B43] hover:text-[#183832] font-medium text-sm"
                      >
                        LogOut
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;