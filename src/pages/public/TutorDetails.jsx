import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAxiosPublic } from '../../hooks/useAxiosPublic';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CheckCircle2, Mail, Phone, Star, ArrowLeft, MessageSquare } from 'lucide-react';

export const TutorDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const [tutor, setTutor] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], count: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get(`/users/tutors/${id}`)
      .then((res) => setTutor(res.data))
      .catch((err) => console.error(err));

    axiosPublic
      .get(`/reviews/tutor/${id}`)
      .then((res) => setReviewsData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, axiosPublic]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!tutor) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link to="/tutors" className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" />
        Back to Tutors Directory
      </Link>

      {/* Main Profile Card */}
      <div className="bg-base-100 dark:bg-base-200 rounded-3xl p-8 border border-base-200 dark:border-base-300 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative w-32 h-32 shrink-0">
          <img
            src={tutor.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={tutor.name}
            className="w-full h-full rounded-3xl object-cover border-4 border-indigo-500/30 shadow-lg"
          />
          {tutor.verified && (
            <span className="absolute -bottom-2 -right-2 bg-cyan-500 text-white p-1.5 rounded-full shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          )}
        </div>

        <div className="space-y-4 text-center md:text-left flex-1">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-base-content">{tutor.name}</h1>
              <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 font-bold text-xs uppercase">
                Verified Tutor
              </span>
            </div>
            <p className="text-sm text-base-content/60 mt-1">Member since {new Date(tutor.createdAt).getFullYear()}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-base-content/80">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" />
              <span>{tutor.email}</span>
            </div>
            {tutor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500" />
                <span>{tutor.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{reviewsData.avgRating} ({reviewsData.count} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-base-100 dark:bg-base-200 rounded-3xl p-8 border border-base-200 dark:border-base-300 shadow-lg space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-base-200">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xl font-bold font-heading text-base-content">Student Ratings & Reviews</h3>
        </div>

        {reviewsData.reviews.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-base-200/50 border border-base-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.studentId?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                      alt="Student"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-semibold text-xs text-base-content">{rev.studentId?.name || 'Student'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{rev.rating}/5</span>
                  </div>
                </div>
                <p className="text-xs text-base-content/80">{rev.comment || 'No written comment provided.'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-base-content/60 py-4 text-center">No reviews submitted for this tutor yet.</p>
        )}
      </div>

    </div>
  );
};
