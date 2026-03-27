import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  Home, 
  Search, 
  BookOpen, 
  HeartPulse, 
  Users, 
  HandHeart, 
  Menu, 
  X,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyEmergencyCTA from './components/StickyEmergencyCTA';
import { LanguageCode } from './constants/languages';

// Pages - Lazy Loaded
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const SearchHub = lazy(() => import('./pages/SearchHub.tsx'));
const LMSPage = lazy(() => import('./pages/LMSPage.tsx'));
const WellnessPage = lazy(() => import('./pages/WellnessPage.tsx'));
const ServicePage = lazy(() => import('./pages/ServicePage.tsx'));
const DonationPage = lazy(() => import('./pages/DonationPage.tsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));
const FounderPage = lazy(() => import('./pages/FounderPage.tsx'));
const RecognitionPage = lazy(() => import('./pages/RecognitionPage.tsx'));
const NominationsPage = lazy(() => import('./pages/NominationsPage.tsx'));
const LucknowCenterPage = lazy(() => import('./pages/LucknowCenterPage.tsx'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage.tsx'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage.tsx'));
const StressPage = lazy(() => import('./pages/MentalHealth/StressPage.tsx'));
const AnxietyPage = lazy(() => import('./pages/MentalHealth/AnxietyPage.tsx'));
const DepressionPage = lazy(() => import('./pages/MentalHealth/DepressionPage.tsx'));
const SelfCarePage = lazy(() => import('./pages/SelfCarePage.tsx'));
const UserDashboard = lazy(() => import('./pages/UserDashboard.tsx'));
const FindHelpPage = lazy(() => import('./pages/FindHelpPage.tsx'));
const CommunitySupport = lazy(() => import('./pages/CommunitySupport.tsx'));
const VolunteerInduction = lazy(() => import('./pages/VolunteerInduction.tsx'));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage.tsx'));
const InternshipPage = lazy(() => import('./pages/InternshipPage.tsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx'));
const NationalPartnershipHub = lazy(() => import('./components/NationalPartnershipHub.tsx'));
const YuwaSewaSammanHub = lazy(() => import('./components/YuwaSewaSammanHub.tsx'));
const ResourceMobilizationHub = lazy(() => import('./components/ResourceMobilizationHub.tsx'));
const CampaignDashboard = lazy(() => import('./pages/Campaigns/CampaignDashboard.tsx'));
const AwarenessLanding = lazy(() => import('./pages/Campaigns/AwarenessLanding.tsx'));
const ServiceLanding = lazy(() => import('./pages/Campaigns/ServiceLanding.tsx'));
const FundraisingLanding = lazy(() => import('./pages/Campaigns/FundraisingLanding.tsx'));
const RecognitionLanding = lazy(() => import('./pages/Campaigns/RecognitionLanding.tsx'));
const WishTreePage = lazy(() => import('./pages/WishTreePage.tsx'));
const SnehBazaar = lazy(() => import('./pages/SnehBazaar.tsx'));
const ImpactControlTower = lazy(() => import('./pages/ImpactControlTower.tsx'));
const ResearcherPortal = lazy(() => import('./pages/ResearcherPortal.tsx'));
const AdminGuard = lazy(() => import('./components/AdminGuard.tsx'));
const ExpertOnboarding = lazy(() => import('./pages/ExpertOnboarding.tsx'));
const TeleBridge = lazy(() => import('./pages/TeleBridge.tsx'));
const ClinicalLibrary = lazy(() => import('./pages/ClinicalLibrary.tsx'));
const ExpertDashboard = lazy(() => import('./pages/ExpertDashboard.tsx'));
const CampusBookingPage = lazy(() => import('./pages/CampusBookingPage.tsx'));
const AdminCampusDashboard = lazy(() => import('./pages/AdminCampusDashboard.tsx'));
const PersonnelFeedbackPage = lazy(() => import('./pages/PersonnelFeedbackPage.tsx'));
const AdminMasterLedger = lazy(() => import('./pages/AdminMasterLedger.tsx'));
const StaffIncidentLog = lazy(() => import('./pages/StaffIncidentLog.tsx'));
const FormPage = lazy(() => import('./pages/FormPage.tsx'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-ngo-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
      active ? "text-ngo-primary bg-ngo-primary/10" : "text-slate-500 hover:text-ngo-primary hover:bg-ngo-primary/5"
    )}
  >
    <Icon size={24} />
    <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{label}</span>
  </Link>
);

const MobileNav = () => {
  const location = useLocation();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-between items-center z-50">
      <NavItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
      <NavItem to="/search" icon={Search} label="Search" active={location.pathname === '/search'} />
      <NavItem to="/lms" icon={BookOpen} label="Learn" active={location.pathname === '/lms'} />
      <NavItem to="/wellness" icon={HeartPulse} label="Wellness" active={location.pathname === '/wellness'} />
      <NavItem to="/donate" icon={HandHeart} label="Donate" active={location.pathname === '/donate'} />
    </div>
  );
};

