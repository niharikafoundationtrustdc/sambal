import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Download, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const ResearcherPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [exportData, setExportData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users/1/dashboard'); // Mocking user ID 1
      const data = await res.json();
      setUser(data);
      setPledgeSigned(data.data_privacy_pledge_signed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignPledge = async () => {
    try {
      await fetch('/api/researcher/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 })
      });

      // M5 Webhook: Log Pledge Signing
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_RESEARCH_PLEDGE',
          payload: { userId: 1, action: 'signed_privacy_pledge' },
          secure_url: '/researcher-portal'
        })
      }).catch(err => console.error('M5 Pledge Log Failed:', err));

      setPledgeSigned(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/researcher/export', {
        headers: { 'x-user-id': '1' }
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // M5 Webhook: Log Data Export
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M11_RESEARCH_EXPORT',
            payload: { userId: 1, record_count: data.length, action: 'data_export_csv' },
            secure_url: '/researcher-portal'
          })
        }).catch(err => console.error('M5 Export Log Failed:', err));

        setExportData(data);
        // Simulate CSV download
        const csvContent = "data:text/csv;charset=utf-8," 
          + "Anonymized_Research_ID,Category,Tier,Region,Created_At\n"
          + data.map((row: any) => `${row.anonymized_research_id},${row.category},${row.tier},${row.region},${row.created_at}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "anonymized_research_data.csv");
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <RefreshCw className="animate-spin text-ngo-primary" size={32} />
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-ngo-dark text-white pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ngo-primary flex items-center justify-center">
              <Database size={20} />
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Researcher Data Portal</h1>
            <div className="ml-auto bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={14} />
              Secure Access
            </div>
          </div>
          <p className="text-white/60 max-w-2xl">
            A private, role-protected dashboard for PhD/MPhil scholars to download anonymized datasets for correlation studies on Mental Health Impact, Educational Gaps, and Social ROI.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Access Control */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Access Requirements</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user?.role === 'Researcher' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                    {user?.role === 'Researcher' ? <CheckCircle size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Researcher Role</p>
                    <p className="text-xs text-slate-500">Verified PhD/MPhil status required.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user?.research_access_level > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                    {user?.research_access_level > 0 ? <CheckCircle size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">M5 Ledger Approval</p>
                    <p className="text-xs text-slate-500">Access level must be &gt; 0.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${pledgeSigned ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                    {pledgeSigned ? <CheckCircle size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Data Privacy Pledge</p>
                    <p className="text-xs text-slate-500">Must be signed before every export.</p>
                  </div>
                </div>
              </div>

              {!pledgeSigned && (
                <button 
                  onClick={handleSignPledge}
                  className="w-full mt-8 bg-ngo-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-ngo-primary/20 hover:scale-[1.02] transition-all"
                >
                  Sign Privacy Pledge
                </button>
              )}
            </div>

            <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100">
              <div className="flex items-center gap-3 mb-4 text-amber-700">
                <AlertCircle size={20} />
                <h4 className="font-bold">Privacy Shroud Active</h4>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                All exports are automatically anonymized. Personally Identifiable Information (PII) like names, mobile numbers, and specific addresses are stripped and replaced with Anonymized Research IDs.
              </p>
            </div>
          </div>

          {/* Right Column: Data Explorer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Dataset Explorer</h3>
                  <p className="text-slate-500 text-sm">Select and download datasets for your research.</p>
                </div>
                <button 
                  onClick={handleExport}
                  disabled={!pledgeSigned || isExporting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${!pledgeSigned || isExporting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-ngo-primary text-white hover:scale-[1.02] shadow-lg shadow-ngo-primary/20'}`}
                >
                  {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                  Download CSV
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Mental Health Impact', count: '1,240 records', size: '2.4 MB' },
                  { title: 'Educational Gaps', count: '850 records', size: '1.1 MB' },
                  { title: 'Social ROI Data', count: '3,100 records', size: '5.8 MB' },
                  { title: 'Demographic Trends', count: '12,000 records', size: '12.4 MB' },
                ].map((dataset) => (
                  <div key={dataset.title} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-ngo-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ngo-primary group-hover:bg-ngo-primary group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dataset.size}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{dataset.title}</h4>
                    <p className="text-xs text-slate-500">{dataset.count}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Audit Trail (Your Recent Exports)</h4>
                <div className="space-y-3">
                  {[
                    { date: '2026-03-20 14:30', dataset: 'Mental Health Impact', id: 'EXP-9921' },
                    { date: '2026-03-18 09:15', dataset: 'Social ROI Data', id: 'EXP-9845' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{log.date}</span>
                      <span className="font-medium text-slate-900">{log.dataset}</span>
                      <span className="text-slate-400 font-mono">{log.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-medium">
          <Lock size={12} />
          <span>Secure Researcher Portal • PII Masking Active • Audit Trail Logged</span>
        </div>
      </div>
    </div>
  );
};

export default ResearcherPortal;
