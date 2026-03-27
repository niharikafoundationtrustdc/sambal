import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  ShieldAlert, 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HeartPulse,
  BookOpen,
  Users,
  Mic,
  ExternalLink,
  Send,
  Play,
  Award,
  Trophy,
  Star,
  TrendingUp,
  Lightbulb,
  Coins,
  Gem,
  Shield,
  Database,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const moods = [
    { icon: Smile, label: 'Great', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Meh, label: 'Okay', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Frown, label: 'Low', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    // M5 Webhook: Log Mood Check-in
    fetch('/api/m5/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: 'M2_MOOD_CHECKIN',
        payload: { mood: moods[index].label, timestamp: new Date().toISOString() },
        secure_url: '/dashboard'
      })
    }).catch(err => console.error('M5 Mood Log Failed:', err));
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">How are you feeling today?</h3>
          <p className="text-sm text-slate-500">Your daily micro-check-in helps us support you better.</p>
        </div>
        <div className="flex gap-4">
          {moods.map((mood, i) => (
            <button
              key={i}
              onClick={() => handleMoodSelect(i)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                selectedMood === i 
                  ? `${mood.bg} border-ngo-primary scale-105` 
                  : "bg-slate-50 border-transparent hover:bg-slate-100"
              )}
            >
              <mood.icon className={cn("w-8 h-8", mood.color)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClinicalRecordCard = ({ title, date, doctor }: any) => (
  <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
        <FileText size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500">{date} • {doctor}</p>
      </div>
    </div>
    <button className="p-3 rounded-xl bg-white text-slate-400 hover:text-ngo-primary hover:bg-ngo-primary/5 transition-all">
      <Download size={20} />
    </button>
  </div>
);

const AudioTranscriptionWorkflow = ({ userId }: { userId: number }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [transcription, setTranscription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/audio-tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const handleSubmit = async () => {
    if (!activeTask || !transcription) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/audio-tasks/${activeTask.id}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription, userId })
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== activeTask.id));
        setActiveTask(null);
        setTranscription('');
        alert("Transcription submitted successfully to M5 Ledger.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
            <Mic className="text-ngo-primary" /> M2: Audio Transcription Workflow
          </h2>
          <p className="text-sm text-slate-500">Transcribe voice notes from beneficiaries into the M5 Google Sheet.</p>
        </div>
        <div className="px-4 py-2 bg-ngo-primary/10 text-ngo-primary rounded-full text-xs font-bold uppercase tracking-widest">
          {tasks.length} Pending Tasks
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => setActiveTask(task)}
              className={cn(
                "w-full p-6 rounded-2xl border text-left transition-all",
                activeTask?.id === task.id 
                  ? "bg-ngo-primary/5 border-ngo-primary shadow-md" 
                  : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm"
              )}
            >
              <h4 className="font-bold text-slate-900 mb-1">{task.title}</h4>
              <p className="text-xs text-slate-500 mb-4">Assigned: {new Date(task.created_at).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 text-ngo-primary text-[10px] font-bold uppercase tracking-widest">
                <Play size={12} /> Click to Start
              </div>
            </button>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">No pending audio tasks found.</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
          {activeTask ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Active Task: {activeTask.title}</h4>
                <a 
                  href={activeTask.audio_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-lg text-ngo-primary hover:bg-ngo-primary hover:text-white transition-all shadow-sm"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Audio Source</p>
                <audio controls className="w-full h-8">
                  <source src={activeTask.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Transcription (Awadhi/Bhojpuri to Hindi/English)</label>
                <textarea 
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Type the transcription here..."
                  className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-ngo-primary focus:border-transparent transition-all outline-none text-sm"
                />
              </div>

              <button 
                disabled={!transcription || isSubmitting}
                onClick={handleSubmit}
                className="w-full py-4 bg-ngo-primary text-white rounded-xl font-bold hover:bg-ngo-dark transition-all shadow-lg shadow-ngo-primary/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting..." : "Submit to M5 Ledger"}
                <Send size={18} />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Mic className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">No Task Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Select a voice note from the left to begin transcription.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const InnovationIntake = ({ userId }: { userId: number }) => {
  const [idea, setIdea] = useState({ beneficiary: '', action: '', impact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/donor-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...idea, userId })
      });
      if (res.ok) {
        // M5 Webhook: Log Innovation Intake
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M10_INNOVATION_INTAKE',
            payload: { ...idea, userId },
            secure_url: '/dashboard'
          })
        }).catch(err => console.error('M5 Innovation Log Failed:', err));

        setSuccess(true);
        setIdea({ beneficiary: '', action: '', impact: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
          <Lightbulb size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">M10: Innovation Intake</h2>
          <p className="text-sm text-slate-500">Propose a campaign idea. Our M5 quarantine engine will review it.</p>
        </div>
      </div>

      {success ? (
        <div className="bg-emerald-100 text-emerald-700 p-6 rounded-2xl font-bold flex items-center gap-3">
          <CheckCircle2 /> Idea submitted for M5 review!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <input 
            required
            placeholder="Target Beneficiary"
            className="p-4 bg-white rounded-xl border border-indigo-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={idea.beneficiary}
            onChange={e => setIdea({...idea, beneficiary: e.target.value})}
          />
          <input 
            required
            placeholder="Proposed Action"
            className="p-4 bg-white rounded-xl border border-indigo-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={idea.action}
            onChange={e => setIdea({...idea, action: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              required
              placeholder="Expected Impact"
              className="flex-1 p-4 bg-white rounded-xl border border-indigo-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={idea.impact}
              onChange={e => setIdea({...idea, impact: e.target.value})}
            />
            <button 
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "..." : <Send size={20} />}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>({ honors: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/users/1/dashboard');
        const data = await res.json();
        setUser(data.user);
        setDashboardData(data);
        
        if (data.user.m3_completed) {
          const certRes = await fetch(`/api/users/${data.user.id}/certificate`);
          const certData = await certRes.json();
          setCertificate(certData);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      }
    };
    fetchDashboard();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-ngo-primary uppercase tracking-[0.2em] mb-2 block">Personalized Dashboard</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Welcome back, {user.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Role: {user.role.replace(/_/g, ' ')}
            </span>
            {user.role_tier && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Gem size={10} /> {user.role_tier.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all">
            <ShieldAlert size={18} />
            Digital Safety Plan
          </button>
          <button className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all">
            <Calendar size={18} />
            Schedule Session
          </button>
        </div>
      </div>

      <MoodTracker />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          
          {user.role === 'Virtual_Intern_MSW' && (
            <AudioTranscriptionWorkflow userId={user.id} />
          )}

          <InnovationIntake userId={user.id} />

          {/* Active Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                <BookOpen className="text-ngo-primary" /> Active Learning
              </h2>
              <button className="text-ngo-primary font-bold text-sm hover:underline">View All Courses</button>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ngo-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-ngo-primary/20 text-ngo-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-ngo-primary/30">
                  In Progress
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Sneh-Rakshak: Mental Health First Aid</h3>
                <p className="text-white/60 text-sm mb-8 max-w-md">Continue where you left off: Lesson 4 - Crisis Intervention Strategies.</p>
                
                <div className="mb-8">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span>Course Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="h-full bg-ngo-primary"
                    />
                  </div>
                </div>
                
                <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all">
                  Resume Training <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Clinical Records */}
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
              <HeartPulse className="text-rose-500" /> Secure Clinical Records
            </h2>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <ClinicalRecordCard 
                title="Tele-Session E-Prescription"
                date="Mar 15, 2024"
                doctor="Dr. Ananya Sharma"
              />
              <ClinicalRecordCard 
                title="Wellness Assessment Report"
                date="Feb 28, 2024"
                doctor="Bio-Well Diagnostic Zone"
              />
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Clinical records are encrypted and stored securely. Access is restricted to you and your authorized healthcare providers.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* My Honors */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" /> My Honors
              </h3>
              <Link to="/yuwa-hub" className="text-ngo-primary text-[10px] font-bold uppercase tracking-widest hover:underline">View Hub</Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData.honors && dashboardData.honors.length > 0 ? (
                dashboardData.honors.map((honor: any) => (
                  <div key={honor.id} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 group hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{honor.title}</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{honor.quarter} {honor.year}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Star className="text-slate-300" size={24} />
                  </div>
                  <p className="text-slate-400 text-[10px] italic">No honors attained yet.</p>
                  <Link to="/yuwa-hub" className="mt-4 inline-block px-4 py-2 bg-ngo-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:shadow-lg transition-all">
                    Start Serving
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* M6 Certification */}
          <section className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-900/20 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <Award className="w-12 h-12 mb-4 text-emerald-400" />
            <h3 className="text-xl font-serif font-bold mb-2">M6: Yuwa Sewa Samman</h3>
            <p className="text-stone-400 text-xs mb-6 leading-relaxed">
              Institutionalizing the legacy of Dr. Sarojini Agarwal. Log your service to vulnerable demographics and earn quarterly honors.
            </p>
            <Link 
              to="/yuwa-hub"
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              Enter Honors Hub <ArrowRight size={16} />
            </Link>
          </section>

          {/* M7: Resource Mobilization */}
          <section className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-900/20 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <TrendingUp className="w-12 h-12 mb-4 text-indigo-400" />
            <h3 className="text-xl font-serif font-bold mb-2">M7: Resource Mobilization</h3>
            <p className="text-indigo-200 text-xs mb-6 leading-relaxed">
              Our fully integrated financial mobilization engine. Support campus governance, micro-donations, and CSR projects.
            </p>
            <Link 
              to="/resource-hub"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              Enter Resource Hub <ArrowRight size={16} />
            </Link>
          </section>

          {certificate && (
            <section className="bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <Award className="w-12 h-12 mb-4 text-emerald-200" />
              <h3 className="text-xl font-serif font-bold mb-2">M6: Official Certification</h3>
              <p className="text-emerald-100 text-xs mb-6 leading-relaxed">
                You have successfully completed the {certificate.course}. Your official certificate is ready.
              </p>
              <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Download Certificate
              </button>
            </section>
          )}

          {/* Community Support */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
              <Users size={20} className="text-blue-500" /> Community Support
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                <h4 className="text-sm font-bold text-slate-900 mb-1">ASHA Case Discussions</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">12 New Posts</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Peer Support & Wellness</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">5 New Posts</p>
              </div>
              <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                Enter Forums
              </button>
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" /> Upcoming Sessions
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold leading-none">22</span>
                  <span className="text-[8px] uppercase font-black">Mar</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Group Wellness Circle</h4>
                  <p className="text-[10px] text-slate-500">10:00 AM • Zoom Meeting</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold leading-none">15</span>
                  <span className="text-[8px] uppercase font-black">Mar</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-through">1-on-1 Consultation</h4>
                  <p className="text-[10px] text-slate-500">Completed</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <div className="bg-ngo-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-ngo-primary/20 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-serif font-bold">Impact Points</h3>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold mb-2">{user.points}</div>
            <p className="text-white/60 text-xs mb-6">You've helped 12 families this month. Keep up the great work!</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 size={14} /> Top 5% Contributor
            </div>
          </div>

          {/* Sneh-Sarthi Credits */}
          <div className="bg-amber-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/20 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-serif font-bold">Sneh-Sarthi Credits</h3>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Coins size={20} />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold mb-2">{user.sneh_sarthi_credits || 0}</div>
            <p className="text-white/90 text-xs mb-6">Earned via referrals. Use these for artisan merchandise or campus perks.</p>
            <Link 
              to="/bazaar"
              className="w-full py-3 bg-white text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
            >
              Redeem in Bazaar <ArrowRight size={16} />
            </Link>
          </div>

          {/* M8: Impact Control Tower (Admin Only) */}
          {(user.role === 'Super_Admin' || user.role === 'admin') && (
            <div className="bg-ngo-dark text-white p-8 rounded-[2.5rem] shadow-xl shadow-ngo-dark/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-serif font-bold">M8: Control Tower</h3>
                <div className="w-10 h-10 bg-ngo-primary rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
              </div>
              <p className="text-white/60 text-xs mb-6">Manage data governance, partner approvals, and public visibility switches.</p>
              <Link 
                to="/impact"
                className="w-full py-3 bg-ngo-primary text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Enter Control Tower <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* M9: Expert Portal (Expert Only) */}
          {(user.role === 'Expert' || user.role === 'Super_Admin' || user.role === 'admin') && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-serif font-bold text-slate-900">M9: Expert Portal</h3>
                <div className="w-10 h-10 bg-ngo-primary/10 text-ngo-primary rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">Access Tele-Bridge sessions, clinical library, and dialect bounties.</p>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/expert-dashboard"
                  className="py-3 bg-ngo-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
                <Link 
                  to="/clinical-library"
                  className="py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Library <BookOpen size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* M8: Researcher Portal (Researcher Only) */}
          {(user.role === 'Researcher' || user.role === 'Super_Admin' || user.role === 'admin') && (
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 mt-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-serif font-bold">Researcher Portal</h3>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Database size={20} />
                </div>
              </div>
              <p className="text-white/60 text-xs mb-6">Access anonymized datasets for clinical and social impact research.</p>
              <Link 
                to="/researcher-portal"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Enter Portal <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
