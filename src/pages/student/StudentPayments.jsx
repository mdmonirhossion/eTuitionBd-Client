import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { CreditCard, CheckCircle } from 'lucide-react';

export const StudentPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get('/payments/history')
      .then((res) => setPayments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Payment History</h2>
        <p className="text-xs text-base-content/60">View all successful payments completed for your tuitions.</p>
      </div>

      {payments.length > 0 ? (
        <div className="bg-base-100 dark:bg-base-200 rounded-3xl border border-base-200 dark:border-base-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/50 text-base-content/70">
                  <th>Transaction ID</th>
                  <th>Tuition Post</th>
                  <th>Assigned Tutor</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-base-200/40">
                    <td className="font-mono text-indigo-600 font-bold">{p.transactionId}</td>
                    <td className="font-bold">{p.tuitionId?.title || 'Tuition'}</td>
                    <td>{p.tutorId?.name || 'Tutor'}</td>
                    <td className="font-bold text-emerald-600">৳{p.amount?.toLocaleString()}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-success badge-sm text-white font-bold uppercase gap-1">
                        <CheckCircle className="w-3 h-3" /> {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No Payment Records" message="Once you pay for accepted tutors, your receipts will show up here." />
      )}
    </div>
  );
};
