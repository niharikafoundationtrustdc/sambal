import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Shield, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AwarenessLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Editorial Style */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <span className="px-4 py-2 bg-ngo-primary/10 text-ngo-primary rounded-full text-sm font-bold uppercase tracking-widest">
              Health Awareness Campaign
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 leading-[0.9] tracking-tighter">
              Bridging the <span className="text-ngo-primary italic">Health Gap</span> in Rural Communities.
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Every child deserves access to quality healthcare. Join our mission to bring medical expertise to the most remote corners of Lucknow.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/search" className="bg-ngo-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-ngo-primary/90 transition-all shadow-xl shadow-ngo-primary/20 flex items-center gap-2">
                Explore Health Resources <ArrowRight size={20} />
              </Link>
              <Link to="/donate" className="bg-white border-2 border-slate-100 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg hover:border-ngo-primary/30 transition-all">
                Support the Mission
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/health/800/1000" 
                alt="Health Campaign" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Activity size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Live Impact</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Over <span className="text-slate-900 font-bold">2,500+</span> children screened in the last 3 months across 12 villages.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Minimal Utility */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-serif font-bold text-ngo-primary">12</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Villages Covered</p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-serif font-bold text-ngo-primary">150+</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical Camps</p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-serif font-bold text-ngo-primary">85%</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recovery Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Blocks - Gutenberg Style */}
      <section className="max-w-4xl mx-auto px-4 py-24 space-y-24">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold text-slate-900">Our Approach to Preventive Care</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We don't just treat symptoms; we build systems. Our mobile clinics are equipped with basic diagnostic tools and staffed by trained paramedics who understand the local context.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <Shield className="text-ngo-primary" size={32} />
              <h4 className="text-xl font-bold text-slate-900">Early Detection</h4>
              <p className="text-slate-500">Screening for common nutritional deficiencies and respiratory issues before they become critical.</p>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <Users className="text-ngo-primary" size={32} />
              <h4 className="text-xl font-bold text-slate-900">Community Training</h4>
              <p className="text-slate-500">Empowering local women as health ambassadors to promote hygiene and basic first aid.</p>
            </div>
          </div>
        </div>

        <div className="bg-ngo-primary rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8">
          <Heart size={64} className="mx-auto text-white/30" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Be the Change Lucknow Needs.</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your contribution funds the medical supplies, transport, and expert time needed to keep our mobile clinics running.
          </p>
          <Link to="/donations" className="inline-block bg-white text-ngo-primary px-12 py-6 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all shadow-2xl">
            Donate to Health Fund
          </Link>
        </div>
      </section>
    </div>
  );
}
