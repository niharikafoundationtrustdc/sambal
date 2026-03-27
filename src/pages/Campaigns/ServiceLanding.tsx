import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceLanding() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Technical/SaaS Style */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full w-fit text-sm font-bold uppercase tracking-widest">
              <Star size={16} fill="currentColor" /> Expert Onboarding Open
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 leading-[0.9] tracking-tighter">
              Lend Your <span className="text-blue-600 italic">Expertise</span> to the Cause.
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              We're looking for medical professionals, researchers, and social workers to join our M5 Intelligence Hub and drive real change.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/expert-onboarding" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                Apply as Expert <ArrowRight size={20} />
              </Link>
              <Link to="/volunteer" className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg hover:border-blue-600/30 transition-all">
                Volunteer with Us
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl bg-white p-8 border border-slate-100">
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="bg-blue-50 rounded-3xl p-8 flex flex-col justify-between">
                  <Zap className="text-blue-600" size={32} />
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">Fast Track</h4>
                    <p className="text-sm text-slate-500">Onboarding in 48h</p>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-3xl p-8 flex flex-col justify-between">
                  <ShieldCheck className="text-emerald-600" size={32} />
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">Verified</h4>
                    <p className="text-sm text-slate-500">M5 Credentials</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-3xl p-8 flex flex-col justify-between col-span-2">
                  <MessageSquare className="text-purple-600" size={32} />
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">Global Network</h4>
                    <p className="text-sm text-slate-500">Connect with 500+ professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid - Brutalist/Creative Tool Style */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 divide-x divide-slate-100">
            <div className="p-12 space-y-6">
              <div className="text-6xl font-serif font-bold text-slate-200">01</div>
              <h3 className="text-2xl font-bold text-slate-900">Submit Credentials</h3>
              <p className="text-slate-500 leading-relaxed">Upload your certifications and professional background via our secure portal.</p>
            </div>
            <div className="p-12 space-y-6">
              <div className="text-6xl font-serif font-bold text-slate-200">02</div>
              <h3 className="text-2xl font-bold text-slate-900">M5 Verification</h3>
              <p className="text-slate-500 leading-relaxed">Our automated system verifies your credentials against global standards.</p>
            </div>
            <div className="p-12 space-y-6">
              <div className="text-6xl font-serif font-bold text-slate-200">03</div>
              <h3 className="text-2xl font-bold text-slate-900">Start Impacting</h3>
              <p className="text-slate-500 leading-relaxed">Get assigned to projects that match your skills and availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Layout Style */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-900 rounded-[4rem] overflow-hidden grid lg:grid-cols-2">
          <div className="p-12 md:p-20 space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Ready to <span className="text-blue-400 italic">Scale</span> Your Impact?
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Join the SAMBAL ecosystem and help us build a more resilient future for Lucknow's most vulnerable.
            </p>
            <Link to="/services" className="inline-block bg-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20">
              Apply Now
            </Link>
          </div>
          <div className="relative hidden lg:block">
            <img 
              src="https://picsum.photos/seed/expert/800/800" 
              alt="Expert Onboarding" 
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
