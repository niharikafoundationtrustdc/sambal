import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      // M5 Webhook: Log Contact Form Submission
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M12_CONTACT_FORM',
          payload,
          secure_url: '/contact'
        })
      }).catch(err => console.error('M5 Contact Log Failed:', err));

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
      <section className="pt-20 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Let's <span className="text-ngo-primary italic">Connect</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about our programs, want to partner with us, or just want to say hello? We're here to listen and help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Email Us</h3>
              <p className="text-slate-500 text-sm mb-6">Our team typically responds within 24 hours.</p>
              <a href="mailto:info@manishamandir.org" className="text-ngo-primary font-bold hover:underline">info@manishamandir.org</a>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <Phone size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Call Us</h3>
              <p className="text-slate-500 text-sm mb-6">Available Monday to Saturday, 9 AM - 6 PM.</p>
              <a href="tel:+910522123456" className="text-ngo-primary font-bold hover:underline">+91 0522 123456</a>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Visit Us</h3>
              <p className="text-slate-500 text-sm mb-6">Manisha Mandir, Hazratganj, Lucknow, UP 226001</p>
              <button className="text-ngo-primary font-bold hover:underline">Get Directions →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                <MessageSquare className="text-ngo-primary" /> Send a Message
              </h2>
              
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Message Sent!</h3>
                  <p className="text-slate-600 mb-8">
                    Thank you for reaching out. We've received your message and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="text-ngo-primary font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
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

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      name="message"
                      rows={6}
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2",
                      formStatus === 'submitting' 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-ngo-primary text-white hover:bg-ngo-primary/90 shadow-ngo-primary/20"
                    )}
                  >
                    {formStatus === 'submitting' ? "Sending..." : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {[
                    { q: "How can I donate to Manisha Mandir?", a: "You can donate directly through our website's donation page using various payment methods." },
                    { q: "Can I visit the Lucknow center?", a: "Yes, we welcome visitors. Please contact us in advance to schedule a visit." },
                    { q: "Are my donations tax-exempt?", a: "Yes, all donations to Manisha Mandir are tax-exempt under Section 80G of the Income Tax Act." },
                    { q: "How can I volunteer remotely?", a: "We have several digital volunteering opportunities in content creation, social media, and data management." }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-ngo-primary/5 p-8 rounded-[3rem] border border-ngo-primary/10">
                <h3 className="text-xl font-serif font-bold text-ngo-primary mb-4 flex items-center gap-2">
                  <Clock size={20} /> Response Time
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  We value your time. Our dedicated support team aims to respond to all inquiries within 24-48 business hours. For urgent matters, please use the emergency contact numbers.
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-ngo-secondary uppercase tracking-widest">
                  <Globe size={16} /> Global Support Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
