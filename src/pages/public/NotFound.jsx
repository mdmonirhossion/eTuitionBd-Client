import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">404</h1>
      <h2 className="text-2xl font-bold font-heading text-base-content mt-2 mb-4">Page Not Found</h2>
      <p className="text-sm text-base-content/60 max-w-md mb-8">
        The page you are searching for does not exist, has been moved, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none rounded-xl text-sm font-bold px-8 shadow-md gap-2"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};
