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
  Zap,
  Building2
} from 'lucide-react';
import { GeneralDonationForm, SponsorshipForm, CorporateIntakeForm } from '../components/DonationForms';

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
  const [type, setType] = useState<'money' | 'sponsor' | 'corporate'>('money');
  const [submitted, setSubmitted] = useState(false);

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
          
          <button 
            onClick={() => setSubmitted(false)}
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
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Sneh-Nidhi: Resource Mobilization</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Zero platform commission. Categorical transparency. Choose your stream of impact.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <DonationCard 
          type="money"
          icon={CreditCard}
          title="General Donation"
          description="Directly fund our schemes, campus maintenance, and emergency relief funds."
          active={type === 'money'}
          onClick={() => setType('money')}
        />
        <DonationCard 
          type="sponsor"
          icon={Zap}
          title="Adopt-a-Beneficiary"
          description="Monthly recurring support for a child's education or a senior's medical care."
          active={type === 'sponsor'}
          onClick={() => setType('sponsor')}
        />
        <DonationCard 
          type="corporate"
          icon={Building2}
          title="Corporate CSR"
          description="Engagement for companies, employee volunteering, and large-scale projects."
          active={type === 'corporate'}
          onClick={() => setType('corporate')}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div 
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl"
        >
          {type === 'money' && <GeneralDonationForm onSuccess={() => setSubmitted(true)} />}
          {type === 'sponsor' && <SponsorshipForm onSuccess={() => setSubmitted(true)} />}
          {type === 'corporate' && <CorporateIntakeForm onSuccess={() => setSubmitted(true)} />}
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
