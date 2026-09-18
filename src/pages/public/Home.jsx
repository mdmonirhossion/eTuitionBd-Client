import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAxiosPublic } from '../../hooks/useAxiosPublic';
import { TuitionCard } from '../../components/TuitionCard';
import { TutorCard } from '../../components/TutorCard';
import { SectionTitle } from '../../components/SectionTitle';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Search,
  BookOpen,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [latestTuitions, setLatestTuitions] = useState([]);
  const [latestTutors, setLatestTutors] = useState([]);
  const [loadingTuitions, setLoadingTuitions] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch latest approved tuitions
    axiosPublic
      .get('/tuitions/latest')
      .then((res) => {
        setLatestTuitions(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingTuitions(false));

    // Fetch latest verified tutors
    axiosPublic
      .get('/tutors/latest')
      .then((res) => {
        setLatestTutors(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingTutors(false));
  }, [axiosPublic]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tuitions?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/tuitions');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Bangladesh's #1 Tuition Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-base-content tracking-tight leading-tight">
                Find Qualified <span className="gradient-text">Tutors</span> & Top Tuitions Anywhere.
              </h1>

              <p className="text-lg text-base-content/70 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect with verified home & online tutors across Bangladesh. Post your tuition requirements or apply as a tutor in minutes with our transparent, secure platform.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="p-2 bg-base-100 dark:bg-base-200 rounded-2xl shadow-xl shadow-indigo-500/10 border border-base-200 dark:border-base-300 flex items-center gap-2">
                  <div className="pl-3 text-base-content/40">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by subject, class, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-sm font-medium text-base-content focus:outline-none placeholder:text-base-content/40"
                  />
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none rounded-xl text-xs font-semibold px-6 shadow-md shadow-indigo-500/20"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-base-200/80 dark:border-base-800 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <h4 className="text-2xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">10,000+</h4>
                  <p className="text-xs text-base-content/60 font-medium">Verified Tutors</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold font-heading text-cyan-600 dark:text-cyan-400">15,000+</h4>
                  <p className="text-xs text-base-content/60 font-medium">Tuitions Matched</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold font-heading text-amber-500">99.8%</h4>
                  <p className="text-xs text-base-content/60 font-medium">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-2xl space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-base-200">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-500/30 shadow-md flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                      <img src="/E-TuitionBd Logo.png" alt="eTuitionBD Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-bold font-heading text-base-content">Top Mathematics Tutor</h4>
                      <p className="text-xs text-base-content/60">BUET CSE Graduate • 5 Yrs Exp</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-base-200/50">
                      <span className="text-base-content/60">Preferred Class:</span>
                      <span className="font-semibold">Class 9 - 12 (HSC)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-base-200/50">
                      <span className="text-base-content/60">Location:</span>
                      <span className="font-semibold">Dhanmondi / Mirpur</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-base-content/60">Monthly Remuneration:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">৳10,000 / mo</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="px-4 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Background & Credentials Verified
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Latest Tuition Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Recent Openings"
          title="Latest Tuition Opportunities"
          subtitle="Explore recently posted tuition positions looking for passionate tutors."
        />

        {loadingTuitions ? (
          <LoadingSpinner />
        ) : latestTuitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestTuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <p className="text-center text-base-content/60 py-8">No tuition posts available currently.</p>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/tuitions"
            className="btn btn-outline border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-semibold px-8 gap-2"
          >
            View All Tuitions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Latest Verified Tutors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Verified Educators"
          title="Top Rated Tutors"
          subtitle="Meet highly rated tutors ready to guide students towards academic excellence."
        />

        {loadingTutors ? (
          <LoadingSpinner />
        ) : latestTutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestTutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <p className="text-center text-base-content/60 py-8">No tutors registered yet.</p>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/tutors"
            className="btn btn-outline border-cyan-200 dark:border-cyan-800 hover:bg-cyan-600 hover:text-white rounded-xl text-sm font-semibold px-8 gap-2"
          >
            Browse All Tutors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How Platform Works Section */}
      <section className="bg-base-200/50 py-20 border-y border-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Simple Process"
            title="How eTuitionBD Works"
            subtitle="Transparent and straightforward workflow connecting students and tutors."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold font-heading">
                1
              </div>
              <h3 className="text-lg font-bold font-heading text-base-content">Post Tuition</h3>
              <p className="text-xs text-base-content/70">
                Student creates a tuition post specifying subject, salary, location, and class details.
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center mx-auto text-xl font-bold font-heading">
                2
              </div>
              <h3 className="text-lg font-bold font-heading text-base-content">Admin Moderation</h3>
              <p className="text-xs text-base-content/70">
                Admin team reviews and approves the tuition post to maintain quality and safety.
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold font-heading">
                3
              </div>
              <h3 className="text-lg font-bold font-heading text-base-content">Tutor Applications</h3>
              <p className="text-xs text-base-content/70">
                Qualified tutors submit applications detailing experience and expected salary.
              </p>
            </div>

            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold font-heading">
                4
              </div>
              <h3 className="text-lg font-bold font-heading text-base-content">Accept & Stripe Pay</h3>
              <p className="text-xs text-base-content/70">
                Student reviews applicants, accepts the best fit, and confirms via Stripe payment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-cyan-900 text-white rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight">
              Ready to Accelerate Learning or Share Knowledge?
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base">
              Join thousands of students and tutors across Bangladesh using eTuitionBD every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="btn bg-white text-indigo-900 hover:bg-slate-100 border-none rounded-xl text-sm font-bold px-8 w-full sm:w-auto"
              >
                Join as Student / Tutor
              </Link>
              <Link
                to="/tuitions"
                className="btn btn-outline border-white/40 text-white hover:bg-white/10 rounded-xl text-sm font-semibold px-8 w-full sm:w-auto"
              >
                Browse Tuitions
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
