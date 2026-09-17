import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { PaymentModal } from '../../components/PaymentModal';
import { Check, X, CreditCard, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export const StudentApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForPayment, setSelectedAppForPayment] = useState(null);

  const fetchApplications = () => {
    setLoading(true);
    axiosSecure
      .get('/applications/student')
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [axiosSecure]);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/applications/${id}/status`, { status });
      if (status === 'accepted') {
        Swal.fire({
          icon: 'success',
          title: 'Candidate Accepted!',
          text: 'Now click "Pay & Confirm" to finalize hiring and activate your tuition.',
        });
      } else {
        Swal.fire('Updated', `Application status changed to ${status}.`, 'success');
      }
      fetchApplications();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update status.', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Applied Tutors Management</h2>
        <p className="text-xs text-base-content/60">Review tutor applicants, accept candidates, and complete payments to finalize tutor hiring.</p>
      </div>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm space-y-4">
              
              {/* Tuition Header */}
              <div className="pb-3 border-b border-base-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    Tuition Post
                  </span>
                  <h4 className="font-bold text-sm text-base-content line-clamp-1">{app.tuitionId?.title}</h4>
                </div>
                <span
                  className={`badge badge-sm font-bold uppercase ${
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
              </div>

              {/* Tutor Profile Details */}
              <div className="flex items-start gap-4">
                <img
                  src={app.tutorId?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={app.tutorId?.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30"
                />
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-sm text-base-content">{app.tutorId?.name}</h5>
                  <p className="text-base-content/60">{app.tutorId?.email}</p>
                  <p className="text-base-content/60">{app.tutorId?.phone || 'No phone'}</p>
                </div>
              </div>

              {/* Qualifications & Experience */}
              <div className="p-4 rounded-2xl bg-base-200/50 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-base-content/60">Qualifications:</span>
                  <p className="text-base-content font-medium">{app.qualifications}</p>
                </div>
                <div>
                  <span className="font-bold text-base-content/60">Experience:</span>
                  <p className="text-base-content font-medium">{app.experience}</p>
                </div>
                <div className="pt-1 flex justify-between items-center text-sm font-bold">
                  <span className="text-base-content/60">Expected Salary:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">৳{app.expectedSalary?.toLocaleString()} / mo</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      className="btn btn-sm btn-ghost text-rose-600 rounded-xl"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'accepted')}
                      className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Accept Candidate
                    </button>
                  </>
                )}

                {app.status === 'accepted' && (
                  <button
                    onClick={() => setSelectedAppForPayment(app)}
                    className="btn btn-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none rounded-xl gap-2 font-bold shadow-md animate-pulse"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay & Confirm Tutor
                  </button>
                )}

                {app.status === 'approved' && (
                  <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Paid & Tutor Approved
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <EmptyState title="No Applications Received" message="When tutors apply to your posted tuitions, they will appear here." />
          
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              ⚡ Quick Payment Testing
            </span>
            <p className="text-xs text-base-content/70">
              Database-এ কোনো টিউটর আবেদন পাওয়া যায়নি। পেমেন্ট গেটওয়ে পরীক্ষা করার জন্য নিচে টেস্ট আবেদন যুক্ত করুন:
            </p>
            <button
              onClick={() => {
                const demoApp = {
                  _id: 'demo_app_' + Date.now(),
                  status: 'accepted',
                  expectedSalary: 8500,
                  qualifications: 'B.Sc in CSE from BUET',
                  experience: '3+ years experience in Class 9-10 Math & Physics',
                  tuitionId: {
                    title: 'Need Higher Math & Physics Tutor for Class 10',
                    subject: 'Mathematics & Physics',
                    className: 'Class 10',
                    salary: 8500,
                  },
                  tutorId: {
                    name: 'Rahim Chowdhury (Verified Tutor)',
                    email: 'rahim.tutor@example.com',
                    phone: '+880 1712-345678',
                    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                  },
                };
                setApplications([demoApp]);
                Swal.fire({
                  icon: 'info',
                  title: 'Demo Tutor Application Added!',
                  text: 'Now click "Pay & Confirm Tutor" button on the candidate card to open the Payment Gateway.',
                  timer: 2500,
                  showConfirmButton: false,
                });
              }}
              className="btn btn-sm bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white border-none rounded-xl font-bold gap-2 text-xs shadow-md"
            >
              <CreditCard className="w-4 h-4" /> Load Demo Tutor Application & Test Payment
            </button>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={!!selectedAppForPayment}
        onClose={() => setSelectedAppForPayment(null)}
        application={selectedAppForPayment}
        onPaymentSuccess={fetchApplications}
        axiosSecure={axiosSecure}
      />
    </div>
  );
};

