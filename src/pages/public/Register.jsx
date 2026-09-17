import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, Image, GraduationCap, UserCheck, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export const Register = () => {
  const { createUser, googleSignIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 6) {
      Swal.fire('Password Length', 'Password must be at least 6 characters.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await createUser(email, password, name, role);
      if (photoURL) {
        await updateUserProfile(name, photoURL);
      }
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: `Welcome to eTuitionBD as a ${role.toUpperCase()}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      
      const targetPath = role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard';
      navigate(targetPath, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire('Registration Failed', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Registered & Signed in with Google.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/student/dashboard');
    } catch (error) {
      console.error(error);
      Swal.fire('Google Register Error', error.message, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-base-100 dark:bg-base-200 w-full max-w-md rounded-3xl p-8 border border-base-200 dark:border-base-300 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-base-content">Create an Account</h2>
          <p className="text-xs text-base-content/60">Join as a Student or Tutor today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-base-200/50 text-base-content/70 border-base-300'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  role === 'tutor'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-base-200/50 text-base-content/70 border-base-300'
                }`}
              >
                👨‍🏫 Tutor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3.5 text-base-content/40" />
              <input
                type="text"
                placeholder="Monir Hossain"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered w-full pl-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-base-content/40" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full pl-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-base-content/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full pl-11 pr-11 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-base-content/40 hover:text-base-content/70 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Photo URL (Optional)</label>
            <div className="relative">
              <Image className="w-5 h-5 absolute left-3.5 top-3.5 text-base-content/40" />
              <input
                type="url"
                placeholder="https://..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full pl-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none w-full rounded-xl font-bold text-sm shadow-md"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="divider text-xs text-base-content/40 uppercase font-bold">Or Register With</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline border-base-300 w-full rounded-xl gap-2 font-semibold text-xs"
        >
          Google Account
        </button>

        <p className="text-center text-xs text-base-content/70">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};
