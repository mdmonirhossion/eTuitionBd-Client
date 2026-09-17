import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Users, BookOpen, CheckSquare, CreditCard, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get('/stats/admin')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  const COLORS = ['#6366f1', '#10b981', '#06b6d4', '#f43f5e'];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <h2 className="text-2xl font-bold font-heading">System Administration Panel</h2>
        <p className="text-xs text-indigo-200 mt-1">Platform-wide system status, moderation overview, and revenue metrics.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Users</p>
            <h3 className="text-3xl font-extrabold font-heading text-base-content mt-1">{stats?.overview?.totalUsers || 0}</h3>
            <p className="text-[11px] text-base-content/60 mt-1">
              {stats?.overview?.students} Students • {stats?.overview?.tutors} Tutors
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Tuitions</p>
            <h3 className="text-3xl font-extrabold font-heading text-base-content mt-1">{stats?.overview?.totalTuitions || 0}</h3>
            <p className="text-[11px] text-amber-500 font-bold mt-1">
              {stats?.overview?.pendingTuitions} Pending Moderation
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Applications</p>
            <h3 className="text-3xl font-extrabold font-heading text-emerald-600 mt-1">{stats?.overview?.totalApplications || 0}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {stats?.overview?.assignedTuitions} Assigned
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-base-content/60 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400 mt-1">
              ৳{stats?.overview?.totalRevenue?.toLocaleString() || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recharts Graphical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart - Tuition Status */}
        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-heading text-base-content">Tuition Posts Status Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.statusChartData || []}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - User Roles */}
        <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-heading text-base-content">User Roles Demographics</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.roleChartData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  label
                >
                  {(stats?.roleChartData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
