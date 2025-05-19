import type React from "react";
import { useState, useEffect } from "react";
import { Edit2, Trash2, CheckCircle, XCircle, UserIcon} from "lucide-react";
import UserService from "../services/UserService";
import User from "../models/User";
import DashboardSearchbar from "../components/dashboard searchbar/DashboardSearchbar";
import { STORAGE_URL } from "../utils/constants";
import EditUserDialog from "../components/EditUserDialog";


const AdminUsersManagment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const [isDeleteDiaPropPilotpen, setIsDeleteDiaPropPilotpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await UserService.getAll();
        console.log(fetchUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openEditDialog = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialog(true);
  };

  const closeEditDialog = () => {
    setIsEditDialog(false);
    setEditingUser(null);
  };


  const saveUser = async (user:User) => {
    if (user) {
      try {
        console.log(user._id);
        const updatedUser = await UserService.update(user._id, user);
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
      } catch (err) {
        setError("Failed to update user");
        console.error(err);
      } finally {
        closeEditDialog();
      }
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDiaPropPilotpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDiaPropPilotpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await UserService.delete(userToDelete._id);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const isAdmin = (user: User) => user.role === "admin";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users Management</h1>
          </div>

         <DashboardSearchbar value={searchQuery} onChange={setSearchQuery} placeholder="Search Users" />
        </div>

        <div className="overflow-x-auto min-h-[70vh]">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar?.startsWith("http")
                            ? user.avatar
                            : `${STORAGE_URL}${user.avatar}`}
                          alt={user.fullName}
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                          <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                        </div>
                      )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-blue-800 dark:bg-purple-700 dark:text-purple-100"
                          : user.role === "owner"
                            ? "bg-blue-100 text-green-800 dark:bg-blue-700 dark:text-blue-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle size={16} />
                        <span className="text-sm">Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                        <XCircle size={16} />
                        <span className="text-sm">Unverified</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {!isAdmin(user) && (
                        <>
                          <button
                            onClick={() => openEditDialog(user)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-gray-600 dark:text-gray-300" />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(user)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </>
                      )}
                      {isAdmin(user) && <span className="text-gray-500 dark:text-gray-300 text-xs italic">Admin user</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search terms or add a new user.</p>
          </div>
        )}
      </div>

      {/*Edit User Dialog */}
      {isEditDialog && editingUser && (
        <EditUserDialog user={editingUser} onClose={closeEditDialog} onSave={saveUser}/>
      )}

      {/*Delete Confirmation Dialog */}
      {isDeleteDiaPropPilotpen && userToDelete && (
        <dialog className="w-auto md:w-[40vw] inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Confirm Deletion</h2>
              <p className="mb-6 dark:text-gray-300">Are you sure you want to delete the user "{userToDelete.fullName}"?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeDeleteDialog}
                  className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default AdminUsersManagment