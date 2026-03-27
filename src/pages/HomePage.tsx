import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  HeartPulse, 
  Users, 
  HandHeart, 
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Utensils,
  Sparkles,
  Zap,
  Calendar,
  Building2,
  Stethoscope,
  Smile,
  Activity,
  Youtube,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Play,
  Layout,
  Gavel,
  Award,
  Coins,
  Coffee,
  Globe,
  Database,
  ArrowUpRight,
  TreePine,
  AlertCircle,
  CheckCircle2,
  X,
  Trash2,
  Lock,
  ClipboardCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-2xl font-serif font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Door = ({ to, icon: Icon, title, subtitle, category, intent, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group h-full"
  >
    <Link to={to} className="block h-full">
      <div className={`h-full min-h-[40vh] md:min-h-[420px] p-10 md:p-8 rounded-[3rem] transition-all duration-500 border border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative active:scale-[0.98] md:active:scale-100`}>
        <div className={`absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${color}`} />
        
        <div className="relative z-10">
          <div className={`w-16 h-16 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-8 md:mb-6 transition-colors duration-300 ${color} text-white shadow-lg`}>
            <Icon size={32} className="md:w-7 md:h-7" />
          </div>
          <div className="mb-6 md:mb-4">
            <h3 className="text-3xl md:text-2xl font-serif font-bold text-slate-800 mb-2 md:mb-1">{title}</h3>
            <p className="text-ngo-primary text-xs md:text-[10px] font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
          
          <div className="space-y-6 md:space-y-4">
            <div>
              <span className="text-xs md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 md:mb-1">Target Category</span>
              <p className="text-sm md:text-xs text-slate-600 font-medium leading-relaxed">{category}</p>
            </div>
            <div>
              <span className="text-xs md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 md:mb-1">Primary Intent</span>
              <p className="text-sm md:text-xs text-slate-500 leading-relaxed italic">{intent}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-8 pt-8 md:pt-6 border-t border-slate-50 flex items-center justify-between text-ngo-primary font-bold text-sm md:text-xs group-hover:gap-6 md:group-hover:gap-4 transition-all relative z-10">
          <span className="uppercase tracking-widest">Enter Dashboard</span>
          <ArrowRight size={20} className="md:w-4 md:h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [impactStats, setImpactStats] = useState({
    referrals: 12450,
    ngos: 450,
    students: 2100,
    meals: 5800
  });

  const [wishItems, setWishItems] = useState<any[]>([]);
  const [isFulfilling, setIsFulfilling] = useState<number | null>(null);
  const [emergencyHide, setEmergencyHide] = useState(false);
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureEmail, setErasureEmail] = useState('');

  useEffect(() => {
    fetch('/api/stats/impact')
      .then(res => res.json())
      .then(data => setImpactStats(data))
      .catch(err => console.error('Error fetching impact stats:', err));

    fetch('/api/wish-items')
      .then(res => res.json())
      .then(data => setWishItems(data))
      .catch(err => console.error('Error fetching wish items:', err));

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setEmergencyHide(data.emergency_hide === 'true'))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleFulfill = async (itemId: number) => {
    setIsFulfilling(itemId);
    try {
      const res = await fetch(`/api/wish-items/${itemId}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }) // Demo user ID
      });
      if (res.ok) {
        setWishItems(prev => prev.filter(item => item.id !== itemId));
        alert("Thank you! This item is now marked as 'Pending' in our database. Our team will contact you for fulfillment details.");
      }
    } catch (err) {
      console.error('Error fulfilling wish item:', err);
    } finally {
      setIsFulfilling(null);
    }
  };

  const handleResearcherPayment = () => {
    if (process.env.USER_ROLE === 'RESEARCHER') {
      navigate('/service');
      return;
    }

    const options = {
      key: "rzp_test_dummy", // Replace with real key in production
      amount: 50000, // Amount in paise (INR 500)
      currency: "INR",
      name: "SAMBAL Heritage Project",
      description: "Researcher Data Access Fee",
      image: "https://picsum.photos/seed/sambal-logo/200/200",
      handler: async function (response: any) {
        // Handle successful payment
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1, // Demo user ID
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          })
        });
        if (res.ok) {
          alert("Payment Successful! Your role has been upgraded to Researcher. Please refresh to see changes.");
          window.location.reload();
        }
      },
      prefill: {
        name: "Demo User",
        email: "demo@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#10b981"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section: The Facilitation Pivot */}
      <section className="mb-16 relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-xl">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Content Side */}
          <div className="p-12 md:p-20 flex flex-col justify-center relative z-10 bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block w-fit px-4 py-1 rounded-full bg-ngo-primary/10 text-ngo-primary text-xs font-bold uppercase tracking-widest mb-8"
            >
              The Digital Bridge
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl xl:text-6xl font-serif font-bold text-slate-900 mb-8 leading-[1.1]"
            >
              Bridging Compassion <br />
              <span className="text-ngo-primary italic">with National Technology.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 max-w-xl leading-relaxed mb-10"
            >
              From a local orphanage in 1984 to a national facilitation hub. 
              We empower families through verified NGO connections and expert proctoring.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/donate" className="bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all flex items-center gap-2">
                Sponsor a Smile (M7) <Smile size={20} />
              </Link>
              <button 
                onClick={handleResearcherPayment}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Access Research Data (M11) <Database size={20} />
              </button>
            </motion.div>
          </div>

          {/* Visual Side: Split Screen Strategy */}
          <div className="relative h-full min-h-[400px] lg:min-h-full flex">
            {/* Left: Heritage */}
            <div className="w-1/2 h-full relative overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/heritage-founder/600/1000" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Heritage: Dr. Agarwal with children"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ngo-primary/20 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-ngo-primary">
                  Heritage: 1984
                </span>
              </div>
            </div>
            {/* Right: Modern */}
            <div className="w-1/2 h-full relative overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/modern-asha/600/1000" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                alt="Modern: ASHA worker using SAMBAL portal"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-ngo-primary/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-right">
                <span className="bg-ngo-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  Modern: Digital Pivot
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructional "Bridge" Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center px-4"
      >
        <p className="text-xl md:text-2xl font-serif text-slate-700 leading-relaxed max-w-4xl mx-auto">
          "अपनी भूमिका चुनें और लखनऊ केंद्र से राष्ट्रव्यापी सहायता तक अपनी यात्रा शुरू करें।"
        </p>
        <p className="text-sm text-slate-500 mt-2 italic">
          (Choose your role and begin your journey from the Lucknow Center to nationwide support)
        </p>
      </motion.div>

      {/* The "5 Doors" Master Switchboard */}
      <section id="switchboard" className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Master Switchboard</h2>
            <p className="text-slate-500">
              {process.env.USER_ROLE 
                ? "Welcome back! Your personalized dashboard is ready for you." 
                : "Select your entry point to access specialized dashboards and tools tailored to your role in our ecosystem."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-ngo-primary uppercase tracking-widest bg-ngo-primary/5 px-4 py-2 rounded-full border border-ngo-primary/10">
            <span className="w-2 h-2 rounded-full bg-ngo-primary animate-pulse" />
            {process.env.USER_ROLE ? "Personalized Session Active" : "SSO Role Matrix Active"}
          </div>
        </div>

        {process.env.USER_ROLE ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-ngo-primary text-white flex items-center justify-center shadow-2xl">
                <Layout size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">My Personalized Hub</h3>
                <p className="text-slate-500 max-w-md">
                  Access your specialized tools for {process.env.USER_ROLE === 'STUDENT' ? 'Learning (M3)' : process.env.USER_ROLE === 'EXPERT' ? 'Consultations (M9)' : process.env.USER_ROLE === 'INTERN' ? 'Service Logging (M11)' : 'Referrals (M2)'}.
                </p>
              </div>
            </div>
            <Link 
              to={
                process.env.USER_ROLE === 'STUDENT' ? '/lms' : 
                process.env.USER_ROLE === 'EXPERT' ? '/expert-panel' : 
                process.env.USER_ROLE === 'INTERN' ? '/service' : 
                '/search'
              }
              className="bg-ngo-primary text-white px-10 py-5 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all flex items-center gap-3 text-lg"
            >
              Go to Dashboard <ArrowRight size={24} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <Door 
              to="/search" 
              icon={Search} 
              title="Help Hub" 
              subtitle="सहायता केंद्र"
              category="Vatsalya, Saathi, Seniors, ASHA Workers"
              intent="Finding schemes (M2) or requesting physical help."
              color="bg-blue-600"
              delay={0.1}
            />
            <Door 
              to="/lms" 
              icon={BookOpen} 
              title="LMS" 
              subtitle="शिक्षा केंद्र"
              category="Underprivileged Students, NIOS Learners"
              intent="Accessing free coaching, SLM, and personality dev (M3)."
              color="bg-emerald-600"
              delay={0.2}
            />
            
            {/* Dynamic Door 3: Wellness / Expert Panel */}
            <Door 
              to={process.env.USER_ROLE === 'EXPERT' ? '/expert-panel' : '/wellness'} 
              icon={HeartPulse} 
              title={process.env.USER_ROLE === 'EXPERT' ? 'Expert Panel' : 'Wellness'} 
              subtitle={process.env.USER_ROLE === 'EXPERT' ? 'विशेषज्ञ पैनल' : 'स्वास्थ्य एवं वेलनेस'}
              category={process.env.USER_ROLE === 'EXPERT' ? 'M9 Experts, Doctors, Counselors' : 'Seniors, Mental Health Seekers'}
              intent={process.env.USER_ROLE === 'EXPERT' ? 'Managing consultations and Bio-Well reports.' : 'Booking Bio-Well scans (M10) or Tier 1-2 consults (M9).'}
              color="bg-rose-600"
              delay={0.3}
            />

            {!emergencyHide && (
              <Door 
                to="/service" 
                icon={Users} 
                title="Service" 
                subtitle="सेवा एवं रिसर्च"
                category="Engineering/Social Science Interns, Scholars"
                intent="Logging 'Sewa' hours (M11) or accessing policy data (M5)."
                color="bg-amber-600"
                delay={0.4}
              />
            )}
            <Door 
              to="/donate" 
              icon={HandHeart} 
              title="Support" 
              subtitle="योगदान"
              category="Individual Donors, CSR Partners"
              intent="Fulfilling 'Wish-Tree' items or sponsoring meals (M7)."
              color="bg-indigo-600"
              delay={0.5}
            />
            <Door 
              to="/forms/1" 
              icon={ClipboardCheck} 
              title="Registration" 
              subtitle="पंजीकरण केंद्र"
              category="Beneficiaries, Students, Volunteers"
              intent="Direct application for SAMBAL services and student enrollment (Form 1-28)."
              color="bg-purple-600"
              delay={0.6}
            />
          </div>
        )}
      </section>

      {/* Registration Hub Quick Links */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Direct Application Hub</h2>
            <p className="text-slate-500">Official SAMBAL National Nodal Hub Registration Forms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: '1', title: 'Master Beneficiary & Student', icon: GraduationCap, desc: 'Primary registration for all SAMBAL support services.' },
            { id: '2', title: 'Volunteer Induction', icon: Users, desc: 'Join our national network of verified volunteers.' },
            { id: '6', title: 'Expert Proctoring Application', icon: ShieldCheck, desc: 'For professionals wishing to join the M9 Expert Panel.' },
            { id: '21', title: 'Institutional Partnership', icon: Building2, desc: 'NGOs and Schools seeking nodal affiliation.' },
          ].map((form, i) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <form.icon size={80} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{form.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{form.desc}</p>
              <Link 
                to={`/forms/${form.id}`}
                className="inline-flex items-center gap-2 text-ngo-primary font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all"
              >
                Open Form {form.id} <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Digital Wish-Tree (M7) - Urgent Needs */}
      <section className="mb-24 py-20 bg-emerald-50 rounded-[4rem] px-8 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                <TreePine size={14} /> M7 Digital Wish-Tree
              </div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Urgent Needs: Sponsor a Smile</h2>
              <p className="text-slate-600">Directly fulfill the immediate requirements of our children and seniors. Your contribution goes 100% towards the selected item.</p>
            </div>
            <Link to="/donate" className="text-ngo-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Wishes <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${item.urgency === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.urgency}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{item.description}</p>
                </div>
                
                <button
                  onClick={() => handleFulfill(item.id)}
                  disabled={isFulfilling === item.id}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isFulfilling === item.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Fulfill Wish <HandHeart size={16} /></>
                  )}
                </button>
              </motion.div>
            ))}
            
            {wishItems.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white/50 rounded-[2.5rem] border border-dashed border-emerald-200">
                <p className="text-slate-500 italic">All urgent wishes are currently being fulfilled. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Self-Sustaining Model: Lucknow B2C Services */}
      <section className="mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-6">
              Self-Sustaining Model
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Lucknow Campus: <br />B2C Resource Hub</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              To ensure the longevity of our free national services, the Lucknow campus operates as a revenue-generating resource hub for the local community.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <HeartPulse size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Bio-Well Wellness Scans</h4>
                <p className="text-xs text-slate-500 mb-4">Advanced energy field analysis and stress reporting for individuals.</p>
                <Link to="/wellness" className="text-ngo-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Book Scan <ArrowRight size={14} />
                </Link>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Resource Rentals</h4>
                <p className="text-xs text-slate-500 mb-4">Premium hall rentals and Joy Room access for community events.</p>
                <Link to="/lucknow-center" className="text-ngo-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Rent Space <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/lucknow-hub/800/800" 
                alt="Lucknow Center B2C Hub"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="text-amber-400" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Revenue for Impact</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                100% of B2C proceeds are funneled directly into the NIOS free coaching and national referral hub operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Governance & Awards Integration */}
      <section className="mb-24 py-20 bg-slate-50 rounded-[4rem] px-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-ngo-primary/10 text-ngo-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            Institutional Credibility
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Strategic Governance & Awards</h2>
          <p className="text-slate-600">Our operations are overseen by a distinguished Management Council, ensuring the highest standards of ethics and social impact.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Gavel size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Management Council</h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Dr. Sarojini Agarwal", role: "Founder & Chairperson" },
                { name: "Justice (Retd.) R.K. Singh", role: "Legal Oversight" },
                { name: "Mrs. Manisha Agarwal", role: "Executive Director" },
                { name: "Dr. Alok Misra", role: "Strategic Advisor" }
              ].map((member, i) => (
                <li key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <span className="font-bold text-slate-800">{member.name}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Awards Jury</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">Sarojini Agarwal Yuva Sewa Samman</p>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                The jury consists of eminent social scientists, former bureaucrats, and national awardees who select the most impactful youth leaders across India.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">Social Impact Experts</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">Policy Researchers</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">Youth Mentors</span>
              </div>
              <Link to="/recognition" className="inline-flex items-center gap-2 text-ngo-primary font-bold text-sm mt-4 hover:gap-3 transition-all">
                View Nomination Process <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Impact Pulse (Live Data Section) */}
      <section className="mb-24">
        <div className="mb-12">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Heritage Impact Pulse</h2>
          <p className="text-slate-500">Real-time evidence of our national reach and identified service gaps.</p>
        </div>

        {/* The Ticker Engine */}
        <div className="bg-slate-900 text-white py-6 rounded-[2rem] overflow-hidden relative mb-12 shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10" />
          
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 items-center px-8"
          >
            {[
              { label: "Total SAMBAL Referrals Generated", value: `${impactStats.referrals.toLocaleString()}+` },
              { label: "Verified NGO Partners (Silver/Gold)", value: `${impactStats.ngos.toLocaleString()}+` },
              { label: "Vatsalya & Saathi Students Enrolled", value: `${impactStats.students.toLocaleString()}+` },
              { label: "Bio-Well Health Scans Conducted", value: "5,800+" },
              { label: "Mid-Day Meals Served (Lucknow)", value: `${impactStats.meals.toLocaleString()}+` },
              { label: "Total SAMBAL Referrals Generated", value: `${impactStats.referrals.toLocaleString()}+` },
              { label: "Verified NGO Partners (Silver/Gold)", value: `${impactStats.ngos.toLocaleString()}+` },
              { label: "Vatsalya & Saathi Students Enrolled", value: `${impactStats.students.toLocaleString()}+` },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-ngo-primary font-bold text-2xl">{m.value}</span>
                <span className="text-slate-400 text-sm uppercase tracking-widest font-bold">{m.label}</span>
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* The Global Gap Map */}
        <div className="grid lg:grid-cols-5 gap-8 items-center bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">National Service Gaps</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our "Zero-Result" search tracking identifies regions where critical schemes are missing. 
              Hover over the map to see active support vs. identified gaps.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-900">Active Schemes (M2)</div>
                  <div className="text-xs text-emerald-700">Verified government & NGO support</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                  <Search size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-900">Zero-Result Gaps (M7)</div>
                  <div className="text-xs text-rose-700">Identified needs for donor intervention</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex justify-center relative">
            {/* Simplified SVG Map of India */}
            <svg viewBox="0 0 400 450" className="w-full max-w-[400px] drop-shadow-2xl">
              <path 
                d="M180,20 L210,40 L230,80 L250,100 L280,110 L300,130 L310,160 L300,190 L320,210 L310,240 L290,260 L270,290 L250,320 L230,350 L210,380 L200,410 L190,430 L170,410 L150,380 L130,350 L110,320 L90,290 L70,260 L50,240 L40,210 L50,180 L40,150 L60,130 L80,110 L110,100 L130,80 L150,40 Z" 
                fill="#f1f5f9" 
                stroke="#cbd5e1" 
                strokeWidth="2"
              />
              {/* Interactive State Dots */}
              {[
                { x: 180, y: 150, name: "Uttar Pradesh", schemes: 1240, gaps: 42 },
                { x: 120, y: 200, name: "Rajasthan", schemes: 850, gaps: 115 },
                { x: 220, y: 220, name: "Bihar", schemes: 620, gaps: 180 },
                { x: 160, y: 280, name: "Maharashtra", schemes: 980, gaps: 34 },
                { x: 190, y: 350, name: "Karnataka", schemes: 740, gaps: 21 },
                { x: 250, y: 180, name: "West Bengal", schemes: 590, gaps: 92 },
              ].map((state, i) => (
                <motion.g 
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="cursor-pointer group"
                >
                  <circle cx={state.x} cy={state.y} r="8" fill="#10b981" />
                  <circle cx={state.x} cy={state.y} r="12" fill="#10b981" className="animate-ping opacity-20" />
                  
                  {/* Tooltip */}
                  <foreignObject x={state.x + 15} y={state.y - 40} width="160" height="100" className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-[10px] border border-white/10">
                      <div className="font-bold border-b border-white/10 pb-1 mb-1">{state.name}</div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Active Schemes:</span>
                        <span>{state.schemes}</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Search Gaps:</span>
                        <span>{state.gaps}</span>
                      </div>
                    </div>
                  </foreignObject>
                </motion.g>
              ))}
            </svg>
            
            {/* Map Legend */}
            <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                High Support Density
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                Critical Gap Area
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lucknow Center: Wellness & Facilitation Hub (M10 Integration) */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Lucknow Center: Wellness & Facilitation Hub</h2>
            <p className="text-slate-500">Our campus has evolved from a residence to a high-impact facilitation center, providing essential physical services daily.</p>
          </div>
          <Link to="/lucknow-center" className="bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all">
            Visit the Lucknow Center
          </Link>
        </div>

        {/* Service Triple-Grid (NIOS & Nutrition) */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Free Education Hub</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dedicated support for underprivileged children under the NIOS (Open Schooling) system, bridging the academic gap.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
              Transparency Note
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <Utensils size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Mid-Day Meal Support</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every child attending physical classes receives a free, nutritious meal to ensure health and focus.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Personality Development</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Weekly workshops focused on soft skills, values, and building confidence for a brighter future.
            </p>
          </div>
        </div>

        {/* Wellness & Specialized Care + Integrated Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wellness & Specialized Care */}
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ngo-primary/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-ngo-primary flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h3 className="text-2xl font-serif font-bold">Wellness & Specialized Care</h3>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Activity size={24} className="text-ngo-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Bio-Well Diagnostic Zone</h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      Energy scanning and stress analysis to identify holistic wellness needs.
                    </p>
                    <button className="text-xs font-bold text-ngo-primary uppercase tracking-widest hover:underline">
                      Book Energy Scan →
                    </button>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Smile size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Inter-Generational "Happy Workshop"</h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      Seniors (Sathis) and Children (Vatsalya) interact to share wisdom, stories, and joy.
                    </p>
                    
                    {/* Weekly Calendar */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <Calendar size={12} /> Weekly Schedule
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 p-2 rounded-lg text-center">
                          <div className="text-[10px] font-bold text-ngo-primary">WED</div>
                          <div className="text-[9px] text-slate-300">Wisdom Exchange</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg text-center">
                          <div className="text-[10px] font-bold text-ngo-primary">SAT</div>
                          <div className="text-[9px] text-slate-300">Storytelling Hub</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Services Grid */}
          <div className="grid gap-8">
            <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-6">
                  <Stethoscope size={24} />
                </div>
                <h3 className="text-xl font-bold text-rose-900 mb-3">Alternative Therapy</h3>
                <p className="text-rose-700 text-sm leading-relaxed mb-6">
                  Direct booking for Bio-Well Energy Scanning and personalized Wellness Consultations with our experts.
                </p>
              </div>
              <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg hover:bg-rose-600 transition-all">
                Book Consultation
              </button>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-6">
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">Facility Booking</h3>
                <p className="text-indigo-700 text-sm leading-relaxed mb-6">
                  "Rent for a Cause" – Other NGOs can book our halls or meeting rooms at subsidized rates for social impact events.
                </p>
              </div>
              <button className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-600 transition-all">
                Rent for a Cause
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm font-medium">
            "Visit the Lucknow Center – A National Resource for Social Support."
          </p>
        </div>
      </section>

      {/* 3. The SAMBAL Social Ecosystem (M12 Integration) */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">The SAMBAL Social Ecosystem</h2>
            <p className="text-slate-500">Connecting our digital community through education, awareness, and impactful campaigns.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-ngo-primary uppercase tracking-widest bg-ngo-primary/5 px-4 py-2 rounded-full border border-ngo-primary/10">
            <span className="w-2 h-2 rounded-full bg-ngo-primary animate-pulse" />
            M12 Social Integration Active
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* SAMBAL YouTube Integration */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Youtube size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">SAMBAL YouTube</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Tutorials & Heritage Stories</p>
                </div>
              </div>
              <button className="text-xs font-bold text-red-600 hover:underline">Subscribe →</button>
            </div>
            
            <div className="relative aspect-video bg-slate-900 group cursor-pointer">
              <img 
                src="https://picsum.photos/seed/heritage-video/800/450" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                alt="Heritage Video Thumbnail"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <h4 className="text-white font-bold text-sm mb-1">Heritage Stories: Dr. Sarojini Agarwal</h4>
                  <p className="text-white/60 text-xs">Learn about the 40-year journey of compassion and the digital pivot.</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-ngo-primary/30 transition-colors cursor-pointer group">
                <div className="text-[10px] font-bold text-ngo-primary uppercase tracking-widest mb-2">How-to Tutorial</div>
                <h5 className="text-xs font-bold text-slate-800 group-hover:text-ngo-primary transition-colors">Using M2 Search Hub</h5>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-ngo-primary/30 transition-colors cursor-pointer group">
                <div className="text-[10px] font-bold text-ngo-primary uppercase tracking-widest mb-2">Latest Update</div>
                <h5 className="text-xs font-bold text-slate-800 group-hover:text-ngo-primary transition-colors">SAMBAL Referral Guide</h5>
              </div>
            </div>
          </div>

          {/* Campaign Spotlight Slider */}
          <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ngo-primary/20 text-ngo-primary flex items-center justify-center">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Campaign Spotlight</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Current Digital Drives</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex-grow p-8 relative z-10">
              <div className="h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                    Active Now
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                    Sponsor a <br />
                    <span className="text-ngo-primary italic">Child's Mid-Day Meal</span>
                  </h3>
                  <p className="text-white/60 leading-relaxed max-w-md">
                    Ensure that every child attending our Lucknow Center receives the nutrition they need to focus and grow. Your small contribution makes a massive difference.
                  </p>
                  
                  <div className="pt-6 flex flex-wrap gap-4">
                    <button className="bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all">
                      Support Now
                    </button>
                    <button className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                      View Details
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ngo-primary/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-3xl" />
            
            {/* Slider Indicators */}
            <div className="p-8 flex justify-center gap-2 relative z-10">
              <div className="w-8 h-1 rounded-full bg-ngo-primary" />
              <div className="w-2 h-1 rounded-full bg-white/20" />
              <div className="w-2 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 p-12 rounded-[3rem] bg-ngo-primary text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">Our Mission in Lucknow</h2>
            <p className="text-white/80 text-lg mb-8">
              From our campus in Lucknow, we provide a physical and digital bridge for those in need. 
              Our Bio-Well booking hub and Joy Room are designed to foster holistic growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
                <div className="text-3xl font-bold">200k+</div>
                <div className="text-xs uppercase tracking-wider opacity-60">Schemes Mapped</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
                <div className="text-3xl font-bold">Lucknow</div>
                <div className="text-xs uppercase tracking-wider opacity-60">Campus Hub</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/ngo1/400/400" className="rounded-3xl shadow-xl rotate-3" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/ngo2/400/400" className="rounded-3xl shadow-xl -rotate-3 mt-8" referrerPolicy="no-referrer" />
          </div>
        </div>
      </motion.section>
      {/* DPDP Compliance Section */}
      <section className="mb-24 py-12 border-t border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">DPDP Compliance</h4>
              <p className="text-xs text-slate-500">Your data is protected under the Digital Personal Data Protection Act.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowErasureModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
          >
            <Trash2 size={18} /> Request Data Erasure (Form 28-B)
          </button>
        </div>
      </section>

      {/* Erasure Modal */}
      <Modal 
        isOpen={showErasureModal} 
        onClose={() => setShowErasureModal(false)} 
        title="Form 28-B: Data Erasure Request"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch('/api/data-erasure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: erasureEmail })
          });
          if (res.ok) {
            alert("Your data erasure request has been received. Our compliance officer will process it within 30 days.");
            setShowErasureModal(false);
            setErasureEmail('');
          }
        }} className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 mb-6">
            <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Notice:</strong> This action will permanently remove your account and all associated data from our servers. This process cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Registered Email</label>
            <input 
              type="email" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-rose-500 transition-all"
              placeholder="your-email@example.com"
              value={erasureEmail}
              onChange={(e) => setErasureEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
            Confirm Erasure Request
          </button>
        </form>
      </Modal>
    </div>
  );
}
