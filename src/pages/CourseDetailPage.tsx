import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award,
  Youtube,
  ArrowRight,
  Lock,
  Volume2,
  VolumeX,
  HelpCircle
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const QUIZ_DATA: Record<number, QuizQuestion[]> = {
  1: [
    { question: "What does NIOS stand for?", options: ["National Institute of Open Schooling", "National Indian Open School", "New Institute of Online Schooling"], correctAnswer: 0 },
    { question: "Who is the target audience for NIOS?", options: ["Only children", "Only adults", "Anyone seeking flexible education"], correctAnswer: 2 }
  ],
  2: [
    { question: "What is the primary goal of Sneh-Rakshak?", options: ["Physical health", "Mental health first aid", "Financial aid"], correctAnswer: 1 }
  ],
  4: [
    { question: "Under the DPDP Act 2023, what is the maximum penalty for a data breach?", options: ["₹1 Crore", "₹50 Crore", "₹250 Crore"], correctAnswer: 2 },
    { question: "Which guidelines must be followed for child safety in NGOs?", options: ["POCSO Guidelines", "FSSAI Standards", "ISO 9001"], correctAnswer: 0 },
    { question: "Is it allowed to take screenshots of beneficiary data?", options: ["Yes, for reporting", "No, it is strictly prohibited", "Only with verbal consent"], correctAnswer: 1 }
  ]
};

interface Lesson {
  id: number;
  title: string;
  video_url: string;
  content: string;
  order_index: number;
  completed?: boolean;
}

