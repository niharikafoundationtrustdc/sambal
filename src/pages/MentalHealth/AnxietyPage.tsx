import React from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

const AnxietyPage = () => {
  const anxietySigns = [
    { title: 'Physical', description: 'Racing heart, shortness of breath, trembling, or sweating.' },
    { title: 'Emotional', description: 'Feeling tense, nervous, or a sense of impending danger.' },
    { title: 'Mental', description: 'Constant worrying, difficulty concentrating, or mind going blank.' },
    { title: 'Behavioral', description: 'Avoiding situations that cause anxiety, or restlessness.' },
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
          <div className="bg-ngo-secondary p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ngo-primary/20 rounded-full -ml-24 -mb-24 blur-2xl" />
            
            <Activity size={48} className="mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl font-serif font-black uppercase tracking-tighter mb-4">Understanding Anxiety</h1>
            <p className="text-ngo-warm/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Anxiety is a normal human emotion, but when it becomes overwhelming or persistent, it can affect your daily life.
            </p>
          </div>

          <div className="p-12 space-y-12">
            {/* What is Anxiety? */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-ngo-secondary mb-6 flex items-center gap-3">
                <AlertCircle size={28} className="text-ngo-primary" />
                What is Anxiety?
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>
                  Anxiety is a feeling of unease, such as worry or fear, that can be mild or severe. Everyone has feelings of anxiety at some point in their life. For example, you may feel worried and anxious about sitting an exam, or having a medical test or job interview.
                </p>
                <p className="mt-4">
                  However, some people find it hard to control their worries. Their feelings of anxiety are more constant and can often affect their daily lives.
                </p>
              </div>
            </section>

            {/* Signs of Anxiety */}
            <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Common Signs of Anxiety</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {anxietySigns.map((sign) => (
                  <div key={sign.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <h3 className="font-serif font-bold text-ngo-secondary mb-2">{sign.title}</h3>
                    <p className="text-sm text-slate-600">{sign.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Simple Management */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-ngo-secondary mb-6 flex items-center gap-3">
                <Heart size={28} className="text-rose-500" />
                Ways to Manage Anxiety
              </h2>
              <div className="grid gap-4">
                {[
                  'Grounding techniques (e.g., the 5-4-3-2-1 method)',
                  'Limiting caffeine and alcohol intake',
                  'Practicing mindfulness or meditation',
                  'Keeping a journal to track triggers',
                  'Engaging in regular physical activity',
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-4 p-4 bg-ngo-warm/30 rounded-2xl border border-ngo-warm/50">
                    <CheckCircle2 size={20} className="text-ngo-primary shrink-0" />
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
                    If anxiety is making you feel overwhelmed, affecting your daily life, or causing physical symptoms, it's important to talk to someone. You don't have to go through this alone.
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

export default AnxietyPage;
