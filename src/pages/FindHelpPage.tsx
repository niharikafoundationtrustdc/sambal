import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Download, 
  ExternalLink, 
  Building2, 
  Stethoscope, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Scheme {
  id: string;
  title: string;
  category: string;
  source: 'online' | 'offline';
  description: string;
  benefits: string;
  fee: string;
  documents: string[];
  type: 'medical' | 'general';
}

export default function FindHelpPage() {
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState<Scheme[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode) return;

    setSearching(true);
    try {
      // Simulate parallel queries to API Setu and Local DB
      const response = await fetch(`/api/search/schemes?pincode=${pincode}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const generateSlip = async (scheme: Scheme) => {
    try {
      // Trigger Advance Intimation Webhook
      await fetch('/api/webhooks/intimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme.id,
          schemeTitle: scheme.title,
          pincode: pincode,
          timestamp: new Date().toISOString()
        })
      });

      // In a real app, this would generate a PDF via DK PDF or similar
      alert(`Generating ${scheme.type === 'medical' ? 'Red/White Sambal Upchar Parchi' : 'Blue/Yellow Sambal Sahayata Parchi'} for ${scheme.title}`);
    } catch (error) {
      console.error('Failed to generate slip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Find Help Locally</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Access government schemes and NGO support centers near you. 
            Enter your pincode to begin the hybrid search.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-ngo-primary/20 blur-2xl group-hover:bg-ngo-primary/30 transition-all rounded-[2rem]" />
            <div className="relative flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-xl">
              <div className="flex-grow flex items-center px-6">
                <MapPin className="text-slate-400 mr-3" size={24} />
                <input 
                  type="text" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter your 6-digit Pincode..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium"
                  maxLength={6}
                />
              </div>
              <button 
                type="submit"
                disabled={searching}
                className="bg-ngo-primary text-white px-10 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 hover:bg-ngo-primary/90 transition-all disabled:opacity-50"
              >
                {searching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={20} />}
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {results.map((scheme) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className={cn(
                  "p-8 border-b border-slate-50",
                  scheme.type === 'medical' ? "bg-rose-50/50" : "bg-blue-50/50"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      scheme.source === 'online' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {scheme.source === 'online' ? 'Central Scheme' : 'State/NGO Support'}
                    </span>
                    {scheme.type === 'medical' ? <Stethoscope className="text-rose-500" size={20} /> : <Building2 className="text-blue-500" size={20} />}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-ngo-primary transition-colors">
                    {scheme.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{scheme.category}</p>
                </div>

                <div className="p-8 space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {scheme.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Official Fee</span>
                      <span className="text-slate-900 font-bold">{scheme.fee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {scheme.documents.length} Documents Required
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => generateSlip(scheme)}
                      className={cn(
                        "flex-grow py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                        scheme.type === 'medical' 
                          ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20" 
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                      )}
                    >
                      <Download size={18} />
                      Download Slip
                    </button>
                    <button className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                      <Info size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {results.length === 0 && !searching && pincode && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No results found for {pincode}</h3>
            <p className="text-slate-500">Try a different pincode or check back later for updated schemes.</p>
          </div>
        )}

        {/* Disclaimer Section */}
        <div className="mt-24 p-12 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ngo-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldAlert size={40} className="text-ngo-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Legal Disclaimer & Transparency</h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-3xl">
                Manisha Mandir acts strictly as a facilitator. The generated "Sambal Upchar Parchi" and "Sambal Sahayata Parchi" 
                do not contain clinical diagnoses. Official application fees are listed to prevent bribery and ensure transparency. 
                Always verify details with the respective government department or NGO center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
