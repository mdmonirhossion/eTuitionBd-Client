import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { CreditCard, DollarSign } from 'lucide-react';

export const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState({ totalRevenue: 0, count: 0, payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get('/payments/admin/all')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Platform Financial Transactions</h2>
        <p className="text-xs text-base-content/60">Audit log of all Stripe payments processed across eTuitionBD.</p>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Total System Revenue</span>
          <h3 className="text-4xl font-extrabold font-heading mt-1">৳{data.totalRevenue?.toLocaleString()}</h3>
          <p className="text-xs text-indigo-200 mt-2">Across {data.count} successful transactions</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
      </div>

      {data.payments.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Txn ID</th>
                  <th>Student</th>
                  <th>Tutor</th>
                  <th>Tuition Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-base-200/40">
                    <td className="font-mono text-indigo-600 font-bold">{p.transactionId}</td>
                    <td>{p.studentId?.name || 'Student'}</td>
                    <td>{p.tutorId?.name || 'Tutor'}</td>
                    <td className="font-bold">{p.tuitionId?.title || 'Tuition'}</td>
                    <td className="font-bold text-emerald-600">৳{p.amount?.toLocaleString()}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No Payment History" message="Once students complete tuition payments via Stripe, they will show here." />
      )}
    </div>
  );
};
