import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Utensils, 
  Sparkles, 
  Zap, 
  Calendar, 
  Building2, 
  Stethoscope, 
  Smile,
  Activity,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Info,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, description, badge, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
    {badge && (
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
        {badge}
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${color} text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">
      {description}
    </p>
    <div className="flex items-center gap-2 text-ngo-primary font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
      Learn More <ArrowRight size={14} />
    </div>
  </div>
);

export default function LucknowCenterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-12 md:p-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ngo-primary/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-ngo-primary/20 text-ngo-primary text-xs font-bold uppercase tracking-widest mb-6 border border-ngo-primary/30"
            >
              M10 Integration Hub
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight"
            >
              Lucknow Center: <br />
              <span className="text-ngo-primary italic">Wellness & Facilitation Hub</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl"
            >
              Our heritage campus in Lucknow has evolved from a residence to a high-impact national facilitation center, providing essential physical services and digital support daily.
            </motion.p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={18} className="text-ngo-primary" />
                Lucknow, Uttar Pradesh
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={18} className="text-ngo-primary" />
                Open: 9:00 AM - 6:00 PM
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/lucknow-hub/800/600" 
              alt="Lucknow Center Hub" 
              className="rounded-[2rem] shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-6 rounded-2xl shadow-xl hidden md:block border border-slate-100">
              <div className="text-3xl font-bold text-ngo-primary">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Beneficiaries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Triple-Grid (NIOS & Nutrition) */}
      <section className="mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Service Triple-Grid</h2>
          <p className="text-slate-500">Foundational support systems for education, health, and personal growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={GraduationCap}
            title="Free Education Hub"
            description="Dedicated support for underprivileged children under the NIOS (Open Schooling) system, bridging the academic gap with expert guidance."
            color="bg-blue-600"
          />
          <ServiceCard 
            icon={Utensils}
            title="Mid-Day Meal Support"
            description="Every child attending physical classes receives a free, nutritious meal to ensure health and focus. We believe nutrition is the foundation of learning."
            badge="Transparency Note"
            color="bg-emerald-600"
          />
          <ServiceCard 
            icon={Sparkles}
            title="Personality Development"
            description="Weekly workshops focused on soft skills, values, and building confidence, preparing our students for a brighter, more resilient future."
            color="bg-amber-600"
          />
        </div>
      </section>

      {/* Wellness & Specialized Care */}
      <section className="mb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ngo-primary flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Wellness & Specialized Care</h2>
          </div>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Our wellness zone integrates cutting-edge diagnostic technology with traditional wisdom to provide holistic care for all generations.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Activity size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Bio-Well Diagnostic Zone</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Direct booking portal for energy scanning and stress analysis to identify holistic wellness needs.
                </p>
                <Link to="/campus/book" className="bg-rose-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-rose-700 transition-all inline-block">
                  Book Energy Scan
                </Link>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Personnel Feedback</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Help us maintain quality by sharing your experience with our volunteers and experts.
                </p>
                <Link to="/personnel/feedback" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-all inline-block">
                  Submit Feedback
                </Link>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Smile size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Inter-Generational "Happy Workshop"</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  A unique space where Seniors (Sathis) and Children (Vatsalya/Saathi) interact to share wisdom and joy.
                </p>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <Calendar size={12} /> Weekly Schedule
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl text-center border border-slate-100">
                      <div className="text-xs font-bold text-ngo-primary">WEDNESDAY</div>
                      <div className="text-[10px] text-slate-500">Wisdom Exchange</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl text-center border border-slate-100">
                      <div className="text-xs font-bold text-ngo-primary">SATURDAY</div>
                      <div className="text-[10px] text-slate-500">Storytelling Hub</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <img 
            src="https://picsum.photos/seed/wellness-lucknow/800/1000" 
            alt="Wellness Zone" 
            className="rounded-[3rem] shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Integrated Services Grid */}
      <section className="mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-8 shadow-lg">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-rose-900 mb-4">Alternative Therapy</h3>
              <p className="text-rose-700 leading-relaxed mb-8">
                Experience holistic healing with our Bio-Well Energy Scanning and personalized Wellness Consultations. Our experts help you navigate your journey to physical and mental balance.
              </p>
            </div>
            <Link to="/campus/book" className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold shadow-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
              Book Wellness Consultation <ArrowRight size={20} />
            </Link>
          </div>

          <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-8 shadow-lg">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-indigo-900 mb-4">Facility Booking</h3>
              <p className="text-indigo-700 leading-relaxed mb-8">
                "Rent for a Cause" – We offer our halls and meeting rooms to other NGOs and social enterprises at subsidized rates. Your booking directly supports our community programs.
              </p>
            </div>
            <Link to="/campus/book" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              Rent for a Cause <Building2 size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100">
        <div className="max-w-2xl mx-auto px-6">
          <Info className="mx-auto text-ngo-primary mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
            Visit the Lucknow Center
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            A National Resource for Social Support. Whether you're a student, a senior, or a partner organization, our doors are open to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+911234567890" className="bg-ngo-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-2">
              <Phone size={20} /> Call for Appointment
            </a>
            <button className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
              Get Directions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
