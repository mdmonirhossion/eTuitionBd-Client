import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Shield, Trash2, UserCheck } from 'lucide-react';
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
      title: 'Delete User Account?',
      text: 'This user account will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/users/admin/${userId}`);
        Swal.fire('Deleted', 'User account deleted.', 'success');
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
          <h2 className="text-2xl font-bold font-heading text-base-content">User Management</h2>
          <p className="text-xs text-base-content/60">View and manage all registered Students, Tutors, and Administrators.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-base-content/60 uppercase">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs font-semibold"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {users.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>User Profile</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-base-200/40">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span className="font-bold text-base-content">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge badge-sm uppercase font-bold ${
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
                    <td className="text-right">
                      <button onClick={() => handleDeleteUser(u._id)} className="btn btn-xs btn-ghost text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
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
