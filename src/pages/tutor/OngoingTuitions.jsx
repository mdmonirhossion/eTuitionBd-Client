import { useState, useEffect } from 'react';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const OngoingTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [ongoing, setOngoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get('/applications/ongoing')
      .then((res) => setOngoing(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Ongoing Tuitions</h2>
        <p className="text-xs text-base-content/60">Assigned tuitions where student payment has been verified.</p>
      </div>

      {ongoing.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ongoing.map((item) => (
            <div key={item._id} className="bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-base-200">
                <h4 className="font-bold text-sm text-base-content">{item.tuitionId?.title}</h4>
                <span className="badge badge-success badge-sm text-white font-bold uppercase gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Subject & Class:</span>
                  <span className="font-semibold">{item.tuitionId?.subject} (Class {item.tuitionId?.className})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Location:</span>
                  <span className="font-semibold">{item.tuitionId?.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Monthly Remuneration:</span>
                  <span className="font-bold text-indigo-600">৳{item.expectedSalary?.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/50 space-y-2 text-xs">
                <span className="font-bold text-base-content/60 block">Student Contact:</span>
                <p className="font-semibold text-base-content">{item.studentId?.name}</p>
                <div className="flex items-center gap-2 text-base-content/70">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{item.studentId?.email}</span>
                </div>
                {item.studentId?.phone && (
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Phone className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{item.studentId?.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No Ongoing Tuitions" message="Approved and paid tuitions will be listed here once assigned." />
      )}
    </div>
  );
};
