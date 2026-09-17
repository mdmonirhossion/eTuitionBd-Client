import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FileCheck,
  CreditCard,
  User,
  Users,
  CheckSquare,
  DollarSign,
  LogOut,
  GraduationCap,
  Menu,
  X,
  Home,
  ShieldAlert,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const DashboardLayout = () => {
  const { user, dbUser, role, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const studentLinks = [
    { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Tuitions', path: '/student/tuitions', icon: BookOpen },
    { name: 'Post New Tuition', path: '/student/tuitions/create', icon: PlusCircle },
    { name: 'Applied Tutors', path: '/student/applications', icon: FileCheck },
    { name: 'Payment History', path: '/student/payments', icon: CreditCard },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ];

  const tutorLinks = [
    { name: 'Overview', path: '/tutor/dashboard', icon: LayoutDashboard },
    { name: 'Find All Tuitions', path: '/tuitions', icon: BookOpen },
    { name: 'My Applications', path: '/tutor/applications', icon: FileCheck },
    { name: 'Ongoing Tuitions', path: '/tutor/ongoing-tuitions', icon: CheckSquare },
    { name: 'Revenue & Earnings', path: '/tutor/revenue', icon: DollarSign },
    { name: 'Tutor Profile', path: '/tutor/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Tuition Moderation', path: '/admin/tuitions', icon: CheckSquare },
    { name: 'All Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const navLinks = role === 'admin' ? adminLinks : role === 'tutor' ? tutorLinks : studentLinks;

  return (
    <div className="min-h-screen flex bg-base-200/50 text-base-content font-sans antialiased">
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-base-100 border-r border-base-300 z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-20 px-6 border-b border-base-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading">eTuition<span className="gradient-text">BD</span></span>
                <span className="block text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                  {role} Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden btn btn-ghost btn-circle btn-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Brief Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-base-200/70 border border-base-300 flex items-center gap-3">
            <img
              src={user?.photoURL || dbUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Avatar"
              className="w-11 h-11 rounded-xl object-cover border border-indigo-500/30"
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user?.displayName || dbUser?.name || 'User'}</p>
              <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-base-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-base-content/70 hover:bg-base-200"
          >
            <Home className="w-4 h-4" />
            Back to Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-base-100 border-b border-base-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn btn-ghost btn-circle"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold font-heading text-base-content capitalize">
              Welcome, {user?.displayName || dbUser?.name || 'User'}! 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="btn btn-sm btn-ghost gap-2 text-xs font-semibold rounded-xl hidden sm:flex"
            >
              <Home className="w-4 h-4" />
              Main Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
