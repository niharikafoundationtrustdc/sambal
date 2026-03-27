import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Eye,
  Clock,
  CheckCircle,
  XCircle as XIcon,
  HelpCircle
} from 'lucide-react';
import { dbService, SAMBALRecord } from '../services/db';
import { auth } from '../firebase';

const AdminMasterLedger: React.FC = () => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [formRecords, setFormRecords] = useState<SAMBALRecord[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [erasureSla, setErasureSla] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Form_Submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SAMBALRecord | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ledgerRes, alertsRes, erasureRes] = await Promise.all([
        fetch('/api/admin/m5/ledger', { headers: { 'x-user-id': auth.currentUser?.uid || '' } }),
        fetch('/api/admin/m5/alerts', { headers: { 'x-user-id': auth.currentUser?.uid || '' } }),
        fetch('/api/admin/m5/erasure-sla', { headers: { 'x-user-id': auth.currentUser?.uid || '' } }),
      ]);

      if (ledgerRes.ok) setLedger(await ledgerRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
      if (erasureRes.ok) setErasureSla(await erasureRes.json());

      // M5 Webhook: Log Ledger Refresh
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M5_LEDGER_REFRESH',
          payload: { admin_id: auth.currentUser?.uid, timestamp: new Date().toISOString() },
          secure_url: '/admin/master-ledger'
        })
      }).catch(err => console.error('M5 Ledger Refresh Log Failed:', err));

    } catch (error) {
      console.error('Error fetching M5 data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Subscribe to real-time updates from Firestore for Form Submissions
    const unsubscribe = dbService.subscribeToRecords((data) => {
      setFormRecords(data);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: SAMBALRecord['status']) => {
    const officerUin = auth.currentUser?.uid || 'ADM-LKO-001'; 
    await dbService.updateStatus(id, status, officerUin, 'Processed via Master Ledger');
    fetchData();
    setSelectedRecord(null);
  };

  const filteredLedger = ledger.filter(item => 
    item.tab_name === activeTab && 
    (item.form_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.payload.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFormRecords = formRecords.filter(record => 
    record.uin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.formId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    'Form_Submissions',
    'Global_User_Ledger',
    'M2_Offline_Centers',
    'M3_Academic_Transcripts',
    'M4_CSR_Projects',
    'Yuwa_Ledger',
    'M7_Financial_Ledger',
    'M8_Audit_Log',
    'M9_Clinical_Referrals',
    'M11_Task_Master',
    'M12_Broadcast_Lists'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'More Info Required': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Rejected': return <XIcon size={14} />;
      case 'More Info Required': return <HelpCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Master Ledger...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-ngo-primary" size={32} />
              <h1 className="text-4xl font-serif font-bold text-slate-900">M5 Master Data Ledger</h1>
            </div>
            <p className="text-slate-500">Centralized coordination engine for all SAMBAL modules</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
              <ShieldCheck size={18} /> Webhook Status: Active
            </div>
            <button 
              onClick={fetchData}
              className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Data
            </button>
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
              <Download size={18} /> Export Cold Storage
            </button>
          </div>
        </header>

        {/* Alerts Section */}
        {(alerts.length > 0 || erasureSla.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {alerts.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-orange-700 font-bold mb-4">
                  <AlertTriangle size={20} /> Operational Alerts
                </div>
                <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-orange-100 text-sm flex justify-between items-center">
                      <span className="text-slate-700">{alert.detail}</span>
                      <span className="text-orange-600 font-mono font-bold">{alert.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {erasureSla.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                  <ShieldCheck size={20} /> Erasure SLA Breach (15 Days)
                </div>
                <div className="space-y-3">
                  {erasureSla.map((req, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-red-100 text-sm flex justify-between items-center">
                      <span className="text-slate-700">Request ID: {req.id} - User: {req.user_id}</span>
                      <span className="text-red-600 font-bold">URGENT</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ledger Navigation */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 p-6 bg-slate-50/50">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab 
                    ? 'bg-ngo-primary text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search ledger entries..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all">
                <Filter size={20} /> Advanced Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'Form_Submissions' ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-8 py-4">UIN</th>
                    <th className="px-8 py-4">Form</th>
                    <th className="px-8 py-4">Branch</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Timestamp</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFormRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-4 font-mono text-sm font-bold text-slate-900">{record.uin}</td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                          Form {record.formId}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-600">{record.branchId}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={() => setSelectedRecord(record)}
                          className="p-2 text-slate-400 hover:text-ngo-primary hover:bg-ngo-primary/5 rounded-lg transition-all"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredFormRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                        No form submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Form ID</th>
                    <th className="px-8 py-4">Sanitized Metadata</th>
                    <th className="px-8 py-4">Secure Link</th>
                    <th className="px-8 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLedger.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-4 font-mono text-sm text-slate-400">#{item.id}</td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                          {item.form_id}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="max-w-xs truncate text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded-lg">
                          {item.sanitized_payload}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <a 
                          href={item.secure_url} 
                          className="text-ngo-primary hover:underline text-sm font-bold flex items-center gap-1"
                        >
                          View Raw Entry
                        </a>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                        No entries found for this tab.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Record Detail: {selectedRecord.uin}</h2>
                <p className="text-slate-500 text-sm">Form {selectedRecord.formId} Submission</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-white rounded-full transition-all"
              >
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-grow">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Identity & Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1">Full Name</p>
                      <p className="font-bold text-slate-900">{selectedRecord.data?.identity?.fullName || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1">DOB</p>
                      <p className="font-bold text-slate-900">{selectedRecord.data?.identity?.dob || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1">Mobile</p>
                      <p className="font-bold text-slate-900">{selectedRecord.data?.contact?.mobileNumber || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-1">Pincode</p>
                      <p className="font-bold text-slate-900">{selectedRecord.data?.identity?.pincode || 'N/A'}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Raw Data Payload</h3>
                  <pre className="bg-slate-900 text-green-400 p-6 rounded-2xl text-xs font-mono overflow-x-auto">
                    {JSON.stringify(selectedRecord.data, null, 2)}
                  </pre>
                </section>

                <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h3 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} /> Expert Proctoring Decision
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(selectedRecord.id!, 'Approved')}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedRecord.id!, 'Rejected')}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <XIcon size={18} /> Reject
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedRecord.id!, 'More Info Required')}
                      className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all flex items-center gap-2"
                    >
                      <HelpCircle size={18} /> Request Info
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMasterLedger;
