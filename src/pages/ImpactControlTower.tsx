import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Globe, 
  Lock,
  Download,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const ImpactControlTower = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visibility' | 'approvals' | 'translations'>('visibility');
  const [translations, setTranslations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStats();
    fetchTranslations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/impact/stats', {
        headers: { 'x-user-id': '1' } // Mocking Super Admin ID
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslations = async () => {
    try {
      const res = await fetch('/api/admin/impact/translations', {
        headers: { 'x-user-id': '1' }
      });
      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (type: 'ngo' | 'volunteer', id: number, action: 'approve' | 'reject') => {
    try {
      const payload = { type, id, action };
      await fetch('/api/admin/impact/verify-partner', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '1'
        },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Impact Verification
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_IMPACT_VERIFY',
          payload,
          secure_url: '/impact-control-tower'
        })
      }).catch(err => console.error('M5 Impact Verify Log Failed:', err));

      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (table: string, id: number, status: boolean) => {
    try {
      const payload = { table, id, status };
      await fetch('/api/admin/impact/toggle-visibility', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '1'
        },
        body: JSON.stringify(payload)
      });

      // M5 Webhook: Log Visibility Toggle
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M11_VISIBILITY_TOGGLE',
          payload,
          secure_url: '/impact-control-tower'
        })
      }).catch(err => console.error('M5 Visibility Log Failed:', err));

      fetchStats();
    } catch (err) {
      console.error(err);
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
              <Shield size={20} />
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">M8: Impact Control Tower</h1>
            <div className="ml-auto bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/30 flex items-center gap-2 text-sm font-medium">
              <AlertTriangle size={14} />
              Super Admin Mode
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider font-medium">Total Mobilized</p>
              <h2 className="text-3xl font-bold">₹{stats?.totalMobilized?.toLocaleString()}</h2>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider font-medium">Active Partners</p>
              <h2 className="text-3xl font-bold">{stats?.activeNgos}</h2>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <p className="text-white/60 text-sm mb-1 uppercase tracking-wider font-medium">Pending Approvals</p>
              <h2 className="text-3xl font-bold text-ngo-primary">{stats?.pendingApprovals}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('visibility')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'visibility' ? 'bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20' : 'text-slate-600 hover:bg-white'}`}
            >
              <Eye size={18} />
              <span className="font-medium">Visibility Toggle</span>
            </button>
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'approvals' ? 'bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20' : 'text-slate-600 hover:bg-white'}`}
            >
              <CheckCircle size={18} />
              <span className="font-medium">Approval Gate</span>
            </button>
            <button 
              onClick={() => setActiveTab('translations')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === 'translations' ? 'bg-ngo-primary text-white shadow-lg shadow-ngo-primary/20' : 'text-slate-600 hover:bg-white'}`}
            >
              <Globe size={18} />
              <span className="font-medium">Translations</span>
            </button>
            
            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-red-600 text-xs font-bold uppercase tracking-wider mb-2">Emergency Switch</p>
                <button className="w-full bg-red-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
                  HIDE ALL DATA
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === 'visibility' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Master Control Switch</h3>
                    <p className="text-slate-500 text-sm">Instantly hide or show data on public dashboards.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search entities..."
                        className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-ngo-primary w-64"
                      />
                    </div>
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-600">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {['Campaign Ledger', 'NGO Directory', 'Donation Wall', 'Schemes Repository'].map((item) => (
                    <div key={item} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-ngo-primary shadow-sm">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item}</h4>
                          <p className="text-slate-500 text-xs">Public Visibility: <span className="text-green-600 font-medium">Active</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                          Configure
                        </button>
                        <button className="w-14 h-8 bg-ngo-primary rounded-full relative transition-all">
                          <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Verification Gate</h3>
                    <p className="text-slate-500 text-sm">Approve or reject partner submissions before they go live.</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { name: 'Yuva Shakti NGO', type: 'Partner NGO', date: '2026-03-25' },
                        { name: 'Rahul Sharma', type: 'Volunteer', date: '2026-03-24' },
                        { name: 'Sneh-Doot North', type: 'Branch', date: '2026-03-24' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">{row.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{row.type}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <XCircle size={18} />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <CheckCircle size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'translations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Translation Manager</h3>
                    <p className="text-slate-500 text-sm">Override AI-generated translations for clinical accuracy.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {translations.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                      <Globe className="mx-auto text-slate-300 mb-4" size={48} />
                      <p className="text-slate-500">No manual overrides found. AI translations are active.</p>
                    </div>
                  ) : (
                    translations.map((t) => (
                      <div key={t.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-ngo-primary/10 text-ngo-primary rounded-full text-xs font-bold uppercase tracking-wider">
                            {t.language}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{t.lang_key}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Original (English)</label>
                            <p className="text-slate-900 font-medium">{t.original_text}</p>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Override Translation</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                defaultValue={t.translated_text}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-ngo-primary"
                              />
                              <button className="bg-ngo-primary text-white px-4 py-2 rounded-xl text-sm font-bold">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-medium">
          <Lock size={12} />
          <span>Encrypted Session • Super Admin Access Only • Audit Log Active</span>
        </div>
      </div>
    </div>
  );
};

export default ImpactControlTower;
