import React, { useEffect, useState } from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { FiTrash2, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchKeyword, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement admin API endpoint to fetch users
      // const result = await ApiController.getUsers();
      // if (result.success) {
      //   setUsers(result.data);
      //   setFilteredUsers(result.data);
      // }
      
      // Placeholder data
      setUsers([]);
      setFilteredUsers([]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // TODO: Implement delete API call
        console.log('Delete user:', userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // TODO: Implement toggle status API call
      console.log('Toggle user status:', userId, currentStatus);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Users Management
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Manage all registered users
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full py-3 px-4 pl-12 border border-border-color rounded-lg bg-bg-secondary text-text-primary text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-border-color"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-color">
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    User
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Email
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Role
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Status
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Joined
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border-color transition-colors duration-200 hover:bg-bg-tertiary"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-primary font-semibold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-[0.9375rem] text-text-primary font-medium">
                            {user.username || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[0.9375rem] text-text-primary">
                          {user.email || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[0.8125rem] px-3 py-1 rounded-full font-medium ${
                            user.role === 'admin'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-white border border-black text-black'
                          }`}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[0.8125rem] px-3 py-1 rounded-full font-medium ${
                            user.is_active
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[0.8125rem] text-text-muted">
                          {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? (
                              <FiUserX className="text-lg" />
                            ) : (
                              <FiUserCheck className="text-lg" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-red-100 hover:text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-12 text-center text-text-muted"
                    >
                      No users found. API endpoint needs to be implemented.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
