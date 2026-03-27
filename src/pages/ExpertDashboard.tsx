import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Award, 
  Languages, 
  Clock, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  ArrowRight,
  ChevronRight,
  Plus,
  Search,
  Trophy,
  Star,
  TrendingUp,
  AlertCircle,
  X,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

const BOUNTY_DIALECTS = ['Awadhi', 'Bhojpuri', 'Bundeli'];

export default function ExpertDashboard() {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [bounties, setBounties] = useState<any[]>([]);
  const [activeBounty, setActiveBounty] = useState<any>(null);
  const [correctedText, setCorrectedText] = useState('');
  const [isSubmittingBounty, setIsSubmittingBounty] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchSessions();
    fetchBounties();
  }, []);

  const fetchUser = async () => {
    const res = await fetch('/api/users/1/dashboard'); // Mocked
    const data = await res.json();
    setUser(data);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/appointments/my-sessions', {
      headers: { 'x-user-id': '1' } // Mocked
    });
    const data = await res.json();
    setSessions(data);
  };

  const fetchBounties = async () => {
    const res = await fetch('/api/experts/bounty/list', {
      headers: { 'x-user-id': '1' } // Mocked
    });
    const data = await res.json();
    setBounties(data);
  };

  const handleBountySubmit = async () => {
    setIsSubmittingBounty(true);
    try {
      await fetch('/api/experts/bounty/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '1'
        },
        body: JSON.stringify({
          bountyId: activeBounty.id,
          finalText: correctedText
        })
      });

      // M5 Webhook: Log Bounty Completion
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M6_BOUNTY_COMPLETION',
          payload: { bountyId: activeBounty.id, userId: '1', points: 50 },
          secure_url: '/expert/dashboard'
        })
      }).catch(err => console.error('M5 Bounty Log Failed:', err));

      setActiveBounty(null);
      fetchBounties();
      fetchUser();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBounty(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-ngo-primary text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-ngo-primary/20">
              <User size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-serif font-bold text-slate-900">{user.name}</h1>
                <span className="px-3 py-1 bg-ngo-primary/10 text-ngo-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Tier {user.expert_tier} Expert
                </span>
              </div>
              <p className="text-slate-500 text-sm">Expert Panel Member • {user.sneh_ratna_badge} Rank</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sneh-Ratna Credits</p>
                <p className="text-xl font-serif font-bold text-slate-900">{user.points}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pro-Bono Hours</p>
                <p className="text-xl font-serif font-bold text-slate-900">{user.total_pro_bono_hours}h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Sessions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Video size={24} className="text-ngo-primary" /> Active Tele-Bridge Sessions
                </h2>
                <Link to="/tele-bridge" className="text-xs font-bold text-ngo-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {sessions.length > 0 ? sessions.map(session => (
                  <div key={session.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{session.other_party_name}</h4>
                        <p className="text-xs text-slate-500">{new Date(session.scheduled_at).toLocaleString()} • {session.dialect}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {user.expert_tier === 1 && (
                        <button 
                          onClick={() => {
                            setSelectedSession(session);
                            setShowPrescriptionForm(true);
                          }}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Issue E-Prescription
                        </button>
                      )}
                      <a 
                        href={session.tele_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-ngo-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-ngo-primary/20 hover:scale-[1.05] transition-all"
                      >
                        Join Meet
                      </a>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white p-12 rounded-[2.5rem] text-center border border-slate-100">
                    <Video className="mx-auto text-slate-200 mb-4" size={32} />
                    <p className="text-sm text-slate-500">No sessions scheduled for today.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Dialect Bounties */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Languages size={24} className="text-blue-500" /> Dialect Bounties (AI-to-Human)
                </h2>
                <div className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-full">
                  {bounties.length} Tasks Available
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bounties.map(bounty => (
                  <div key={bounty.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Languages size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        +50 Credits
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{bounty.language} Validation</h4>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-2">Verify AI-translated clinical scale for {bounty.language} dialect.</p>
                    <button 
                      onClick={() => {
                        setActiveBounty(bounty);
                        setCorrectedText(bounty.ai_translated_text);
                      }}
                      className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      Start Task <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* RCI Compliance Dossier */}
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">RCI Compliance Dossier</h3>
              <p className="text-white/60 text-xs mb-8 leading-relaxed">
                Download your quarterly pro-bono impact dossier for statutory CRE requirements.
              </p>
              <button 
                onClick={() => alert("M3 Compliance: Generating RCI-aligned pro-bono impact dossier (PDF). Verifiable via M5 Ledger.")}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                <Download size={18} /> Download Verifiable PDF
              </button>
            </div>

            {/* Sneh-Ratna Gamification */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                <Award size={20} className="text-amber-500" /> Sneh-Ratna Rank
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Trophy size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-900">{user.sneh_ratna_badge} Rank</span>
                      <span className="text-[10px] font-bold text-slate-400">75% to Silver</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Social Credits</p>
                    <p className="text-xl font-serif font-bold text-slate-900">1,250</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Value</p>
                    <p className="text-xl font-serif font-bold text-slate-900">₹12.5k</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Library Shortcut */}
            <Link to="/clinical-library" className="block p-8 rounded-[2.5rem] bg-ngo-primary text-white shadow-xl shadow-ngo-primary/20 hover:scale-[1.02] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Clinical E-Library</h3>
              <p className="text-white/70 text-xs leading-relaxed">Access psychometric scales, de-escalation guides, and masterclasses.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Bounty Modal */}
      <AnimatePresence>
        {activeBounty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBounty(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Dialect Bounty: {activeBounty.language}</h3>
                    <p className="text-sm text-slate-500">Review and correct clinical nuances in the AI translation.</p>
                  </div>
                  <button onClick={() => setActiveBounty(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Original Text (English)</label>
                    <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 italic">
                      {activeBounty.original_text}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Translated Text ({activeBounty.language})</label>
                    <textarea 
                      className="w-full p-6 rounded-3xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium min-h-[150px]"
                      value={correctedText}
                      onChange={(e) => setCorrectedText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setActiveBounty(null)}
                    className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBountySubmit}
                    disabled={isSubmittingBounty}
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmittingBounty ? 'Submitting...' : (
                      <>
                        <CheckCircle2 size={20} /> Approve & Earn Credits
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E-Prescription Modal */}
      <AnimatePresence>
        {showPrescriptionForm && selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrescriptionForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Issue E-Prescription (Form 27)</h3>
                    <p className="text-sm text-slate-500">Patient: {selectedSession.other_party_name}</p>
                  </div>
                  <button onClick={() => setShowPrescriptionForm(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4 mb-8">
                  <AlertCircle className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1 uppercase tracking-widest">Liability Notice</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      All prescriptions will be watermarked: "Issued via SAMBAL Tele-Health. Manisha Mandir NGO is a technical facilitator and bears no liability for medical efficacy."
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-ngo-primary transition-colors cursor-pointer group">
                    <Plus className="mx-auto text-slate-400 mb-4 group-hover:text-ngo-primary transition-colors" size={32} />
                    <p className="text-sm text-slate-500 font-bold">Upload Signed Prescription PDF</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Strictly PDF Format Only</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setShowPrescriptionForm(false)}
                    className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={async () => {
                      // M5 Webhook: Log E-Prescription Issuance
                      try {
                        await fetch('/api/m5/webhook', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            form_id: 'M3_E_PRESCRIPTION_ISSUE',
                            payload: { sessionId: selectedSession.id, patientName: selectedSession.other_party_name, expertId: '1' },
                            secure_url: '/expert/dashboard'
                          })
                        });
                        setShowPrescriptionForm(false);
                        alert("E-Prescription issued and logged in M5 Ledger.");
                      } catch (err) {
                        console.error('M5 Prescription Log Failed:', err);
                      }
                    }}
                    className="flex-[2] py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldAlert size={20} /> Secure Issue & Log in M5
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
