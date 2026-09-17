import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import { axiosPublic } from '../api/axiosPublic';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase user with Backend database & fetch JWT
  const syncBackendUser = async (firebaseUser, roleChoice = null) => {
    if (!firebaseUser || !firebaseUser.email) return null;

    try {
      const pendingRole = sessionStorage.getItem('pending_register_role');
      const activeRole = roleChoice || pendingRole || localStorage.getItem('user_role_' + firebaseUser.email) || null;

      const payload = {
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        firebaseUid: firebaseUser.uid,
      };

      if (activeRole) {
        payload.role = activeRole;
        localStorage.setItem('user_role_' + firebaseUser.email, activeRole);
      }

      const response = await axiosPublic.post('/auth/jwt', payload);

      if (response.data.token) {
        localStorage.setItem('access-token', response.data.token);
      }
      if (response.data.user) {
        // If activeRole is explicitly set locally, enforce it in dbUser
        const finalUser = {
          ...response.data.user,
          role: activeRole || response.data.user.role || 'student',
        };
        setDbUser(finalUser);
        if (pendingRole) {
          sessionStorage.removeItem('pending_register_role');
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error syncing backend user:', error);
      return null;
    }
  };

  const setUserRole = (newRole) => {
    if (user && user.email) {
      localStorage.setItem('user_role_' + user.email, newRole);
      setDbUser((prev) => (prev ? { ...prev, role: newRole } : { role: newRole }));
    }
  };

  const createUser = async (email, password, name, role = 'student') => {
    setLoading(true);
    try {
      sessionStorage.setItem('pending_register_role', role);
      localStorage.setItem('user_role_' + email, role);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      await syncBackendUser(res.user, role);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const savedRole = localStorage.getItem('user_role_' + email);
      await syncBackendUser(res.user, savedRole);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncBackendUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('access-token');
      setUser(null);
      setDbUser(null);
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name, photoURL) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setUser({ ...auth.currentUser });
    }
  };

  const refetchDbUser = async () => {
    if (user && user.email) {
      const savedRole = localStorage.getItem('user_role_' + user.email);
      await syncBackendUser(user, savedRole);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const savedRole = localStorage.getItem('user_role_' + currentUser.email);
        await syncBackendUser(currentUser, savedRole);
      } else {
        localStorage.removeItem('access-token');
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdminEmail = user?.email?.toLowerCase() === 'admin@etuitionbd.com' || user?.email?.toLowerCase() === 'admin@gmail.com';
  const activeRole = isAdminEmail ? 'admin' : (user && localStorage.getItem('user_role_' + user.email)) || dbUser?.role || 'student';

  const authInfo = {
    user,
    dbUser: isAdminEmail ? { ...dbUser, role: 'admin' } : dbUser,
    role: activeRole,
    setUserRole,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
    refetchDbUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};
