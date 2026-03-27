import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Star, CheckCircle2, Trophy, Medal, Users } from 'lucide-react';
import YuwaNominationForm from '../components/YuwaNominationForm';

const RecognitionPage = () => {
  return (
    <div className="min-h-screen bg-ngo-warm py-24">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Institutional Authority
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6">National Recognition</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our commitment to child welfare and social facilitation has been honored by the highest offices of the nation.
          </p>
        </header>

        {/* Major Awards */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <Trophy size={64} className="text-amber-500 mb-8" />
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Rashtriya Bal Kalyan Puraskar</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Awarded for outstanding contribution in the field of child welfare. This national honor recognizes 
              Manisha Mandir's dedication to providing a nurturing environment for children in need.
            </p>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Star size={16} fill="currentColor" />
              National Excellence Award
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-ngo-primary p-12 rounded-[3.5rem] shadow-xl text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <Medal size={64} className="text-amber-400 mb-8" />
            <h2 className="text-3xl font-serif font-bold mb-4">Rajiv Gandhi Manav Seva Award</h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Conferred for exceptional service to humanity. This award highlights Dr. Sarojini Agarwal's 
              lifelong commitment to social facilitation and the empowerment of the girl child.
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldCheck size={16} />
              Humanitarian Service Honor
            </div>
          </motion.div>
        </div>

        {/* Credentials Grid */}
        <section className="bg-white rounded-[4rem] p-16 shadow-sm border border-slate-100">
          <h3 className="text-3xl font-serif font-bold text-slate-900 text-center mb-16">Institutional Credentials</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: '80G Certified', desc: 'Tax-exempt donations for all contributors.' },
              { title: 'FCRA Compliant', desc: 'Authorized to receive international support.' },
              { title: 'NITI Aayog', desc: 'Registered with Darpan portal for transparency.' },
              { title: 'ISO 9001:2015', desc: 'Certified quality management systems.' },
            ].map((c, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-ngo-warm rounded-2xl flex items-center justify-center mx-auto mb-6 text-ngo-primary">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{c.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Yuwa Sewa Samman Nomination */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Yuwa Sewa Samman</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Nominate young leaders (18-35) who are making a significant impact in their communities.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <YuwaNominationForm />
          </div>
        </section>

        {/* Impact Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Years of Impact', value: '40+' },
            { label: 'Awards Received', value: '25+' },
            { label: 'Lives Transformed', value: '800+' },
            { label: 'Center Locations', value: '2' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-serif font-bold text-ngo-primary mb-2">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecognitionPage;
