import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  User, 
  Languages,
  MapPin,
  CreditCard,
  AlertCircle,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const DIALECTS = ['Awadhi', 'Bhojpuri', 'Bundeli', 'Kannauji', 'Braj', 'Hindi', 'English'];
const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Crisis'];

export default function TeleBridge() {
  const [view, setView] = useState<'book' | 'sessions'>('book');
  const [bookingMode, setBookingMode] = useState<'direct' | 'assisted'>('direct');
  const [experts, setExperts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    dialect: '',
    severity: 'Low'
  });
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [beneficiaryUin, setBeneficiaryUin] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchExperts();
    fetchSessions();
  }, [filters]);

  const fetchExperts = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/experts/list?${query}`);
    const data = await res.json();
    setExperts(data);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/appointments/my-sessions', {
      headers: { 'x-user-id': '1' } // Mocked
    });
    const data = await res.json();
    setSessions(data);
  };

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const payload = {
        expertId: selectedExpert.id,
        patientId: 1, // Mocked
        assistedByUin: bookingMode === 'assisted' ? 'ASHA-001' : null,
        dialect: filters.dialect || 'Hindi',
        scheduledAt,
        severityLevel: filters.severity,
        isFree: bookingMode === 'assisted'
      };
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // M5 Webhook: Log Tele-Bridge Booking
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M9_TELE_BOOKING',
            payload,
            secure_url: '/tele-bridge'
          })
        }).catch(err => console.error('M5 Tele Booking Log Failed:', err));

        setBookingSuccess(true);
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  const handleRedAlert = async (session: any) => {
    if (!window.confirm("Trigger RED ALERT? This will notify nearest NGO and PHC for physical rescue.")) return;
    
    try {
      const payload = {
        triggeredById: 1, // Mocked
        beneficiaryId: session.patient_id,
        pincode: '226001' // Mocked
      };
      await fetch('/api/crisis/red-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Red Alert
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M9_RED_ALERT',
          payload,
          secure_url: '/tele-bridge'
        })
      }).catch(err => console.error('M5 Red Alert Log Failed:', err));

      alert("Red Alert Triggered. Emergency services notified.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">M9: SAMBAL Tele-Bridge</h1>
            <p className="text-slate-500">Secure, multi-tiered telemedicine for rural and urban India.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => setView('book')}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                view === 'book' ? "bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Book Session
            </button>
            <button 
              onClick={() => setView('sessions')}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                view === 'sessions' ? "bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              My Sessions
            </button>
          </div>
        </div>

        {view === 'book' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                  <Filter size={20} className="text-ngo-primary" /> Booking Filters
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setBookingMode('direct')}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                          bookingMode === 'direct' ? "border-ngo-primary bg-ngo-primary/5 text-ngo-primary" : "border-slate-50 text-slate-500"
                        )}
                      >
                        Direct (Urban)
                      </button>
                      <button 
                        onClick={() => setBookingMode('assisted')}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                          bookingMode === 'assisted' ? "border-ngo-primary bg-ngo-primary/5 text-ngo-primary" : "border-slate-50 text-slate-500"
                        )}
                      >
                        Assisted (Rural)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dialect Fluency</label>
                    <select 
                      className="w-full p-4 rounded-2xl bg-slate-50 border-transparent text-sm font-medium"
                      value={filters.dialect}
                      onChange={(e) => setFilters({...filters, dialect: e.target.value})}
                    >
                      <option value="">All Dialects</option>
                      {DIALECTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Severity Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SEVERITY_LEVELS.map(level => (
                        <button 
                          key={level}
                          onClick={() => setFilters({...filters, severity: level})}
                          className={cn(
                            "py-3 rounded-xl text-xs font-bold border-2 transition-all",
                            filters.severity === level ? "border-ngo-primary bg-ngo-primary/5 text-ngo-primary" : "border-slate-50 text-slate-500"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {bookingMode === 'assisted' && (
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Assisted Mode:</strong> ASHA workers can book on behalf of rural beneficiaries. Razorpay payment is bypassed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Expert List / Booking Flow */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {!selectedExpert ? (
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {experts.length > 0 ? experts.map((expert) => (
                      <div 
                        key={expert.id}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                            <User size={32} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900">{expert.name}</h3>
                              {expert.sneh_ratna_badge !== 'None' && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-full">
                                  {expert.sneh_ratna_badge} Expert
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-2">Tier {expert.expert_tier} Expert • {JSON.parse(expert.dialect_fluency || '[]').join(', ')}</p>
                            <div className="flex gap-2">
                              <span className="text-[10px] font-bold text-ngo-primary bg-ngo-primary/5 px-2 py-1 rounded-md uppercase tracking-wider">
                                {expert.expert_tier === 1 ? 'Clinical' : expert.expert_tier === 2 ? 'Therapy' : 'Support'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedExpert(expert)}
                          className="px-8 py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 group-hover:scale-[1.02] transition-all flex items-center gap-2"
                        >
                          Book Now <ChevronRight size={18} />
                        </button>
                      </div>
                    )) : (
                      <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                        <Search className="mx-auto text-slate-200 mb-4" size={48} />
                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Experts Found</h3>
                        <p className="text-slate-500">Try adjusting your filters or dialect selection.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="booking"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative"
                  >
                    <button 
                      onClick={() => setSelectedExpert(null)}
                      className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={24} />
                    </button>

                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Schedule Session with {selectedExpert.name}</h2>
                    
                    <div className="space-y-8">
                      {bookingMode === 'assisted' && (
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Beneficiary UIN</label>
                          <input 
                            type="text" 
                            placeholder="Enter UIN (e.g., MM-2024-001)"
                            className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ngo-primary transition-all"
                            value={beneficiaryUin}
                            onChange={(e) => setBeneficiaryUin(e.target.value)}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
                        <input 
                          type="datetime-local" 
                          className="w-full p-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ngo-primary transition-all"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                        />
                      </div>

                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-slate-600">Platform Fee (15%)</span>
                          <span className="text-sm font-bold text-slate-900">₹150</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-slate-600">Expert Fee (85%)</span>
                          <span className="text-sm font-bold text-slate-900">₹850</span>
                        </div>
                        <div className="h-px bg-slate-200 my-4" />
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-serif font-bold text-slate-900">Total Amount</span>
                          <span className="text-lg font-serif font-bold text-ngo-primary">
                            {bookingMode === 'assisted' ? '₹0 (Subsidized)' : '₹1,000'}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={handleBook}
                        disabled={isBooking || !scheduledAt || (bookingMode === 'assisted' && !beneficiaryUin)}
                        className="w-full py-5 bg-ngo-primary text-white rounded-2xl font-bold shadow-xl shadow-ngo-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isBooking ? 'Processing...' : (
                          <>
                            <CreditCard size={20} /> {bookingMode === 'assisted' ? 'Confirm Assisted Booking' : 'Pay & Confirm Session'}
                          </>
                        )}
                      </button>
                    </div>

                    {bookingSuccess && (
                      <div className="absolute inset-0 bg-white rounded-[3rem] flex flex-col items-center justify-center p-10 text-center z-10">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8">
                          <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                          Your session has been scheduled. A secure Google Meet link has been generated and sent to your email.
                        </p>
                        <button 
                          onClick={() => {
                            setBookingSuccess(false);
                            setSelectedExpert(null);
                            setView('sessions');
                          }}
                          className="w-full py-4 bg-ngo-primary text-white rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all"
                        >
                          View My Sessions
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.length > 0 ? sessions.map((session) => (
              <div 
                key={session.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Video size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">Session with {session.other_party_name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(session.scheduled_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(session.scheduled_at).toLocaleTimeString()}</span>
                      <span className="flex items-center gap-1.5"><Languages size={16} /> {session.dialect}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleRedAlert(session)}
                    className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                  >
                    <ShieldAlert size={16} /> Red Alert
                  </button>
                  <a 
                    href={session.tele_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-ngo-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-ngo-primary/20 hover:scale-[1.05] transition-all flex items-center gap-2"
                  >
                    Join Meet <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )) : (
              <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                <Video className="mx-auto text-slate-200 mb-4" size={48} />
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Active Sessions</h3>
                <p className="text-slate-500">Your upcoming tele-bridge sessions will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
