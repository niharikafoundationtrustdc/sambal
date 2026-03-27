import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Quote, Heart, Users, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecognitionLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Editorial/Magazine Style */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="text-center space-y-8 mb-24">
          <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-bold uppercase tracking-widest">
            Success Stories & Recognition
          </span>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-slate-900 leading-[0.85] tracking-tighter">
            The <span className="text-amber-500 italic">Faces</span> of Change.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Celebrating the resilience of our community and the incredible impact of our donors and volunteers in Lucknow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/success1/800/1000" 
                alt="Success Story" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
              <Quote className="text-amber-400" size={48} />
              <h3 className="text-3xl font-serif font-bold">"I can finally dream of becoming a doctor."</h3>
              <p className="text-white/80">Manisha, 12, Lucknow Campus Student</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/success2/800/1000" 
                alt="Success Story" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
              <Quote className="text-amber-400" size={48} />
              <h3 className="text-3xl font-serif font-bold">"The M5 Hub gave me the tools to help my village."</h3>
              <p className="text-white/80">Rajesh, Community Health Ambassador</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recognition Grid - Warm Organic Style */}
      <section className="bg-amber-50/50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Our Champions</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Recognizing the individuals and organizations that make our work possible.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <Star size={32} />
              </div>
              <h4 className="font-bold text-slate-900">Top Donors</h4>
              <p className="text-sm text-slate-500">Individuals who have contributed significantly to our relief funds.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users size={32} />
              </div>
              <h4 className="font-bold text-slate-900">Lead Volunteers</h4>
              <p className="text-sm text-slate-500">Experts who have dedicated over 100+ hours to our projects.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award size={32} />
              </div>
              <h4 className="font-bold text-slate-900">Community Hubs</h4>
              <p className="text-sm text-slate-500">Villages that have shown exceptional progress in health metrics.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <Heart size={32} />
              </div>
              <h4 className="font-bold text-slate-900">Social Partners</h4>
              <p className="text-sm text-slate-500">Organizations that help us amplify our message and reach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Oversized Typographic Style */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center space-y-12">
        <h2 className="text-7xl md:text-[10rem] font-serif font-bold text-slate-100 leading-none tracking-tighter select-none">
          JOIN THE STORY
        </h2>
        <div className="relative -mt-24 md:-mt-48 space-y-8">
          <p className="text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your support creates the next success story. Join us in building a legacy of change in Lucknow.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/recognition" className="bg-ngo-primary text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-ngo-primary/90 transition-all shadow-2xl shadow-ngo-primary/20">
              View Recognition Wall
            </Link>
            <Link to="/nominations" className="bg-white border-2 border-slate-200 text-slate-700 px-12 py-6 rounded-2xl font-bold text-xl hover:border-ngo-primary/30 transition-all">
              Nominate a Champion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
