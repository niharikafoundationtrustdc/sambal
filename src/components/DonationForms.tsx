import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  CreditCard, 
  IndianRupee, 
  AlertCircle, 
  CheckCircle2,
  HandHeart,
  Users,
  Building2,
  FileText,
  Zap
} from 'lucide-react';

// DPDP Consent Checkbox Component
const DPDPConsent = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <input 
      type="checkbox" 
      id="dpdp-consent"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 w-4 h-4 rounded border-slate-300 text-ngo-primary focus:ring-ngo-primary"
      required
    />
    <label htmlFor="dpdp-consent" className="text-[10px] text-slate-500 leading-relaxed">
      I explicitly consent to Manisha Mandir collecting and processing my data in accordance with the <strong>DPDP Act 2023</strong> for the purpose of social facilitation. I understand I have the right to request erasure of this data at any time.
    </label>
  </div>
);

// 1. General Donation Form (M7 Phase 1)
export const GeneralDonationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    pan: '',
    amount: '',
    purpose: 'General Fund',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return alert("Please provide DPDP consent.");
    
    setIsSubmitting(true);
    
    try {
      // M5 Webhook: Log General Donation
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M7_GENERAL_DONATION',
          payload: { ...formData, action: 'donation_initiate' },
          secure_url: '/donate'
        })
      });

      // Simulate Razorpay Metadata Routing
      console.log("Routing to Razorpay with Metadata: Module=M7_Donation", formData);
      
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Redirecting to Secure Razorpay Gateway (INR Only)...");
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error('Donation log failed:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3 mb-6">
        <AlertCircle className="text-rose-600 shrink-0 mt-1" size={20} />
        <p className="text-[10px] text-rose-700 leading-relaxed">
          <strong>FCRA Compliance:</strong> By Indian Law, we can only accept contributions from Indian Citizens holding an active Indian bank account. All international cards are blocked.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name (As per PAN)</label>
          <input 
            type="text" 
            required
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Indian Mobile Number</label>
          <input 
            type="tel" 
            pattern="[6-9][0-9]{9}"
            required
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Indian PAN Card (Sensitive)</label>
          <input 
            type="text" 
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
            placeholder="ABCDE1234F"
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all font-mono"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Donation Amount (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="number" 
              required
              min="100"
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Donation Purpose (Zoho Sync)</label>
          <select 
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          >
            <option value="General Fund">General Fund</option>
            <option value="Corpus Fund">Corpus Fund</option>
            <option value="Skill-Grant">Skill-Grant</option>
          </select>
        </div>
      </div>

      <DPDPConsent checked={formData.consent} onChange={(val) => setFormData({ ...formData, consent: val })} />

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Proceed to Payment <IndianRupee size={18} /></>
        )}
      </button>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          Instant 80G Tax Exemption Receipt will be emailed by Razorpay NGO Suite.
        </p>
      </div>
    </form>
  );
};