interface Course {
  id: number;
  title: string;
  track: string;
  description: string;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(activeLesson?.content || "");
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch(`/api/courses/${courseId}/lessons`)
        ]);
        
        const courses = await courseRes.json();
        const courseData = courses.find((c: Course) => c.id === Number(courseId));
        const lessonsData = await lessonsRes.json();
        
        setCourse(courseData);
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setActiveLesson(lessonsData[0]);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleComplete = async () => {
    if (!activeLesson) return;
    setCompleting(true);
    try {
      await fetch(`/api/lessons/${activeLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }) // Demo User ID
      });
      
      setLessons(prev => prev.map(l => l.id === activeLesson.id ? { ...l, completed: true } : l));
      
      // Auto-advance to next lesson
      const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < lessons.length - 1) {
        setActiveLesson(lessons[currentIndex + 1]);
      } else {
        // Course completed!
        alert("Congratulations! You have completed this course module.");
        navigate('/lms');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-ngo-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Course Not Found</h2>
        <Link to="/lms" className="text-ngo-primary font-bold hover:underline flex items-center justify-center gap-2">
          <ChevronLeft size={20} /> Back to LMS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/lms" className="text-slate-500 hover:text-ngo-primary font-bold flex items-center gap-2 mb-6 transition-colors">
          <ChevronLeft size={20} /> Back to Training Engine
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-ngo-primary/10 text-ngo-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              {course.track} Module
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">{course.title}</h1>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</div>
              <div className="text-lg font-bold text-ngo-primary">
                {Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-ngo-primary/10 flex items-center justify-center text-ngo-primary">
              <Award size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Video Player & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            {activeLesson?.video_url ? (
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeLesson.video_url.split('v=')[1]}`}
                title={activeLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                <Youtube size={64} className="mb-4" />
                <p>Video content loading...</p>
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-slate-900">{activeLesson?.title}</h2>
              <button 
                onClick={toggleSpeech}
                className={cn(
                  "p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
                  isSpeaking ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600 hover:bg-ngo-primary/10 hover:text-ngo-primary"
                )}
              >
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                {isSpeaking ? "Stop Reading" : "Read Lesson"}
              </button>
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p>{activeLesson?.content || "In this lesson, we will explore the core concepts of this module. Please watch the video above carefully as it contains essential information for your certification."}</p>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Understand the foundational principles of {course.track.toLowerCase()}.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Learn practical application strategies for field work.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Identify key metrics for social impact assessment.</span>
                </li>
              </ul>
            </div>

            {/* Quiz Section */}
            <AnimatePresence>
              {showQuiz && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-200"
                >
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HelpCircle size={20} className="text-ngo-primary" />
                    Knowledge Check
                  </h3>
                  <div className="space-y-8">
                    {(QUIZ_DATA[Number(courseId)] || []).map((q, qIdx) => (
                      <div key={qIdx} className="space-y-4">
                        <p className="font-bold text-slate-800">{qIdx + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qIdx] = oIdx;
                                setQuizAnswers(newAnswers);
                              }}
                              disabled={quizSubmitted}
                              className={cn(
                                "p-4 rounded-xl border-2 text-left text-sm font-bold transition-all",
                                quizAnswers[qIdx] === oIdx 
                                  ? (quizSubmitted 
                                      ? (oIdx === q.correctAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-rose-50 border-rose-500 text-rose-700")
                                      : "bg-ngo-primary/10 border-ngo-primary text-ngo-primary")
                                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {!quizSubmitted ? (
                    <button 
                      onClick={async () => {
                        const questions = QUIZ_DATA[Number(courseId)] || [];
                        const correctCount = quizAnswers.reduce((acc, ans, idx) => 
                          ans === questions[idx].correctAnswer ? acc + 1 : acc, 0);
                        const score = (correctCount / questions.length) * 100;
                        
                        setQuizSubmitted(true);
                        
                        // If it's the M3 course (id 4), unlock M4 Hub if score is 100
                        if (Number(courseId) === 4 && score === 100) {
                          try {
                            await fetch('/api/lms/quiz-complete', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: 1, score: 100 })
                            });
                            alert("Congratulations! You have passed the M3 Compliance Quiz. The National Partnership Hub (M4) is now unlocked!");
                          } catch (err) {
                            console.error('Error unlocking M4 Hub:', err);
                          }
                        }
                      }}
                      disabled={quizAnswers.length < (QUIZ_DATA[Number(courseId)] || []).length}
                      className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-ngo-primary transition-all disabled:opacity-50"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div className="mt-8 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-center">
                      Quiz Completed! You can now mark the lesson as complete.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
              {!showQuiz && !lessons.find(l => l.id === activeLesson?.id)?.completed ? (
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-ngo-primary transition-all flex items-center gap-3"
                >
                  Take Knowledge Check <HelpCircle size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  disabled={completing || lessons.find(l => l.id === activeLesson?.id)?.completed || (showQuiz && !quizSubmitted)}
                  className="bg-ngo-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-ngo-primary/90 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : lessons.find(l => l.id === activeLesson?.id)?.completed ? (
                    <><CheckCircle2 size={20} /> Completed</>
                  ) : (
                    <>Mark as Complete <ArrowRight size={20} /></>
                  )}
                </button>
              )}
              
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
                <Clock size={16} /> 15 Min Lesson
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-ngo-primary" /> Module Curriculum
            </h3>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${activeLesson?.id === lesson.id ? 'bg-ngo-primary/5 border-ngo-primary text-ngo-primary' : 'bg-white border-slate-50 text-slate-600 hover:border-ngo-primary/30'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${lesson.completed ? 'bg-emerald-500 text-white' : activeLesson?.id === lesson.id ? 'bg-ngo-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {lesson.completed ? <CheckCircle2 size={16} /> : index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-bold leading-tight">{lesson.title}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Video Lesson</div>
                  </div>
                  {activeLesson?.id === lesson.id && <Play size={14} className="animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ngo-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h4 className="text-lg font-serif font-bold mb-4">Related Modules</h4>
            <div className="space-y-4">
              <Link to="/lms" className="block p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                <div className="text-[10px] font-bold text-ngo-primary uppercase tracking-widest mb-1">Next in Track</div>
                <div className="text-sm font-bold">Advanced {course.track} Strategies</div>
              </Link>
              <Link to="/lms" className="block p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Elective</div>
                <div className="text-sm font-bold">Community Leadership 101</div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-lg font-serif font-bold mb-4">Certification Path</h4>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              Complete all lessons in this module to earn your verified certificate and unlock the next level of the M3 Training Engine.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-ngo-primary" /> Verified Digital Certificate
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-ngo-primary" /> LinkedIn Integration
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Unlock Field Internship
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
