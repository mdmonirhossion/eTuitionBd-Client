import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = () => {
    setLoading(true);
    axiosSecure
      .get(`/users/admin/all?role=${roleFilter}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, axiosSecure]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosSecure.patch(`/users/admin/${userId}/role`, { role: newRole });
      Swal.fire('Role Updated', `User role updated to ${newRole}.`, 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update role.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/users/admin/${userId}`);
        Swal.fire('Deleted', 'User removed successfully.', 'success');
        fetchUsers();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to delete user.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">User Management</h2>
          <p className="text-xs text-base-content/60">Manage accounts and role permissions</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {users.length > 0 ? (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>User</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-base-200/40">
                    {/* User Info: Name + Email একসাথে */}
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-base-300"
                        />
                        <div>
                          <p className="font-semibold text-base-content text-xs">{u.name}</p>
                          <p className="text-[11px] text-base-content/50">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td>
                      <span
                        className={`badge badge-sm font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'badge-error text-white'
                            : u.role === 'tutor'
                            ? 'badge-info text-white'
                            : 'badge-ghost'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Quick Role Change */}
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="select select-bordered select-xs rounded-lg text-xs"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Delete Action */}
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No Users Found" message="No users match the selected role filter." />
      )}
    </div>
  );
};