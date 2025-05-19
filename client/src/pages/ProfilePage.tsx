import { useState, useRef, useEffect } from "react"
import { User, Lock, Mail, Building, Save, Camera, Loader2, AlertCircle } from "lucide-react"
import useAuthStore from "../hooks/useAuthStore"
import UserService from "../services/UserService"
import type UserModel from "../models/User"
import { deleteFiles } from "../utils/functions"
import { STORAGE_URL } from "../utils/constants"

const ProfilePage = ({ role }: { role: string }) => {
  const { user, isAuthenticated, refresh } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileData, setProfileData] = useState<Partial<UserModel>>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    role: role,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: role,
      })
    }
  }, [user, role])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!user) throw new Error("User not authenticated")

      const formData = new FormData()
      if (newAvatarFile) {
        formData.append("avatar", newAvatarFile)
      }

      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && key !== "avatar") {
          formData.append(key, value.toString())
        }
      })

      await UserService.updateFormData(user._id, formData)
      
      //Refresh user data to get the updated information
      await refresh();
      
        const updatedUser = await UserService.get(user._id);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setIsEditing(false)
      setNewAvatarFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.")
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!user) throw new Error("User not authenticated")

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match")
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      await UserService.update(user._id, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      })
      
      await refresh()
      
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      setError(error.message || "Failed to change password. Please try again.")
      console.error("Failed to change password:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?._id) {
      try {
        setIsLoading(true)
        setNewAvatarFile(file)
        
        const formData = new FormData()
        formData.append("avatar", file)
        
        await UserService.updateFormData(user._id, formData)
        await refresh()
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error('Error updating avatar:', error)
        setError("Failed to update avatar. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeAvatar = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!user?._id) throw new Error("User not authenticated")

      if (user.avatar && !user.avatar.startsWith("http://") && !user.avatar.startsWith("https://")) {
        await deleteFiles([{ path: user.avatar }])
      }

      await UserService.update(user._id, { avatar: "delete" })
      await refresh()

      setProfileData((prev) => ({ ...prev, avatar: undefined }))
      setNewAvatarFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Failed to remove avatar:", error)
      setError("Failed to remove avatar. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-400">Please log in to view your profile.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/*Profile Picture Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                  {!profileData.avatar ? (
                    <img
                      src="/placeholder.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : profileData.avatar?.startsWith("http") || profileData.avatar?.startsWith("https") ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`${STORAGE_URL}${profileData.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Recommended: Square image, at least 400x400 pixels
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAvatarClick}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
                  >
                    Upload New
                  </button>
                  {profileData.avatar && (
                    <button
                      onClick={removeAvatar}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/*Personal Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      disabled={!isEditing || isLoading}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing || isLoading}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/*Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {isChangingPassword ? "Cancel" : "Change"}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage