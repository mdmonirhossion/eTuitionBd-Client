import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, User, LogOut, LayoutDashboard, Menu, X, Shield, GraduationCap } from 'lucide-react';
import Swal from 'sweetalert2';

export const Navbar = () => {
  const { user, dbUser, role, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been signed out successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tuitions', path: '/tuitions' },
    { name: 'Tutors', path: '/tutors' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'tutor') return '/tutor/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/85 backdrop-blur-md border-b border-base-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold font-heading tracking-tight text-base-content">
                eTuition<span className="gradient-text">BD</span>
              </span>
              <span className="block text-[10px] font-medium tracking-widest text-indigo-500 uppercase -mt-1">
                Premium Tutor Matching
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500/30 hover:border-indigo-500 transition-all">
                  <div className="w-10 rounded-full">
                    <img
                      src={user.photoURL || dbUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user.displayName || 'User Profile'}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-3 shadow-xl menu dropdown-content bg-base-100 rounded-2xl w-60 border border-base-200 space-y-1"
                >
                  <li className="px-3 py-2 border-b border-base-200 mb-1">
                    <p className="font-semibold text-base-content text-sm truncate">{user.displayName || dbUser?.name || 'User'}</p>
                    <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 w-fit">
                      {role}
                    </span>
                  </li>
                  <li>
                    <Link to={getDashboardPath()} className="flex items-center gap-2 py-2.5 rounded-xl font-medium">
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-rose-600 py-2.5 rounded-xl font-medium">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="btn btn-ghost text-sm font-semibold rounded-xl text-base-content hover:bg-base-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-none shadow-md shadow-indigo-500/20 hover:opacity-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-circle text-base-content"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 border-b border-base-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-base-content/80 hover:bg-base-200"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="pt-4 border-t border-base-200 space-y-2">
              <div className="px-4 py-2">
                <p className="font-semibold text-sm">{user.displayName || dbUser?.name}</p>
                <p className="text-xs text-base-content/60">{user.email}</p>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-600 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-base-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline border-base-300 w-full rounded-xl font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn bg-gradient-to-r from-indigo-600 to-cyan-600 text-white w-full rounded-xl font-semibold border-none"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
