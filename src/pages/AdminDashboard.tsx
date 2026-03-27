import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Utensils,
  Settings,
  Lock,
  Unlock,
  ArrowRight,
  Database,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AttendanceTracker from '../components/AttendanceTracker';
import { dbService } from '../services/db';
import { auth } from '../firebase';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} text-white`}>
      <Icon size={32} />
    </div>
    <div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ngos');
  const [emergencyHide, setEmergencyHide] = useState(false);
  const [pendingNGOs, setPendingNGOs] = useState<any[]>([]);
  const [pendingYuwaLogs, setPendingYuwaLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await dbService.getSettings();
      setEmergencyHide(settings.emergency_hide);
    };
    
    loadSettings();
    fetchPendingNGOs();
    fetchPendingYuwaLogs();
  }, []);

  const fetchPendingNGOs = async () => {
    setLoading(true);
    try {
      const data = await dbService.getPendingNGOs();
      setPendingNGOs(data);
    } catch (err) {
      console.error('Error fetching pending NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingYuwaLogs = async () => {
    try {
      const data = await dbService.getPendingYuwaLogs();
      setPendingYuwaLogs(data);
    } catch (err) {
      console.error('Error fetching Yuwa logs:', err);
    }
  };

  const handleVerifyYuwa = async (logId: string, status: 'Verified' | 'Rejected') => {
    try {
      await dbService.updateStatus(logId, status, auth.currentUser?.uid || 'SYSTEM', `Verified via Control Tower`);
      alert(`Log ${status} successfully.`);
      fetchPendingYuwaLogs();
    } catch (err) {
      console.error('Error verifying Yuwa log:', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await dbService.updateStatus(id, 'Approved', auth.currentUser?.uid || 'SYSTEM', 'NGO Approved via Control Tower');
      alert(`NGO Approved!`);
      fetchPendingNGOs();
    } catch (err) {
      console.error('Error approving NGO:', err);
    }
  };

  const toggleEmergencyHide = async () => {
    const newValue = !emergencyHide;
    setEmergencyHide(newValue);
    try {
      await dbService.updateSettings({ emergency_hide: newValue });
      alert(`Emergency Hide ${newValue ? 'Activated' : 'Deactivated'}`);
    } catch (err) {
      console.error('Error updating settings:', err);
      setEmergencyHide(!newValue); // Rollback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900">Admin Control Tower</h1>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ngos' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            NGO Vetting
          </button>
          <button 
            onClick={() => setActiveTab('yuwa')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'yuwa' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Yuwa Sewa
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('lucknow')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'lucknow' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Lucknow Center
          </button>
          <button 
            onClick={() => setActiveTab('campus')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'campus' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Campus Governance
          </button>
          <button 
            onClick={() => setActiveTab('m5')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'm5' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Master Ledger
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total NGOs" value="1,240" icon={Users} color="bg-blue-600" />
        <StatCard title="Active Schemes" value="450" icon={FileText} color="bg-emerald-600" />
        <StatCard title="Pending Vetting" value="12" icon={ShieldCheck} color="bg-amber-600" />
        <StatCard title="Alerts" value="3" icon={AlertTriangle} color="bg-rose-600" />
      </div>

      {activeTab === 'ngos' ? (
        <div className="glass-card rounded-[3rem] overflow-hidden">
          {/* NGO Vetting Table... */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
            <h2 className="text-xl font-serif font-bold">NGO Vetting Dashboard</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search NGOs..." 
                className="pl-12 pr-4 py-2 rounded-xl bg-slate-100 border-none text-sm focus:ring-2 focus:ring-ngo-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-4">NGO Name</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Documents</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingNGOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">
                      No pending NGO applications found.
                    </td>
                  </tr>
                ) : (
                  pendingNGOs.map((ngo) => (
                    <tr key={ngo.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800">{ngo.name}</div>
                        <div className="text-xs text-slate-400">Darpan ID: {ngo.darpan_id}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">PAN: {ngo.pan}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full">{ngo.category}</span>
                        <div className="text-[10px] text-slate-400 mt-1">{ngo.district}, {ngo.state}</div>
                      </td>
                      <td className="px-8 py-6">
                        {ngo.document_url ? (
                          <a 
                            href={ngo.document_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-ngo-primary font-bold text-xs hover:underline"
                          >
                            <Eye size={14} /> View 12A/80G
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No documents</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                          <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" /> {ngo.onboarding_status || 'Pending'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleApprove(ngo.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs"
                          >
                            <CheckCircle2 size={16} /> Approve & MoU
                          </button>
                          <button 
                            onClick={async () => {
                              await fetch(`/api/admin/ngos/${ngo.id}/strike`, { method: 'POST' });
                              alert('Strike Added');
                              fetchPendingNGOs();
                            }}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            <AlertTriangle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'yuwa' ? (
        <div className="glass-card rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
            <h2 className="text-xl font-serif font-bold">Yuwa Sewa Verification</h2>
            <div className="px-4 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
              {pendingYuwaLogs.length} Pending Logs
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-4">Volunteer</th>
                  <th className="px-8 py-4">Activity</th>
                  <th className="px-8 py-4">Units</th>
                  <th className="px-8 py-4">Points</th>
                  <th className="px-8 py-4">Proof</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingYuwaLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">
                      No pending service logs for verification.
                    </td>
                  </tr>
                ) : (
                  pendingYuwaLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800">{log.user_name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Q{log.quarter} {log.year}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800">{log.activity_type}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{log.description}</div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 font-bold">{log.units}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full">
                          +{log.points_earned} PTS
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <a 
                          href={log.proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-ngo-primary font-bold text-xs hover:underline"
                        >
                          <Eye size={14} /> View Proof
                        </a>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleVerifyYuwa(log.id, 'Verified')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs"
                          >
                            <CheckCircle2 size={16} /> Verify
                          </button>
                          <button 
                            onClick={() => handleVerifyYuwa(log.id, 'Rejected')}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'lucknow' ? (
        <AttendanceTracker />
      ) : activeTab === 'campus' ? (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center">
          <ShieldCheck className="mx-auto text-ngo-primary mb-6" size={64} />
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">M10 Campus Governance Hub</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Manage physical assets, safety protocols, facility bookings, and personnel quality control for the Lucknow campus.
          </p>
          <Link 
            to="/admin/campus" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg hover:bg-ngo-dark transition-all"
          >
            Open Governance Tower <ArrowRight size={20} />
          </Link>
        </div>
      ) : activeTab === 'm5' ? (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center">
          <Database className="mx-auto text-ngo-primary mb-6" size={64} />
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">M5 Master Data Ledger</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Centralized coordination engine for all SAMBAL modules. View real-time data flow, operational alerts, and audit logs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/admin/m5/ledger" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg hover:bg-ngo-dark transition-all"
            >
              Open Master Ledger <ArrowRight size={20} />
            </Link>
            <Link 
              to="/staff/incident-log" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold shadow-lg hover:bg-slate-50 transition-all"
            >
              Log Staff Incident <ShieldAlert size={20} />
            </Link>
          </div>
        </div>
      ) : activeTab === 'settings' ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Governance & Safety Controls</h2>
                <p className="text-slate-500 text-sm">M8 Admin Master Control Switchboard</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${emergencyHide ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                    {emergencyHide ? <Lock size={28} /> : <Unlock size={28} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Emergency Hide Switch</h3>
                    <p className="text-xs text-slate-500 max-w-md">Instantly hide sensitive records and M5 Intelligence Hub dashboards from public view during audits or security events.</p>
                  </div>
                </div>
                <button 
                  onClick={toggleEmergencyHide}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${emergencyHide ? 'bg-rose-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${emergencyHide ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-white border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Audit Mode</h4>
                  <p className="text-xs text-slate-500 mb-4">Automatically generate compliance reports while in hide mode.</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-ngo-primary uppercase tracking-widest">
                    <CheckCircle2 size={14} /> Ready for DPDP 2023
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-white border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Data Scrubbing</h4>
                  <p className="text-xs text-slate-500 mb-4">Anonymize PII data across all M5 dashboards with one click.</p>
                  <button className="text-xs font-bold text-ngo-primary uppercase tracking-widest hover:underline">Configure Scrubbing →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-12 rounded-[3rem]">
            <h2 className="text-2xl font-serif font-bold mb-8">Search Log Analytics</h2>
            <div className="h-64 flex items-end justify-between gap-4">
              {[40, 70, 45, 90, 65, 80, 55, 75, 60, 85, 50, 95].map((h, i) => (
                <div key={i} className="flex-grow group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="bg-ngo-primary/20 group-hover:bg-ngo-primary transition-all rounded-t-lg"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {h * 10}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <h3 className="font-serif font-bold text-lg mb-6">Top Search Keywords</h3>
              <div className="space-y-4">
                {[
                  { label: "Old Age Pension", count: "1.2k" },
                  { label: "Child Education", count: "850" },
                  { label: "Medical Aid", count: "640" },
                  { label: "Skill Training", count: "420" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-xs font-bold text-ngo-primary">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ngo-primary text-white p-8 rounded-[2.5rem]">
              <h3 className="font-serif font-bold text-lg mb-4">M5 Master Hub</h3>
              <p className="text-white/60 text-xs mb-6">Live dashboards synced with Google Sheets & Looker Studio for CSR reporting.</p>
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold border border-white/20">
                Open Looker Studio
              </button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <h3 className="font-serif font-bold text-lg mb-4">Google Nonprofit Setup</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> TechSoup registration</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Domain token verification</li>
                <li className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border border-slate-300" /> Workspace for Nonprofits</li>
                <li className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border border-slate-300" /> YouTube Nonprofit activation</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
