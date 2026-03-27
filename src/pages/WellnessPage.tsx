import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HeartPulse, 
  Calendar, 
  UserCheck, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Wifi
} from 'lucide-react';
import FileUpload from '../components/FileUpload';

const ExpertCard = ({ name, role, rating, fee, image }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex gap-6 items-center mb-6">
      <img src={image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
      <div>
        <h3 className="text-xl font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-ngo-primary font-medium">{role}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="text-amber-400" size={14} fill="currentColor" />
          <span className="text-xs font-bold text-slate-600">{rating}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Consultation</div>
        <div className="text-lg font-bold text-slate-800">₹{fee}</div>
      </div>
      <button 
        onClick={() => {
          const element = document.getElementById('booking-form');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="bg-ngo-primary text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-ngo-primary/90 transition-all"
      >
        Book Now
      </button>
    </div>
  </div>
);

export default function WellnessPage() {
  const [resource, setResource] = useState('Bio-Well');
  const [date, setDate] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, date })
      });

      // M5 Webhook: Log Campus Booking
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M10_CAMPUS_BOOKING',
          payload: { resource, date, action: 'wellness_campus_booking' },
          secure_url: '/wellness'
        })
      }).catch(err => console.error('M5 Booking Log Failed:', err));

      setBooked(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-16">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">स्वास्थ्य एवं वेलनेस</h1>
        <div className="flex items-center gap-2">
          <p className="text-lg text-slate-600 max-w-2xl">
            Access world-class mental health, senior care, and holistic wellness services through our expert directory and Lucknow campus.
          </p>
          <div className="flex items-center gap-2 bg-ngo-primary/10 text-ngo-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-ngo-primary/20 whitespace-nowrap">
            <Wifi className="w-3 h-3 animate-pulse" />
            Rural 3G Optimized
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                <UserCheck className="text-rose-500" /> Expert Directory
              </h2>
              <button className="text-ngo-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                View All Experts <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ExpertCard 
                name="Dr. Ananya Sharma"
                role="Mental Health Specialist"
                rating="4.9"
                fee="1200"
                image="https://picsum.photos/seed/doc1/200/200"
              />
              <ExpertCard 
                name="Prof. Rajesh Kumar"
                role="Senior Care Consultant"
                rating="4.8"
                fee="1500"
                image="https://picsum.photos/seed/doc2/200/200"
              />
            </div>
          </section>

          <section id="booking-form">
            <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
              <MapPin className="text-blue-500" /> Lucknow Campus Hub
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {['Hall', 'Bio-Well', 'Joy Room'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setResource(item)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left ${resource === item ? "bg-ngo-primary text-white border-ngo-primary shadow-lg" : "bg-white text-slate-800 border-slate-100 hover:border-ngo-primary/30"}`}
                >
                  <h4 className="font-bold text-lg">{item}</h4>
                  <p className={`text-xs mt-1 ${resource === item ? "text-white/70" : "text-slate-400"}`}>
                    {item === 'Bio-Well' ? 'Energy Scan & Wellness' : item === 'Joy Room' ? 'Children Play & Learn' : 'Community Events'}
                  </p>
                </button>
              ))}
            </div>

            <div className="glass-card p-10 rounded-[3rem]">
              {booked ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-500 mb-6">Your session for {resource} has been scheduled. Please arrive 15 minutes early.</p>
                  <button onClick={() => setBooked(false)} className="text-ngo-primary font-bold">Book Another Session</button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="datetime-local" 
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Booking For</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary">
                        <option value="self">Myself</option>
                        <option value="other">Someone Else (Family/Child)</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <Clock className="text-amber-600 shrink-0" size={20} />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      A 60-minute buffer is automatically added between sessions for sanitization and preparation.
                    </p>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-ngo-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-ngo-primary/90 transition-all shadow-xl shadow-ngo-primary/20"
                  >
                    Confirm Campus Booking
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-2xl font-serif font-bold mb-6">Bio-Well Scan</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Our advanced Bio-Well technology provides a holistic view of your energy levels and stress balance.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400" /> Energy Mapping
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400" /> Stress Analysis
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-rose-400" /> Organ Balance
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all">
              Learn More
            </button>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold mb-6">Upload Reports</h3>
            <FileUpload 
              onUpload={(url) => {
                console.log('Wellness report uploaded:', url);
                // M5 Webhook: Log Report Upload
                fetch('/api/m5/webhook', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    form_id: 'M11_WELLNESS_REPORT',
                    payload: { file_url: url, action: 'report_upload' },
                    secure_url: '/wellness'
                  })
                }).catch(err => console.error('M5 Report Log Failed:', err));
              }}
              accept="image/*,application/pdf"
              maxSize={10}
            />
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold text-center">PDF, JPG up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
