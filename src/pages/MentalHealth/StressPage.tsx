import React from 'react';
import { motion } from 'motion/react';
import { Wind, Activity, Heart, Shield, CheckCircle2 } from 'lucide-react';

const StressPage = () => {
  const stressSigns = [
    { title: 'Physical', description: 'Headaches, muscle tension, fatigue, or sleep issues.' },
    { title: 'Emotional', description: 'Irritability, feeling overwhelmed, or mood swings.' },
    { title: 'Mental', description: 'Difficulty concentrating, racing thoughts, or constant worrying.' },
    { title: 'Behavioral', description: 'Changes in appetite, social withdrawal, or procrastination.' },
  ];

  return (
    <div className="min-h-screen bg-ngo-warm pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className="bg-ngo-primary p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ngo-secondary/20 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <Wind size={48} className="mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl font-serif font-black uppercase tracking-tighter mb-4">Understanding Stress</h1>
            <p className="text-ngo-warm/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Stress is your body's natural response to challenges. While some stress can be motivating, chronic stress can impact your well-being.
            </p>
          </div>

          <div className="p-12 space-y-12">
            {/* What is Stress? */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-ngo-primary mb-6 flex items-center gap-3">
                <Activity size={28} className="text-ngo-secondary" />
                What is Stress?
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>
                  Stress is a feeling of being under abnormal pressure. This pressure can come from different aspects of your life, such as increased workload, a transitional period, an argument you have with your family, or new and existing financial worries.
                </p>
                <p className="mt-4">
                  It has a physical effect on you. When you are stressed, your body releases a hormone called adrenaline, which is often called the 'fight or flight' hormone. This is what gives you a surge of energy to help you deal with the situation.
                </p>
              </div>
            </section>

            {/* Signs of Stress */}
            <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Common Signs of Stress</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {stressSigns.map((sign) => (
                  <div key={sign.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <h3 className="font-serif font-bold text-ngo-primary mb-2">{sign.title}</h3>
                    <p className="text-sm text-slate-600">{sign.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Simple Management */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-ngo-primary mb-6 flex items-center gap-3">
                <Heart size={28} className="text-rose-500" />
                Simple Ways to Manage Stress
              </h2>
              <div className="grid gap-4">
                {[
                  'Deep breathing exercises (try the 4-7-8 technique)',
                  'Regular physical activity, even a short walk',
                  'Connecting with friends or family',
                  'Prioritizing sleep and healthy eating',
                  'Setting realistic goals and boundaries',
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-4 p-4 bg-ngo-warm/30 rounded-2xl border border-ngo-warm/50">
                    <CheckCircle2 size={20} className="text-ngo-secondary shrink-0" />
                    <span className="text-slate-700 font-medium">{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* When to Seek Help */}
            <section className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
              <div className="flex items-start gap-4">
                <div className="bg-rose-600 text-white p-3 rounded-2xl shadow-lg">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-rose-900 mb-2">When to Seek Help</h2>
                  <p className="text-sm text-rose-800 leading-relaxed">
                    If stress is making you feel overwhelmed, affecting your daily life, or causing physical symptoms, it's important to talk to someone. You don't have to go through this alone.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StressPage;
