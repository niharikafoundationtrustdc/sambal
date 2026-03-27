import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, Users, Calendar, ArrowRight, Quote } from 'lucide-react';

const FounderPage = () => {
  return (
    <div className="min-h-screen bg-ngo-warm">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/founder-hero/1920/1080?blur=2" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ngo-warm/0 via-ngo-warm/80 to-ngo-warm" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-ngo-primary/10 text-ngo-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            The Heart of Manisha Mandir
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6"
          >
            Dr. Sarojini Agarwal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-700 font-serif italic"
          >
            "A mother to the motherless, a beacon of hope for 800+ daughters."
          </motion.p>
        </div>
      </section>

      {/* The Journey */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/founder-portrait/800/1000" 
                className="rounded-[3rem] shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-ngo-primary rounded-full blur-3xl opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-serif font-bold text-slate-900">A 40-Year Legacy of Love</h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                The journey of Manisha Mandir began with a personal tragedy that transformed into a national mission. 
                After losing her own daughter, Manisha, in a tragic accident, Dr. Sarojini Agarwal decided that 
                no child should ever feel alone or abandoned.
              </p>
              <p>
                Since 1984, she has opened her heart and home to over 800 girls, providing them not just with 
                shelter, but with a family, an education, and the confidence to lead independent lives.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="p-6 rounded-3xl bg-white shadow-sm border border-slate-100">
                <div className="text-4xl font-serif font-bold text-ngo-primary mb-2">800+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daughters Nurtured</div>
              </div>
              <div className="p-6 rounded-3xl bg-white shadow-sm border border-slate-100">
                <div className="text-4xl font-serif font-bold text-ngo-primary mb-2">40+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Years of Service</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-ngo-primary py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Quote size={400} className="absolute -top-20 -left-20" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Quote size={48} className="mx-auto mb-8 text-amber-400" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 leading-tight">
            "Every girl is a seed of potential. My job is simply to provide the soil, the water, and the sun."
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto" />
        </div>
      </section>

      {/* Milestones */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-serif font-bold text-slate-900 text-center mb-16">Key Milestones</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { year: '1984', title: 'The Foundation', desc: 'Manisha Mandir was established in memory of Manisha Agarwal.' },
            { year: '1995', title: 'National Recognition', desc: 'Awarded the Rashtriya Bal Kalyan Puraskar for outstanding service.' },
            { year: '2024', title: 'Digital Pivot', desc: 'Launching the Digital Ecosystem to scale impact across India.' },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="text-2xl font-serif font-bold text-ngo-primary mb-4">{m.year}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{m.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FounderPage;
