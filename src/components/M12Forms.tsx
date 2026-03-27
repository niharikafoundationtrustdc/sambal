import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Megaphone, FileText, Link as LinkIcon, CheckCircle2, User, Mail, Users, Building2 } from 'lucide-react';

interface FormProps {
  userId?: number;
  onSuccess?: () => void;
}

export const CampaignSubmissionForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'Video',
    asset_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m12/campaign-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting campaign content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Content Submitted!</h3>
        <p className="text-slate-600">Your content is in quarantine for review. Once approved, it will be published to the SAMBAL network.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Megaphone size={14} /> Campaign Title
        </label>
        <input
          required
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          placeholder="E.g., Mental Health Awareness 2026"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <FileText size={14} /> Content Type
        </label>
        <select
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          value={formData.content_type}
          onChange={e => setFormData({ ...formData, content_type: e.target.value })}
        >
          <option value="Video">Video / Reel</option>
          <option value="Infographic">Infographic / Poster</option>
          <option value="Article">Article / Blog</option>
          <option value="Audio">Audio / Podcast</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <LinkIcon size={14} /> Asset URL (Google Drive/YouTube/Cloud)
        </label>
        <input
          required
          type="url"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          placeholder="https://..."
          value={formData.asset_url}
          onChange={e => setFormData({ ...formData, asset_url: e.target.value })}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
};

export const EventRSVPForm: React.FC<FormProps & { eventId: number }> = ({ eventId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isGovtOrPress: false,
    attendees: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m12/event-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">RSVP Confirmed!</h3>
        <p className="text-slate-600">We've received your RSVP. You will receive an email with event details shortly.</p>
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Mail size={14} /> Email
          </label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <input
          type="checkbox"
          id="govtPress"
          className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
          checked={formData.isGovtOrPress}
          onChange={e => setFormData({ ...formData, isGovtOrPress: e.target.checked })}
        />
        <label htmlFor="govtPress" className="text-sm font-medium text-amber-900">
          I am representing a Government body or Press/Media
        </label>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Users size={14} /> Number of Attendees
        </label>
        <input
          required
          type="number"
          min="1"
          max="10"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
          value={formData.attendees}
          onChange={e => setFormData({ ...formData, attendees: parseInt(e.target.value) })}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Confirm RSVP'}
      </button>
    </form>
  );
};
