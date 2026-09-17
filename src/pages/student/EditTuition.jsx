import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Send, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

export const EditTuition = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosSecure
      .get(`/tuitions/${id}`)
      .then((res) => {
        const t = res.data;
        setTitle(t.title || '');
        setSubject(t.subject || '');
        setClassName(t.className || '');
        setLocation(t.location || '');
        setSalary(t.salary ? t.salary.toString() : '');
        setDaysPerWeek(t.daysPerWeek ? t.daysPerWeek.toString() : '3');
        setSchedule(t.schedule || '');
        setDescription(t.description || '');
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'Tuition not found', 'error');
      })
      .finally(() => setLoading(false));
  }, [id, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosSecure.patch(`/tuitions/${id}`, {
        title,
        subject,
        className,
        location,
        salary: Number(salary),
        daysPerWeek: Number(daysPerWeek),
        schedule,
        description,
        status: 'pending',
      });

      Swal.fire('Updated', 'Tuition updated successfully. Status reset to pending for review.', 'success');
      navigate('/student/tuitions');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update tuition.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Edit Tuition Details</h2>
        <p className="text-xs text-base-content/60">Update your tuition post parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Post Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input input-bordered w-full rounded-xl text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Class *</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Salary (৳) *</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              min={0}
              className="input input-bordered w-full rounded-xl text-sm font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Days / Week</label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              min={1}
              max={7}
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Schedule</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="textarea textarea-bordered w-full rounded-xl text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none w-full rounded-xl font-bold text-sm shadow-md gap-2"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Saving Changes...' : 'Update Tuition Post'}
        </button>
      </form>
    </div>
  );
};
