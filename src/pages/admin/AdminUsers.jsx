import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Trash2, Eye, X, Phone, Mail, Award, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null); // State for View Profile Modal

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
      Swal.fire({
        icon: 'success',
        title: 'Role Updated!',
        text: `User role has been updated to ${newRole}.`,
        timer: 1500,
        showConfirmButton: false,
      });
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
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">User Management</h2>
          <p className="text-xs text-base-content/60">Manage registered accounts and role permissions</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs font-medium"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Streamlined Clean Users Table */}
      {users.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-2xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>User Info</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-base-200/40">
                    
                    {/* User Info Column (Name + Email together under photo) */}
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-base-300 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-base-content text-xs">{u.name || 'User'}</p>
                          <p className="text-[11px] text-base-content/50 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td>
                      <span
                        className={`badge badge-sm font-bold uppercase ${
                          u.role === 'admin'
                            ? 'badge-error text-white'
                            : u.role === 'tutor'
                            ? 'badge-info text-white'
                            : 'badge-ghost text-base-content/80'
                        }`}
                      >
                        {u.role || 'student'}
                      </span>
                    </td>

                    {/* Quick Role Change Dropdown */}
                    <td>
                      <select
                        value={u.role || 'student'}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="select select-bordered select-xs rounded-lg text-xs font-medium"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Action Buttons: View Profile Modal & Delete */}
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="btn btn-xs btn-ghost text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                          title="View Full Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Detailed User Profile View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-base-100 dark:bg-base-200 rounded-3xl max-w-lg w-full overflow-hidden border border-base-300 shadow-2xl space-y-0 relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-cyan-900 p-6 text-white relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={selectedUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold font-heading">{selectedUser.name || 'User Profile'}</h3>
                  <p className="text-xs text-indigo-200 font-mono flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {selectedUser.email}
                  </p>
                  <span className="badge badge-sm badge-info font-bold uppercase mt-1">
                    {selectedUser.role || 'student'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Details Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              
              {/* Contact & Phone */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300">
                <div>
                  <span className="text-base-content/60 block font-medium">Phone Number</span>
                  <span className="font-bold text-base-content flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" /> {selectedUser.phone || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/60 block font-medium">Teaching Mode</span>
                  <span className="font-bold text-base-content flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" /> {selectedUser.teachingMode || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Preferences & Bio */}
              <div className="space-y-3">
                <div>
                  <span className="text-base-content/60 block font-bold uppercase mb-1">Medium & Class</span>
                  <div className="flex gap-2">
                    <span className="badge badge-ghost font-semibold">{selectedUser.medium || 'English Medium'}</span>
                    <span className="badge badge-ghost font-semibold">{selectedUser.className || 'Class N/A'}</span>
                  </div>
                </div>

                {selectedUser.subjects && selectedUser.subjects.length > 0 && (
                  <div>
                    <span className="text-base-content/60 block font-bold uppercase mb-1">Preferred Subjects</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.subjects.map((subj, idx) => (
                        <span key={idx} className="badge badge-sm badge-outline badge-primary">
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.bio && (
                  <div>
                    <span className="text-base-content/60 block font-bold uppercase mb-1">About / Bio</span>
                    <p className="bg-base-200/40 p-3 rounded-xl text-base-content/80 leading-relaxed italic">
                      "{selectedUser.bio}"
                    </p>
                  </div>
                )}
              </div>

              {/* Academic Qualifications if present */}
              {selectedUser.academics && selectedUser.academics.length > 0 && (
                <div>
                  <span className="text-base-content/60 block font-bold uppercase mb-2 flex items-center gap-1">
                    <Award className="w-4 h-4 text-indigo-600" /> Academic Qualifications
                  </span>
                  <div className="space-y-2">
                    {selectedUser.academics.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">{item.degree}</div>
                        <div className="text-base-content/70">{item.institution} ({item.passingYear})</div>
                        <div className="text-[11px] font-semibold text-emerald-600">Result: {item.result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Action */}
              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  Close Profile
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};