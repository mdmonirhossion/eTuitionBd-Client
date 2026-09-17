import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAxiosPublic } from '../../hooks/useAxiosPublic';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  MapPin,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
  Send,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const TuitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user, dbUser, role } = useAuth();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);

  // Application form fields
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');

  const fetchTuitionDetails = () => {
    setLoading(true);
    axiosPublic
      .get(`/tuitions/${id}`)
      .then((res) => {
        setTuition(res.data);
        if (res.data.salary) {
          setExpectedSalary(res.data.salary.toString());
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Tuition post not found', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitionDetails();
  }, [id]);

  // Check if current tutor has already applied
  useEffect(() => {
    if (user && role === 'tutor' && id) {
      axiosSecure
        .get('/applications/my')
        .then((res) => {
          const applied = res.data.some((app) => app.tuitionId?._id === id || app.tuitionId === id);
          setHasApplied(applied);
        })
        .catch((err) => console.error(err));
    }
  }, [user, role, id, axiosSecure]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!qualifications || !experience || !expectedSalary) {
      Swal.fire('Validation Error', 'Please fill in all application fields.', 'warning');
      return;
    }

    setSubmittingApp(true);
    try {
      await axiosSecure.post('/applications', {
        tuitionId: id,
        qualifications,
        experience,
        expectedSalary: Number(expectedSalary),
      });

      setApplyModalOpen(false);
      setHasApplied(true);
      Swal.fire('Application Submitted!', 'Your application has been sent to the student.', 'success');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit application.';
      Swal.fire('Error', msg, 'error');
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleAdminStatusChange = async (newStatus) => {
    try {
      await axiosSecure.patch(`/tuitions/${id}/status`, { status: newStatus });
      Swal.fire('Updated', `Tuition status updated to ${newStatus}.`, 'success');
      fetchTuitionDetails();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to update status.', 'error');
    }
  };

  const handleDeleteTuition = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This tuition post will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tuitions/${id}`);
        Swal.fire('Deleted!', 'Tuition post has been removed.', 'success');
        navigate('/tuitions');
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to delete tuition.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!tuition) return null;

  const isOwner = user && tuition.studentId?._id === dbUser?._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back Button */}
      <Link to="/tuitions" className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" />
        Back to Tuitions
      </Link>

      {/* Main Details Card */}
      <div className="bg-base-100 dark:bg-base-200 rounded-3xl p-8 border border-base-200 dark:border-base-300 shadow-xl space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-base-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200">
                Class {tuition.className}
              </span>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  tuition.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : tuition.status === 'assigned'
                    ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                    : tuition.status === 'rejected'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                {tuition.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-base-content">{tuition.title}</h1>
          </div>

          <div className="flex items-center gap-1 text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
            ৳{tuition.salary?.toLocaleString()}
            <span className="text-xs text-base-content/60 font-medium">/month</span>
          </div>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-base-200/50 border border-base-300">
          <div className="space-y-1">
            <span className="text-xs text-base-content/60 font-medium flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-500" /> Subject
            </span>
            <p className="font-bold text-base-content">{tuition.subject}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-base-content/60 font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" /> Location
            </span>
            <p className="font-bold text-base-content">{tuition.location}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-base-content/60 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" /> Days / Week
            </span>
            <p className="font-bold text-base-content">{tuition.daysPerWeek} Days</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-base-content/60 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" /> Schedule
            </span>
            <p className="font-bold text-base-content">{tuition.schedule}</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-base-content">Tuition Description & Requirements</h3>
          <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-line">
            {tuition.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Posted By Student Profile */}
        <div className="pt-6 border-t border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={tuition.studentId?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Student Avatar"
              className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30"
            />
            <div>
              <p className="text-xs text-base-content/60 font-medium">Posted by Student</p>
              <h4 className="font-bold font-heading text-base-content">{tuition.studentId?.name || 'Student'}</h4>
            </div>
          </div>

          <span className="text-xs text-base-content/50">
            Posted on {new Date(tuition.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action Controls Section */}
        <div className="pt-6 border-t border-base-200 flex flex-wrap items-center justify-end gap-4">
          
          {/* Admin Controls */}
          {role === 'admin' && (
            <div className="flex items-center gap-3">
              {tuition.status !== 'approved' && (
                <button
                  onClick={() => handleAdminStatusChange('approved')}
                  className="btn btn-emerald bg-emerald-600 hover:bg-emerald-700 text-white btn-sm rounded-xl gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              )}
              {tuition.status !== 'rejected' && (
                <button
                  onClick={() => handleAdminStatusChange('rejected')}
                  className="btn btn-rose bg-rose-600 hover:bg-rose-700 text-white btn-sm rounded-xl gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              )}
            </div>
          )}

          {/* Student Owner Controls */}
          {isOwner && (
            <div className="flex items-center gap-3">
              <Link
                to={`/student/tuitions/${id}/edit`}
                className="btn btn-outline border-indigo-200 dark:border-indigo-800 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
              <Link
                to="/student/applications"
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold gap-2"
              >
                <Briefcase className="w-4 h-4" /> View Applications
              </Link>
              <button
                onClick={handleDeleteTuition}
                className="btn btn-ghost text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-semibold gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}

          {/* Tutor Apply Controls */}
          {role === 'tutor' && !isOwner && (
            <div>
              {hasApplied ? (
                <span className="px-6 py-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 font-bold text-sm inline-flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Already Applied
                </span>
              ) : tuition.status !== 'approved' ? (
                <span className="px-6 py-3 rounded-2xl bg-base-200 text-base-content/60 font-semibold text-sm">
                  Applications Closed
                </span>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none rounded-2xl text-sm font-bold px-8 shadow-lg shadow-indigo-500/20 gap-2"
                >
                  <Send className="w-4 h-4" />
                  Apply for this Tuition
                </button>
              )}
            </div>
          )}

          {!user && (
            <Link
              to="/login"
              className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl text-sm font-bold px-8"
            >
              Sign In to Apply
            </Link>
          )}

        </div>

      </div>

      {/* Tutor Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 dark:bg-base-200 w-full max-w-lg rounded-3xl p-8 border border-base-300 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="text-xl font-bold font-heading text-base-content">Submit Tutor Application</h3>
              <button onClick={() => setApplyModalOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Tutor Name</label>
                <input
                  type="text"
                  value={user?.displayName || dbUser?.name || ''}
                  readOnly
                  className="input input-bordered w-full rounded-xl bg-base-200/50 cursor-not-allowed text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Tutor Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="input input-bordered w-full rounded-xl bg-base-200/50 cursor-not-allowed text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Educational Qualifications</label>
                <textarea
                  placeholder="e.g. B.Sc in CSE from BUET (3rd Year), HSC 5.00..."
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  required
                  rows={3}
                  className="textarea textarea-bordered w-full rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Tutoring Experience</label>
                <textarea
                  placeholder="e.g. 3 years experience teaching Math & Physics to Class 9-12 students..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  rows={3}
                  className="textarea textarea-bordered w-full rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Expected Salary (৳ / Month)</label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  required
                  min={0}
                  className="input input-bordered w-full rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="btn btn-ghost rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none rounded-xl font-bold text-xs px-6 shadow-md"
                >
                  {submittingApp ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
