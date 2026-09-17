import { useState } from 'react';
import { SectionTitle } from '../../components/SectionTitle';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Swal from 'sweetalert2';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out. Our team will get back to you shortly.',
      timer: 2000,
      showConfirmButton: false,
    });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <SectionTitle
        badge="Get in Touch"
        title="Contact Our Support Team"
        subtitle="Have questions or feedback? We are here to help you 24/7."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-heading text-base-content">Contact Information</h3>

            <div className="space-y-4 text-sm text-base-content/80">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-base-content">Office Address</h5>
                  <p className="text-xs text-base-content/60">Gulshan-2, Dhaka 1212, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-base-content">Phone Support</h5>
                  <p className="text-xs text-base-content/60">+880 1700-000000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-base-content">Email Support</h5>
                  <p className="text-xs text-base-content/60">support@etuitionbd.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-4">
            <h3 className="text-xl font-bold font-heading text-base-content mb-4">Send Us a Message</h3>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered w-full rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="textarea textarea-bordered w-full rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none w-full rounded-xl font-bold text-sm shadow-md gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
