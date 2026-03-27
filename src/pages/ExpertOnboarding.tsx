import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  UserCheck,
  Languages,
  Stethoscope,
  GraduationCap,
  Users,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

const TIERS = [
  { 
    id: 1, 
    title: 'Tier 1: Clinical Expert', 
    icon: Stethoscope, 
    desc: 'Psychiatrists & Clinical Psychologists (MCI/RCI Registered)',
    permissions: ['Diagnosis', 'E-Prescriptions', 'Therapy']
  },
  { 
    id: 2, 
    title: 'Tier 2: Registered Counselor', 
    icon: GraduationCap, 
    desc: 'Post-Graduate degree in Psychology/Counseling',
    permissions: ['Tele-Therapy', 'Support']
  },
  { 
    id: 3, 
    title: 'Tier 3: Social Counselor', 
    icon: Users, 
    desc: 'UG/PG degree in Social Work or related fields',
    permissions: ['Tele-Support', 'ASHA Guidance']
  },
  { 
    id: 4, 
    title: 'Tier 4: Student Intern', 
    icon: Heart, 
    desc: 'Final year students in Psychology/Social Work',
    permissions: ['Guided Listening', 'Triage Support']
  }
];

const DIALECTS = ['Awadhi', 'Bhojpuri', 'Bundeli', 'Kannauji', 'Braj', 'Hindi', 'English'];

export default function ExpertOnboarding() {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    degreeUrl: '',
    hodReferenceUrl: '',
    dialects: [] as string[],
    mciRciNumber: '',
    digitalReadiness: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDialectToggle = (dialect: string) => {
    setFormData(prev => ({
      ...prev,
      dialects: prev.dialects.includes(dialect) 
        ? prev.dialects.filter(d => d !== dialect)
        : [...prev.dialects, dialect]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      userId: 1, // Mocked
      tier: selectedTier,
      ...formData,
      dialectFluency: formData.dialects
    };

    try {
      const res = await fetch('/api/experts/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // M5 Webhook: Log Expert Application
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M9_EXPERT_APPLICATION',
            payload,
            secure_url: '/expert/onboarding'
          })
        }).catch(err => console.error('M5 Expert Log Failed:', err));

        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200 max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Application Received</h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Your credentials have been sent to the M8 Impact Control Tower for proctor verification. 
            You will be notified once your tier is unlocked.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ngo-primary/10 text-ngo-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> M9 Expert Panel Onboarding
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Join the SAMBAL Expert Network</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Help us bridge the mental health gap in rural India. Select your academic tier to begin the vetting process.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-500",
                step >= i ? "bg-ngo-primary" : "bg-slate-200"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTier(tier.id);
                    setStep(2);
                  }}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 text-left transition-all group",
                    selectedTier === tier.id 
                      ? "bg-ngo-primary border-ngo-primary text-white shadow-xl shadow-ngo-primary/20" 
                      : "bg-white border-slate-100 hover:border-ngo-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    selectedTier === tier.id ? "bg-white/20" : "bg-slate-50 text-ngo-primary group-hover:bg-ngo-primary/10"
                  )}>
                    <tier.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tier.title}</h3>
                  <p className={cn(
                    "text-sm mb-6 leading-relaxed",
                    selectedTier === tier.id ? "text-white/80" : "text-slate-500"
                  )}>
                    {tier.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tier.permissions.map((p, i) => (
                      <span key={i} className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                        selectedTier === tier.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      )}>
                        {p}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
            >
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Verification Details</h2>
              
              <div className="space-y-8">
                {selectedTier && selectedTier <= 3 ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">Degree Certificate Upload</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-ngo-primary transition-colors cursor-pointer group">
                      <Upload className="mx-auto text-slate-400 mb-4 group-hover:text-ngo-primary transition-colors" size={32} />
                      <p className="text-sm text-slate-500">Click to upload your highest degree (PDF/JPG)</p>
                    </div>
                    {selectedTier === 1 && (
                      <div className="mt-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">MCI / RCI Registration Number</label>
                        <input 
                          type="text" 
                          placeholder="Enter Registration ID"
                          className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ngo-primary transition-all"
                          value={formData.mciRciNumber}
                          onChange={(e) => setFormData({...formData, mciRciNumber: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">HOD Reference Form</label>
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 mb-6">
                      <AlertCircle className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        As a Tier 4 Intern, you must upload a signed reference form from your Head of Department. 
                        <a href="#" className="underline ml-1 font-bold">Download Template</a>
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-ngo-primary transition-colors cursor-pointer group">
                      <Upload className="mx-auto text-slate-400 mb-4 group-hover:text-ngo-primary transition-colors" size={32} />
                      <p className="text-sm text-slate-500">Upload Signed HOD Reference (PDF)</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Dialect Fluency (Select all that apply)</label>
                  <div className="flex flex-wrap gap-3">
                    {DIALECTS.map((dialect) => (
                      <button
                        key={dialect}
                        onClick={() => handleDialectToggle(dialect)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                          formData.dialects.includes(dialect)
                            ? "bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {dialect}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-2xl">
                  <input 
                    type="checkbox" 
                    id="readiness"
                    className="w-5 h-5 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
                    checked={formData.digitalReadiness}
                    onChange={(e) => setFormData({...formData, digitalReadiness: e.target.checked})}
                  />
                  <label htmlFor="readiness" className="text-sm text-slate-600">
                    I declare that I am ready for rural tele-health sessions and have a stable internet connection.
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={formData.dialects.length === 0 || !formData.digitalReadiness}
                  className="flex-[2] py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Continue to Ethics Oath
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
            >
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <FileText size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">The "Scope of Practice" Oath</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  To ensure DPDP Act 2023 compliance and patient safety, all experts must sign the ethics oath. 
                  This document legally binds you to your assigned tier's permissions.
                </p>

                <div className="bg-slate-50 p-8 rounded-3xl text-left mb-10 h-64 overflow-y-auto border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 underline">Legal Declaration & Ethics Oath</h4>
                  <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    <p>1. I understand that Manisha Mandir NGO acts strictly as a technical facilitator and I bear full professional liability for my clinical advice.</p>
                    <p>2. I will strictly adhere to the DPDP Act 2023 regarding patient data privacy and confidentiality.</p>
                    <p>3. I will never issue an E-Prescription unless I am a verified Tier 1 Clinical Expert.</p>
                    <p>4. I will immediately escalate any crisis (suicidal intent/psychosis) using the Red Alert protocol.</p>
                    <p>5. I understand that my pro-bono hours will be logged in the M5 Master Ledger for regulatory reporting.</p>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-5 bg-ngo-primary text-white rounded-2xl font-bold shadow-xl shadow-ngo-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      <UserCheck size={20} /> Sign Oath & Submit Application
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
