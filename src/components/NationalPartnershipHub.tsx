import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Handshake, 
  Package, 
  UserPlus, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  Plus,
  ArrowRight,
  Info,
  Lock,
  FileText,
  CheckCircle2,
  X,
  AlertTriangle,
  Clock,
  Upload,
  Wifi
} from 'lucide-react';
import FileUpload from './FileUpload';

interface User {
  id: number;
  role: string;
  m4_unlocked: boolean;
}

interface NGO {
  id: number;
  name: string;
  darpan_id: string;
  category: string;
  sub_category: string;
  pincode: string;
  state: string;
  district: string;
  verified: boolean;
  contact: string;
}

interface ResourceItem {
  id: number;
  ngo_id: number;
  ngo_name: string;
  type: 'offer' | 'request';
  title: string;
  description: string;
  category: string;
  created_at: string;
}

interface LaborItem {
  id: number;
  ngo_id: number;
  ngo_name: string;
  type: 'request' | 'offer';
  role: string;
  count: number;
  description: string;
  created_at: string;
}

const NationalPartnershipHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'resources' | 'labor'>('directory');
  const [partners, setPartners] = useState<NGO[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [labor, setLabor] = useState<LaborItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    darpan_id: '',
    pan: '',
    state: '',
    district: '',
    pincode: '',
    category: '',
    document_url: ''
  });

  useEffect(() => {
    fetchUser();
    fetchData();
  }, [activeTab]);

  const fetchUser = async () => {
    // Simulate fetching current user
    try {
      const res = await fetch('/api/users/1/dashboard'); // Mocking user 1
      const data = await res.json();
      // In a real app, we'd get the full user object
      // For this demo, let's fetch user details specifically
      const userRes = await fetch('/api/admin/users/1'); // Need to add this endpoint or similar
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ngos/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...onboardingData, userId: user?.id || 1 })
      });
      if (res.ok) {
        alert("Onboarding submitted! Nodal Admin will review your Darpan ID.");
        setShowOnboarding(false);
        fetchUser();
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const handleQuizComplete = async () => {
    try {
      const res = await fetch('/api/lms/quiz-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 1, score: 100 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unlocked) {
          alert("Compliance verified! M4 Hub unlocked.");
          fetchUser();
        }
      }
    } catch (error) {
      console.error('Quiz error:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'directory') {
        const res = await fetch('/api/partners');
        const data = await res.json();
        setPartners(data);
      } else if (activeTab === 'resources') {
        const res = await fetch('/api/resources');
        const data = await res.json();
        setResources(data);
      } else if (activeTab === 'labor') {
        const res = await fetch('/api/labor');
        const data = await res.json();
        setLabor(data);
      }
    } catch (error) {
      console.error('Error fetching hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
              <Handshake className="w-8 h-8 text-emerald-600" />
              National Partnership Hub
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-stone-600">
                B2B Networking, Resource Directory, and Digital Labor Exchange for Indian NGOs.
              </p>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <Wifi className="w-3 h-3 animate-pulse" />
                Rural 3G Optimized
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Verified NGO Ecosystem
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex p-1 bg-stone-200 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'directory' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              NGO Directory
            </div>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'resources' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Resource Board
            </div>
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'labor' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Labor Exchange
            </div>
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'directory' ? 'partners by name, category or location...' : activeTab === 'resources' ? 'resource offers and requests...' : 'labor exchange postings...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        {user?.role === 'user' && (
          <button 
            onClick={() => setShowOnboarding(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Register NGO (Form 40)
          </button>
        )}

        {user?.role === 'Pending_NGO' && (
          <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-medium">
            <Clock className="w-5 h-5 animate-pulse" />
            Registration Pending Review
          </div>
        )}

        {user?.role === 'Verified_NGO' && activeTab !== 'directory' && (
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-sm">
            <Plus className="w-5 h-5" />
            {activeTab === 'resources' ? 'Post Resource' : 'Post Labor Need'}
          </button>
        )}
      </div>

      {/* Compliance Lock Section */}
      {user?.role === 'Verified_NGO' && !user?.m4_unlocked && (
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Lock className="w-12 h-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-amber-900 mb-2">Mandatory Legal Compliance Required</h2>
                <p className="text-amber-800 mb-6 max-w-2xl">
                  Your NGO is verified, but to access national resources and networking, you must complete the 
                  <strong> "NGO Capacity Building & Legal Compliance"</strong> track (DPDP Act & POCSO guidelines).
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link 
                    to="/lms/4"
                    className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-200"
                  >
                    <FileText className="w-5 h-5" />
                    Go to M3 Compliance Track
                  </Link>
                  <div className="flex items-center gap-2 text-amber-700 text-sm font-medium bg-white/50 px-4 py-2 rounded-xl border border-amber-200">
                    <CheckCircle2 className="w-4 h-4" />
                    100% Score Required in Capstone Quiz
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-500">Loading hub data...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'directory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartners.map((ngo) => (
                    <div key={ngo.id} className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 p-3 rounded-xl">
                          <Handshake className="w-6 h-6 text-emerald-600" />
                        </div>
                        {ngo.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {ngo.name}
                      </h3>
                      <p className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ngo.district}, {ngo.state}
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <span className="font-semibold">Category:</span>
                          {ngo.category}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <span className="font-semibold">Darpan ID:</span>
                          {ngo.darpan_id}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-all">
                          <MessageSquare className="w-4 h-4" />
                          Connect
                        </button>
                        <button className="p-2.5 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-all">
                          <Info className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="relative">
                  {user?.role === 'Verified_NGO' && !user?.m4_unlocked && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                      <div className="text-center p-8 bg-white shadow-xl rounded-3xl border border-stone-200 max-w-sm">
                        <Lock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h4 className="font-bold text-stone-900 mb-2">Module Locked</h4>
                        <p className="text-sm text-stone-500">Complete M3 Compliance Track to unlock the Resource Board.</p>
                      </div>
                    </div>
                  )}
                  <div className={`space-y-4 ${user?.role === 'Verified_NGO' && !user?.m4_unlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                    {resources.map((item) => (
                      <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-all">
                        <div className="flex gap-4">
                          <div className={`p-4 rounded-2xl h-fit ${item.type === 'offer' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                            <Package className={`w-6 h-6 ${item.type === 'offer' ? 'text-blue-600' : 'text-orange-600'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                item.type === 'offer' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {item.type}
                              </span>
                              <span className="text-xs text-stone-400">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-1">{item.title}</h3>
                            <p className="text-stone-600 text-sm mb-2">{item.description}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {item.ngo_name}
                              </span>
                              <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                                <Filter className="w-3 h-3" />
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                          item.type === 'offer' 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}>
                          {item.type === 'offer' ? 'Request Item' : 'Offer Help'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'labor' && (
                <div className="relative">
                  {user?.role === 'Verified_NGO' && !user?.m4_unlocked && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                      <div className="text-center p-8 bg-white shadow-xl rounded-3xl border border-stone-200 max-w-sm">
                        <Lock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h4 className="font-bold text-stone-900 mb-2">Module Locked</h4>
                        <p className="text-sm text-stone-500">Complete M3 Compliance Track to unlock the Labor Exchange.</p>
                      </div>
                    </div>
                  )}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${user?.role === 'Verified_NGO' && !user?.m4_unlocked ? 'opacity-40 pointer-events-none' : ''}`}>
                    {labor.map((item) => (
                      <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${item.type === 'request' ? 'bg-purple-50' : 'bg-teal-50'}`}>
                            <UserPlus className={`w-6 h-6 ${item.type === 'request' ? 'text-purple-600' : 'text-teal-600'}`} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            item.type === 'request' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                          }`}>
                            {item.type === 'request' ? 'Seeking Labor' : 'Offering Labor'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">{item.role}</h3>
                        <p className="text-sm text-stone-500 mb-4">
                          {item.count} Position{item.count > 1 ? 's' : ''} • {item.ngo_name}
                        </p>
                        <p className="text-stone-600 text-sm mb-6 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                          <span className="text-xs text-stone-400">
                            Posted {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            item.type === 'request' 
                              ? 'text-purple-600 hover:bg-purple-50' 
                              : 'text-teal-600 hover:bg-teal-50'
                          }`}>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {((activeTab === 'directory' && filteredPartners.length === 0) || 
                (activeTab === 'resources' && resources.length === 0) || 
                (activeTab === 'labor' && labor.length === 0)) && (
                <div className="text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl">
                  <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-stone-300" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">No results found</h3>
                  <p className="text-stone-500">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-stone-900 rounded-3xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold">Zero-Cost B2B Architecture</h4>
              <p className="text-sm text-stone-400">Direct NGO-to-NGO collaboration with no intermediaries or fees.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">450+</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500">Active Partners</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">1.2k</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500">Resources Shared</div>
            </div>
          </div>
        </div>
      </div>
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">NGO National Onboarding</h3>
                  <p className="text-sm text-stone-500">Form 40: Official Partnership Gate</p>
                </div>
                <button onClick={() => setShowOnboarding(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>
              <form onSubmit={handleOnboardingSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">NGO Name</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.name}
                      onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Organization Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">NITI Aayog Darpan ID</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.darpan_id}
                      onChange={(e) => setOnboardingData({ ...onboardingData, darpan_id: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="e.g. UP/2023/0123456"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">PAN Number</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.pan}
                      onChange={(e) => setOnboardingData({ ...onboardingData, pan: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="10-digit PAN"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                      required
                      value={onboardingData.category}
                      onChange={(e) => setOnboardingData({ ...onboardingData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="Orphanage">Orphanage</option>
                      <option value="Old Age Home">Old Age Home</option>
                      <option value="Disability Center">Disability Center</option>
                      <option value="Women Shelter">Women Shelter</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">State</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.state}
                      onChange={(e) => setOnboardingData({ ...onboardingData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">District</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.district}
                      onChange={(e) => setOnboardingData({ ...onboardingData, district: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Pincode</label>
                    <input
                      required
                      type="text"
                      value={onboardingData.pincode}
                      onChange={(e) => setOnboardingData({ ...onboardingData, pincode: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <FileUpload 
                    label="12A/80G PDF Upload"
                    onUpload={(url) => setOnboardingData({ ...onboardingData, document_url: url })}
                    accept=".pdf"
                    maxSize={10}
                  />
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-700 leading-relaxed">
                  <strong>Anti-Bribery Clause:</strong> By submitting this form, you agree to our zero-tolerance policy on bribery and corruption. Your IP address ({'127.0.0.1'}) will be recorded on the generated MoU.
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                >
                  Submit Onboarding Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NationalPartnershipHub;
