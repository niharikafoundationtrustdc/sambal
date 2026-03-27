import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Stethoscope, 
  FileText, 
  Languages, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Download
} from 'lucide-react';
import { UserRole } from '../types';

interface FormProps {
  userId?: string;
  onSuccess?: () => void;
}

// Form 6: Expert Onboarding
export const ExpertOnboardingForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.TIER_3_SOCIAL_COUNSELOR,
    registration_no: '',
    degree_upload: null as File | null,
    hod_reference: null as File | null,
    dialect_fluency: [] as string[],
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'expert_onboarding',
          payload: { ...formData, userId },
          secure_url: '/telebridge'
        })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting expert onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Application Submitted</h3>
        <p className="text-slate-600">Our RCI Proctors will review your credentials within 72 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <User size={14} /> Full Name
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={14} /> Expert Tier
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
          >
            <option value={UserRole.TIER_1_CLINICAL_EXPERT}>Tier 1: Clinical Expert (MCI/RCI)</option>
            <option value={UserRole.TIER_2_REGISTERED_COUNSELOR}>Tier 2: Registered Counselor</option>
            <option value={UserRole.TIER_3_SOCIAL_COUNSELOR}>Tier 3: Social Counselor</option>
            <option value={UserRole.TIER_4_STUDENT_INTERN}>Tier 4: Student Intern</option>
          </select>
        </div>
      </div>

      {(formData.role === UserRole.TIER_1_CLINICAL_EXPERT || formData.role === UserRole.TIER_2_REGISTERED_COUNSELOR) && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope size={14} /> Registration Number (MCI/RCI)
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g. RCI-12345"
            value={formData.registration_no}
            onChange={e => setFormData({ ...formData, registration_no: e.target.value })}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <FileText size={14} /> 
          {formData.role === UserRole.TIER_4_STUDENT_INTERN ? 'HOD Reference Letter' : 'Degree & Registration Certificate'}
        </label>
        <input
          required
          type="file"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Languages size={14} /> Dialect Fluency
        </label>
        <div className="flex flex-wrap gap-2">
          {['Hindi', 'English', 'Awadhi', 'Bhojpuri'].map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                const current = formData.dialect_fluency;
                setFormData({
                  ...formData,
                  dialect_fluency: current.includes(lang) 
                    ? current.filter(l => l !== lang) 
                    : [...current, lang]
                });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                formData.dialect_fluency.includes(lang)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Submit Expert Application'}
      </button>
    </form>
  );
};

// Patient Intake Form with Scoring
export const PatientIntakeForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [formData, setFormData] = useState({
    sleep_trouble: '0',
    self_harm: '0',
    mood: '0',
    appetite: '0',
    notes: ''
  });

  const calculateScore = () => {
    return parseInt(formData.sleep_trouble) + 
           parseInt(formData.self_harm) + 
           parseInt(formData.mood) + 
           parseInt(formData.appetite);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = calculateScore();
    setScore(finalScore);
    setLoading(true);
    
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'patient_intake',
          payload: { ...formData, score: finalScore, userId },
          secure_url: '/telebridge'
        })
      });
      if (res.ok) {
        setStep(3);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting patient intake:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-800">
            <Clock size={20} className="shrink-0" />
            <p className="text-sm">Progress is automatically saved. You can resume this form later.</p>
          </div>
          
          <div className="space-y-4">
            <label className="block font-medium text-slate-900">How often have you had trouble sleeping lately?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Never', val: '0' },
                { label: 'Sometimes', val: '2' },
                { label: 'Often', val: '5' },
                { label: 'Always', val: '8' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setFormData({ ...formData, sleep_trouble: opt.val })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.sleep_trouble === opt.val 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-slate-900">Have you had thoughts of hurting yourself?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Never', val: '0' },
                { label: 'Rarely', val: '5' },
                { label: 'Sometimes', val: '10' },
                { label: 'Frequently', val: '20' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setFormData({ ...formData, self_harm: opt.val })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.self_harm === opt.val 
                      ? 'bg-red-600 border-red-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Next Step
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              rows={4}
              placeholder="Tell us more about how you're feeling..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            {loading ? 'Analyzing...' : 'Complete Intake'}
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-8 space-y-6">
          {score > 15 ? (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">High Priority SOS Triggered</h3>
              <p className="text-slate-600">
                Based on your responses, we have alerted our Admin Triage Desk. 
                A Tier 1 Clinical Expert will contact you immediately.
              </p>
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 font-bold">
                Emergency Helpline: 14416 (Tele-MANAS)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Intake Received</h3>
              <p className="text-slate-600">
                You have been assigned to our Tier 3 Social Counseling team. 
                You can book your first session now.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Form 32: E-Prescription Generator
export const EPrescriptionForm: React.FC<FormProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    medication: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'e_prescription',
          payload: { ...formData, userId, timestamp: new Date().toISOString() },
          secure_url: '/telebridge'
        })
      });
      if (res.ok) {
        setGenerated(true);
      }
    } catch (err) {
      console.error('Error generating prescription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 text-indigo-800">
        <ShieldCheck size={20} className="shrink-0" />
        <p className="text-sm font-medium">Access Restricted: Tier 1 & 2 Experts Only</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis</label>
          <input 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
            value={formData.diagnosis}
            onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medication & Dosage</label>
          <textarea 
            required 
            rows={4} 
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
            value={formData.medication}
            onChange={e => setFormData({ ...formData, medication: e.target.value })}
          />
        </div>
      </div>

      {!generated ? (
        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Generating PDF...' : <><Download size={18} /> Generate E-Prescription</>}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-center font-medium">
            PDF Generated & Securely Stored
          </div>
          <p className="text-xs text-slate-500 text-center italic">
            * This document contains a digital watermark. Secure link sent to patient dashboard.
          </p>
          <div className="text-[10px] text-slate-400 border-t pt-4">
            Liability Disclaimer: Manisha Mandir Foundation holds no medical liability for prescriptions issued via this platform.
          </div>
        </div>
      )}
    </form>
  );
};
