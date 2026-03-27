import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';

const ProgramCard = ({ title, duration, description, icon: Icon }: any) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-16 h-16 bg-ngo-primary/10 rounded-2xl flex items-center justify-center text-ngo-primary mb-8 group-hover:scale-110 transition-transform">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
    <div className="text-xs font-bold text-ngo-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-ngo-secondary" />
      {duration}
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-6">{description}</p>
    <button className="text-ngo-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
      Learn More <ArrowRight size={16} />
    </button>
  </div>
);

export default function InternshipPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      university: formData.get('university'),
      track: formData.get('track'),
      resume: formData.get('resume'),
      sop: formData.get('sop')
    };

    try {
      // M5 Webhook: Log Internship Application
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_INTERNSHIP_APP',
          payload,
          secure_url: '/internships'
        })
      }).catch(err => console.error('M5 Internship Log Failed:', err));

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
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-ngo-primary/10 -z-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-ngo-primary/20 text-ngo-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-ngo-primary/30">
                Academic & Professional Growth
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Shape Your Future in the <span className="text-ngo-primary italic">Social Sector</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed mb-12">
                Our internship program offers students and young professionals a unique opportunity to gain hands-on experience in community development, mental health, and education.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#apply" className="bg-ngo-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-ngo-primary/20 hover:bg-ngo-primary/90 transition-all">
                  Apply for Internship
                </a>
                <a href="#programs" className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/20 transition-all">
                  Explore Programs
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Our Internship Tracks</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Choose a track that aligns with your academic background and career aspirations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ProgramCard 
              icon={GraduationCap}
              title="Education & Literacy"
              duration="3-6 Months"
              description="Support our NIOS program, develop teaching materials, and work directly with children in our Junior Lab."
            />
            <ProgramCard 
              icon={BookOpen}
              title="Mental Health Advocacy"
              duration="4-8 Months"
              description="Assist in mental health screening, awareness campaigns, and support our Sneh-Rakshak network."
            />
            <ProgramCard 
              icon={Briefcase}
              title="NGO Management"
              duration="3-6 Months"
              description="Learn about fundraising, donor relations, social media management, and administrative operations."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/internship/800/1000" 
                alt="Internship Experience" 
                className="rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-ngo-primary text-white p-10 rounded-[2.5rem] shadow-2xl hidden md:block">
                <div className="text-4xl font-serif font-bold mb-1">500+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Interns Mentored</div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">What You'll Gain</h2>
              <div className="space-y-8">
                {[
                  { icon: Award, title: "Verified Certification", text: "Receive a certificate of completion recognized by our partner organizations." },
                  { icon: Briefcase, title: "Professional Mentorship", text: "Work directly under experienced social workers and NGO leaders." },
                  { icon: CheckCircle2, title: "Real-world Impact", text: "See the direct results of your work in the lives of the community members." },
                  { icon: GraduationCap, title: "Academic Credit", text: "We provide necessary documentation for university internship requirements." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-ngo-primary/10 text-ngo-primary rounded-2xl flex items-center justify-center shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 bg-slate-900 text-white p-12 lg:p-16 flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-serif font-bold mb-8">Apply Now</h2>
                  <p className="text-white/60 mb-12 leading-relaxed">
                    We're looking for passionate, dedicated individuals who want to make a difference. Join our next cohort of interns.
                  </p>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-ngo-primary">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Email Us</div>
                        <div className="text-sm font-bold">internships@manishamandir.org</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-ngo-primary">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Call Us</div>
                        <div className="text-sm font-bold">+91 0522 123456</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 border-t border-white/10">
                  <p className="text-xs text-white/40 italic">
                    * Applications are reviewed on a rolling basis. Please allow 7-10 days for a response.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3 p-12 lg:p-16">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Application Submitted!</h3>
                    <p className="text-slate-600 mb-8">
                      Thank you for applying to our internship program. We will review your profile and get back to you soon.
                    </p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="text-ngo-primary font-bold hover:underline"
                    >
                      Submit another application
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
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
 
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">University/College</label>
                        <input 
                          type="text" 
                          name="university"
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                          placeholder="University Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Track</label>
                        <select name="track" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all appearance-none">
                          <option>Education & Literacy</option>
                          <option>Mental Health Advocacy</option>
                          <option>NGO Management</option>
                          <option>Social Media & Marketing</option>
                        </select>
                      </div>
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Upload Resume (Link)</label>
                      <div className="relative">
                        <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="url" 
                          name="resume"
                          required
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
                          placeholder="Google Drive or LinkedIn Link"
                        />
                      </div>
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Statement of Purpose</label>
                      <textarea 
                        name="sop"
                        rows={4}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-ngo-primary transition-all resize-none"
                        placeholder="Tell us why you want to intern with us..."
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
        </div>
      </section>
    </div>
  );
}
