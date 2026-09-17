import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { DollarSign, CheckCircle } from 'lucide-react';

export const TutorRevenue = () => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState({ totalRevenue: 0, paymentCount: 0, payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get('/payments/revenue')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Revenue & Earnings</h2>
        <p className="text-xs text-base-content/60">Overview of total payments received from assigned tuitions.</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-100">Total Accumulated Earnings</span>
          <h3 className="text-4xl font-extrabold font-heading mt-1">৳{data.totalRevenue?.toLocaleString()}</h3>
          <p className="text-xs text-indigo-100 mt-2">From {data.paymentCount} completed tuition transactions</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
      </div>

      {data.payments.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Txn ID</th>
                  <th>Tuition Post</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-base-200/40">
                    <td className="font-mono text-cyan-600 font-bold">{p.transactionId}</td>
                    <td className="font-bold">{p.tuitionId?.title}</td>
                    <td>{p.studentId?.name}</td>
                    <td className="font-bold text-emerald-600">৳{p.amount?.toLocaleString()}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No Earnings Recorded" message="Payments will appear here once students confirm assigned tuitions." />
      )}
    </div>
  );
};
