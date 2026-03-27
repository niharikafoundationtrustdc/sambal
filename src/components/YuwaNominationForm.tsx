import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, FileText, Send, ShieldCheck } from 'lucide-react';

export default function YuwaNominationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    category: 'Social Impact',
    achievement: '',
    evidence_url: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // M5 Webhook: Log Nomination
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M6_YUWA_NOMINATION',
          payload: { ...formData, action: 'nomination_submit' },
          secure_url: '/recognition'
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Nomination failed:', error);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-[3.5rem] shadow-xl text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-3xl font-serif font-bold mb-4">Nomination Received!</h3>
        <p className="text-slate-600 mb-8">Thank you for nominating a young leader. Our VIP Jury will review the submission soon.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-ngo-primary text-white px-8 py-3 rounded-2xl font-bold"
        >
          Nominate Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
      <h3 className="text-3xl font-serif font-bold text-slate-900 mb-8">Yuwa Sewa Samman Nomination</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Candidate Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="tel"
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
            <select 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Social Impact</option>
              <option>Innovation & Tech</option>
              <option>Art & Culture</option>
              <option>Sports Excellence</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Achievement Summary</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea 
              required
              rows={4}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
              value={formData.achievement}
              onChange={e => setFormData({...formData, achievement: e.target.value})}
              placeholder="Describe the candidate's impact..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Evidence URL (Drive/Video)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="url"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
              value={formData.evidence_url}
              onChange={e => setFormData({...formData, evidence_url: e.target.value})}
              placeholder="https://..."
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-ngo-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-ngo-primary/90 transition-all"
        >
          <Send size={18} /> Submit Nomination
        </button>
      </form>
    </div>
  );
}
