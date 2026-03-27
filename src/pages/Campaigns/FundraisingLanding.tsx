import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, ShieldCheck, LayoutDashboard, CreditCard, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FundraisingLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Luxury Style */}
      <section className="bg-slate-900 text-white py-24 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/donation/1920/1080?blur=10" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-full text-sm font-bold uppercase tracking-widest">
              Emergency Relief Fund
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-light leading-[0.9] tracking-tighter">
              Your Contribution, <span className="italic text-rose-400">Their Future.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              Every rupee you donate is tracked through our M5 Intelligence Hub, ensuring 100% transparency and direct impact on the ground in Lucknow.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/donate" className="bg-rose-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 flex items-center gap-2">
                Donate Now <ArrowRight size={20} />
              </Link>
              <Link to="/wish-tree" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Explore Wish Tree
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Options - Clean Utility Style */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif font-bold text-slate-900">Choose Your Impact</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We offer three ways to give, ensuring everyone can contribute to the SAMBAL mission.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
              <CreditCard size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Financial Support</h3>
            <p className="text-slate-500 leading-relaxed">Directly fund medical supplies, campus maintenance, and emergency relief funds.</p>
            <Link to="/donations" className="text-rose-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              Donate Money <ArrowRight size={20} />
            </Link>
          </div>
          <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Clock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Volunteer Time</h3>
            <p className="text-slate-500 leading-relaxed">Contribute your skills to our Lucknow campus or virtual research projects.</p>
            <Link to="/donations" className="text-blue-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              Pledge Time <ArrowRight size={20} />
            </Link>
          </div>
          <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Package size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Donate Items</h3>
            <p className="text-slate-500 leading-relaxed">Provide clothes, books, or medical supplies for our community hubs.</p>
            <Link to="/donations" className="text-emerald-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              Donate Items <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section - Atmospheric Style */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight">
                Transparency is Not a Feature, It's Our <span className="text-rose-500 italic">Foundation.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">80G Tax Benefits</h4>
                    <p className="text-slate-500">All financial donations are eligible for tax deductions under Section 80G of the Income Tax Act.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <LayoutDashboard size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Real-time M5 Tracking</h4>
                    <p className="text-slate-500">See exactly how your funds are being used through our live intelligence dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/trust/800/600" 
                  alt="Transparency" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-xs">
                <p className="text-lg font-serif italic text-slate-800">"Your donation directly supports our Lucknow Joy Room, providing a safe space for children to learn and play."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center space-y-8">
        <Heart size={64} className="mx-auto text-rose-500" />
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900">Be the Change Today.</h2>
        <Link to="/donations" className="inline-block bg-rose-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/20">
          Make a Donation
        </Link>
      </section>
    </div>
  );
}
