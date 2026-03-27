import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HandHeart, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Upload,
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  AlertCircle,
  CreditCard,
  Building2,
  TreePine,
  MapPin,
  Send,
  Zap,
  Wifi
} from 'lucide-react';
import { cn } from '../lib/utils';
import FileUpload from './FileUpload';

interface Donation {
  id: number;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  receipt_url?: string;
}

interface CSRProposal {
  id: number;
  company_name: string;
  amount: number;
  project_focus: string;
  status: string;
  created_at: string;
}

interface CampusBooking {
  id: number;
  facility_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
}

interface WishTreePledge {
  id: number;
  item_name: string;
  quantity: number;
  status: string;
  created_at: string;
}

export default function ResourceMobilizationHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'engine' | 'blueprint'>('engine');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [proposals, setProposals] = useState<CSRProposal[]>([]);
  const [bookings, setBookings] = useState<CampusBooking[]>([]);
  const [pledges, setPledges] = useState<WishTreePledge[]>([]);
  const [proposalDocUrl, setProposalDocUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userId = 1; // Mock

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsRes, proposalsRes, bookingsRes, pledgesRes] = await Promise.all([
        fetch(`/api/m7/donations/${userId}`),
        fetch(`/api/m7/csr-proposals/${userId}`),
        fetch(`/api/m7/campus-bookings/${userId}`),
        fetch(`/api/m7/wish-tree-pledges/${userId}`)
      ]);

      setDonations(await donationsRes.json());
      setProposals(await proposalsRes.json());
      setBookings(await bookingsRes.json());
      setPledges(await pledgesRes.json());
    } catch (error) {
      console.error('Error fetching M7 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (amount: number, type: string) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/m7/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          type,
          razorpayId: 'pay_' + Math.random().toString(36).substring(7)
        })
      });
      if (res.ok) {
        setShowDonateModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Donation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const blueprintSteps = [
    {
      id: 1,
      title: "Forminator (Free)",
      stage: "INTAKE ENGINE",
      description: "The universal intake engine handling all micro-donations, CSR proposals, Wish-Tree pledges, and campus bookings. No extra plugins allowed to maintain speed for rural 3G users.",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Razorpay Gateway",
      stage: "PAYMENT PROCESSING",
      description: "Processes all payments. Must utilize native '80G Automate' to instantly generate and email tax receipts to donors.",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      id: 3,
      title: "Zoho Books API",
      stage: "AUTOMATED ACCOUNTING",
      description: "Catches Razorpay webhooks to automatically map incoming funds to correct accounting heads without manual entry.",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-600"
    },
    {
      id: 4,
      title: "Uncanny Automator / Webhooks",
      stage: "DATA ROUTING",
      description: "Routes Forminator data to the M5 Master Ledger and triggers automated emails to stakeholders.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 5,
      title: "Google Looker Studio",
      stage: "IMPACT VISUALIZATION",
      description: "Pulls sanitized data from M5 to display public Impact Dashboards and Trophy Boards for transparency.",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-rose-100 text-rose-600"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ngo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <HandHeart className="w-6 h-6" />
                      <span className="font-bold tracking-widest uppercase text-sm">Module M7: Integrated Resource Mobilization</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      <Wifi className="w-3 h-3" />
                      Optimized for Rural 3G
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Financial <span className="text-indigo-400 italic">Mobilization</span> Engine
              </h1>
              <p className="text-stone-400 text-lg leading-relaxed">
                A fully integrated engine interlocked with strict campus governance, automated accounting, and risk-free stakeholder gamification.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[280px]">
              <div className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">Total Funds Mobilized</div>
              <div className="text-5xl font-bold mb-2">₹12,45,000</div>
              <div className="text-stone-400 text-sm">Target: ₹50,00,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-stone-200 w-fit">
          <button 
            onClick={() => setActiveTab('engine')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'engine' ? "bg-stone-900 text-white shadow-md" : "text-stone-500 hover:bg-stone-50"
            )}
          >
            Mobilization Engine
          </button>
          <button 
            onClick={() => setActiveTab('blueprint')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'blueprint' ? "bg-stone-900 text-white shadow-md" : "text-stone-500 hover:bg-stone-50"
            )}
          >
            Financial Blueprint
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'engine' ? (
            <motion.div 
              key="engine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Actions & History */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <CreditCard size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Micro-Donations</h3>
                    <p className="text-stone-500 text-sm mb-6">Support our daily operations with a small contribution. Instant 80G receipt.</p>
                    <button 
                      onClick={() => navigate('/donate')}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                      Donate Now
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Building2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">CSR Proposals</h3>
                    <p className="text-stone-500 text-sm mb-6">Submit corporate social responsibility proposals for large-scale impact projects.</p>
                    <button 
                      onClick={() => setShowProposalModal(true)}
                      className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                    >
                      Submit Proposal
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <TreePine size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Wish-Tree Pledges</h3>
                    <p className="text-stone-500 text-sm mb-6">Pledge physical items (books, computers, food) needed at our campus.</p>
                    <button 
                      onClick={() => navigate('/wish-tree')}
                      className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
                    >
                      Pledge Items
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <MapPin size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Campus Bookings</h3>
                    <p className="text-stone-500 text-sm mb-6">Book our facilities for workshops, seminars, or community events.</p>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                      Book Facility
                    </button>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <h2 className="text-2xl font-bold text-stone-900 mb-8">Financial Audit Trail</h2>
                  <div className="space-y-4">
                    {donations.length === 0 ? (
                      <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <Clock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-500">No transactions found in the ledger.</p>
                      </div>
                    ) : (
                      donations.map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                              <CreditCard size={24} />
                            </div>
                            <div>
                              <div className="font-bold text-stone-900">₹{donation.amount}</div>
                              <div className="text-xs text-stone-500">{donation.type} • {new Date(donation.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              donation.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                            )}>
                              {donation.status}
                            </span>
                            {donation.receipt_url && (
                              <button className="p-2 bg-white rounded-xl border border-stone-200 text-stone-400 hover:text-indigo-600 transition-all">
                                <FileText size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Impact & Gamification */}
              <div className="space-y-8">
                {/* Impact Dashboard (Looker Studio Mock) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-200">
                  <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Impact Dashboard
                  </h2>
                  <div className="aspect-video bg-stone-100 rounded-3xl flex items-center justify-center border border-stone-200 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                    <div className="text-center p-6 relative z-10">
                      <Trophy className="w-12 h-12 text-stone-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Looker Studio Integration</p>
                      <p className="text-[10px] text-stone-400 mt-1 italic">Real-time financial transparency</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500">Beneficiaries Reached</span>
                      <span className="font-bold text-stone-900">12,450</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500">NGOs Supported</span>
                      <span className="font-bold text-stone-900">84</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[65%]"></div>
                    </div>
                  </div>
                </div>

                {/* Trophy Board (M10 Gamification) */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-lg shadow-indigo-200">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-300" />
                    Stakeholder Trophy Board
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-stone-900 font-bold">1</div>
                      <div>
                        <div className="text-sm font-bold">Reliance Industries</div>
                        <div className="text-[10px] text-indigo-200 uppercase tracking-widest">CSR Champion</div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-stone-300 rounded-xl flex items-center justify-center text-stone-900 font-bold">2</div>
                      <div>
                        <div className="text-sm font-bold">Tata Trusts</div>
                        <div className="text-[10px] text-indigo-200 uppercase tracking-widest">Strategic Partner</div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center text-stone-900 font-bold">3</div>
                      <div>
                        <div className="text-sm font-bold">HDFC Bank</div>
                        <div className="text-[10px] text-indigo-200 uppercase tracking-widest">Micro-Donation Leader</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="blueprint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-stone-200">
                <div className="max-w-3xl mb-12">
                  <h2 className="text-3xl font-bold text-stone-900 mb-4">SECTION 1: THE STRICT FINANCIAL PLUGIN STACK (ZERO-BLOAT)</h2>
                  <p className="text-stone-500 text-lg">
                    To maintain high speeds for rural 3G users, the developer is strictly prohibited from installing extra form or booking plugins (No Ninja Forms, No BookingPress).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blueprintSteps.map((step) => (
                    <div key={step.id} className="group p-8 rounded-[2rem] bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", step.color)}>
                          {step.icon}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 bg-stone-200/50 px-3 py-1 rounded-full">
                          Step 0{step.id}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">STAGE: {step.stage}</div>
                        <h3 className="text-xl font-bold text-stone-900">{step.title}</h3>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-stone-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h4 className="text-xl font-bold mb-2">Zero-Bloat Architecture</h4>
                    <p className="text-stone-400 text-sm">Every plugin in this stack is chosen for its ability to handle massive scale without compromising on rural accessibility.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all whitespace-nowrap">
                      Download API Specs
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonateModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Micro-Donation</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[500, 1000, 2500, 5000].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => handleDonate(amount, 'micro')}
                    className="py-4 border border-stone-200 rounded-2xl font-bold hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowDonateModal(false)}
                className="w-full py-3 text-stone-400 font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {showProposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProposalModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Submit CSR Proposal</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setSubmitting(true);
                try {
                  const res = await fetch('/api/m7/csr-proposals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId,
                      companyName: formData.get('companyName'),
                      amount: parseFloat(formData.get('amount') as string),
                      projectFocus: formData.get('projectFocus'),
                      documentUrl: proposalDocUrl
                    })
                  });
                  if (res.ok) {
                    setShowProposalModal(false);
                    fetchData();
                  }
                } catch (error) {
                  console.error('Proposal submission failed:', error);
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-4">
                <input name="companyName" placeholder="Company Name" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <input name="amount" type="number" placeholder="Proposed Amount (₹)" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <input name="projectFocus" placeholder="Project Focus (e.g. Education)" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <FileUpload 
                  label="Proposal Document (PDF)"
                  onUpload={(url) => setProposalDocUrl(url)}
                  accept=".pdf"
                  maxSize={15}
                />
                <button type="submit" disabled={submitting || !proposalDocUrl} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Campus Booking</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setSubmitting(true);
                try {
                  const res = await fetch('/api/m7/campus-bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId,
                      facilityName: formData.get('facilityName'),
                      bookingDate: formData.get('bookingDate'),
                      timeSlot: formData.get('timeSlot')
                    })
                  });
                  if (res.ok) {
                    setShowBookingModal(false);
                    fetchData();
                  }
                } catch (error) {
                  console.error('Booking failed:', error);
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-4">
                <select name="facilityName" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <option value="">Select Facility</option>
                  <option value="Main Auditorium">Main Auditorium</option>
                  <option value="Conference Room A">Conference Room A</option>
                  <option value="Outdoor Amphitheatre">Outdoor Amphitheatre</option>
                </select>
                <input name="bookingDate" type="date" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <select name="timeSlot" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <option value="">Select Time Slot</option>
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                </select>
                <button type="submit" disabled={submitting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showPledgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPledgeModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-stone-900 mb-6">Wish-Tree Pledge</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setSubmitting(true);
                try {
                  const res = await fetch('/api/m7/wish-tree-pledges', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId,
                      itemName: formData.get('itemName'),
                      quantity: parseInt(formData.get('quantity') as string)
                    })
                  });
                  if (res.ok) {
                    setShowPledgeModal(false);
                    fetchData();
                  }
                } catch (error) {
                  console.error('Pledge failed:', error);
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-4">
                <input name="itemName" placeholder="Item Name (e.g. Blankets)" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <input name="quantity" type="number" placeholder="Quantity" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl" />
                <button type="submit" disabled={submitting} className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold">
                  {submitting ? 'Pledging...' : 'Pledge Items'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
