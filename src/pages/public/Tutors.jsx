import { useState, useEffect } from 'react';
import { useAxiosPublic } from '../../hooks/useAxiosPublic';
import { TutorCard } from '../../components/TutorCard';
import { SectionTitle } from '../../components/SectionTitle';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Search } from 'lucide-react';

export const Tutors = () => {
  const axiosPublic = useAxiosPublic();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get(`/tutors?search=${encodeURIComponent(search.trim())}`)
      .then((res) => {
        setTutors(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, axiosPublic]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <SectionTitle
        badge="Qualified Educators"
        title="Find Verified Tutors"
        subtitle="Browse through background-checked and highly qualified tutors nationwide."
      />

      {/* Search Input */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search tutors by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 dark:bg-base-200 focus:outline-none shadow-md"
          />
        </div>
      </div>

      {/* Tutors Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <EmptyState title="No Tutors Found" message="Try searching for a different name or keyword." />
      )}

    </div>
  );
};
