import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAxiosPublic } from '../../hooks/useAxiosPublic';
import { TuitionCard } from '../../components/TuitionCard';
import { SectionTitle } from '../../components/SectionTitle';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export const Tuitions = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialClass = searchParams.get('class') || 'All';
  const initialSubject = searchParams.get('subject') || 'All';
  const initialSort = searchParams.get('sort') || 'newest';

  const [search, setSearch] = useState(initialSearch);
  const [className, setClassName] = useState(initialClass);
  const [subject, setSubject] = useState(initialSubject);
  const [location, setLocation] = useState('All');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const limit = 6;

  const [tuitions, setTuitions] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTuitions = () => {
    setLoading(true);
    const query = new URLSearchParams({
      search: search.trim(),
      className: className === 'All' ? '' : className,
      subject: subject === 'All' ? '' : subject,
      location: location === 'All' ? '' : location,
      sort,
      page,
      limit,
    }).toString();

    axiosPublic
      .get(`/tuitions?${query}`)
      .then((res) => {
        setTuitions(res.data.tuitions || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTuitions();
  }, [search, className, subject, location, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setClassName('All');
    setSubject('All');
    setLocation('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const classOptions = ['All', 'Class 1-5', 'Class 6-8', 'Class 9', 'Class 10', 'SSC', 'HSC', 'University'];
  const subjectOptions = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'ICT', 'Accounting'];
  const locationOptions = ['All', 'Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna', 'Barisal', 'Rangpur'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <SectionTitle
        badge="Available Openings"
        title="Browse All Tuitions"
        subtitle="Search and filter through approved tuition posts across Bangladesh."
      />

      {/* Filter Toolbar Card */}
      <div className="bg-base-100 dark:bg-base-200 p-6 rounded-3xl border border-base-200 dark:border-base-300 shadow-lg space-y-6">
        
        {/* Search Bar + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by keyword, title, subject, or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input input-bordered w-full pl-12 rounded-2xl bg-base-200/50 focus:bg-base-100"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-indigo-500 shrink-0" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="select select-bordered w-full rounded-2xl bg-base-200/50 focus:bg-base-100 text-sm font-semibold"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="budget_asc">Budget: Low to High</option>
              <option value="budget_desc">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-base-200">
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Class / Level</label>
            <select
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                setPage(1);
              }}
              className="select select-bordered select-sm w-full rounded-xl bg-base-200/50"
            >
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="select select-bordered select-sm w-full rounded-xl bg-base-200/50"
            >
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="select select-bordered select-sm w-full rounded-xl bg-base-200/50"
            >
              {locationOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-ghost border border-base-300 w-full rounded-xl gap-2 font-semibold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between px-2 text-sm text-base-content/70">
        <p className="font-semibold">
          Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{tuitions.length}</span> of{' '}
          <span className="font-bold">{total}</span> approved tuitions
        </p>
      </div>

      {/* Tuitions Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : tuitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tuitions.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Tuitions Match Your Query"
          message="Try adjusting your search terms or clearing selected filter options."
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-sm btn-circle btn-ghost border border-base-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-4 py-2 rounded-xl bg-base-200">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-sm btn-circle btn-ghost border border-base-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
