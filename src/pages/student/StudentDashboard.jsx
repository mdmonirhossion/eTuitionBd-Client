import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BookOpen, CheckCircle, Clock, CreditCard, PlusCircle, ArrowRight } from 'lucide-react';

export const StudentDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [myTuitions, setMyTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axiosSecure.get('/stats/student'), axiosSecure.get('/tuitions/my')])
      .then(([statsRes, tuitionsRes]) => {
        setStats(statsRes.data);
        setMyTuitions(tuitionsRes.data.slice(0, 5));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-cyan-900 text-white shadow-xl">
        <div>
          <h2 className="text-2xl font-bold font-heading">Student Portal Overview</h2>
          <p className="text-xs text-indigo-200 mt-1">Manage your tuition requests, applicant tutors, and payments.</p>
        </div>
        <Link
          to="/student/tuitions/create"
          className="btn bg-white text-indigo-900 hover:bg-slate-100 border-none rounded-xl text-xs font-bold gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Tuition
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Tuitions</p>
            <h3 className="text-3xl font-extrabold font-heading text-base-content mt-1">{stats?.totalTuitions || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Approved Posts</p>
            <h3 className="text-3xl font-extrabold font-heading text-emerald-600 mt-1">{stats?.approvedTuitions || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Pending Review</p>
            <h3 className="text-3xl font-extrabold font-heading text-amber-500 mt-1">{stats?.pendingTuitions || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Spent</p>
            <h3 className="text-2xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400 mt-1">
              ৳{stats?.totalSpent?.toLocaleString() || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Tuitions */}
      <div className="bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-lg font-bold font-heading text-base-content">Recent Tuition Posts</h3>
          <Link to="/student/tuitions" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myTuitions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="text-base-content/60">
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-base-200/50">
                    <td className="font-bold">{t.title}</td>
                    <td>{t.subject}</td>
                    <td>{t.className}</td>
                    <td className="font-bold text-indigo-600">৳{t.salary}</td>
                    <td>
                      <span className="badge badge-sm font-semibold uppercase">{t.status}</span>
                    </td>
                    <td>
                      <Link to={`/tuitions/${t._id}`} className="btn btn-xs btn-ghost text-indigo-600">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-base-content/60 py-4 text-center">You haven't posted any tuitions yet.</p>
        )}
      </div>

    </div>
  );
};
