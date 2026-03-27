import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Sparkles, GraduationCap, Building, ClipboardCheck, CheckCircle2, Link as LinkIcon } from 'lucide-react';

interface FormProps {
  userId?: number;
  onSuccess?: () => void;
}

export const VolunteerIntakeForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pincode: '',
    talents: '',
    manual_entry: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m11/volunteer-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting volunteer intake:', err);
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
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Registration Successful!</h3>
        <p className="text-slate-600">Thank you for joining the Sneh-Rakshak initiative. Our team will contact you soon.</p>
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
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Mail size={14} /> Email Address
          </label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Phone size={14} /> Phone Number
          </label>
          <input
            required
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} /> Pincode
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="226001"
            value={formData.pincode}
            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={14} /> Talents & Skills
        </label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          placeholder="E.g., Teaching, Counseling, Data Entry, Fieldwork..."
          value={formData.talents}
          onChange={e => setFormData({ ...formData, talents: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <input
          type="checkbox"
          id="manual_entry"
          className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          checked={formData.manual_entry}
          onChange={e => setFormData({ ...formData, manual_entry: e.target.checked })}
        />
        <label htmlFor="manual_entry" className="text-sm text-slate-600 font-medium cursor-pointer">
          This is a manual entry (staff logging offline registration)
        </label>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Register as Sneh-Rakshak'}
      </button>
    </form>
  );
};

export const InternshipIntakeForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    course: '',
    skills: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m11/internship-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting internship intake:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Application Received!</h3>
        <p className="text-slate-600">Your internship application has been submitted. We will review your profile and get back to you.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <User size={14} /> Full Name
        </label>
        <input
          required
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Jane Smith"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Building size={14} /> University / College
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Lucknow University"
            value={formData.university}
            onChange={e => setFormData({ ...formData, university: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={14} /> Course / Year
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="MSW / 2nd Year"
            value={formData.course}
            onChange={e => setFormData({ ...formData, course: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <ClipboardCheck size={14} /> Key Skills & Interests
        </label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="E.g., Research, Content Writing, Social Media, Event Management..."
          value={formData.skills}
          onChange={e => setFormData({ ...formData, skills: e.target.value })}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Apply for Internship'}
      </button>
    </form>
  );
};

export const WorkLogForm: React.FC<FormProps & { taskId?: number }> = ({ userId, taskId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    hours: 1,
    mood: 'Calm',
    proof_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m11/work-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId, taskId })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting work log:', err);
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
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Work Log Saved!</h3>
        <p className="text-slate-600">Your daily activity has been recorded. Keep up the great work!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <ClipboardCheck size={14} /> Hours Worked
          </label>
          <input
            required
            type="number"
            step="0.5"
            min="0.5"
            max="12"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={formData.hours}
            onChange={e => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} /> Current Mood
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={formData.mood}
            onChange={e => setFormData({ ...formData, mood: e.target.value })}
          >
            <option value="Calm">Calm / Focused</option>
            <option value="Fatigued">Fatigued / Tired</option>
            <option value="Severe Stress">Severe Stress / Burnout</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <LinkIcon size={14} /> Proof of Work URL (Photo/Doc)
        </label>
        <input
          required
          type="url"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          placeholder="https://..."
          value={formData.proof_url}
          onChange={e => setFormData({ ...formData, proof_url: e.target.value })}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Work Log'}
      </button>
    </form>
  );
};
