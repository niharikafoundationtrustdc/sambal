import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  ArrowUpRight,
  Target,
  Users,
  TrendingUp
} from 'lucide-react';

interface CampaignStat {
  utm_campaign: string;
  conversions: number;
}

interface CampaignAsset {
  id: number;
  name: string;
  type: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function CampaignDashboard() {
  const [stats, setStats] = useState<CampaignStat[]>([]);
  const [assets, setAssets] = useState<CampaignAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, assetsRes] = await Promise.all([
        fetch('/api/campaign-ledger'),
        fetch('/api/campaign-assets')
      ]);
      const statsData = await statsRes.json();
      const assetsData = await assetsRes.json();
      setStats(statsData.stats || []);
      setAssets(assetsData || []);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await fetch('/api/campaign-assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (error) {
      console.error('Error updating asset status:', error);
    }
  };

  const [showGenerator, setShowGenerator] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'poster', url: '' });
  const [utmGen, setUtmGen] = useState({ source: '', medium: '', campaign: '', base: window.location.origin + '/donate' });

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/campaign-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAsset, intern_id: localStorage.getItem('userId') })
      });
      setShowAssetForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const generatedUrl = `${utmGen.base}?utm_source=${utmGen.source}&utm_medium=${utmGen.medium}&utm_campaign=${utmGen.campaign}`;

  if (loading) return <div className="p-12 text-center">Loading Campaign Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Campaign Hub (M12)</h1>
          <p className="text-slate-500">Zero-bloat digital outreach & ROI tracking engine.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowGenerator(true)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> UTM Generator
          </button>
          <button 
            onClick={() => setShowAssetForm(true)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <FileText size={20} /> Submit Asset
          </button>
          <button className="bg-ngo-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all flex items-center gap-2">
            <Send size={20} /> Broadcast M5
          </button>
        </div>
      </div>

      {/* UTM Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-900">UTM Link Generator</h3>
              <button onClick={() => setShowGenerator(false)}><XCircle className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Base URL</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-slate-200" 
                  value={utmGen.base}
                  onChange={e => setUtmGen({...utmGen, base: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Source</label>
                  <input 
                    type="text" 
                    placeholder="facebook, youtube"
                    className="w-full p-3 rounded-xl border border-slate-200" 
                    value={utmGen.source}
                    onChange={e => setUtmGen({...utmGen, source: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Medium</label>
                  <input 
                    type="text" 
                    placeholder="social, email"
                    className="w-full p-3 rounded-xl border border-slate-200" 
                    value={utmGen.medium}
                    onChange={e => setUtmGen({...utmGen, medium: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="dementia_awareness"
                  className="w-full p-3 rounded-xl border border-slate-200" 
                  value={utmGen.campaign}
                  onChange={e => setUtmGen({...utmGen, campaign: e.target.value})}
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 break-all font-mono text-xs text-slate-600">
                {generatedUrl}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedUrl);
                  alert('Copied to clipboard!');
                }}
                className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all"
              >
                Copy Tracking Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Asset Submission Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Submit Campaign Asset</h3>
              <button onClick={() => setShowAssetForm(false)}><XCircle className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asset Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200" 
                  value={newAsset.name}
                  onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200"
                  value={newAsset.type}
                  onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                >
                  <option value="poster">Digital Poster</option>
                  <option value="video">YouTube/Video Link</option>
                  <option value="copy">Ad Copy / Text</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asset URL / Link</label>
                <input 
                  type="url" 
                  required
                  placeholder="Google Drive or YouTube link"
                  className="w-full p-3 rounded-xl border border-slate-200" 
                  value={newAsset.url}
                  onChange={e => setNewAsset({...newAsset, url: e.target.value})}
                />
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-xs text-orange-700">
                <strong>Governance Rule:</strong> Assets will be reviewed by the Clinical Lead for accuracy and brand alignment before authorization.
              </div>
              <button 
                type="submit"
                className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all"
              >
                Submit for Approval
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Active Campaigns</p>
          <h3 className="text-3xl font-bold text-slate-900">{stats.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Conversions</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {stats.reduce((acc, curr) => acc + curr.conversions, 0)}
          </h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Outreach Reach</p>
          <h3 className="text-3xl font-bold text-slate-900">1.2k</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. ROI</p>
          <h3 className="text-3xl font-bold text-slate-900">12.4%</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Campaign Performance */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-bottom border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-slate-900">Campaign ROI Ledger</h2>
              <button className="text-ngo-primary font-bold text-sm flex items-center gap-1">
                View Full Report <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Conversions</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.map((stat, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-700">{stat.utm_campaign || 'Direct/Unknown'}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-900">{stat.conversions}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-ngo-primary" 
                              style={{ width: `${Math.min(100, (stat.conversions / 10) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-12 text-center text-slate-400">No campaign data recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Asset Approval Workflow */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Asset Approvals</h2>
            <div className="space-y-6">
              {assets.map((asset) => (
                <div key={asset.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{asset.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{asset.type}</p>
                      </div>
                    </div>
                    {asset.status === 'pending' ? (
                      <Clock size={20} className="text-orange-400" />
                    ) : asset.status === 'approved' ? (
                      <CheckCircle size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-rose-500" />
                    )}
                  </div>
                  
                  {asset.url && (
                    <a 
                      href={asset.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ngo-primary text-sm font-bold hover:underline block mb-4"
                    >
                      View Asset File
                    </a>
                  )}

                  {asset.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(asset.id, 'approved')}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApprove(asset.id, 'rejected')}
                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {assets.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No assets pending approval.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
