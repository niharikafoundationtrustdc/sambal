import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Download, 
  ExternalLink, 
  Play, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Video, 
  Globe,
  ChevronRight,
  Tag,
  AlertTriangle,
  Heart,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';

const ZONES = [
  { id: 1, title: 'Zone 1: Diagnostic Armory', icon: Scale, color: 'bg-rose-500', desc: 'Clinical tools, psychometric scales, and risk assessment templates.' },
  { id: 2, title: 'Zone 2: Frontline Care Kit', icon: Heart, color: 'bg-emerald-500', desc: 'Patient handouts, grounding exercises, and de-escalation guides.' },
  { id: 3, title: 'Zone 3: Research & Policy', icon: Globe, color: 'bg-blue-500', desc: 'Peer-reviewed journals, policy papers, and M5 impact reports.' },
  { id: 4, title: 'Zone 4: Masterclass Archive', icon: Video, color: 'bg-amber-500', desc: 'Expert panel discussions, training sessions, and role-play therapy.' },
  { id: 5, title: 'Zone 5: Legal & Compliance', icon: ShieldCheck, color: 'bg-slate-900', desc: 'Mental Healthcare Act 2017, DPDP Act 2023, and RCI guidelines.' }
];

const DIALECTS = ['Awadhi', 'Bhojpuri', 'Bundeli', 'Kannauji', 'Braj', 'Hindi', 'English'];
const CONDITIONS = ['Anxiety', 'Depression', 'Trauma', 'Stress', 'Psychosis', 'Child Welfare'];
const FORMATS = ['PDF', 'Video', 'Link'];

export default function ClinicalLibrary() {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    dialect: '',
    condition: '',
    format: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [userTier, setUserTier] = useState<number>(4); // Mocked Tier 4 Intern

  useEffect(() => {
    fetchItems();
  }, [selectedZone, filters]);

  const fetchItems = async () => {
    const query = new URLSearchParams({
      ...(selectedZone && { zone: selectedZone.toString() }),
      ...filters
    }).toString();
    const res = await fetch(`/api/library?${query}`);
    const data = await res.json();
    setItems(data);
  };

  const toggleBookmark = (id: number) => {
    const isBookmarked = bookmarks.includes(id);
    setBookmarks(prev => isBookmarked ? prev.filter(b => b !== id) : [...prev, id]);

    // M5 Webhook: Log Bookmark Action
    fetch('/api/m5/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: 'M11_LIBRARY_BOOKMARK',
        payload: { resource_id: id, action: isBookmarked ? 'unbookmark' : 'bookmark' },
        secure_url: '/clinical-library'
      })
    }).catch(err => console.error('M5 Bookmark Log Failed:', err));
  };

  const isLocked = (zoneId: number) => {
    if (zoneId === 1 && userTier > 2) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">M9: Clinical E-Library</h1>
              <p className="text-slate-500">A high-value career hub and diagnostic toolkit for SAMBAL experts.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by keyword, dialect, or condition..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-slate-100 shadow-sm focus:ring-2 focus:ring-ngo-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={cn(
                "p-6 rounded-[2rem] border-2 text-left transition-all group relative overflow-hidden",
                selectedZone === zone.id 
                  ? "border-ngo-primary bg-white shadow-xl shadow-ngo-primary/10" 
                  : "bg-white border-slate-100 hover:border-ngo-primary/30"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white",
                zone.color
              )}>
                <zone.icon size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{zone.title}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{zone.desc}</p>
              {isLocked(zone.id) && (
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center">
                  <Lock className="text-slate-400" size={24} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Faceted Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                <Filter size={20} className="text-ngo-primary" /> Faceted Search
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Dialect</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-50 border-transparent text-xs font-bold"
                    value={filters.dialect}
                    onChange={(e) => setFilters({...filters, dialect: e.target.value})}
                  >
                    <option value="">All Dialects</option>
                    {DIALECTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Clinical Condition</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-slate-50 border-transparent text-xs font-bold"
                    value={filters.condition}
                    onChange={(e) => setFilters({...filters, condition: e.target.value})}
                  >
                    <option value="">All Conditions</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">File Format</label>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS.map(f => (
                      <button 
                        key={f}
                        onClick={() => setFilters({...filters, format: filters.format === f ? '' : f})}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[10px] font-bold border-2 transition-all",
                          filters.format === f ? "border-ngo-primary bg-ngo-primary/5 text-ngo-primary" : "border-slate-50 text-slate-500"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20">
              <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
                <Bookmark size={20} className="text-amber-400" /> My Toolkit
              </h3>
              <p className="text-slate-400 text-[10px] mb-6 leading-relaxed uppercase tracking-widest">
                Pinned resources for 1-click access during sessions.
              </p>
              <div className="space-y-3">
                {bookmarks.length > 0 ? bookmarks.map(id => (
                  <div key={id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                    <span className="text-xs font-bold truncate pr-2">Resource #{id}</span>
                    <button onClick={() => toggleBookmark(id)} className="text-amber-400"><Bookmark size={14} fill="currentColor" /></button>
                  </div>
                )) : (
                  <p className="text-[10px] text-white/40 italic">No bookmarks yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedZone || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {items.length > 0 ? items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                        ZONES.find(z => z.id === item.zone)?.color || 'bg-slate-400'
                      )}>
                        {item.format === 'PDF' ? <FileText size={20} /> : item.format === 'Video' ? <Video size={20} /> : <ExternalLink size={20} />}
                      </div>
                      <button 
                        onClick={() => toggleBookmark(item.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          bookmarks.includes(item.id) ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-500"
                        )}
                      >
                        <Bookmark size={18} fill={bookmarks.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {JSON.parse(item.dialects || '[]').map((d: string) => (
                        <span key={d} className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded">
                          {d}
                        </span>
                      ))}
                      <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {item.clinical_condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.format}</span>
                      <button 
                        onClick={() => {
                          // M5 Webhook: Log Resource Access
                          fetch('/api/m5/webhook', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              form_id: 'M11_LIBRARY_ACCESS',
                              payload: { resource_id: item.id, title: item.title, format: item.format, action: 'resource_access' },
                              secure_url: '/clinical-library'
                            })
                          }).catch(err => console.error('M5 Library Access Log Failed:', err));
                        }}
                        className="flex items-center gap-1.5 text-ngo-primary font-bold text-xs hover:gap-2 transition-all"
                      >
                        {item.format === 'Video' ? 'Watch Now' : 'Open Resource'} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                    <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Resources Found</h3>
                    <p className="text-slate-500">Try adjusting your faceted filters or selecting a different zone.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
