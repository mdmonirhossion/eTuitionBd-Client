import { Link } from 'react-router-dom';
import { MapPin, BookOpen, Calendar, Clock, ArrowRight, CheckCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const TuitionCard = ({ tuition }) => {
  const {
    _id,
    title,
    subject,
    className,
    location,
    salary,
    daysPerWeek,
    schedule,
    status,
    createdAt,
    studentId,
  } = tuition;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Class {className}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
              ৳{salary?.toLocaleString()}
            </span>
            <span className="text-xs text-base-content/60 font-medium">/mo</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-heading text-base-content group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
          {title}
        </h3>

        {/* Info Grid */}
        <div className="space-y-2.5 mb-6 text-xs text-base-content/70">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="font-semibold text-base-content/90">{subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{daysPerWeek} days/week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{schedule}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="pt-4 border-t border-base-200 dark:border-base-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={studentId?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
            alt="Student Avatar"
            className="w-8 h-8 rounded-full object-cover border border-indigo-500/20"
          />
          <span className="text-xs font-semibold text-base-content/80 truncate max-w-[100px]">
            {studentId?.name || 'Student'}
          </span>
        </div>

        <Link
          to={`/tuitions/${_id}`}
          className="btn btn-sm text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none shadow-sm hover:shadow-indigo-500/20 gap-1.5 group-hover:gap-2 transition-all"
        >
          Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
