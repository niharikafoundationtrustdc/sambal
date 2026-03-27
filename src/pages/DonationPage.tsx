import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HandHeart, 
  Clock, 
  Package, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  Heart,
  ShieldCheck,
  LayoutDashboard,
  Award,
  TrendingUp,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { getUTMParams } from '../lib/utm';

const DonationCard = ({ type, icon: Icon, title, description, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
      active 
      ? "bg-ngo-primary text-white border-ngo-primary shadow-xl shadow-ngo-primary/20 scale-[1.02]" 
      : "bg-white text-slate-800 border-slate-100 hover:border-ngo-primary/30"
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${active ? "bg-white/20" : "bg-ngo-primary/10 text-ngo-primary"}`}>
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-serif font-bold mb-2">{title}</h3>
    <p className={`text-sm leading-relaxed ${active ? "text-white/80" : "text-slate-500"}`}>{description}</p>
  </button>
);

export default function DonationPage() {
  const [type, setType] = useState('money');
  const [amount, setAmount] = useState('1000');
  const [step, setStep] = useState(1);
  const [feeCovered, setFeeCovered] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const impactEquivalencies: Record<string, string> = {
    '500': 'This provides a nutritious meal for 5 children!',
    '1000': "This funds an ASHA worker's digital data for 10 weeks!",
    '5000': 'This sponsors a child’s primary education for a full semester!',
  };

  const calculateImpact = (amt: string) => {
    const val = parseInt(amt);
    if (isNaN(val)) return '';
    if (val >= 5000) return impactEquivalencies['5000'];
    if (val >= 1000) return impactEquivalencies['1000'];
    if (val >= 500) return impactEquivalencies['500'];
    return 'Every contribution counts towards our mission.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const utms = getUTMParams();
    const payload = { 
      type, 
      amount: parseFloat(amount), 
      fee_covered: feeCovered,
      is_recurring: isRecurring,
      is_anonymous: isAnonymous,
      referral_code: referralCode,
      ...utms 
    };
    
    try {
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Donation
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M7_DONATION_FORM',
          payload,
          secure_url: '/donate'
        })
      }).catch(err => console.error('M5 Donation Log Failed:', err));

      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Thank You for Your Contribution!</h2>
          <p className="text-slate-600 mb-8">Your support helps us bridge the gap for thousands in need. A receipt has been sent to your email and synced with Zoho Books.</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
              Share on WhatsApp
            </button>
            <button className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-all">
              Share on Instagram
            </button>
          </div>

          <button 
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all"
          >
            Make Another Donation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Trust Anchor */}
      <div className="bg-ngo-primary/5 rounded-[3rem] p-12 mb-16 border border-ngo-primary/10 text-center">
        <div className="flex justify-center gap-8 mb-6">
          <img src="https://picsum.photos/seed/legacy/100/100" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" alt="Dr. Sarojini Agarwal" />
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-amber-500">
            <Award size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">The Legacy of Dr. Sarojini Agarwal</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Recipient of the National Child Welfare Award. Your trust is our heritage. 100% of your core donation goes directly to the cause.</p>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Sneh-Nidhi: Integrated Resource Mobilization</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Zero platform commission. Categorical transparency. Choose your stream of impact.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <DonationCard 
          type="money"
          icon={CreditCard}
          title="Financial Support"
          description="Directly fund our schemes, campus maintenance, and emergency relief funds."
          active={type === 'money'}
          onClick={() => { setType('money'); setStep(1); }}
        />
        <DonationCard 
          type="time"
          icon={Clock}
          title="Volunteer Time"
          description="Contribute your skills and time to our Lucknow campus or virtual projects."
          active={type === 'time'}
          onClick={() => { setType('time'); setStep(1); }}
        />
        <DonationCard 
          type="items"
          icon={Package}
          title="Donate Items"
          description="Provide clothes, books, or medical supplies for our community hubs."
          active={type === 'items'}
          onClick={() => { setType('items'); setStep(1); }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div 
          key={`${type}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-12 rounded-[3rem]"
        >
          <form onSubmit={handleSubmit}>
            {type === 'money' && (
              <div className="space-y-8">
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Amount (INR)</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['500', '1000', '5000'].map((val) => (
                          <button 
                            key={val}
                            type="button"
                            onClick={() => setAmount(val)}
                            className={`py-4 rounded-2xl font-bold border-2 transition-all ${amount === val ? "bg-ngo-primary text-white border-ngo-primary" : "bg-slate-50 border-transparent text-slate-600 hover:border-ngo-primary/30"}`}
                          >
                            ₹{val}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Custom Amount</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-12 pr-6 py-6 rounded-3xl bg-slate-50 border-none text-2xl font-bold text-slate-800 focus:ring-2 focus:ring-ngo-primary"
                        />
                      </div>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-blue-700 font-bold flex items-center gap-2">
                        <TrendingUp size={20} /> {calculateImpact(amount)}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-ngo-primary text-white py-6 rounded-3xl font-bold text-xl hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-3"
                    >
                      Next Step <ArrowRight />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={feeCovered}
                          onChange={(e) => setFeeCovered(e.target.checked)}
                          className="w-6 h-6 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
                        />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-ngo-primary transition-colors">
                          Add 2% to cover secure bank processing fees, ensuring 100% of my core donation goes directly to the cause.
                        </span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          className="w-6 h-6 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
                        />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-ngo-primary transition-colors">
                          Make this a Monthly Contribution (Sneh-Parivaar)
                        </span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-6 h-6 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
                        />
                        <span className="text-sm text-slate-700 font-medium group-hover:text-ngo-primary transition-colors">
                          Keep my donation Anonymous
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Referral Code (Sneh-Sarthi)</label>
                      <input 
                        type="text" 
                        placeholder="Enter code to credit your friend"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-slate-100 text-slate-600 py-6 rounded-3xl font-bold text-xl hover:bg-slate-200 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] bg-ngo-primary text-white py-6 rounded-3xl font-bold text-xl hover:bg-ngo-primary/90 transition-all shadow-xl shadow-ngo-primary/20 flex items-center justify-center gap-3"
                      >
                        Confirm ₹{feeCovered ? (parseFloat(amount) * 1.02).toFixed(2) : amount} <ArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'time' && (
              <div className="space-y-6">
                <p className="text-slate-600">You are pledging your time. Our team will contact you for onboarding into the Internship & Volunteer Hub.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold mb-2">Virtual</h4>
                    <p className="text-xs text-slate-500">Content creation, data entry, research.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold mb-2">On-Field</h4>
                    <p className="text-xs text-slate-500">Lucknow campus support, community visits.</p>
                  </div>
                </div>
              </div>
            )}

            {type === 'items' && (
              <div className="space-y-6">
                <p className="text-slate-600">Please list the items you wish to donate. We accept books, clothes, and medical equipment.</p>
                <textarea 
                  placeholder="Describe the items..."
                  className="w-full p-6 rounded-3xl bg-slate-50 border-none h-32 focus:ring-2 focus:ring-ngo-primary"
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full mt-12 bg-ngo-primary text-white py-6 rounded-3xl font-bold text-xl hover:bg-ngo-primary/90 transition-all shadow-xl shadow-ngo-primary/20 flex items-center justify-center gap-3"
            >
              Confirm {type === 'money' ? 'Payment' : 'Pledge'} <ArrowRight />
            </button>
          </form>
        </motion.div>
      </div>

      <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img src="https://picsum.photos/seed/impact/600/400" className="rounded-[3rem] shadow-2xl" referrerPolicy="no-referrer" />
          <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xs">
            <Heart className="text-rose-500 mb-4" fill="currentColor" />
            <p className="text-sm font-medium text-slate-800 italic">"Your donation directly supports our Lucknow Joy Room, providing a safe space for children to learn and play."</p>
          </div>
        </div>
        <div className="pl-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Transparency & Trust</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">80G Tax Benefits</h4>
                <p className="text-sm text-slate-500">All financial donations are eligible for tax deductions under Section 80G.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <LayoutDashboard />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Real-time Tracking</h4>
                <p className="text-sm text-slate-500">See exactly how your funds are being used through our M5 Intelligence Hub.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
