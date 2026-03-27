import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  FileCheck, 
  IndianRupee, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Lock,
  History,
  Trash2,
  Zap,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  UserPlus,
  Award,
  Video,
  Star,
  LayoutDashboard,
  TrendingUp,
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';
import { VideoKYCBlock } from './YuwaSewaForms';
import { StaffIncidentLog } from './StaffIncidentLog';
import { UserRole, M5Status } from '../types';

// 1. NGO Onboarding Queue (M8 Phase 2)
const NGOOnboardingQueue = () => {
  const [ngos, setNgos] = useState([
    { id: 'NGO-001', name: 'Rural Health Initiative', type: 'Health', status: 'Pending_Verification', docUrl: '#' },
    { id: 'NGO-002', name: 'Skill Up India', type: 'Education', status: 'Pending_Verification', docUrl: '#' },
    { id: 'NGO-003', name: 'Green Earth Foundation', type: 'Environment', status: 'Verified_NGO', docUrl: '#' }
  ]);

  const handleVerify = (id: string) => {
    alert(`M8 Admin: Finalizing verification for ${id}. Role updated to 'Verified_NGO'. Expiry set to 365 days.`);
    setNgos(ngos.map(n => n.id === id ? { ...n, status: 'Verified_NGO' } : n));
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="text-ngo-primary" size={20} />
          NGO Onboarding Queue (M4)
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Search NGOs..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-ngo-primary outline-none" />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <Filter size={14} className="text-slate-500" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">NGO ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ngos.map((ngo) => (
              <tr key={ngo.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{ngo.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{ngo.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {ngo.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ngo.status === 'Verified_NGO' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {ngo.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 text-slate-400 hover:text-ngo-primary hover:bg-ngo-primary/5 rounded-lg transition-all" title="View Documents">
                      <Eye size={16} />
                    </button>
                    {ngo.status === 'Pending_Verification' && (
                      <button 
                        onClick={() => handleVerify(ngo.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Final Activate">
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. Financial Ledger & "Four-Eyes" Approval (M7/M5)
const FinancialLedger = () => {
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9901', donor: 'Amit Sharma', amount: 5000, status: 'Cleared', verified: true, approved: false },
    { id: 'TXN-9902', donor: 'Priya Verma', amount: 1500, status: 'Pending Bank Settlement', verified: false, approved: false },
    { id: 'TXN-9903', donor: 'Corporate CSR', amount: 50000, status: 'Cleared', verified: true, approved: true }
  ]);

  const handleApproval = (id: string, type: 'verify' | 'approve') => {
    const txn = transactions.find(t => t.id === id);
    if (type === 'approve' && !txn?.verified) {
      alert("M8 Security: Cannot approve before HQ Finance verification (Four-Eyes Principle).");
      return;
    }
    alert(`M8 Security: ${type === 'verify' ? 'HQ Finance' : 'Super Admin'} ${type}d transaction ${id}.`);
    setTransactions(transactions.map(t => {
      if (t.id === id) {
        return type === 'verify' ? { ...t, verified: true } : { ...t, approved: true };
      }
      return t;
    }));
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <IndianRupee className="text-emerald-600" size={20} />
          M7 Financial Ledger (Four-Eyes Logic)
        </h3>
        <button className="text-xs font-bold text-ngo-primary hover:underline flex items-center gap-1">
          Open M5 Master Sheet <ExternalLink size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">TXN ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{txn.donor}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">₹{txn.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      txn.verified ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {txn.verified ? <CheckCircle2 size={10} /> : <History size={10} />} Finance
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      txn.approved ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {txn.approved ? <CheckCircle2 size={10} /> : <History size={10} />} Admin
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!txn.verified && (
                      <button 
                        onClick={() => handleApproval(txn.id, 'verify')}
                        className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-all">
                        Verify
                      </button>
                    )}
                    {txn.verified && !txn.approved && (
                      <button 
                        onClick={() => handleApproval(txn.id, 'approve')}
                        className="px-3 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-700 transition-all">
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Master Control Switches (M8 Phase 1)
const MasterControls = () => {
  const [switches, setSwitches] = useState({
    siteActive: true,
    emergencyHide: false,
    donationsOpen: true,
    lmsPublic: true
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    const newVal = !switches[key];
    if (newVal === true && key === 'emergencyHide') {
      if (!confirm("CRITICAL: This will immediately hide all sensitive public data. Proceed?")) return;
    }
    setSwitches({ ...switches, [key]: newVal });
    alert(`M8 Master Control: ${key} set to ${newVal}. Updating M5 Ledger...`);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {(Object.keys(switches) as Array<keyof typeof switches>).map((key) => (
        <div key={key} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</h4>
            <p className="text-sm font-bold text-slate-900">{switches[key] ? 'ACTIVE' : 'DISABLED'}</p>
          </div>
          <button 
            onClick={() => toggleSwitch(key)}
            className={`w-12 h-6 rounded-full transition-all relative ${switches[key] ? 'bg-ngo-primary' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${switches[key] ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      ))}
    </div>
  );
};

// 4. Jury Management (M6 Governance)
const JuryManagement = () => {
  const [jury, setJury] = useState([
    { id: 'J-01', name: 'Dr. Ramesh Kumar', role: 'M6_VIP_JURY', sessions: 12 },
    { id: 'J-02', name: 'Smt. Sunita Devi', role: 'M6_JURY_ALUMNI', sessions: 8 }
  ]);

  const handleRoleChange = (id: string, newRole: string) => {
    alert(`M6 Automator: Role changed to ${newRole}. Triggering "Letter of Gratitude" recipe.`);
    setJury(jury.map(j => j.id === id ? { ...j, role: newRole as any } : j));
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" size={20} />
          Jury Governance (M6)
        </h3>
        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all">
          <UserPlus size={18} />
        </button>
      </div>
      <div className="space-y-4">
        {jury.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {member.name[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{member.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {member.role === 'M6_VIP_JURY' ? (
                <button 
                  onClick={() => handleRoleChange(member.id, 'M6_JURY_ALUMNI')}
                  className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50">Offboard</button>
              ) : (
                <button 
                  onClick={() => handleRoleChange(member.id, 'M6_VIP_JURY')}
                  className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700">Re-appoint</button>
              )}
              <button className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700">Audit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Chairman's Ranked Dashboard (M6 Phase 4)
const YuwaRankedDashboard = () => {
  const [candidates, setCandidates] = useState([
    { id: 'Y-001', name: 'Rahul Singh', juryScore: 28, presidentMarks: 0, status: 'Pending_Approval', kyc: 'Pending' },
    { id: 'Y-002', name: 'Anjali Gupta', juryScore: 26, presidentMarks: 0, status: 'Pending_Approval', kyc: 'Verified' },
    { id: 'Y-003', name: 'Vikram Das', juryScore: 24, presidentMarks: 0, status: 'Pending_Approval', kyc: 'Pending' }
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const handlePresidentMarks = (id: string, marks: number) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, presidentMarks: marks } : c));
  };

  const handleFinalApproval = (id: string, rank: string) => {
    alert(`M6 Final: Candidate ${id} assigned ${rank}. Triggering Automator Congratulatory Email & GamiPress Badge.`);
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: rank } : c));
  };

  const sortedCandidates = [...candidates].sort((a, b) => (b.juryScore + b.presidentMarks) - (a.juryScore + a.presidentMarks));

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Award className="text-amber-500" size={20} />
          Yuwa Sewa Samman: Ranked Hub (M6)
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <TrendingUp size={14} /> Sorted by Final Score
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jury Avg</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">President's Marks</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">KYC</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Final Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedCandidates.map((candidate, index) => (
              <tr key={candidate.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">{candidate.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{candidate.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600">{candidate.juryScore}</td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    max="20"
                    placeholder="0-20"
                    className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    value={candidate.presidentMarks}
                    onChange={(e) => handlePresidentMarks(candidate.id, parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      candidate.kyc === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {candidate.kyc === 'Verified' ? <CheckCircle2 size={10} /> : <Video size={10} />}
                    {candidate.kyc}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <select 
                    className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg outline-none"
                    onChange={(e) => handleFinalApproval(candidate.id, e.target.value)}
                    value={candidate.status}
                    disabled={candidate.kyc !== 'Verified'}
                  >
                    <option value="Pending_Approval">Assign Rank</option>
                    <option value="1st_Prize">1st Prize (Gold)</option>
                    <option value="2nd_Prize">2nd Prize (Silver)</option>
                    <option value="3rd_Prize">3rd Prize (Bronze)</option>
                    <option value="Consolation">Consolation</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full"
            >
              <VideoKYCBlock 
                applicant={{ name: selectedCandidate.name, idType: 'Aadhar Card' }} 
                onComplete={(status) => {
                  setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, kyc: status } : c));
                  setSelectedCandidate(null);
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 6. Looker Studio Dashboard Embeds (M5 Phase 6)
const LookerDashboard = ({ title, type }: { title: string, type: string }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm h-[600px] flex flex-col">
    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
      <h3 className="font-bold text-slate-900 flex items-center gap-2">
        <TrendingUp className="text-indigo-600" size={20} />
        {title}
      </h3>
      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] uppercase font-bold tracking-wider">
        <ShieldCheck size={12} /> Role-Gated: {type}
      </div>
    </div>
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-12 text-center">
      <div className="max-w-xs">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="text-slate-300" size={32} />
        </div>
        <h4 className="text-slate-900 font-bold mb-2">Looker Studio Embed</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Native Gutenberg Block: Connecting to M5 Master Ledger. Sanitized data view for {type}.
        </p>
      </div>
    </div>
  </div>
);

// Main M8 Dashboard Component
export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ngos' | 'finance' | 'yuwa' | 'security' | 'staff_log'>('overview');
  const [isInducted, setIsInducted] = useState(false);
  const [m5Status, setM5Status] = useState<M5Status>({
    webhookStatus: 'Green',
    zohoInvoiceCount: 42,
    lastSync: new Date().toISOString()
  });

  const userRole = UserRole.SUPER_ADMIN; // Mocked for now
  const userId = 'ADMIN-001'; // Mocked for now

  const renderM5StatusWidget = () => (
    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${m5Status.webhookStatus === 'Green' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">M5 Webhook Status</span>
        </div>
        <div className="h-4 w-px bg-slate-100" />
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zoho Invoices: {m5Status.zohoInvoiceCount}/1000</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
        <History size={12} />
        Last Sync: {new Date(m5Status.lastSync).toLocaleTimeString()}
      </div>
    </div>
  );

  // M8 Security Prerequisite: Digital Oath Induction
  if (!isInducted) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">M8 Admin Induction</h2>
          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            Access to the Impact Dashboard requires a mandatory Digital Oath. You must pledge to protect PII data and adhere to the <strong>DPDP Act 2023</strong>.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => {
                alert("M8 Security: Digital Oath Signed. DPDP Induction Quiz Completed (Score: 100%). Access Granted.");
                setIsInducted(true);
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
            >
              Sign Digital Oath & Enter
            </button>
            <p className="text-[10px] text-slate-400 font-medium">
              Your IP and login session will be logged in the M8 Audit Trail.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-12 bg-slate-50/50 min-h-screen">
      {renderM5StatusWidget()}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Impact Dashboard</h1>
          <p className="text-slate-500 font-medium">Module M8: Data Governance & Admin Control</p>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'ngos' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            NGO Queue
          </button>
          <button 
            onClick={() => setActiveTab('yuwa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'yuwa' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Yuwa Hub
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'finance' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <IndianRupee size={18} /> Financials
          </button>
          <button 
            onClick={() => setActiveTab('staff_log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'staff_log' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <AlertTriangle size={18} /> Staff Log
          </button>
        </div>
      </div>

      <MasterControls />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-2">Total Impact Units</h4>
                    <div className="text-4xl font-bold mb-4">15,240+</div>
                    <p className="text-indigo-100 text-xs leading-relaxed">
                      Aggregated from M1-M12. No monetary values displayed publicly.
                    </p>
                  </div>
                  <Zap className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-all" size={120} />
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">System Health</h4>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                      <ShieldCheck size={20} />
                      DPDP Compliant
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Audit Trail Sync</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
              <LookerDashboard title="Chairman's Master UI" type="Super Admin" />
              <NGOOnboardingQueue />
            </>
          )}
          {activeTab === 'ngos' && <NGOOnboardingQueue />}
          {activeTab === 'yuwa' && <YuwaRankedDashboard />}
          {activeTab === 'finance' && <FinancialLedger />}
          {activeTab === 'staff_log' && <StaffIncidentLog userRole={userRole} userId={userId} />}
        </div>

        <div className="space-y-8">
          <JuryManagement />
          
          <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
            <h3 className="font-bold text-rose-900 flex items-center gap-2 mb-4">
              <Trash2 size={20} />
              Right to be Forgotten
            </h3>
            <p className="text-xs text-rose-700 mb-4 leading-relaxed">
              Form 28-B requests for data erasure. <strong>15-day SLA active.</strong>
            </p>
            <button className="w-full py-3 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-all">
              View 3 Pending Requests
            </button>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <History size={20} className="text-slate-400" />
              Audit Trail (M8)
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Role Update', user: 'Admin_01', time: '2m ago' },
                { action: 'TXN Approved', user: 'Admin_01', time: '15m ago' },
                { action: 'NGO Verified', user: 'Admin_02', time: '1h ago' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">{log.action}</span>
                  <span className="text-slate-400">{log.user} • {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
