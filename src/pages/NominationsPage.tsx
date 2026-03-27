import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, User, Mail, Phone, MapPin, FileText, Send, CheckCircle2 } from 'lucide-react';

const NominationsPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      nominee_name: formData.get('nominee_name'),
      category: formData.get('category'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      reason: formData.get('reason')
    };

    try {
      // M5 Webhook: Log Nomination
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_NOMINATION',
          payload,
          secure_url: '/nominations'
        })
      }).catch(err => console.error('M5 Nomination Log Failed:', err));

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ngo-warm py-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Nomination Received</h2>
          <p className="text-slate-600 mb-8">
            Thank you for your nomination. Our selection committee will review the details and get back to you if further information is required.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-4 bg-ngo-primary text-white rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all shadow-lg"
          >
            Submit Another Nomination
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ngo-warm py-24">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-ngo-primary/10 text-ngo-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            Annual Awards 2024
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Nominate a Hero</h1>
          <p className="text-lg text-slate-600">
            Recognizing outstanding contributions to child welfare and social empowerment.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nominee Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text" 
                    name="nominee_name"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Award Category</label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    required
                    name="category"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="child_welfare">Child Welfare Excellence</option>
                    <option value="education">Education Pioneer</option>
                    <option value="social_impact">Social Impact Leader</option>
                    <option value="youth_icon">Youth Icon Award</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="email" 
                    name="email"
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    placeholder="+91 00000 00000"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Reason for Nomination</label>
              <div className="relative">
                <FileText className="absolute left-4 top-6 text-slate-400" size={18} />
                <textarea 
                  required
                  name="reason"
                  rows={6}
                  placeholder="Describe the nominee's contributions and impact..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all resize-none"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-ngo-primary text-white rounded-2xl font-bold shadow-xl shadow-ngo-primary/20 hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Send size={20} /> Submit Nomination</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NominationsPage;
