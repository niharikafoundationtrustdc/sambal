import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Filter, 
  FileText, 
  Download, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Map as MapIcon, 
  List,
  AlertTriangle,
  Calendar,
  Info,
  User,
  Phone,
  X,
  Plus,
  CreditCard,
  Camera,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { MASTER_TAXONOMY, MainCategory, SubCategory } from '../constants/taxonomy';

const MapSection = lazy(() => import('../components/MapSection'));

// Simple geocoding lookup for Lucknow area
const PINCODE_COORDS: Record<string, [number, number]> = {
  '226001': [26.8487, 80.9412], // Hazratganj
  '226010': [26.8517, 80.9982], // Gomti Nagar
  '226016': [26.8667, 81.0167], // Indira Nagar
  '226021': [26.8917, 80.9367], // Jankipuram
  '226024': [26.8217, 80.9167], // Alambagh
  '110001': [28.6315, 77.2167], // Delhi
};

const defaultCenter: [number, number] = [26.8467, 80.9462]; // Lucknow

export default function SearchHub() {
  const [query, setQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [radius, setRadius] = useState('0');
  const [results, setResults] = useState<any>({ ngos: [], schemes: [] });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Taxonomy State
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showM9Widget, setShowM9Widget] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Intake Gate State
  const [helpFor, setHelpFor] = useState<'myself' | 'someone_else' | 'patient' | ''>('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showGapForm, setShowGapForm] = useState(false);
  const [lastSearchId, setLastSearchId] = useState<number | null>(null);
  const [gapSubmitted, setGapSubmitted] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [showSuccessForm, setShowSuccessForm] = useState(false);
  const [successFormData, setSuccessFormData] = useState({
    userName: '',
    contactNumber: '',
    resolvedIssue: '',
    consentGiven: true
  });
  const [derivedState, setDerivedState] = useState<string | null>(null);

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = MASTER_TAXONOMY.find(c => c.label === e.target.value);
    setSelectedMainCategory(category || null);
    setSelectedSubCategory(null);
    setQuery(category ? category.label : '');
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sub = selectedMainCategory?.subCategories.find(s => s.label === e.target.value);
    setSelectedSubCategory(sub || null);
    if (sub) {
      setQuery(sub.label);
      
      // Rule: Mental Health unhides M9 Widget
      if (sub.rule === 'm9' || selectedMainCategory?.label === "Mental Health & De-Addiction") {
        setShowM9Widget(true);
      } else {
        setShowM9Widget(false);
      }

      // Rule: Child Protection triggers SMS alert
      if (sub.rule === 'sms') {
        triggerSmsAlert(sub.label);
      }
    }
  };

  const triggerSmsAlert = async (category: string) => {
    setAlertMessage(`CRITICAL ALERT: Instant SMS sent to NGO Admin for "${category}" request.`);
    // Simulate API call
    try {
      await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SMS_ALERT', category, timestamp: new Date().toISOString() })
      });
    } catch (err) {
      console.error('Failed to log alert:', err);
    }
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const mapCenter = useMemo(() => {
    if (pincode && PINCODE_COORDS[pincode]) {
      return PINCODE_COORDS[pincode];
    }
    return defaultCenter;
  }, [pincode]);

  const markers = useMemo(() => {
    const allMarkers: any[] = [];
    results.ngos.forEach((ngo: any) => {
      if (ngo.pincode && PINCODE_COORDS[ngo.pincode]) {
        allMarkers.push({
          id: `ngo-${ngo.id}`,
          position: PINCODE_COORDS[ngo.pincode],
          title: ngo.name,
          type: 'NGO',
          category: ngo.category,
          tier: ngo.tier || 1,
        });
      }
    });
    // For schemes, we might have multiple pincodes in range
    results.schemes.forEach((scheme: any) => {
      const pins = scheme.pincode_range?.split(',').map((p: string) => p.trim()) || [];
      pins.forEach((p: string) => {
        if (PINCODE_COORDS[p]) {
          allMarkers.push({
            id: `scheme-${scheme.id}-${p}`,
            position: PINCODE_COORDS[p],
            title: scheme.title,
            type: 'Scheme',
            category: scheme.category,
          });
        }
      });
    });
    return allMarkers;
  }, [results]);

  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestionData, setSuggestionData] = useState({
    name: '',
    state: '',
    district: '',
    pincode: '',
    category: ''
  });

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ngos/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData)
      });
      if (res.ok) {
        setAlertMessage("Thank you! Your suggestion has been recorded for verification.");
        setShowSuggestForm(false);
        setSuggestionData({ name: '', state: '', district: '', pincode: '', category: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Spam prevention
    if (!pincode || !selectedMainCategory) {
      setAlertMessage("Please select a category and enter a valid pincode.");
      return;
    }

    setLoading(true);
    setShowGapForm(false);
    setGapSubmitted(false);

    try {
      const params = new URLSearchParams({
        q: query,
        pincode,
        radius,
        age,
        gender,
        category,
        helpFor: helpFor || 'myself',
        language: 'Hindi'
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      
      if (res.status === 429) {
        setAlertMessage(data.error);
        return;
      }

      setResults(data);
      setLastSearchId(data.searchId);
      setDerivedState(data.state);
      
      // M5 Webhook: Log Search
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M2_SEARCH_HUB',
          payload: { query, pincode, age, gender, category, helpFor, resultsCount: data.ngos.length + data.schemes.length },
          secure_url: '/search'
        })
      }).catch(err => console.error('M5 Search Log Failed:', err));

      if (data.ngos.length === 0 && data.schemes.length === 0) {
        setShowGapForm(true);
        // Log failed search
        fetch('/api/search/failed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pincode, query, userId: 1 }) // Demo userId
        }).catch(err => console.error('Failed to log search gap:', err));

        // M5 Webhook: Log Gap
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M2_SEARCH_GAP',
            payload: { query, pincode, timestamp: new Date().toISOString() },
            secure_url: '/search'
          })
        }).catch(err => console.error('M5 Gap Log Failed:', err));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGapReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp || !lastSearchId) return;

    try {
      const res = await fetch('/api/search/gap-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchId: lastSearchId, whatsapp })
      });
      if (res.ok) {
        setGapSubmitted(true);
        setShowGapForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateReferral = async (item: any, type: 'ngo' | 'scheme') => {
    const { jsPDF } = await import('jspdf');
    const slipId = `MM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const userUin = `UIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Log the slip generation
    try {
      const payload = {
        slipId,
        userUin,
        destinationCenter: item.name || item.title,
        intimationSentStatus: 'Pending'
      };
      
      await fetch('/api/slip-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Referral
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M2_REFERRAL_SLIP',
          payload,
          secure_url: '/search'
        })
      }).catch(err => console.error('M5 Referral Log Failed:', err));
    } catch (e) {
      console.error("Failed to log slip:", e);
    }

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Manisha Mandir NGO - Sambal Referral", 20, 20);
    doc.setFontSize(12);
    doc.text(`Referral ID: ${slipId}`, 20, 35);
    doc.text(`User UIN: ${userUin}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    doc.line(20, 55, 190, 55);
    
    doc.setFontSize(16);
    doc.text(type === 'ngo' ? "NGO Details" : "Scheme Details", 20, 70);
    doc.setFontSize(12);
    doc.text(`Name: ${item.name || item.title}`, 20, 80);
    doc.text(`Category: ${item.category}`, 20, 90);
    if (item.address) doc.text(`Address: ${item.address}`, 20, 100);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Legal Disclaimer: Manisha Mandir acts as a digital bridge.", 20, 250);
    doc.text("This referral does not guarantee service but facilitates connection.", 20, 255);
    
    doc.save(`Sambal-Referral-${slipId}.pdf`);
  };

  const submitSuccessStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...successFormData,
        demographics: JSON.stringify({ age, gender, category }),
        assignedIntern: 'Pending Assignment'
      };

      await fetch('/api/case-study-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Success Story
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M2_SUCCESS_STORY',
          payload,
          secure_url: '/search'
        })
      }).catch(err => console.error('M5 Success Story Log Failed:', err));

      alert("आपकी कहानी के लिए धन्यवाद! (Thank you for sharing your story!)");
      setShowSuccessForm(false);
      setSuccessFormData({ userName: '', contactNumber: '', resolvedIssue: '', consentGiven: true });
    } catch (e) {
      console.error("Failed to submit success story:", e);
    }
  };

  const submitGroundReality = async (targetId: number, targetType: string, helpReceived: string) => {
    try {
      const payload = {
        targetId,
        targetType,
        pincode,
        helpReceived,
        voiceNoteUrl: '', // Placeholder
        trustScore: helpReceived === 'Yes' ? 1.0 : (helpReceived === 'Partial' ? 0.5 : 0.0)
      };

      await fetch('/api/ground-reality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Ground Reality
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M2_GROUND_REALITY',
          payload,
          secure_url: '/search'
        })
      }).catch(err => console.error('M5 Ground Reality Log Failed:', err));

      alert("आपकी प्रतिक्रिया के लिए धन्यवाद! (Thank you for your feedback!)");
    } catch (e) {
      console.error("Failed to submit feedback:", e);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">National Social Support Hub</h1>
          <p className="text-slate-600">
            Search over 200,000+ NGOs and Government Schemes across India.
            {derivedState && <span className="ml-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">Region: {derivedState}</span>}
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-ngo-primary text-white shadow-md' : 'text-slate-500 hover:text-ngo-primary'}`}
          >
            <List size={18} /> List
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-ngo-primary text-white shadow-md' : 'text-slate-500 hover:text-ngo-primary'}`}
          >
            <MapIcon size={18} /> Map
          </button>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2rem] mb-12">
        <form onSubmit={handleSearch} className="space-y-8">
          {/* Honeypot */}
          <input 
            type="text" 
            name="website" 
            style={{ display: 'none' }} 
            tabIndex={-1} 
            autoComplete="off" 
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1: Zero-Typing UI */}
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Need (मुख्य आवश्यकता)</label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-slate-100 focus:ring-2 focus:ring-ngo-primary transition-all appearance-none text-sm font-medium"
                    onChange={handleMainCategoryChange}
                    value={selectedMainCategory?.label || ''}
                    required
                  >
                    <option value="">Select Category...</option>
                    {MASTER_TAXONOMY.map(cat => (
                      <option key={cat.label} value={cat.label}>{cat.label} ({cat.hindiLabel})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Specific Service (विशिष्ट सेवा)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-slate-100 focus:ring-2 focus:ring-ngo-primary transition-all appearance-none text-sm font-medium disabled:opacity-50"
                    disabled={!selectedMainCategory}
                    onChange={handleSubCategoryChange}
                    value={selectedSubCategory?.label || ''}
                  >
                    <option value="">Select Service...</option>
                    {selectedMainCategory?.subCategories.map(sub => (
                      <option key={sub.label} value={sub.label}>{sub.label} ({sub.hindiLabel})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">6-Digit Pincode (पिनकोड)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="e.g. 226001" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-slate-100 focus:ring-2 focus:ring-ngo-primary transition-all"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Proxy-Logic Form */}
            <div className="bg-slate-50 p-6 rounded-3xl space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Who is this help for? (यह सहायता किसके लिए है?)</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'myself', label: 'मेरे लिए (Myself)' },
                    { id: 'someone_else', label: 'किसी और के लिए (Someone else)' },
                    { id: 'patient', label: 'मेरे मरीज/छात्र के लिए (Patient/Student)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHelpFor(opt.id as any)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 ${helpFor === opt.id ? 'bg-ngo-primary text-white border-ngo-primary' : 'bg-white text-slate-600 border-slate-100 hover:border-ngo-primary/30'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {helpFor && (
                  <motion.div
                    key={helpFor}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age (उम्र)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-2 rounded-xl border-none bg-white text-sm"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender (लिंग)</label>
                        <select 
                          className="w-full px-4 py-2 rounded-xl border-none bg-white text-sm"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category (श्रेणी)</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border-none bg-white text-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="gen">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all shadow-lg shadow-ngo-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? "Searching..." : <><Search size={20} /> Search Hub</>}
          </button>
        </form>

        <AnimatePresence>
          {alertMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm"
            >
              <AlertTriangle size={20} />
              {alertMessage}
            </motion.div>
          )}
          {selectedSubCategory?.rule === 'cara' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">CARA Guidance Required</h4>
                  <p className="text-xs text-blue-700">All legal adoptions must follow Central Adoption Resource Authority guidelines.</p>
                </div>
              </div>
              <a 
                href="https://cara.nic.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
              >
                cara.nic.in <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {viewMode === 'list' ? (
            <div className="space-y-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <Users className="text-blue-600" /> Nearby NGOs
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.ngos.length} Found</span>
                </div>
                <div className="space-y-4">
                  {results.ngos.length > 0 ? results.ngos.map((ngo: any) => (
                    <motion.div 
                      key={ngo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{ngo.name}</h3>
                          <p className="text-sm text-slate-500 mb-4">{ngo.address}</p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full">{ngo.category}</span>
                            {ngo.verified && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
                          </div>
                        </div>
                        <button 
                          onClick={() => generateReferral(ngo, 'ngo')}
                          className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-ngo-primary hover:text-white transition-all"
                          title="Generate Referral Slip"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Help Received? (क्या सहायता मिली?)</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => submitGroundReality(ngo.id, 'NGO', 'Yes')}
                            className="text-[10px] px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all"
                          >
                            हाँ (Yes)
                          </button>
                          <button 
                            onClick={() => submitGroundReality(ngo.id, 'NGO', 'Partial')}
                            className="text-[10px] px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 hover:bg-amber-100 transition-all"
                          >
                            थोड़ी (Partial)
                          </button>
                          <button 
                            onClick={() => submitGroundReality(ngo.id, 'NGO', 'No')}
                            className="text-[10px] px-3 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 transition-all"
                          >
                            नहीं (No)
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 px-6">
                      <p className="text-slate-400 mb-6">No NGOs found for this search.</p>
                      
                      {showGapForm && !gapSubmitted && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md mx-auto border border-slate-100"
                        >
                          <div className="w-16 h-16 bg-ngo-primary/10 text-ngo-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone size={32} />
                          </div>
                          <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">Service Gap Detected</h4>
                          <p className="text-sm text-slate-500 mb-6">
                            We currently have no resources here. Enter your WhatsApp number to be notified when help arrives.
                          </p>
                          <form onSubmit={handleGapReport} className="space-y-4">
                            <input 
                              type="tel" 
                              placeholder="WhatsApp Number" 
                              className="w-full px-6 py-4 rounded-2xl border-none bg-slate-100 focus:ring-2 focus:ring-ngo-primary text-center font-bold tracking-widest"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              required
                            />
                            <button 
                              type="submit"
                              className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all"
                            >
                              Notify Me
                            </button>
                          </form>
                        </motion.div>
                      )}

                      {gapSubmitted && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-emerald-600 font-bold flex flex-col items-center gap-2"
                        >
                          <ShieldCheck size={48} />
                          <span>Verified Service Gap Logged. We will notify you.</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <FileText className="text-emerald-600" /> Govt Schemes
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.schemes.length} Found</span>
                </div>
                <div className="space-y-4">
                  {results.schemes.length > 0 ? results.schemes.map((scheme: any) => (
                    <motion.div 
                      key={scheme.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <h3 className="font-bold text-lg text-slate-800">{scheme.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 mb-4 line-clamp-2">{scheme.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full">{scheme.category}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedScheme(scheme)}
                            className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                          >
                            विवरण देखें (View Details)
                          </button>
                          <button 
                            onClick={() => generateReferral(scheme, 'scheme')}
                            className="flex items-center gap-2 px-4 py-2 bg-ngo-primary text-white text-xs font-bold rounded-xl hover:bg-ngo-primary/90 transition-all"
                          >
                            <Download size={14} /> Referral Slip
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400">No schemes found for this search.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-[3rem] overflow-hidden h-[600px] relative z-0"
            >
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-ngo-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold text-sm">Loading Map...</p>
                  </div>
                </div>
              }>
                <MapSection mapCenter={mapCenter} markers={markers} />
              </Suspense>
            </motion.div>
          )}
        </div>

        {/* Sidebar / Widgets */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <h3 className="text-xl font-serif font-bold">Suggest a Center</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Can't find a specific NGO or center? Help us expand our national directory by suggesting one.
            </p>
            <button 
              onClick={() => setShowSuggestForm(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Form 39: Suggest Center
            </button>
          </div>

          <AnimatePresence>
            {showM9Widget && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-ngo-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-ngo-primary flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <h3 className="text-xl font-serif font-bold">M9 BookingPress</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Mental health support requires professional intervention. Book a session with our verified counselors instantly.
                  </p>
                  <button className="w-full py-3 bg-ngo-primary text-white rounded-xl font-bold text-sm hover:bg-ngo-primary/90 transition-all">
                    Book Consultation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-2">
              <Info size={20} className="text-ngo-primary" /> Search Tips
            </h3>
            <ul className="space-y-4 text-xs text-slate-500">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-ngo-primary mt-1.5 shrink-0" />
                Select a category for more accurate results.
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-ngo-primary mt-1.5 shrink-0" />
                Enter your pincode to find services nearby.
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-ngo-primary mt-1.5 shrink-0" />
                Download the referral slip to present at the NGO center.
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>

      {/* View Details Modal */}
    <AnimatePresence>
      {selectedScheme && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScheme(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedScheme.source_type === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {selectedScheme.source_type === 'online' ? 'Digital Scheme (API Setu)' : 'Offline State Scheme'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900">{selectedScheme.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedScheme(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Eligibility */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={16} className="text-ngo-primary" /> किसे मिलेगा (Who is eligible)
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <ul className="space-y-2">
                      {Object.entries(JSON.parse(selectedScheme.eligibility_criteria || '{}')).map(([key, value]) => (
                        <li key={key} className="flex justify-between text-sm">
                          <span className="text-slate-500 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-bold text-slate-700">{String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Benefits */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> क्या लाभ है (What is the benefit)
                  </h3>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <p className="text-sm font-medium text-emerald-900">
                      {JSON.parse(selectedScheme.benefits || '{}').financial}
                    </p>
                    <p className="text-xs text-emerald-700 mt-2">
                      {JSON.parse(selectedScheme.benefits || '{}').other}
                    </p>
                  </div>
                </section>

                {/* Documents */}
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> जरूरी दस्तावेज़ (Required Documents)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {JSON.parse(selectedScheme.required_documents || '[]').map((doc: string) => (
                      <div key={doc} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          {doc.toLowerCase().includes('aadhaar') || doc.toLowerCase().includes('card') ? <CreditCard size={16} /> : 
                           doc.toLowerCase().includes('photo') ? <Camera size={16} /> : 
                           <BookOpen size={16} />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 leading-tight">{doc}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => generateReferral(selectedScheme, 'scheme')}
                  className="flex-1 bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Referral Slip
                </button>
                <button 
                  onClick={() => setShowSuccessForm(!showSuccessForm)}
                  className="px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                >
                  {showSuccessForm ? 'Cancel' : 'Share Success Story'}
                </button>
              </div>

              {showSuccessForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <h4 className="font-serif font-bold text-lg mb-4">Share Your Success Story</h4>
                  <form onSubmit={submitSuccessStory} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="आपका नाम (Your Name)" 
                        className="px-4 py-3 rounded-xl border-none bg-white focus:ring-2 focus:ring-ngo-primary text-sm"
                        value={successFormData.userName}
                        onChange={(e) => setSuccessFormData({...successFormData, userName: e.target.value})}
                        required
                      />
                      <input 
                        type="tel" 
                        placeholder="संपर्क नंबर (Contact Number)" 
                        className="px-4 py-3 rounded-xl border-none bg-white focus:ring-2 focus:ring-ngo-primary text-sm"
                        value={successFormData.contactNumber}
                        onChange={(e) => setSuccessFormData({...successFormData, contactNumber: e.target.value})}
                        required
                      />
                    </div>
                    <textarea 
                      placeholder="आपको कैसे मदद मिली? (How did you get help?)" 
                      className="w-full px-4 py-3 rounded-xl border-none bg-white focus:ring-2 focus:ring-ngo-primary h-24 text-sm"
                      value={successFormData.resolvedIssue}
                      onChange={(e) => setSuccessFormData({...successFormData, resolvedIssue: e.target.value})}
                      required
                    />
                    <label className="flex items-center gap-2 text-[10px] text-slate-500">
                      <input 
                        type="checkbox" 
                        checked={successFormData.consentGiven}
                        onChange={(e) => setSuccessFormData({...successFormData, consentGiven: e.target.checked})}
                      />
                      I consent to share my story for research and case study purposes.
                    </label>
                    <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm">Submit Story</button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showSuggestForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Suggest a Center</h3>
                <p className="text-xs text-slate-500">M2 Citizen Crowdsource Gate (Form 39)</p>
              </div>
              <button onClick={() => setShowSuggestForm(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSuggestSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Center Name</label>
                <input
                  required
                  type="text"
                  value={suggestionData.name}
                  onChange={(e) => setSuggestionData({ ...suggestionData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Manisha Mandir Orphanage"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">State</label>
                  <input
                    required
                    type="text"
                    value={suggestionData.state}
                    onChange={(e) => setSuggestionData({ ...suggestionData, state: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Uttar Pradesh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">District</label>
                  <input
                    required
                    type="text"
                    value={suggestionData.district}
                    onChange={(e) => setSuggestionData({ ...suggestionData, district: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Lucknow"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pincode</label>
                  <input
                    required
                    type="text"
                    value={suggestionData.pincode}
                    onChange={(e) => setSuggestionData({ ...suggestionData, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="6 digits"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    required
                    value={suggestionData.category}
                    onChange={(e) => setSuggestionData({ ...suggestionData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Orphanage">Orphanage</option>
                    <option value="Old Age Home">Old Age Home</option>
                    <option value="Disability Center">Disability Center</option>
                    <option value="Women Shelter">Women Shelter</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 leading-relaxed">
                <strong>Note:</strong> Crowdsourced entries are tagged as <em>Verification: Pending</em> and will be mapped with a grey pin until verified by our team.
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Submit Suggestion
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
