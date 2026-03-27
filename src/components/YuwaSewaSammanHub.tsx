import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  History, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Upload,
  Trophy,
  Star,
  Users,
  Calendar,
  ChevronRight,
  AlertCircle,
  Wifi
} from 'lucide-react';
import FileUpload from './FileUpload';

interface PointMatrix {
  id: number;
  activity_name: string;
  points_per_unit: number;
  unit_name: string;
  category: string;
}

interface ServiceLog {
  id: number;
  activity_type: string;
  description: string;
  units: number;
  points_earned: number;
  status: 'pending' | 'verified' | 'rejected';
  proof_url: string;
  quarter: string;
  year: number;
  audit_trail: string;
  created_at: string;
}

interface Honor {
  id: number;
  title: string;
  quarter: string;
  year: number;
  points_attained: number;
  badge_url: string;
  created_at: string;
}

interface LeaderboardEntry {
  name: string;
  total_points: number;
}

export default function YuwaSewaSammanHub() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflow'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [pointMatrix, setPointMatrix] = useState<PointMatrix[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    activityType: '',
    description: '',
    units: '',
    proofUrl: ''
  });

  const userId = 1; // In a real app, this would come from auth context

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, matrixRes, logsRes, honorsRes, leaderboardRes] = await Promise.all([
        fetch(`/api/users/${userId}/dashboard`),
        fetch('/api/yuwa/point-matrix'),
        fetch(`/api/yuwa/service-logs/${userId}`),
        fetch(`/api/yuwa/honors/${userId}`),
        fetch('/api/yuwa/leaderboard')
      ]);

      if (!userRes.ok) throw new Error('User data fetch failed');
      const userData = await userRes.json();
      
      setUser(userData.user);
      setPointMatrix(await matrixRes.json());
      setServiceLogs(await logsRes.json());
      setHonors(await honorsRes.json());
      setLeaderboard(await leaderboardRes.json());
    } catch (error) {
      console.error('Error fetching Yuwa data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/yuwa/service-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          units: parseFloat(formData.units)
        })
      });

      if (res.ok) {
        setShowSubmitModal(false);
        setFormData({ activityType: '', description: '', units: '', proofUrl: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error submitting service log:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getQuarterName = () => {
    const month = new Date().getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = new Date().getFullYear();
    return `Q${quarter} ${year}`;
  };

  const workflowSteps = [
    {
      id: 1,
      title: "Forminator (Free)",
      stage: "INTAKE",
      description: "Used exclusively on the frontend to build the Dual-Nomination form. It handles the conditional logic (Self vs. Third-Party), enforces the 18-45 age limits, and securely collects the PDF/Image uploads.",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Uncanny Automator / Webhooks (Free)",
      stage: "DATA ROUTING",
      description: "Fires the exact second the Forminator form is submitted. It catches the applicant's data and silently pushes it to the M5 Google Sheet (Tab 8: Yuwa_Ledger). It is also used later to trigger the automated M12 Media alerts.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 3,
      title: "Ultimate Member (Free)",
      stage: "SECURITY & ADMIN CONTROL",
      description: "Used to role-gate the WordPress backend. It ensures that only the Super_Admin (The Chairman) can access the hidden page containing the M6_Criteria_Settings (The Control Panel).",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      title: "Google Looker Studio (Free) & Google Forms",
      stage: "VIP SCRUTINY",
      description: "Used during Month 2. Looker Studio pulls the Ready_for_Jury rows from the M5 Ledger and turns them into a beautiful, view-only visual dashboard for the VIP Jury. An embedded Google Form is used next to each profile for the VIPs to submit their 1-10 scores.",
      icon: <Users className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600"
    },
    {
      id: 5,
      title: "WP Mail SMTP (Free)",
      stage: "COMMUNICATION",
      description: "Fired automatically during the Clarification Loop (if an M11 intern requests clearer documents) and at the very end of the cycle to send the official congratulatory email/WhatsApp to the winner.",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-rose-100 text-rose-600"
    },
    {
      id: 6,
      title: "Elementor Pro",
      stage: "THE REVEAL",
      description: "Used in Month 3 after the winner is approved. Automator injects the winner's data and the hidden Jury names into a pre-designed Elementor Pro template to instantly publish the public 'Wall of Honor.'",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading Yuwa Sewa Samman Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Award className="w-6 h-6" />
                <span className="font-bold tracking-widest uppercase text-sm">Module M6: Yuwa Sewa Samman Hub</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Institutionalizing the Legacy of <span className="text-emerald-400 italic">Dr. Sarojini Agarwal</span>
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <p className="text-stone-400 text-lg leading-relaxed max-w-xl">
                  Recognizing the personal social support provided by youth to vulnerable demographics. 
                  A quarterly honors system designed for transparency, auditability, and impact.
                </p>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap">
                  <Wifi className="w-3 h-3 animate-pulse" />
                  Rural 3G Optimized
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[280px]">
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">Total Points Earned</div>
              <div className="text-6xl font-bold mb-2">{user?.points || 0}</div>
              <div className="text-stone-400 text-sm">Pan-India Rank: #124</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-stone-200 w-fit">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('workflow')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'workflow' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            System Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Stats & Submission */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Quarterly Stats Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900">Quarterly Performance</h2>
                      <p className="text-stone-500">{getQuarterName()}</p>
                    </div>
                    <button 
                      onClick={() => setShowSubmitModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                      <Plus className="w-5 h-5" />
                      Log Service
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="text-stone-500 text-sm font-medium mb-1">Quarterly Points</div>
                      <div className="text-3xl font-bold text-stone-900">
                        {serviceLogs.filter(l => l.status === 'verified').reduce((acc, curr) => acc + curr.points_earned, 0)}
                      </div>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                        <History className="w-6 h-6" />
                      </div>
                      <div className="text-stone-500 text-sm font-medium mb-1">Activities Logged</div>
                      <div className="text-3xl font-bold text-stone-900">{serviceLogs.length}</div>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="text-stone-500 text-sm font-medium mb-1">Honors Attained</div>
                      <div className="text-3xl font-bold text-stone-900">{honors.length}</div>
                    </div>
                  </div>
                </div>

                {/* Service History / Audit Trail */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-stone-900">Service Audit Trail</h2>
                    <div className="flex items-center gap-2 text-stone-400 text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Strict Audit Trail Enabled
                    </div>
                  </div>

                  <div className="space-y-4">
                    {serviceLogs.length === 0 ? (
                      <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-500">No service logs found. Start your legacy today.</p>
                      </div>
                    ) : (
                      serviceLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100 hover:border-emerald-200 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              log.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 
                              log.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              <Award className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-stone-900">{log.activity_type}</h4>
                                <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-600 rounded-full font-medium">
                                  {log.quarter} {log.year}
                                </span>
                              </div>
                              <p className="text-sm text-stone-500 line-clamp-1">{log.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-stone-900">+{log.points_earned} pts</div>
                            <div className="flex items-center justify-end gap-1 text-xs font-medium uppercase tracking-wider">
                              {getStatusIcon(log.status)}
                              <span className={
                                log.status === 'verified' ? 'text-emerald-600' : 
                                log.status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                              }>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Point Matrix & Leaderboard */}
              <div className="space-y-8">
                
                {/* Honors Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-lg shadow-emerald-200">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    Your Honors
                  </h2>
                  <div className="space-y-4">
                    {honors.length === 0 ? (
                      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                        <p className="text-emerald-100 text-sm mb-4">Reach 500 points this quarter to earn the "Sarojini Agarwal Fellow" title.</p>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (serviceLogs.filter(l => l.status === 'verified').reduce((acc, curr) => acc + curr.points_earned, 0) / 500) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      honors.map((honor) => (
                        <div key={honor.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-amber-300" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{honor.title}</h4>
                            <p className="text-emerald-100 text-sm">{honor.quarter} {honor.year}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Configurable Point Matrix */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-stone-900">Point Matrix</h2>
                    <Info className="w-4 h-4 text-stone-400" />
                  </div>
                  <div className="space-y-4">
                    {pointMatrix.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{item.activity_name}</div>
                          <div className="text-xs text-stone-500">{item.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-600 font-bold">{item.points_per_unit} pts</div>
                          <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">per {item.unit_name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quarterly Leaderboard */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Top Yuwa Sewaks
                  </h2>
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-amber-100 text-amber-600' : 
                            index === 1 ? 'bg-stone-200 text-stone-600' : 
                            index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="font-bold text-stone-900 text-sm">{entry.name}</div>
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">{entry.total_points} pts</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-stone-200">
                <div className="max-w-3xl mb-12">
                  <h2 className="text-3xl font-bold text-stone-900 mb-4">SECTION 1: THE STRICT PLUGIN STACK & CHRONOLOGICAL WORKFLOW</h2>
                  <p className="text-stone-500 text-lg">
                    To build this enterprise-grade honors system without custom coding costs, the developer must strictly use the following plugins and execute them in this exact chronological sequence:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {workflowSteps.map((step) => (
                    <div key={step.id} className="group p-8 rounded-[2rem] bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl hover:border-emerald-200 transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color} shadow-sm group-hover:scale-110 transition-transform`}>
                          {step.icon}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 bg-stone-200/50 px-3 py-1 rounded-full">
                          Step 0{step.id}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">STAGE: {step.stage}</div>
                        <h3 className="text-xl font-bold text-stone-900">{step.title}</h3>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h4 className="text-xl font-bold mb-2">Ready to scale your impact?</h4>
                    <p className="text-stone-400 text-sm">This workflow ensures that every nomination is handled with VIP-level scrutiny and institutional transparency.</p>
                  </div>
                  <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all whitespace-nowrap">
                    Download Technical Spec
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">Log Service Activity</h3>
                  <p className="text-stone-500">Zero Paperwork. Digital Audit Trail.</p>
                </div>
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Activity Type</label>
                    <select 
                      required
                      value={formData.activityType}
                      onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="">Select Activity</option>
                      {pointMatrix.map(item => (
                        <option key={item.id} value={item.activity_name}>{item.activity_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Units (Hours/Meals/Visits)</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 2"
                      value={formData.units}
                      onChange={(e) => setFormData({...formData, units: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Description of Service</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe your contribution..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Proof of Service (Photo/Document)</label>
                  <FileUpload 
                    onUpload={(url) => setFormData({...formData, proofUrl: url})}
                    accept="image/*,application/pdf"
                    maxSize={5}
                  />
                  <p className="text-[10px] text-stone-400 italic">Upload a photo or document of your service activity for verification.</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    By submitting, you agree that this information is accurate. False submissions will result in a permanent ban from the honors system. 
                    <strong> Strict audit trails are maintained for every submission.</strong>
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
