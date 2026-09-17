import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Check, X, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AdminTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  const fetchTuitions = () => {
    setLoading(true);
    axiosSecure
      .get(`/tuitions/admin/all?status=${statusFilter === 'All' ? '' : statusFilter}`)
      .then((res) => setTuitions(res.data.tuitions || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitions();
  }, [statusFilter, axiosSecure]);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/tuitions/${id}/status`, { status });
      Swal.fire('Updated', `Tuition status set to ${status}.`, 'success');
      fetchTuitions();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update status.', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-base-content">Tuition Moderation</h2>
          <p className="text-xs text-base-content/60">Review, approve, or reject student tuition posts.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-base-content/60 uppercase">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs font-semibold"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="assigned">Assigned</option>
            <option value="rejected">Rejected</option>
            <option value="All">All Statuses</option>
          </select>
        </div>
      </div>

      {tuitions.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Title</th>
                  <th>Student</th>
                  <th>Subject / Class</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-base-200/40">
                    <td className="font-bold">{t.title}</td>
                    <td>{t.studentId?.name || 'Student'}</td>
                    <td>
                      {t.subject} (Class {t.className})
                    </td>
                    <td className="font-bold text-indigo-600">৳{t.salary?.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge badge-sm font-bold uppercase ${
                          t.status === 'approved'
                            ? 'badge-success text-white'
                            : t.status === 'assigned'
                            ? 'badge-info text-white'
                            : t.status === 'rejected'
                            ? 'badge-error text-white'
                            : 'badge-warning text-white'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="text-right space-x-1">
                      <Link to={`/tuitions/${t._id}`} className="btn btn-xs btn-ghost text-indigo-600">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {t.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(t._id, 'approved')}
                          className="btn btn-xs btn-ghost text-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {t.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(t._id, 'rejected')}
                          className="btn btn-xs btn-ghost text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No Tuitions Found" message="No tuition posts match the current status filter." />
      )}
    </div>
  );
};
