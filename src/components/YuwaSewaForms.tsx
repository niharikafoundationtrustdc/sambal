import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle2,
  Users,
  Star,
  Zap,
  Video
} from 'lucide-react';

// DPDP Consent Checkbox Component (Reused from M7)
const DPDPConsent = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <input 
      type="checkbox" 
      id="dpdp-consent-m6"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 w-4 h-4 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
      required
    />
    <label htmlFor="dpdp-consent-m6" className="text-[10px] text-slate-500 leading-relaxed">
      I explicitly consent to Manisha Mandir collecting and processing my data (including Govt IDs) in accordance with the <strong>DPDP Act 2023</strong>. I understand this data is stored in a secure private vault for award verification only.
    </label>
  </div>
);

// 1. Yuwa Sewa Samman Application Form (M6 Phase 1)
export const YuwaApplicationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    consistencyMonths: '6',
    recommenderName: '',
    recommenderDesignation: '',
    recommenderPhone: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age);
    if (age < 18 || age > 45) return alert("Age must be between 18 and 45 years.");
    if (!formData.consent) return alert("Please provide DPDP consent.");
    
    alert("Application Submitted! Documents routed to /private/ vault. Status: Pending_Verification.");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <Award className="text-indigo-600 shrink-0 mt-1" size={20} />
        <p className="text-[10px] text-indigo-700 leading-relaxed">
          <strong>Eligibility:</strong> Age 18-45. Minimum 6 months of consistent social service proof required. Mandatory third-party recommendation letter must be uploaded.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
          <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Age (18-45)</label>
          <input type="number" required min="18" max="45" className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Proof of Service (PDF/JPG)</label>
          <div className="relative">
            <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="file" required className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-100 border-none text-xs file:hidden" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Government ID (Private Vault)</label>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="file" required className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-100 border-none text-xs file:hidden" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <UserCheck size={16} className="text-ngo-primary" />
          Recommending Authority (Mandatory)
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name (e.g. Gram Pradhan)" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 text-sm" value={formData.recommenderName} onChange={e => setFormData({...formData, recommenderName: e.target.value})} />
          <input type="text" placeholder="Designation" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 text-sm" value={formData.recommenderDesignation} onChange={e => setFormData({...formData, recommenderDesignation: e.target.value})} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Official Recommendation Letter (Signed)</label>
          <input type="file" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 text-xs file:hidden" />
        </div>
      </div>

      <DPDPConsent checked={formData.consent} onChange={val => setFormData({...formData, consent: val})} />

      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
        Submit Award Nomination
      </button>
    </form>
  );
};

// 2. VIP Jury Evaluation Form (M6 Phase 3)
export const JuryEvaluationForm = ({ applicantId, juryUin, onSuccess }: { applicantId: string, juryUin: string, onSuccess?: () => void }) => {
  const [scores, setScores] = useState({
    socialImpact: 5,
    innovation: 5,
    hardship: 5
  });

  const totalScore = scores.socialImpact + scores.innovation + scores.hardship;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`M5 Aggregation: Score ${totalScore}/30 logged for Applicant ${applicantId} by Jury ${juryUin}.`);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Evaluating Applicant</p>
          <p className="text-sm font-bold">{applicantId}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Jury UIN</p>
          <p className="text-sm font-bold">{juryUin}</p>
        </div>
      </div>

      <div className="space-y-6">
        {[
          { key: 'socialImpact', label: 'Social Impact (1-10)', desc: 'Tangible change in the community.' },
          { key: 'innovation', label: 'Innovation (1-10)', desc: 'Uniqueness of the solution/approach.' },
          { key: 'hardship', label: 'Hardship Overcome (1-10)', desc: 'Personal challenges faced by the youth.' }
        ].map((item) => (
          <div key={item.key}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">{item.label}</label>
              <span className="text-indigo-600 font-bold">{scores[item.key as keyof typeof scores]}</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">{item.desc}</p>
            <input 
              type="range" 
              min="1" 
              max="10" 
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={scores[item.key as keyof typeof scores]}
              onChange={e => setScores({...scores, [item.key]: parseInt(e.target.value)})}
            />
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 text-center">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Calculated Score</p>
        <div className="text-4xl font-bold text-indigo-600">{totalScore} <span className="text-lg text-indigo-300">/ 30</span></div>
      </div>

      <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
        Submit Score to M5 Ledger <Zap size={18} className="text-amber-400" />
      </button>
    </form>
  );
};

// 3. Video KYC Block (M6 Phase 4)
export const VideoKYCBlock = ({ applicant, onComplete }: { applicant: any, onComplete: (status: 'Verified' | 'Fraud') => void }) => {
  return (
    <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Video size={40} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Video KYC Verification</h3>
      <p className="text-sm text-slate-500 mb-8">
        Verify <strong>{applicant.name}</strong> over WhatsApp Video. Match their face with the uploaded Govt ID: <strong>{applicant.idType}</strong>.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => {
            alert("Fraud Detected: Applicant removed from ranking. Status updated in M5.");
            onComplete('Fraud');
          }}
          className="py-4 rounded-2xl border-2 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 transition-all"
        >
          Fraud Detected
        </button>
        <button 
          onClick={() => {
            alert("KYC Completed: Applicant cleared for final ranking.");
            onComplete('Verified');
          }}
          className="py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          KYC Verified
        </button>
      </div>
    </div>
  );
};
