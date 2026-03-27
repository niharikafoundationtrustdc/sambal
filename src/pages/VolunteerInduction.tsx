import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  ChevronRight, 
  Award,
  FileText,
  HelpCircle,
  Youtube,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Lesson {
  id: number;
  title: string;
  video_url: string;
  content: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function VolunteerInduction() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  // Mock user data - in real app, this comes from Auth context
  useEffect(() => {
    // In real app, fetch from /api/users/me
    const mockUser = {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Pending_Volunteer',
      uin: 'VOL-2026-001',
      m3_completed: false
    };
    setUser(mockUser);

    if (mockUser.m3_completed) {
      setQuizPassed(true);
    }

    // Fetch induction course lessons
    fetch('/api/courses/4/lessons')
      .then(res => res.json())
      .then(lessons => {
        const grouped: Module[] = [
          { id: 1, title: 'Module 1: Our Mission & Your Impact', lessons: lessons.slice(0, 3) },
          { id: 2, title: 'Module 2: Data Privacy & Indian Law', lessons: lessons.slice(3, 6) },
          { id: 3, title: 'Module 3: Mental Health Sensitivity & Ethics', lessons: lessons.slice(6, 9) },
          { id: 4, title: 'Module 4: Technical Tools & Role-Specific Training', lessons: lessons.slice(9) },
        ];
        setModules(grouped);
      });

    // Fetch quiz data
    fetch('/api/quizzes/4')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setQuizData({
            ...data,
            questions: JSON.parse(data.questions)
          });
        }
      });
  }, []);

  const handleLessonComplete = (lessonId: number) => {
    setModules(prev => prev.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l)
    })));
    setActiveLesson(null);
  };

  const allLessonsCompleted = modules.every(mod => mod.lessons.every(l => l.completed));

  const handleQuizSubmit = async () => {
    if (!quizData) return;
    
    let correctCount = 0;
    quizData.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / quizData.questions.length) * 100;

    if (score === 100) {
      try {
        const payload = { userId: user.id, score, passed: true };
        await fetch(`/api/quizzes/${quizData.id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // M5 Webhook: Log Quiz Submission
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M3_QUIZ_SUBMISSION',
            payload,
            secure_url: '/volunteer/induction'
          })
        }).catch(err => console.error('M5 Quiz Log Failed:', err));

        setQuizPassed(true);
        setQuizStarted(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert(`You scored ${score}%. You must score 100% to proceed. Please review the materials and try again.`);
      setAnswers([]);
    }
  };

  const handleFinalUpgrade = async () => {
    if (!ndaSigned) return;
    setIsUpgrading(true);
    
    try {
      const payload = {
        targetRole: 'Virtual_Intern_MSW', // Example target role
        uin: user.uin,
        name: user.name
      };

      const response = await fetch(`/api/users/${user.id}/upgrade-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // M5 Webhook: Log Role Upgrade
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M3_ROLE_UPGRADE',
            payload,
            secure_url: '/volunteer/induction'
          })
        }).catch(err => console.error('M5 Upgrade Log Failed:', err));

        alert("Congratulations! Your role has been upgraded. Welcome to the team.");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Upgrade failed", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (user && user.role !== 'Pending_Volunteer' && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl text-center">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Access Restricted</h2>
          <p className="text-slate-600 mb-8">
            This induction course is strictly for users with the <strong>Pending_Volunteer</strong> role.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-ngo-primary/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-ngo-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold text-slate-900">M3: Volunteer Professional Induction</h1>
                  <p className="text-slate-500">Mandatory Certification for Official Onboarding</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">
                  Welcome to the SAMBAL Volunteer Training. This curriculum is designed to align you with our mission, 
                  ensure legal compliance with the <strong>DPDP Act 2023</strong>, and equip you with the technical tools 
                  needed for your specific role.
                </p>
              </div>

              {activeLesson ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 space-y-8"
                >
                  <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                    <iframe 
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                      className="w-full h-full"
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                      Unlisted Training Video
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2rem]">
                    <h3 className="text-xl font-bold mb-4">{activeLesson.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-8">{activeLesson.content}</p>
                    
                    {activeLesson.title.includes("SOS Protocol") && (
                      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-8">
                        <div className="flex items-center gap-3 text-red-600 font-bold mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          CRITICAL: SOS ESCALATION
                        </div>
                        <p className="text-sm text-red-700">
                          Use the <strong>"Escalate to Tier 3"</strong> button in the UI to instantly alert Nodal Admins. 
                          This shifts legal liability and ensures immediate expert intervention.
                        </p>
                      </div>
                    )}

                    <button 
                      onClick={() => handleLessonComplete(activeLesson.id)}
                      className="flex items-center gap-2 px-8 py-4 bg-ngo-primary text-white rounded-2xl font-bold hover:bg-ngo-dark transition-all shadow-lg shadow-ngo-primary/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Lesson as Complete
                    </button>
                  </div>
                </motion.div>
              ) : quizStarted ? (
                <div className="mt-12 bg-slate-50 p-10 rounded-[2.5rem] border-2 border-ngo-primary/20">
                  <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                    <HelpCircle className="w-7 h-7 text-ngo-primary" />
                    Capstone: Privacy & Ethics Assessment
                  </h3>
                  
                  <div className="space-y-10">
                    {quizData?.questions.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-4">
                        <p className="font-bold text-lg text-slate-800">{qIdx + 1}. {q.question}</p>
                        <div className="grid gap-3">
                          {q.options.map((opt: string, oIdx: number) => (
                            <button 
                              key={oIdx} 
                              onClick={() => {
                                const newAnswers = [...answers];
                                newAnswers[qIdx] = oIdx;
                                setAnswers(newAnswers);
                              }}
                              className={cn(
                                "p-4 text-left bg-white border rounded-2xl transition-all",
                                answers[qIdx] === oIdx 
                                  ? "border-ngo-primary bg-ngo-primary/5 ring-2 ring-ngo-primary/20" 
                                  : "border-slate-200 hover:border-ngo-primary"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button 
                      disabled={answers.length < (quizData?.questions.length || 0)}
                      onClick={handleQuizSubmit}
                      className={cn(
                        "w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                        answers.length === (quizData?.questions.length || 0)
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Submit Assessment
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : quizPassed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <Award className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-4">Assessment Passed!</h3>
                  <p className="text-emerald-700 mb-10 max-w-md mx-auto">
                    You have successfully completed the M3 Induction. To finalize your onboarding, please sign the Digital NDA below.
                  </p>

                  <div className="bg-white p-8 rounded-[2rem] shadow-sm text-left max-w-xl mx-auto border border-emerald-100">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Digital NDA & Consent
                    </h4>
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 mb-6 h-32 overflow-y-auto border border-slate-100">
                      I legally agree to the Manisha Mandir Non-Disclosure Agreement (NDA). I understand that any breach of data privacy 
                      under the DPDP Act 2023 carries severe legal consequences. I will not take screenshots, share beneficiary data, 
                      or access unauthorized information...
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={ndaSigned}
                        onChange={(e) => setNdaSigned(e.target.checked)}
                        className="w-6 h-6 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        I legally agree to the Manisha Mandir Non-Disclosure Agreement (NDA).
                      </span>
                    </label>
                  </div>

                  <button 
                    disabled={!ndaSigned || isUpgrading}
                    onClick={handleFinalUpgrade}
                    className={cn(
                      "mt-10 px-12 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 mx-auto",
                      ndaSigned 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {isUpgrading ? "Upgrading Access..." : "Complete Onboarding"}
                    <UserCheck className="w-6 h-6" />
                  </button>
                </motion.div>
              ) : (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-bold mb-2">Thin-Client Hosting</h4>
                    <p className="text-sm text-slate-500">All training videos are hosted externally to ensure zero load on our core servers.</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-bold mb-2">Legal Compliance</h4>
                    <p className="text-sm text-slate-500">Curriculum strictly aligned with DPDP Act 2023 and Mental Health Ethics.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-serif font-bold mb-6">Course Curriculum</h3>
              <div className="space-y-8">
                {modules.map((mod) => (
                  <div key={mod.id}>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{mod.title}</h4>
                    <div className="space-y-3">
                      {mod.lessons.map((lesson) => (
                        <button 
                          key={lesson.id}
                          onClick={() => !quizPassed && setActiveLesson(lesson)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                            activeLesson?.id === lesson.id 
                              ? "bg-ngo-primary/10 text-ngo-primary" 
                              : "hover:bg-slate-50"
                          )}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Play className="w-5 h-5 text-slate-300 group-hover:text-ngo-primary transition-colors" />
                          )}
                          <span className={cn(
                            "text-sm font-medium",
                            lesson.completed ? "text-slate-400 line-through" : "text-slate-700"
                          )}>
                            {lesson.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <button 
                  disabled={!allLessonsCompleted || quizPassed}
                  onClick={() => setQuizStarted(true)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    allLessonsCompleted && !quizPassed
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {quizPassed ? "Assessment Complete" : "Start Capstone Quiz"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-ngo-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="text-lg font-serif font-bold mb-4">Support Hub</h4>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Stuck on a lesson or technical issue? Our Nodal Admins are available for live support.
              </p>
              <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
                Contact Training Lead
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
