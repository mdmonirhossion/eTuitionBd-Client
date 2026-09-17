import { Link } from 'react-router-dom';
import { Award, Mail, Phone, CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const TutorCard = ({ tutor }) => {
  const { _id, name, email, phone, photoURL, verified } = tutor;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-base-100 dark:bg-base-200 rounded-3xl p-6 border border-base-200 dark:border-base-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between text-center"
    >
      <div>
        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src={photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={name}
            className="w-full h-full rounded-3xl object-cover border-2 border-indigo-500/30 shadow-md"
          />
          {verified && (
            <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1 rounded-full shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Info */}
        <h3 className="text-lg font-bold font-heading text-base-content hover:text-indigo-600 transition-colors">
          {name}
        </h3>
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 mt-1 mb-4">
          Verified Tutor
        </span>

        <div className="space-y-2 text-xs text-base-content/70 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate max-w-[180px]">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-500" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/tutors/${_id}`}
        className="btn btn-outline border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-600 hover:text-white hover:border-transparent text-xs font-semibold rounded-xl w-full gap-2 transition-all"
      >
        View Profile
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
};