export default function App() {
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header 
          fontSize={fontSize} 
          setFontSize={setFontSize} 
          language={language} 
          setLanguage={setLanguage} 
        />
        <main className="flex-grow pt-24 pb-24 md:pb-0">
          <Suspense fallback={<LoadingFallback />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchHub />} />
                <Route path="/lms" element={<LMSPage />} />
                <Route path="/lms/:courseId" element={<CourseDetailPage />} />
                <Route path="/wellness" element={<WellnessPage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path="/donate" element={<DonationPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/recognition" element={<RecognitionPage />} />
                <Route path="/nominations" element={<NominationsPage />} />
                <Route path="/lucknow-center" element={<LucknowCenterPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/mental-health/stress" element={<StressPage />} />
                <Route path="/mental-health/anxiety" element={<AnxietyPage />} />
                <Route path="/mental-health/depression" element={<DepressionPage />} />
                <Route path="/self-care" element={<SelfCarePage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/find-help" element={<FindHelpPage />} />
                <Route path="/community" element={<CommunitySupport />} />
              <Route path="/volunteer-induction" element={<VolunteerInduction />} />
                <Route path="/volunteer" element={<VolunteerPage />} />
                <Route path="/internship" element={<InternshipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/partnership-hub" element={<NationalPartnershipHub />} />
                <Route path="/yuwa-hub" element={<YuwaSewaSammanHub />} />
                <Route path="/resource-hub" element={<ResourceMobilizationHub />} />
                <Route path="/campaign-hub" element={<CampaignDashboard />} />
                <Route path="/campaign/awareness" element={<AwarenessLanding />} />
                <Route path="/campaign/service" element={<ServiceLanding />} />
                <Route path="/campaign/fundraising" element={<FundraisingLanding />} />
                <Route path="/campaign/recognition" element={<RecognitionLanding />} />
                <Route path="/wish-tree" element={<WishTreePage />} />
                <Route path="/bazaar" element={<SnehBazaar />} />
                <Route path="/expert-onboarding" element={<ExpertOnboarding />} />
                <Route path="/tele-bridge" element={<TeleBridge />} />
                <Route path="/clinical-library" element={<ClinicalLibrary />} />
                <Route path="/campus/book" element={<CampusBookingPage />} />
                <Route path="/personnel/feedback" element={<PersonnelFeedbackPage />} />
                <Route path="/admin/campus" element={
                  <AdminGuard requiredRole={['Super_Admin', 'admin']}>
                    <AdminCampusDashboard />
                  </AdminGuard>
                } />
                <Route path="/expert-dashboard" element={
                  <AdminGuard requiredRole={['Expert', 'Super_Admin', 'admin']}>
                    <ExpertDashboard />
                  </AdminGuard>
                } />
                <Route path="/impact" element={
                  <AdminGuard requiredRole={['Super_Admin', 'admin']}>
                    <ImpactControlTower />
                  </AdminGuard>
                } />
                <Route path="/researcher-portal" element={
                  <AdminGuard requiredRole={['Researcher', 'Super_Admin', 'admin']}>
                    <ResearcherPortal />
                  </AdminGuard>
                } />
                <Route path="/admin/m5/ledger" element={
                  <AdminGuard requiredRole={['Super_Admin', 'admin']}>
                    <AdminMasterLedger />
                  </AdminGuard>
                } />
                <Route path="/staff/incident-log" element={<StaffIncidentLog />} />
                <Route path="/forms/:formId" element={<FormPage />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
        <MobileNav />
        <StickyEmergencyCTA />
      </div>
    </Router>
  );
}
