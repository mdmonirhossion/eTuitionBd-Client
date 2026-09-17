import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosSecure } from '../../hooks/useAxiosSecure';
import { BookOpen, MapPin, DollarSign, Calendar, Clock, FileText, Send } from 'lucide-react';
import Swal from 'sweetalert2';

export const CreateTuition = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 9');
  const [location, setLocation] = useState('Dhanmondi, Dhaka');
  const [salary, setSalary] = useState('8000');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [schedule, setSchedule] = useState('Evening');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subject || !className || !location || !salary) {
      Swal.fire('Missing Fields', 'Please complete all required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.post('/tuitions', {
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

      Swal.fire({
        icon: 'success',
        title: 'Tuition Posted!',
        text: 'Your post is now pending admin moderation.',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/student/tuitions');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to post tuition.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-base-content">Post a New Tuition</h2>
        <p className="text-xs text-base-content/60">Fill out your tuition requirements. Posts will be reviewed by admin.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-6">
        
        <div>
          <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Post Title *</label>
          <input
            type="text"
            placeholder="Need Experienced Math & Physics Tutor for Class 9 Student"
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
              placeholder="e.g. Mathematics & Physics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Class / Grade *</label>
            <input
              type="text"
              placeholder="e.g. Class 9 / SSC"
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
              placeholder="e.g. Mirpur-10, Dhaka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Monthly Salary (৳) *</label>
            <input
              type="number"
              placeholder="8000"
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
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Days Per Week</label>
            <select
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="select select-bordered w-full rounded-xl text-sm"
            >
              <option value="1">1 Day / Week</option>
              <option value="2">2 Days / Week</option>
              <option value="3">3 Days / Week</option>
              <option value="4">4 Days / Week</option>
              <option value="5">5 Days / Week</option>
              <option value="6">6 Days / Week</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Preferred Time / Schedule</label>
            <input
              type="text"
              placeholder="e.g. 5:00 PM - 7:00 PM (Evening)"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Detailed Description & Special Notes</label>
          <textarea
            placeholder="Mention any preferred tutor qualifications, university preferences, exam timeline, etc."
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
          {submitting ? 'Submitting Post...' : 'Publish Tuition Post'}
        </button>

      </form>
    </div>
  );
};
