export const SectionTitle = ({ badge, title, subtitle, center = true }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-left'}`}>
      {badge && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-base-content tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
