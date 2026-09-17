import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

export const StudentTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTuitions = () => {
    setLoading(true);
    axiosSecure
      .get('/tuitions/my')
      .then((res) => setTuitions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyTuitions();
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Tuition?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tuitions/${id}`);
        Swal.fire('Deleted', 'Tuition deleted.', 'success');
        fetchMyTuitions();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete tuition.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-base-content">My Posted Tuitions</h2>
          <p className="text-xs text-base-content/60">Manage your active and pending tuition requirements.</p>
        </div>
        <Link
          to="/student/tuitions/create"
          className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-xs font-bold gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Tuition
        </Link>
      </div>

      {tuitions.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-base-200/40">
                    <td className="font-bold text-base-content">{t.title}</td>
                    <td>{t.subject}</td>
                    <td>{t.className}</td>
                    <td>{t.location}</td>
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
                      <Link to={`/student/tuitions/${t._id}/edit`} className="btn btn-xs btn-ghost text-cyan-600">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(t._id)} className="btn btn-xs btn-ghost text-rose-600">
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
        <EmptyState
          title="No Tuitions Posted Yet"
          message="Post your first tuition request to get connected with verified tutors."
          actionText="Post a Tuition"
          actionPath="/student/tuitions/create"
        />
      )}
    </div>
  );
};
