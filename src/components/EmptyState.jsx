import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({ title = 'No Data Found', message = 'There are no records to display right now.', actionText, actionPath }) => {
  return (
    <div className="py-16 px-4 text-center bg-base-100 dark:bg-base-200/50 rounded-3xl border border-dashed border-base-300 max-w-md mx-auto my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-heading text-base-content mb-2">{title}</h3>
      <p className="text-sm text-base-content/60 mb-6">{message}</p>
      {actionText && actionPath && (
        <Link
          to={actionPath}
          className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-semibold border-none px-6"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