// 2. Adopt-a-Beneficiary Subscription Form (M7 Phase 2)
export const SponsorshipForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [tier, setTier] = useState<'education' | 'medical' | 'asha'>('education');
  const [consent, setConsent] = useState(false);

  const tiers = {
    education: { title: "Sponsor a Child's Education", amount: 2000, desc: "Monthly support for NIOS coaching and meals." },
    medical: { title: "Senior Citizen Medical Care", amount: 1500, desc: "Monthly health checkups and Bio-Well scans." },
    asha: { title: "Train an ASHA Worker", amount: 3500, desc: "One-time unit grant for professional certification." }
  };

  const handleSponsorship = async () => {
    if (!consent) return alert("Please provide DPDP consent.");
    
    try {
      // M5 Webhook: Log Sponsorship
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M7_SPONSORSHIP',
          payload: { tier, ...tiers[tier], action: 'sponsorship_initiate' },
          secure_url: '/donate'
        })
      });

      alert(`Activating Razorpay ${tier === 'asha' ? 'Payment Page' : 'Subscription'}...`);
      onSuccess?.();
    } catch (error) {
      console.error('Sponsorship log failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {(Object.keys(tiers) as Array<keyof typeof tiers>).map((key) => (
          <button
            key={key}
            onClick={() => setTier(key)}
            className={`p-6 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between ${tier === key ? 'border-ngo-primary bg-ngo-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div>
              <h4 className="font-bold text-slate-900">{tiers[key].title}</h4>
              <p className="text-xs text-slate-500">{tiers[key].desc}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-ngo-primary">₹{tiers[key].amount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                {key === 'asha' ? 'Unit Grant' : 'Per Month'}
              </div>
            </div>
          </button>
        ))}
      </div>

      <DPDPConsent checked={consent} onChange={setConsent} />

      <button 
        onClick={handleSponsorship}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
      >
        Activate Recurring Support <Zap size={18} className="text-amber-400" />
      </button>
    </div>
  );
};

// 3. Wish-Tree Support Form (M7 Phase 3)
export const WishTreeForm = ({ item, onSuccess }: { item: any, onSuccess?: () => void }) => {
  const [consent, setConsent] = useState(false);

  const handleFund = async () => {
    if (!consent) return alert("Please provide DPDP consent.");
    
    try {
      // M5 Webhook: Log Wish Fulfillment
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M7_WISH_FULFILLMENT',
          payload: { item_id: item.id, item_title: item.title, action: 'wish_fund' },
          secure_url: '/donate'
        })
      });

      alert("M5 Ledger Script: Updating item status to 'Funded'...");
      onSuccess?.();
    } catch (error) {
      console.error('Wish fulfillment log failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <HandHeart className="text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-900">Fulfilling: {item.title}</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">{item.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-emerald-200/50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Required Amount</span>
          <span className="text-2xl font-bold text-emerald-600">₹{item.cost || '1,200'}</span>
        </div>
      </div>

      <DPDPConsent checked={consent} onChange={setConsent} />

      <button 
        onClick={handleFund}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
      >
        Fund This Item Now
      </button>
    </div>
  );
};

// 4. Corporate Engagement Intake (M7 Phase 2)
export const CorporateIntakeForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return alert("Please provide DPDP consent.");

    try {
      // M5 Webhook: Log Corporate Inquiry
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M7_CORPORATE_INQUIRY',
          payload: { action: 'corporate_submit' },
          secure_url: '/donate'
        })
      });

      alert("Routing to M7_Corporate_Leads in M5 Ledger. Alerting Management Council...");
      onSuccess?.();
    } catch (error) {
      console.error('Corporate inquiry log failed:', error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
          <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Person</label>
          <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Engagement Type</label>
        <select className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary">
          <option>Employee Volunteering Day</option>
          <option>CSR Project Sponsorship</option>
          <option>Skill-Grant Partnership</option>
        </select>
      </div>
      <DPDPConsent checked={consent} onChange={setConsent} />
      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
        Submit Corporate Inquiry <Building2 size={18} />
      </button>
    </form>
  );
};

// 5. M3 Fast-Track Fee Form (M7 Phase 2)
export const FastTrackFeeForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [consent, setConsent] = useState(false);

  const handlePay = async () => {
    if (!consent) return alert("Please provide DPDP consent.");

    try {
      // M5 Webhook: Log Fast-Track Fee
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M3_FASTTRACK_FEE',
          payload: { action: 'fee_initiate' },
          secure_url: '/lms'
        })
      });

      alert("Routing to Razorpay: Module=M3_FastTrack");
      onSuccess?.();
    } catch (error) {
      console.error('Fast-track fee log failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-amber-600" size={24} />
          <h4 className="font-bold text-slate-900">Premium Certificate Fast-Track</h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          While education is free, independent professionals can pay a nominal fee for expedited hard-copy certificate processing.
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-amber-200/50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing Fee</span>
          <span className="text-2xl font-bold text-amber-600">₹499</span>
        </div>
      </div>
      <DPDPConsent checked={consent} onChange={setConsent} />
      <button 
        onClick={handlePay}
        className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-amber-700 transition-all"
      >
        Pay Fast-Track Fee
      </button>
    </div>
  );
};
