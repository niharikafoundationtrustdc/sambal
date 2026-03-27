import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { auth, getUserProfile, onAuthStateChanged } from '../firebase';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, requiredRole = ['Super_Admin', 'admin'] }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-ngo-primary" size={32} />
      </div>
    );
  }

  if (!userProfile || !requiredRole.includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 max-w-md mb-8">
          This area is strictly reserved for authorized personnel. Your attempt has been logged in the audit trail.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-ngo-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
