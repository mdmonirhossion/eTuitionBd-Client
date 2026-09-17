import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileCheck, BookOpen, DollarSign, Clock, ArrowRight } from 'lucide-react';

export const TutorDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axiosSecure.get('/stats/tutor'), axiosSecure.get('/applications/my')])
      .then(([statsRes, appRes]) => {
        setStats(statsRes.data);
        setApplications(appRes.data.slice(0, 5));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading">Tutor Portal Overview</h2>
          <p className="text-xs text-cyan-200 mt-1">Track your tuition applications, ongoing classes, and monthly earnings.</p>
        </div>
        <Link
          to="/tuitions"
          className="btn bg-white text-indigo-900 hover:bg-slate-100 border-none rounded-xl text-xs font-bold gap-2 shrink-0 shadow-md"
        >
          <BookOpen className="w-4 h-4" />
          Find Available Tuitions
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Applied Tuitions</p>
            <h3 className="text-3xl font-extrabold font-heading text-base-content mt-1">{stats?.totalApplications || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Ongoing Tuitions</p>
            <h3 className="text-3xl font-extrabold font-heading text-emerald-600 mt-1">{stats?.ongoingTuitions || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Pending Response</p>
            <h3 className="text-3xl font-extrabold font-heading text-amber-500 mt-1">{stats?.pendingApplications || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold font-heading text-cyan-600 dark:text-cyan-400 mt-1">
              ৳{stats?.totalEarnings?.toLocaleString() || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-lg font-bold font-heading text-base-content">Recent Applications</h3>
          <Link to="/tutor/applications" className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="text-base-content/60">
                  <th>Tuition Title</th>
                  <th>Student</th>
                  <th>Expected Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-base-200/50">
                    <td className="font-bold">{app.tuitionId?.title}</td>
                    <td>{app.studentId?.name}</td>
                    <td className="font-bold text-indigo-600">৳{app.expectedSalary}</td>
                    <td>
                      <span className="badge badge-sm uppercase font-semibold">{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-base-content/60 py-4 text-center">No applications submitted yet.</p>
        )}
      </div>

    </div>
  );
};
