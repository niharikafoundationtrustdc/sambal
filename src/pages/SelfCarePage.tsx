import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Heart, Sun, Moon, Coffee, Users, Activity } from 'lucide-react';

const SelfCarePage = () => {
  const strategies = [
    {
      title: 'Physical Self-Care',
      icon: Activity,
      color: 'bg-emerald-500',
      tips: [
        'Get at least 7-8 hours of sleep',
        'Eat balanced, nutritious meals',
        'Take a 20-minute walk outside',
        'Stay hydrated throughout the day',
      ]
    },
    {
      title: 'Emotional Self-Care',
      icon: Heart,
      color: 'bg-rose-500',
      tips: [
        'Practice gratitude journaling',
        'Set healthy boundaries with others',
        'Allow yourself to feel your emotions',
        'Seek therapy or talk to a friend',
      ]
    },
    {
      title: 'Mental Self-Care',
      icon: BookOpen,
      color: 'bg-indigo-500',
      tips: [
        'Read a book for pleasure',
        'Take a break from social media',
        'Learn a new skill or hobby',
        'Practice mindfulness meditation',
      ]
    },
    {
      title: 'Social Self-Care',
      icon: Users,
      color: 'bg-amber-500',
      tips: [
        'Call a loved one just to chat',
        'Join a community group or club',
        'Volunteer for a cause you care about',
        'Spend quality time with friends',
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ngo-warm pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 bg-ngo-primary/10 rounded-3xl mb-6"
          >
            <Sun size={48} className="text-ngo-primary animate-spin-slow" />
          </motion.div>
          <h1 className="text-5xl font-serif font-black text-ngo-primary uppercase tracking-tighter mb-4">Practical Self-Care</h1>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            Self-care isn't selfish. It's about taking the time to nurture your physical, emotional, and mental well-being so you can show up as your best self.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all"
            >
              <div className={`${strategy.color} p-8 text-white flex items-center justify-between`}>
                <h2 className="text-2xl font-serif font-bold">{strategy.title}</h2>
                <strategy.icon size={32} className="opacity-80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  {strategy.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-3 text-slate-600">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${strategy.color.replace('bg-', 'bg-opacity-50 bg-')}`} />
                      <span className="font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Routine Section */}
        <section className="mt-20 bg-white rounded-[40px] p-12 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-serif font-bold text-ngo-primary mb-6">Building a Daily Routine</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Consistency is key to effective self-care. Try incorporating small, manageable habits into your daily schedule to create a sustainable routine that supports your well-being.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                    <Sun size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Morning Ritual</h3>
                    <p className="text-sm text-slate-500">Start your day with intention and calm.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-ngo-primary/10 p-3 rounded-2xl text-ngo-primary">
                    <Coffee size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Mid-Day Reset</h3>
                    <p className="text-sm text-slate-500">Take a moment to breathe and recharge.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                    <Moon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Evening Wind-Down</h3>
                    <p className="text-sm text-slate-500">Prepare your mind and body for restful sleep.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800" 
                alt="Self Care" 
                className="rounded-[32px] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SelfCarePage;
