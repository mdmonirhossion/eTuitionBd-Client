export const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-semibold text-base-content/70 animate-pulse">Loading eTuitionBD...</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-base-100/90 z-50">{content}</div>;
  }

  return <div className="py-20 flex items-center justify-center w-full">{content}</div>;
};
