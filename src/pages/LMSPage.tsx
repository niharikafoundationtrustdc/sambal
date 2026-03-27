import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Play, 
  ChevronRight, 
  Search,
  Filter,
  Star,
  Users,
  HeartPulse,
  ShieldCheck,
  UserPlus,
  HelpCircle,
  X,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-2xl font-serif font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface Course {
  id: number;
  title: string;
  track: string;
  description: string;
  thumbnail?: string;
}

const LMSPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showHelpdeskModal, setShowHelpdeskModal] = useState(false);
  const [helpdeskData, setHelpdeskData] = useState({ subject: '', question: '' });

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  const handleHelpdeskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { userId: 1, ...helpdeskData };
      const res = await fetch('/api/homework-helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // M5 Webhook: Log Homework Helpdesk Submission
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M3_HOMEWORK_HELPDESK',
            payload,
            secure_url: '/lms'
          })
        }).catch(err => console.error('M5 Homework Log Failed:', err));

        alert("Your question has been submitted to the Expert Helpdesk. You will receive a response within 24-48 hours.");
        setShowHelpdeskModal(false);
        setHelpdeskData({ subject: '', question: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tracks = ['All', 'Academic', 'Health', 'Induction', 'Research'];

  const filteredCourses = activeTab === 'All' 
    ? courses 
    : courses.filter(c => c.track === activeTab);

  const getTrackIcon = (track: string) => {
    switch (track) {
      case 'Academic': return <GraduationCap size={20} className="text-blue-500" />;
      case 'Health': return <HeartPulse size={20} className="text-rose-500" />;
      case 'Induction': return <UserPlus size={20} className="text-emerald-500" />;
      default: return <BookOpen size={20} className="text-ngo-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-ngo-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-ngo-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-8"
          >
            <ShieldCheck size={16} className="text-ngo-primary" />
            M3 Training Engine Activated
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            LMS: Education, Mental Health <br /> & Volunteer Hub
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            Empowering children, ASHA workers, and volunteers through specialized, 
            RCI-aligned training modules designed for ground-level impact.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl text-left min-w-[200px]">
              <div className="text-ngo-primary font-bold text-2xl mb-1">2,100+</div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Active Learners</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl text-left min-w-[200px]">
              <div className="text-ngo-secondary font-bold text-2xl mb-1">45+</div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Expert Modules</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl text-left min-w-[200px]">
              <div className="text-emerald-400 font-bold text-2xl mb-1">98%</div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Completion Rate</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelpdeskModal(true)}
            className="inline-flex items-center gap-3 bg-ngo-primary text-white px-10 py-5 rounded-2xl font-bold shadow-2xl hover:bg-ngo-primary/90 transition-all text-lg"
          >
            <HelpCircle size={24} /> Homework Helpdesk (Form 33)
          </motion.button>
        </div>
      </section>

      {/* Course Explorer */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Course Explorer</h2>
            <p className="text-slate-500">Select a track to begin your specialized training journey.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tracks.map(track => (
              <button
                key={track}
                onClick={() => setActiveTab(track)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === track ? 'bg-ngo-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img 
                    src={course.thumbnail || `https://picsum.photos/seed/${course.id}/800/600`} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-ngo-primary uppercase tracking-widest">
                      {course.track}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={14} /> 12 Lessons
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> 4.9
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    {getTrackIcon(course.track)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.track} Track</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-ngo-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <Link 
                    to={`/lms/${course.id}`}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ngo-primary transition-all shadow-xl"
                  >
                    Start Training <Play size={16} fill="currentColor" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Certification Section */}
      <section className="bg-ngo-primary py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Earn Your Verified <br /> Social Impact Certificate</h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Our courses are developed in collaboration with RCI experts and social scientists. 
              Upon completion, receive a blockchain-verified certificate that validates your 
              expertise in grassroots social work and mental health support.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">RCI Aligned</h4>
                  <p className="text-xs text-white/60">Curriculum follows national rehabilitation standards.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Field Validated</h4>
                  <p className="text-xs text-white/60">Practical insights from 20+ years of ground work.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="bg-white p-4 rounded-[3rem] shadow-2xl rotate-3 scale-95 opacity-50 absolute inset-0" />
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl relative z-10 border-8 border-white/20">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 bg-ngo-primary rounded-2xl flex items-center justify-center text-white font-serif font-bold text-3xl">M</div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificate ID</div>
                  <div className="text-sm font-mono font-bold text-slate-900">MM-2024-8842</div>
                </div>
              </div>
              
              <div className="text-center mb-12">
                <div className="text-[12px] font-bold text-ngo-primary uppercase tracking-[0.3em] mb-4">Certificate of Excellence</div>
                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">Volunteer Intern</h3>
                <p className="text-slate-500 italic">has successfully completed the</p>
                <div className="text-xl font-bold text-slate-900 mt-2">Sneh-Rakshak: Mental Health First Aid</div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="w-32 h-px bg-slate-200" />
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Director Signature</div>
                </div>
                <div className="w-20 h-20 bg-ngo-primary/5 rounded-full flex items-center justify-center border-4 border-ngo-primary/10">
                  <ShieldCheck size={40} className="text-ngo-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpdesk Modal */}
      <Modal 
        isOpen={showHelpdeskModal} 
        onClose={() => setShowHelpdeskModal(false)} 
        title="Expert Homework Helpdesk (Form 33)"
      >
        <form onSubmit={handleHelpdeskSubmit} className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 mb-6">
            <HelpCircle className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Expert Support:</strong> Submit your academic or vocational questions here. Our panel of experts will provide a detailed response within 48 hours.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject / Topic</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all"
              placeholder="e.g. Mathematics - Algebra, NIOS Exam Prep"
              value={helpdeskData.subject}
              onChange={(e) => setHelpdeskData({...helpdeskData, subject: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Question</label>
            <textarea 
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-ngo-primary transition-all min-h-[150px]"
              placeholder="Describe your doubt in detail..."
              value={helpdeskData.question}
              onChange={(e) => setHelpdeskData({...helpdeskData, question: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-ngo-primary text-white rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
            Submit to Experts <Send size={18} />
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default LMSPage;
