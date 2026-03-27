import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Award, 
  Globe, 
  Type, 
  LogIn, 
  Menu, 
  X,
  MapPin,
  Search,
  Heart,
  User,
  Users,
  HeartPulse,
  MessageSquare,
  MessageCircle,
  Check,
  Video,
  Activity,
  Shield,
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
  Database,
  BarChart3,
  LogOut,
  Wifi,
  Smile,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { INDIAN_LANGUAGES, LanguageCode } from '../constants/languages';
import { t } from '../constants/translations';

import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChanged, 
  getUserProfile, 
  db, 
  doc, 
  setDoc, 
  Timestamp 
} from '../firebase';

type UserRole = 'Super_Admin' | 'admin' | 'Expert' | 'Researcher' | 'Intern' | 'STUDENT' | 'User' | 'guest';

interface HeaderProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const Header = ({ fontSize, setFontSize, language, setLanguage }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFounderDropdownOpen, setIsFounderDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [emergencyHide, setEmergencyHide] = useState(false);
  const [isCalmMode, setIsCalmMode] = useState(false);
  const [isWellnessDropdownOpen, setIsWellnessDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        let profile = await getUserProfile(user.uid);
        
        if (!profile) {
          // Create default profile for new user
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'User',
            createdAt: Timestamp.now()
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          profile = newProfile;
        }
        
        setUserRole(profile.role as UserRole);
      } else {
        setCurrentUser(null);
        setUserRole('guest');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isCalmMode) {
      document.body.classList.add('calm-mode');
    } else {
      document.body.classList.remove('calm-mode');
    }
  }, [isCalmMode]);
  const [isJoinUsDropdownOpen, setIsJoinUsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setEmergencyHide(data.emergency_hide === 'true'))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const toggleFontSize = () => {
    setFontSize(fontSize === 16 ? 18 : 16);
  };

  const navLinks = [
    { name: 'Lucknow', to: '/service', icon: MapPin },
    { name: 'Find Help Locally', to: '/find-help', icon: Search },
    { name: 'Community Support', to: '/community', icon: MessageCircle },
    { name: 'Support Hub', to: '/search', icon: Users },
  ].filter(link => !(emergencyHide && link.to === '/service'));

  const roleBasedLinks = {
    STUDENT: [
      { name: 'My Dashboard', to: '/dashboard', icon: User },
      { name: 'My Progress', to: '/progress', icon: Activity },
      { name: 'Joy Room', to: '/joy-room', icon: Video },
    ],
    Intern: [
      { name: 'My Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { name: 'M2 Audio Hub', to: '/m2-audio', icon: HeartPulse },
      { name: 'Incident Log', to: '/staff/incident-log', icon: AlertCircle },
    ],
    Researcher: [
      { name: 'My Dashboard', to: '/dashboard', icon: User },
      { name: 'Data Gateway', to: '/data', icon: Database },
      { name: 'Impact Reports', to: '/reports', icon: BarChart3 },
      { name: 'Incident Log', to: '/staff/incident-log', icon: AlertCircle },
    ],
    Expert: [
      { name: 'Expert Dashboard', to: '/expert-dashboard', icon: ShieldCheck },
      { name: 'Clinical Library', to: '/clinical-library', icon: BookOpen },
      { name: 'Incident Log', to: '/staff/incident-log', icon: AlertCircle },
    ],
    Super_Admin: [
      { name: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
      { name: 'Master Ledger', to: '/admin/m5/ledger', icon: Database },
      { name: 'Campus Governance', to: '/admin/campus', icon: ShieldCheck },
      { name: 'Incident Log', to: '/staff/incident-log', icon: AlertCircle },
    ],
    admin: [
      { name: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
      { name: 'Master Ledger', to: '/admin/m5/ledger', icon: Database },
      { name: 'Incident Log', to: '/staff/incident-log', icon: AlertCircle },
    ],
  };

  const miniDoors = [
    { name: 'Help', to: '/search' },
    { name: 'Education', to: '/lms' },
    { name: 'Wellness', to: '/wellness' },
    { name: 'Service', to: '/service' },
    { name: 'Donate', to: '/donate' },
  ].filter(door => !(emergencyHide && door.to === '/service'));

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-center justify-between transition-all duration-500", isScrolled ? "h-16" : "h-20")}>
          
          {/* Legacy Anchor (Left) */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className={cn(
                  "bg-ngo-primary rounded-xl flex items-center justify-center text-white font-serif font-bold shadow-lg group-hover:scale-105 transition-all duration-500 overflow-hidden",
                  isScrolled ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl"
                )}>
                  <img 
                    src="https://picsum.photos/seed/founder-legacy/100/100" 
                    alt="Founder" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Legacy Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Award size={8} className="text-white" />
                </div>
              </div>
              <div className={cn("hidden lg:block transition-all duration-500", isScrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                <h1 className="font-serif font-bold text-ngo-primary text-lg leading-none">Manisha Mandir</h1>
                <p className="text-[8px] uppercase tracking-[0.2em] text-ngo-secondary font-bold mt-0.5">Heritage of Care</p>
              </div>
            </Link>

            <div className={cn("hidden xl:flex items-center gap-4 transition-all duration-500", isScrolled && "opacity-0 w-0 overflow-hidden")}>
              <div className="relative">
                <button 
                  onMouseEnter={() => setIsFounderDropdownOpen(true)}
                  onMouseLeave={() => setIsFounderDropdownOpen(false)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors py-2"
                >
                  About
                  <ChevronDown size={14} className={cn("transition-transform", isFounderDropdownOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isFounderDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setIsFounderDropdownOpen(true)}
                      onMouseLeave={() => setIsFounderDropdownOpen(false)}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 mt-1"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-serif font-bold text-ngo-primary mb-1">Our Heritage</h3>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {t('founderDescription', language)}
                          </p>
                          <Link to="/founder" className="inline-block mt-2 text-[10px] font-bold text-ngo-secondary hover:underline">
                            Founder's Journey →
                          </Link>
                        </div>
                        <div className="pt-3 border-t border-slate-50">
                          <Link to="/recognition" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">
                            <Award size={14} className="text-amber-500" />
                            Recognition & Awards
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wellness Dropdown (Stigma-Free: Rural Vitality & Family Harmony) */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setIsWellnessDropdownOpen(true)}
                  onMouseLeave={() => setIsWellnessDropdownOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors py-2"
                >
                  <HeartPulse size={14} className="text-rose-500" />
                  Rural Vitality & Family Harmony
                  <ChevronDown size={14} className={cn("transition-transform", isWellnessDropdownOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isWellnessDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setIsWellnessDropdownOpen(true)}
                      onMouseLeave={() => setIsWellnessDropdownOpen(false)}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 mt-1"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Mental Health</h3>
                          <div className="space-y-2">
                            <Link to="/mental-health/stress" className="block text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">Understanding Stress</Link>
                            <Link to="/mental-health/anxiety" className="block text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">Understanding Anxiety</Link>
                            <Link to="/mental-health/depression" className="block text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">Understanding Depression</Link>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-50">
                          <Link to="/self-care" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">
                            <Heart size={14} className="text-emerald-500" />
                            Self-Care Strategies
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Join Us Dropdown */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setIsJoinUsDropdownOpen(true)}
                  onMouseLeave={() => setIsJoinUsDropdownOpen(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors py-2"
                >
                  <Users size={14} className="text-blue-500" />
                  Join Us
                  <ChevronDown size={14} className={cn("transition-transform", isJoinUsDropdownOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isJoinUsDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setIsJoinUsDropdownOpen(true)}
                      onMouseLeave={() => setIsJoinUsDropdownOpen(false)}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 mt-1"
                    >
                      <div className="space-y-3">
                        <Link to="/volunteer" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">
                          <Heart size={14} className="text-rose-500" />
                          Volunteer with Us
                        </Link>
                        <Link to="/internship" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">
                          <GraduationCap size={14} className="text-ngo-primary" />
                          Intern with Us
                        </Link>
                        <div className="pt-2 border-t border-slate-50">
                          <Link to="/contact" className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-ngo-primary transition-colors">
                            <MessageSquare size={14} className="text-slate-400" />
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mini-Doors (Visible on Scroll) */}
          <div className={cn(
            "hidden xl:flex items-center gap-4 transition-all duration-500",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}>
            {miniDoors.map((door) => (
              <Link 
                key={door.to}
                to={door.to}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-ngo-primary transition-colors border-b-2 border-transparent hover:border-ngo-primary pb-1"
              >
                {door.name}
              </Link>
            ))}
            <Link 
              to="/search" 
              className="bg-ngo-primary text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md hover:bg-ngo-primary/90 transition-all"
            >
              Referral
            </Link>
          </div>

          {/* Global Navigation (Center - Hidden on Scroll) */}
          <div className={cn("hidden xl:flex items-center gap-4 transition-all duration-500", isScrolled && "opacity-0 w-0 overflow-hidden")}>
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to}
                className={cn(
                  "text-xs font-bold tracking-wide transition-all hover:text-ngo-primary flex items-center gap-1.5",
                  location.pathname === link.to ? "text-ngo-primary" : "text-slate-600"
                )}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            ))}
            
            {/* Role-Based Links */}
            {userRole !== 'guest' && roleBasedLinks[userRole as keyof typeof roleBasedLinks]?.map((link) => (
              <Link 
                key={link.to}
                to={link.to}
                className={cn(
                  "text-xs font-bold tracking-wide transition-all hover:text-ngo-primary flex items-center gap-1.5 px-3 py-1 rounded-full bg-ngo-primary/5 border border-ngo-primary/10",
                  location.pathname === link.to ? "text-ngo-primary bg-ngo-primary/10" : "text-slate-600"
                )}
              >
                <link.icon size={14} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action & Accessibility (Right) */}
          <div className="flex items-center gap-2">
            {/* Rural 3G Optimization Indicator */}
            <div className={cn(
              "hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600",
              isScrolled ? "scale-90" : ""
            )}>
              <Wifi size={14} className="animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Rural 3G Optimized</span>
            </div>

            {/* SAMBAL Yuva Sewa Samman */}
            <Link 
              to="/nominations"
              className={cn(
                "hidden 2xl:flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-[10px] font-bold shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5",
                isScrolled ? "px-2 py-1" : "px-3 py-1.5"
              )}
            >
              <Award size={14} />
              <span className="uppercase tracking-wider">Yuva Samman</span>
            </Link>

            {/* Need Immediate Support CTA (RED/YELLOW) */}
            <Link 
              to="/emergency"
              className={cn(
                "flex items-center gap-2 bg-yellow-400 text-red-600 rounded-full font-black shadow-[0_0_20px_rgba(234,67,53,0.4)] hover:bg-yellow-500 transition-all hover:scale-105 border-2 border-red-600",
                isScrolled ? "px-3 py-1.5 text-[10px]" : "px-5 py-2.5 text-xs"
              )}
            >
              <Activity size={isScrolled ? 14 : 18} className="animate-pulse" />
              <span className="uppercase tracking-tighter whitespace-nowrap">Need Immediate Support</span>
            </Link>

            {/* Live Joy Room Pulsing Button (Always visible for children or guests) */}
            {(userRole === 'guest' || userRole === 'STUDENT') && (
              <motion.a
                href="https://meet.google.com/lookup/joyroom" // Placeholder URL
                target="_blank"
                rel="noopener noreferrer"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0px rgba(225, 29, 72, 0)",
                    "0 0 0 8px rgba(225, 29, 72, 0.2)",
                    "0 0 0 0px rgba(225, 29, 72, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={cn(
                  "hidden sm:flex items-center gap-1.5 bg-rose-600 text-white rounded-full font-bold shadow-xl hover:bg-rose-700 transition-all",
                  isScrolled ? "px-2.5 py-1 text-[9px]" : "px-4 py-2 text-xs"
                )}
              >
                <Video size={isScrolled ? 12 : 16} className="animate-pulse" />
                <span className="uppercase tracking-widest">{isScrolled ? "Joy Room" : "Live Joy Room"}</span>
              </motion.a>
            )}

            <div className="flex items-center bg-slate-100 rounded-full p-0.5 relative">
              {/* Language Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="p-1 rounded-full hover:bg-white transition-colors text-slate-600 flex items-center gap-0.5"
                  title={t('toggleLanguage', language)}
                >
                  <Globe size={16} />
                  <span className="text-[8px] font-bold uppercase">{language}</span>
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 max-h-80 overflow-y-auto"
                      >
                        {INDIAN_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code as LanguageCode);
                              setIsLangDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors",
                              language === lang.code ? "text-ngo-primary font-bold" : "text-slate-600"
                            )}
                          >
                            <span>{lang.native} ({lang.name})</span>
                            {language === lang.code && <Check size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Accessibility: Font Resizer */}
              <button 
                onClick={toggleFontSize}
                className="p-1.5 rounded-full hover:bg-white transition-colors text-slate-600"
                title={t('resizeFont', language)}
              >
                <Type size={18} />
              </button>

              {/* Calm Mode Toggle */}
              <button 
                onClick={() => setIsCalmMode(!isCalmMode)}
                className={cn(
                  "p-1.5 rounded-full transition-all",
                  isCalmMode ? "bg-slate-700 text-white shadow-inner" : "hover:bg-white text-slate-600"
                )}
                title="Toggle Calm Mode (Reduced visual noise)"
              >
                <Smile size={18} />
              </button>
            </div>

            {/* Entry Gate / Role Switcher for Demo */}
            {!currentUser ? (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 bg-ngo-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-ngo-primary/90 transition-all"
              >
                <LogIn size={16} />
                <span className="hidden lg:inline">Login with Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col items-end mr-1">
                  <span className="text-[10px] font-bold text-ngo-primary uppercase tracking-widest leading-none">{userRole}</span>
                  <span className="text-[8px] text-slate-400 font-medium uppercase tracking-widest">{currentUser.displayName}</span>
                </div>
                <button 
                  onClick={() => signOutUser()}
                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden p-2 text-ngo-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold text-slate-700 p-3 rounded-2xl hover:bg-ngo-warm transition-colors"
                >
                  <link.icon size={24} className="text-ngo-primary" />
                  {link.name}
                </Link>
              ))}

              {/* Role-Based Links Mobile */}
              {userRole !== 'guest' && roleBasedLinks[userRole as keyof typeof roleBasedLinks]?.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-bold text-ngo-primary p-3 rounded-2xl bg-ngo-primary/5 border border-ngo-primary/10 transition-colors"
                >
                  <link.icon size={24} />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <motion.a 
                  href="https://meet.google.com/lookup/joyroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="flex items-center justify-center gap-3 bg-rose-600 text-white p-5 rounded-2xl font-bold text-lg shadow-xl"
                >
                  <Video size={24} className="animate-pulse" />
                  Join Live Joy Room
                </motion.a>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 font-bold text-sm"
                  >
                    <Globe size={18} />
                    {INDIAN_LANGUAGES.find(l => l.code === language)?.native || 'Language'}
                  </button>
                  <button 
                    onClick={toggleFontSize}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 font-bold text-sm"
                  >
                    <Type size={18} />
                    {fontSize === 16 ? t('largeText', language) : t('normalText', language)}
                  </button>
                </div>
                
                {isLangDropdownOpen && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-2xl max-h-48 overflow-y-auto">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as LanguageCode);
                          setIsLangDropdownOpen(false);
                        }}
                        className={cn(
                          "text-left px-3 py-2 text-xs rounded-lg transition-colors",
                          language === lang.code ? "bg-ngo-primary text-white" : "hover:bg-white"
                        )}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                to="/nominations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white p-4 rounded-2xl font-bold"
              >
                <Award size={20} />
                {t('sambalYuva', language)}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
