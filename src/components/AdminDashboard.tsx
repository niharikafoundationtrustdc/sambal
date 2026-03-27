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
  UserPlus
} from 'lucide-react';

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
              <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50">Revoke</button>
              <button className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700">Audit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main M8 Dashboard Component
export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ngos' | 'finance' | 'security'>('overview');
  const [isInducted, setIsInducted] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Impact Dashboard</h1>
          <p className="text-slate-500 font-medium">Module M8: Data Governance & Admin Control</p>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'ngos' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            NGO Queue
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'finance' ? 'bg-ngo-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Financials
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
              <NGOOnboardingQueue />
            </>
          )}
          {activeTab === 'ngos' && <NGOOnboardingQueue />}
          {activeTab === 'finance' && <FinancialLedger />}
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
