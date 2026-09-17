import { SectionTitle } from '../../components/SectionTitle';
import { GraduationCap, ShieldCheck, Heart, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <SectionTitle
        badge="Our Mission"
        title="About eTuitionBD"
        subtitle="Empowering students and educators across Bangladesh through a modern, secure, and transparent tuition ecosystem."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-heading text-base-content">
            Revolutionizing Tutor Matching in Bangladesh
          </h2>
          <p className="text-base-content/70 leading-relaxed text-sm">
            eTuitionBD was founded with a single mission: to eliminate the friction in finding reliable, background-verified home and online tutors. Our platform bridges the gap between ambitious students seeking personalized guidance and qualified tutors looking to make a meaningful impact.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
              <ShieldCheck className="w-6 h-6 text-indigo-600 mb-2" />
              <h4 className="font-bold text-sm text-base-content">100% Background Checked</h4>
              <p className="text-xs text-base-content/60 mt-1">Verified educational credentials and identity documents.</p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800">
              <Award className="w-6 h-6 text-cyan-600 mb-2" />
              <h4 className="font-bold text-sm text-base-content">Quality Assurance</h4>
              <p className="text-xs text-base-content/60 mt-1">Admin moderation on every tuition post before listing.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
            alt="Students Studying"
            className="rounded-3xl shadow-2xl border border-base-200 dark:border-base-300"
          />
        </div>
      </div>
    </div>
  );
};
