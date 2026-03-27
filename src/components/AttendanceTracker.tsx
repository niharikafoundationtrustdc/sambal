import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Utensils, Save, CheckCircle2, Loader2 } from 'lucide-react';

export default function AttendanceTracker() {
  const [stats, setStats] = useState({
    nios_attendance: 0,
    meals_served: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/stats/daily')
      .then(res => res.json())
      .then(data => {
        setStats({
          nios_attendance: data.nios_attendance || 0,
          meals_served: data.meals_served || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching daily stats:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/stats/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
      if (res.ok) {
        setMessage('Stats updated successfully! Impact Pulse will reflect these changes.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving stats:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-ngo-primary" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 rounded-[3rem] max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-ngo-primary text-white flex items-center justify-center">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Lucknow Center Tracker</h2>
          <p className="text-slate-500">Daily NIOS Attendance & Mid-Day Meal Logging</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-blue-600" size={24} />
            <h3 className="font-bold text-blue-900">Daily NIOS Attendance</h3>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={stats.nios_attendance}
              onChange={(e) => setStats({ ...stats, nios_attendance: parseInt(e.target.value) || 0 })}
              className="w-full text-4xl font-bold bg-white border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 text-blue-900"
            />
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Students</span>
          </div>
        </div>

        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="text-emerald-600" size={24} />
            <h3 className="font-bold text-emerald-900">Meals Served Today</h3>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={stats.meals_served}
              onChange={(e) => setStats({ ...stats, meals_served: parseInt(e.target.value) || 0 })}
              className="w-full text-4xl font-bold bg-white border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 text-emerald-900"
            />
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Meals</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400 italic">
          * This data directly updates the "Impact Pulse" ticker on the homepage.
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-ngo-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Update Daily Stats'}
        </button>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-emerald-100 text-emerald-700 rounded-2xl text-center font-bold text-sm"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
