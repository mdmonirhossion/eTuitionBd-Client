import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const user = auth.currentUser;
  const isGoogleUser = user?.providerData?.some((p) => p.providerId === 'google.com');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isGoogleUser) {
      Swal.fire({
        icon: 'info',
        title: 'Google Sign-In Account',
        text: 'Your account is linked with Google Sign-In. Password changes are managed via Google Account settings.',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg('New password must be different from your current password.');
      return;
    }

    setLoading(true);

    try {
      if (!user || !user.email) {
        throw new Error('User authentication session expired. Please sign in again.');
      }

      // 1. Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Update password
      await updatePassword(user, newPassword);

      setSuccessMsg('Your password has been updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Swal.fire({
        icon: 'success',
        title: 'Password Updated!',
        text: 'Your password has been changed successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Password change error:', error);
      let message = 'Failed to update password. Please check your current password.';

      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'The current password you entered is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        message = 'The new password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/requires-recent-login') {
        message = 'For security reasons, please log out and log in again before changing your password.';
      }

      setErrorMsg(message);
      Swal.fire({
        icon: 'error',
        title: 'Password Change Failed',
        text: message,
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 dark:bg-base-200 p-8 rounded-3xl border border-base-200 dark:border-base-300 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-base-200 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-heading text-base-content">Security & Change Password</h3>
          <p className="text-xs text-base-content/60">Update your account password securely with verification</p>
        </div>
      </div>

      {isGoogleUser ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Google Account Sign-In</p>
            <p className="mt-0.5">
              You are signed in using Google Account. Passwords for Google accounts are managed directly through Google Security Settings.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Current Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-3.5 text-base-content/40 hover:text-base-content/70 transition-colors"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3.5 text-base-content/40 hover:text-base-content/70 transition-colors"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/60 uppercase mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3.5 text-base-content/40 hover:text-base-content/70 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold text-xs gap-2 px-6 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Change Password
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
