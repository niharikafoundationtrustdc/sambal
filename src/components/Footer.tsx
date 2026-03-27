import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Lock,
  HeartPulse,
  Scale
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* CSR Trust Hub: Compliance Bar */}
        <div className="mb-16 py-4 px-8 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-center gap-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-ngo-primary" size={20} />
            <span className="text-xs font-bold text-white uppercase tracking-widest">80G Registered</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-ngo-primary" size={20} />
            <span className="text-xs font-bold text-white uppercase tracking-widest">12A Compliant</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-ngo-primary" size={20} />
            <span className="text-xs font-bold text-white uppercase tracking-widest">CSR-1 Certified</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            Registration No: 1234/56/789
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Legal Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white mb-4">
              <Scale className="text-ngo-primary" size={24} />
              <h3 className="font-serif font-bold text-xl">Legal Identity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-emerald-500 mt-1" size={18} />
                <div>
                  <p className="text-sm font-bold text-white">NGO Registration (1988)</p>
                  <p className="text-xs text-slate-500">Verified National Entity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-emerald-500 mt-1" size={18} />
                <div>
                  <p className="text-sm font-bold text-white">12A/80G Tax-Exempt</p>
                  <p className="text-xs text-slate-500">Authorized for Donor Benefits</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <Award className="text-amber-400" size={24} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Awarded</p>
                  <p className="text-xs font-bold text-white">Rashtriya Bal Kalyan Puraskar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M2</span> Help Hub (Search)
                </Link>
              </li>
              <li>
                <Link to="/lms" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M3</span> Student Login (LMS)
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M10</span> Volunteer Portal
                </Link>
              </li>
              <li>
                <Link to="/internship" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M11</span> Intern Application
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M7</span> Wish-Tree (Donate)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M12</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/partnership-hub" className="text-sm hover:text-ngo-primary transition-colors flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">M4</span> Partnership Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Professionals */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-white mb-4">For Professionals</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/admin" className="group block p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-ngo-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white group-hover:text-ngo-primary transition-colors">Researcher Login</span>
                    <ExternalLink size={14} className="text-slate-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Anonymized M5 Access</p>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="group block p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-ngo-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white group-hover:text-ngo-primary transition-colors">NGO Partner Login</span>
                    <ExternalLink size={14} className="text-slate-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">M8 Partner Dashboard</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-white mb-4">Contact & Emergency</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-ngo-primary mt-1" size={18} />
                <p className="text-sm leading-relaxed">
                  Lucknow Campus, <br />
                  Heritage Facilitation Hub, <br />
                  Uttar Pradesh, India
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Phone className="text-emerald-400" size={20} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">24/7 Helpline</p>
                  <p className="text-sm font-bold text-white">+91 123 456 7890</p>
                </div>
              </div>
              <Link to="/wellness" className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group">
                <AlertCircle className="text-rose-400 group-hover:animate-pulse" size={20} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Emergency</p>
                  <p className="text-sm font-bold text-white">Red Alert Protocol</p>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* In Memory of: Founder's Legacy */}
        <div className="mb-16 p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ngo-primary/50 to-transparent" />
          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif italic text-2xl text-white mb-6">"In Memory of Dr. Sarojini Agarwal"</h3>
            <p className="text-slate-400 leading-relaxed italic mb-8">
              "Even as we scale through national technology, the foundation of SAMBAL remains the soul of our founder. Her journey from a single act of compassion in 1984 to a national facilitation hub continues to guide every line of code and every life we touch."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ngo-primary">The Soul of Sambal</span>
              <div className="h-px w-12 bg-white/10" />
            </div>
          </div>
        </div>

        {/* Institutional Trust Verification Ticker (M8/M4 Live Integration) */}
        <div className="mb-12 py-3 px-6 rounded-full bg-white/5 border border-white/10 flex items-center overflow-hidden relative">
          <div className="flex-shrink-0 flex items-center gap-2 mr-6 border-r border-white/10 pr-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">M8 Control Tower Active</span>
          </div>
          <div className="flex-grow overflow-hidden">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-12 text-[10px] font-bold uppercase tracking-widest text-slate-500"
            >
              <span>Last NGO Verified: Gram Vikas Sansthan (Lucknow)</span>
              <span className="text-white/20">|</span>
              <span>Current Expert Proctoring: Dr. Anjali Sharma (M4 Panel)</span>
              <span className="text-white/20">|</span>
              <span>Last NGO Verified: Sahyog Foundation (Bihar)</span>
              <span className="text-white/20">|</span>
              <span>Current Expert Proctoring: Prof. Rajesh Kumar (M4 Panel)</span>
              <span className="text-white/20">|</span>
              <span>Last NGO Verified: Gram Vikas Sansthan (Lucknow)</span>
              <span className="text-white/20">|</span>
              <span>Current Expert Proctoring: Dr. Anjali Sharma (M4 Panel)</span>
            </motion.div>
          </div>
        </div>

        {/* Strategic Governance & Awards Jury */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Scale size={16} className="text-ngo-primary" /> Management Council
            </h4>
            <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400">
              <div>
                <p className="text-white font-bold">Dr. Sarojini Agarwal</p>
                <p>Founder Chairperson</p>
              </div>
              <div>
                <p className="text-white font-bold">Justice (Retd.) R.K. Singh</p>
                <p>Legal Oversight</p>
              </div>
              <div>
                <p className="text-white font-bold">Mrs. Manisha Agarwal</p>
                <p>Executive Director</p>
              </div>
              <div>
                <p className="text-white font-bold">Dr. Alok Misra</p>
                <p>Strategic Advisor</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={16} className="text-amber-400" /> Awards Jury
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              The Jury for the <span className="text-white font-bold">Sarojini Agarwal Yuva Sewa Samman</span> consists of eminent social scientists, former bureaucrats, and national awardees dedicated to youth empowerment.
            </p>
            <Link to="/recognition" className="inline-block mt-4 text-[10px] font-bold text-ngo-primary uppercase tracking-widest hover:underline">
              Nomination Details →
            </Link>
          </div>
        </div>

        {/* DPDP Compliance Note */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl">
            <div className="w-10 h-10 rounded-xl bg-ngo-primary/20 text-ngo-primary flex items-center justify-center flex-shrink-0">
              <Lock size={20} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-white font-bold">DPDP Compliance Note:</span> Committed to the DPDP Act 2023. All personal data is anonymized for policy research after 3 years to ensure the highest standards of privacy and ethical data handling.
              </p>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                <span className="text-white/40 font-bold uppercase tracking-widest not-italic">Thin Client Architecture:</span> This frontend acts as a digital bridge for data capture. Heavy processing and clinical logic occur within the M5 Master Data Ledger (Google Sheets) with automated liability shifts to government health frameworks.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              © 2024 SAMBAL Heritage Project
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <HeartPulse size={14} className="text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Built for Impact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
