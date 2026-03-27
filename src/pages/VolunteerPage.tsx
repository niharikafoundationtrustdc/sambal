import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Users, 
  Globe, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

const BenefitCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-14 h-14 bg-ngo-primary/10 rounded-2xl flex items-center justify-center text-ngo-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function VolunteerPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      interest: formData.get('interest'),
      motivation: formData.get('motivation')
    };

    try {
      // M5 Webhook: Log Volunteer Application
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_VOLUNTEER_APP',
          payload,
          secure_url: '/volunteer'
        })
      }).catch(err => console.error('M5 Volunteer Log Failed:', err));

      // Simulate API call
      setTimeout(() => {
        setFormStatus('success');
      }, 1500);
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-ngo-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-ngo-primary/10 text-ngo-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Join Our Mission
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Become a <span className="text-ngo-primary italic">Sneh-Rakshak</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Lend your hands and heart to support children, women, and the elderly. Your time can change lives in the communities of Lucknow and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#apply" className="bg-ngo-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-ngo-primary/20 hover:bg-ngo-primary/90 transition-all">
                Apply to Volunteer
              </a>
              <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                View Opportunities
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Volunteer? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Why Volunteer With Us?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Join a community of dedicated individuals working towards a more compassionate and equitable society.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={Heart}
              title="Make an Impact"
              description="Directly contribute to the well-being of vulnerable populations through our specialized programs."
            />
            <BenefitCard 
              icon={Users}
              title="Community Network"
              description="Connect with like-minded individuals, experts, and community leaders in the social sector."
            />
            <BenefitCard 
              icon={ShieldCheck}
              title="Skill Development"
              description="Gain valuable experience in social work, community management, and mental health advocacy."
            />
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">Ready to start your journey?</h2>
              <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                Fill out the form below, and our volunteer coordination team will get in touch with you within 48 hours to discuss how you can contribute.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: CheckCircle2, text: "Flexible hours based on your availability" },
                  { icon: CheckCircle2, text: "Training and orientation provided" },
                  { icon: CheckCircle2, text: "Certificate of appreciation for your service" },
                  { icon: CheckCircle2, text: "Opportunity to lead community projects" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Application Received!</h3>
                  <p className="text-slate-600 mb-8">
                    Thank you for your interest in volunteering. Our team will review your application and contact you soon.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="text-ngo-primary font-bold hover:underline"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Area of Interest</label>
                      <select name="interest" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all appearance-none">
                        <option>Education & NIOS</option>
                        <option>Mental Health Support</option>
                        <option>Elderly Care</option>
                        <option>Community Outreach</option>
                        <option>Digital Literacy</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Why do you want to volunteer?</label>
                    <textarea 
                      name="motivation"
                      rows={4}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all resize-none"
                      placeholder="Tell us a bit about your motivation..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl",
                      formStatus === 'submitting' 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-ngo-primary text-white hover:bg-ngo-primary/90 shadow-ngo-primary/20"
                    )}
                  >
                    {formStatus === 'submitting' ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ngo-primary">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold">Lucknow Office</h3>
              <p className="text-white/60 text-sm">Manisha Mandir, Hazratganj,<br />Lucknow, Uttar Pradesh 226001</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ngo-primary">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold">Email Us</h3>
              <p className="text-white/60 text-sm">volunteer@manishamandir.org<br />info@manishamandir.org</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ngo-primary">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold">Office Hours</h3>
              <p className="text-white/60 text-sm">Monday - Saturday<br />9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
