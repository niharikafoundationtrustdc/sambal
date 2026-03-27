import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Globe, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  AlertCircle,
  FileText,
  UserPlus,
  X,
  Database,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUTMParams } from '../lib/utm';
import FileUpload from '../components/FileUpload';

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-2xl font-serif font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const OpportunityCard = ({ title, type, location, points, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'Virtual' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
        {type === 'Virtual' ? <Globe size={24} /> : <MapPin size={24} />}
      </div>
      <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
        <Award size={12} /> {points} Points
      </div>
    </div>
    <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">{title}</h3>
    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
      <span>{type}</span>
      <span className="w-1 h-1 rounded-full bg-slate-200" />
      <span>{location}</span>
    </div>
    <button 
      onClick={() => alert(`Application for ${title} submitted! Status: Pending_Induction_Review.`)}
      className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-ngo-primary hover:text-white transition-all flex items-center justify-center gap-2"
    >
      Apply Now <ArrowRight size={16} />
    </button>
  </motion.div>
);

export default function ServicePage() {
  const [isM3Completed, setIsM3Completed] = useState(false);
  const [emergencyHide, setEmergencyHide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showDailyTrackerModal, setShowDailyTrackerModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showResearcherModal, setShowResearcherModal] = useState(false);

  // Form States
  const [grievanceData, setGrievanceData] = useState({ subject: '', description: '' });
  const [expertData, setExpertData] = useState({ expertUin: '', degreeUrl: '', dialects: '', tier: 'Tier 1' });
  const [dailyTrackerData, setDailyTrackerData] = useState({ taskName: '', hoursSpent: '', status: 'Completed', photoUrl: '' });
  const [campaignData, setCampaignData] = useState({ assetName: '', assetType: 'Image', assetUrl: '' });
  const [researcherData, setResearcherData] = useState({ researchTopic: '', institution: '', purpose: '' });

  useEffect(() => {
    const userId = 1; // Demo User ID
    
    const fetchData = async () => {
      try {
        const [settingsRes, m3Res] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch(`/api/users/${userId}/m3-status`)
        ]);
        
        const settings = await settingsRes.json();
        const m3Status = await m3Res.json();
        
        setEmergencyHide(settings.emergency_hide === 'true');
        setIsM3Completed(m3Status.m3_completed);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, ...grievanceData })
      });
      if (res.ok) {
        alert("Grievance submitted successfully. 15-day SLA active.");
        setShowGrievanceModal(false);
        setGrievanceData({ subject: '', description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const utms = getUTMParams();
    try {
      const res = await fetch('/api/expert-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, ...expertData, ...utms })
      });
      if (res.ok) {
        alert("Expert onboarding request submitted.");
        setShowExpertModal(false);
        setExpertData({ expertUin: '', degreeUrl: '', dialects: '', tier: 'Tier 1' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-ngo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (emergencyHide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-[3rem] border-rose-100"
        >
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">System Maintenance</h2>
          <p className="text-slate-600 mb-8">
            This dashboard is currently undergoing scheduled governance maintenance. Please check back later.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Return Home <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isM3Completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-[3rem]"
        >
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Dashboard Locked</h2>
          <p className="text-slate-600 mb-8">
            To ensure data ethics and mission alignment, the Internship Hub is locked until you complete the 
            <strong> M3 Induction Course</strong>.
          </p>
          <Link 
            to="/lms" 
            className="inline-flex items-center gap-2 bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all"
          >
            Go to LMS <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Internship & Volunteer Hub</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Join our mission to create social impact. We offer both field-based internships in Lucknow and virtual opportunities worldwide.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowGrievanceModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100"
          >
            <AlertCircle size={18} /> Grievance
          </button>
          <button 
            onClick={() => setShowExpertModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100"
          >
            <UserPlus size={18} /> Expert
          </button>
          <button 
            onClick={() => setShowDailyTrackerModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-all border border-amber-100"
          >
            <Clock size={18} /> Daily Track
          </button>
          <button 
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            <FileText size={18} /> Assets
          </button>
          <button 
            onClick={() => setShowResearcherModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <Database size={18} /> Researcher
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-24">
        <OpportunityCard 
          title="Community Health Researcher"
          type="Field"
          location="Lucknow Campus"
          points={500}
          delay={0.1}
        />
        <OpportunityCard 
          title="Digital Content Strategist"
          type="Virtual"
          location="Remote"
          points={300}
          delay={0.2}
        />
        <OpportunityCard 
          title="Govt Scheme Mapping Intern"
          type="Virtual"
          location="Remote"
          points={400}
          delay={0.3}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="glass-card p-12 rounded-[3rem]">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Intern Induction Path</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">M3 Induction Completion</h4>
                <p className="text-sm text-slate-500">Complete the mandatory 8-lesson induction course on our LMS.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-ngo-primary text-white flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Field/Virtual Track Selection</h4>
                <p className="text-sm text-slate-500">Choose your area of impact based on your skills and availability.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-400">Final Certification</h4>
                <p className="text-sm text-slate-400">Earn your internship certificate and referral points upon completion.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img src="https://picsum.photos/seed/volunteers/600/600" className="rounded-[3rem] shadow-2xl" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xs">
            <h4 className="text-2xl font-serif font-bold text-ngo-primary mb-2">Referral Earning</h4>
            <p className="text-sm text-slate-500">Invite others to join and earn points that can be redeemed for exclusive NGO merchandise or certificates.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showGrievanceModal} 
        onClose={() => setShowGrievanceModal(false)} 
        title="M5 Tab 3: Grievance Form"
      >
        <form onSubmit={handleGrievanceSubmit} className="space-y-6">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3 mb-6">
            <AlertCircle className="text-rose-600 shrink-0 mt-1" size={20} />
            <p className="text-xs text-rose-700 leading-relaxed">
              <strong>SLA Notice:</strong> All grievances are tracked with a mandatory 15-day response time. You will receive an update via email.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-rose-500 transition-all"
              placeholder="Brief summary of the issue"
              value={grievanceData.subject}
              onChange={(e) => setGrievanceData({...grievanceData, subject: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-rose-500 transition-all min-h-[150px]"
              placeholder="Detailed explanation..."
              value={grievanceData.description}
              onChange={(e) => setGrievanceData({...grievanceData, description: e.target.value})}
              required
            />
          </div>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Download Form
            </button>
            <button type="submit" className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
              Submit Grievance
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={showExpertModal} 
        onClose={() => setShowExpertModal(false)} 
        title="M5 Tab 2: Expert Onboarding (Form 6)"
      >
        <form onSubmit={handleExpertSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expert UIN</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="UIN-EXPERT-XXXX"
              value={expertData.expertUin}
              onChange={(e) => setExpertData({...expertData, expertUin: e.target.value})}
              required
            />
          </div>
          <FileUpload 
            label="Degree/Certification Upload (Form 6)"
            onUpload={(url) => setExpertData({...expertData, degreeUrl: url})}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tier</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={expertData.tier}
                onChange={(e) => setExpertData({...expertData, tier: e.target.value})}
              >
                <option value="Tier 1">Tier 1 (Specialist)</option>
                <option value="Tier 2">Tier 2 (Generalist)</option>
                <option value="Tier 3">Tier 3 (Counselor)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Dialects Known</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Hindi, Awadhi, Bhojpuri"
                value={expertData.dialects}
                onChange={(e) => setExpertData({...expertData, dialects: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Submit Onboarding Request
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={showDailyTrackerModal} 
        onClose={() => setShowDailyTrackerModal(false)} 
        title="M5 Tab 4: Daily Tracking"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch('/api/daily-tracker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, ...dailyTrackerData })
          });
          if (res.ok) {
            alert("Daily progress tracked.");
            setShowDailyTrackerModal(false);
          }
        }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Task Name</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-amber-500 transition-all"
              value={dailyTrackerData.taskName}
              onChange={(e) => setDailyTrackerData({...dailyTrackerData, taskName: e.target.value})}
              required
            />
          </div>
          <FileUpload 
            label="Activity Proof (Photo/Document)"
            onUpload={(url) => setDailyTrackerData({...dailyTrackerData, photoUrl: url})}
          />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hours Spent</label>
              <input 
                type="number" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-amber-500 transition-all"
                value={dailyTrackerData.hoursSpent}
                onChange={(e) => setDailyTrackerData({...dailyTrackerData, hoursSpent: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-amber-500 transition-all"
                value={dailyTrackerData.status}
                onChange={(e) => setDailyTrackerData({...dailyTrackerData, status: e.target.value})}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-100">
            Log Progress
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={showCampaignModal} 
        onClose={() => setShowCampaignModal(false)} 
        title="M5 Tab 5: Campaign Asset Management"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch('/api/campaign-assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, ...campaignData })
          });
          if (res.ok) {
            alert("Campaign asset logged.");
            setShowCampaignModal(false);
          }
        }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asset Name</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={campaignData.assetName}
              onChange={(e) => setCampaignData({...campaignData, assetName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asset Type</label>
            <select 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={campaignData.assetType}
              onChange={(e) => setCampaignData({...campaignData, assetType: e.target.value})}
            >
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
            </select>
          </div>
          <FileUpload 
            label="Upload Campaign Asset"
            onUpload={(url) => setCampaignData({...campaignData, assetUrl: url})}
          />
          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            Save Asset
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={showResearcherModal} 
        onClose={() => setShowResearcherModal(false)} 
        title="M5 Tab 6: Researcher Intake"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          const utms = getUTMParams();
          const res = await fetch('/api/researcher-intake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, ...researcherData, ...utms })
          });
          if (res.ok) {
            alert("Researcher intake request submitted.");
            setShowResearcherModal(false);
          }
        }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Research Topic</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={researcherData.researchTopic}
              onChange={(e) => setResearcherData({...researcherData, researchTopic: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Institution</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={researcherData.institution}
              onChange={(e) => setResearcherData({...researcherData, institution: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Purpose of Research</label>
            <textarea 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
              value={researcherData.purpose}
              onChange={(e) => setResearcherData({...researcherData, purpose: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Submit Intake Request
          </button>
        </form>
      </Modal>
    </div>
  );
}
