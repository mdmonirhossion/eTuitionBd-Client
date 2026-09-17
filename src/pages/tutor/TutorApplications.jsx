import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const TutorApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = () => {
    setLoading(true);
    axiosSecure
      .get('/applications/my')
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyApplications();
  }, [axiosSecure]);

  const handleWithdraw = async (id) => {
    const result = await Swal.fire({
      title: 'Withdraw Application?',
      text: 'Are you sure you want to cancel this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, withdraw',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/applications/${id}`);
        Swal.fire('Withdrawn', 'Application withdrawn.', 'success');
        fetchMyApplications();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to withdraw application.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">My Applications</h2>
        <p className="text-xs text-base-content/60">Track status of all your submitted tuition applications.</p>
      </div>

      {applications.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Tuition Title</th>
                  <th>Student Name</th>
                  <th>Subject / Class</th>
                  <th>Expected Salary</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-base-200/40">
                    <td className="font-bold">{app.tuitionId?.title}</td>
                    <td>{app.studentId?.name}</td>
                    <td>
                      {app.tuitionId?.subject} (Class {app.tuitionId?.className})
                    </td>
                    <td className="font-bold text-indigo-600">৳{app.expectedSalary?.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge badge-sm uppercase font-bold ${
                          app.status === 'approved'
                            ? 'badge-success text-white'
                            : app.status === 'accepted'
                            ? 'badge-info text-white'
                            : app.status === 'rejected'
                            ? 'badge-error text-white'
                            : 'badge-warning text-white'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="btn btn-xs btn-ghost text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <EmptyState title="No Applications Yet" message="Browse active tuitions and submit your application to start tutoring." />
      )}
    </div>
  );
};
