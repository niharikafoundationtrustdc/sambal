import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  FileText, 
  MessageSquare, 
  HeartPulse,
  Image as ImageIcon,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Booking {
  id: number;
  user_name: string;
  resource_name: string;
  activity_type: string;
  attendee_count: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  banner_url: string;
  banner_status: string;
  project_id: string;
  created_at: string;
}

interface Asset {
  id: number;
  asset_name: string;
  serial_number: string;
  health_status: string;
  location: string;
  last_service_date: string;
  warranty_expiry: string;
  service_history: string;
}

interface Feedback {
  id: number;
  beneficiary_name: string;
  personnel_name: string;
  rating: number;
  comments: string;
  is_public_funnel: boolean;
  created_at: string;
}

export default function AdminCampusDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'assets' | 'feedback' | 'visitors'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, aRes, fRes] = await Promise.all([
          fetch('/api/admin/campus/bookings', { headers: { 'x-user-id': '1' } }),
          fetch('/api/admin/campus/assets', { headers: { 'x-user-id': '1' } }),
          fetch('/api/admin/campus/feedback', { headers: { 'x-user-id': '1' } })
        ]);
        
        const [bData, aData, fData] = await Promise.all([
          bRes.json(), aRes.json(), fRes.json()
        ]);

        setBookings(bData);
        setAssets(aData);
        setFeedback(fData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (bookingId: number, action: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/campus/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
      body: JSON.stringify({ bookingId, action, notes: 'M8 Council Vetted' })
    });
    if (res.ok) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: action } : b));
      
      // M5 Webhook: Log Approval
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M8_BOOKING_APPROVAL',
          payload: { bookingId, action, reviewer: 'Admin' },
          secure_url: '/admin/campus'
        })
      }).catch(err => console.error('M5 Approval Log Failed:', err));
    }
  };

  const handleBannerVerify = async (bookingId: number, action: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/campus/banner-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
      body: JSON.stringify({ bookingId, action })
    });
    if (res.ok) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, banner_status: action } : b));

      // M5 Webhook: Log Banner Verification
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M8_BANNER_VERIFICATION',
          payload: { bookingId, action, reviewer: 'Admin' },
          secure_url: '/admin/campus'
        })
      }).catch(err => console.error('M5 Banner Log Failed:', err));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <ShieldCheck className="text-ngo-primary" size={32} />
            M8 Campus Governance Tower
          </h1>
          <p className="text-slate-500">Lucknow Hub: Physical Assets, Safety & Personnel Quality</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          {(['bookings', 'assets', 'feedback', 'visitors'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all uppercase tracking-wider",
                activeTab === tab ? "bg-white text-ngo-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Calendar} label="Active Bookings" value={bookings.filter(b => b.status === 'approved').length} color="blue" />
        <StatCard icon={AlertTriangle} label="Pending Vetting" value={bookings.filter(b => b.status === 'pending').length} color="amber" />
        <StatCard icon={HeartPulse} label="Asset Health" value={`${assets.filter(a => a.health_status === 'Functional').length}/${assets.length}`} color="emerald" />
        <StatCard icon={MessageSquare} label="Audit Feedback" value={feedback.length} color="indigo" />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue & Activity</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Banner</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{booking.user_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{booking.project_id || 'NO-PROJECT'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">{booking.resource_name}</div>
                      <div className="text-xs text-slate-500">{booking.activity_type} ({booking.attendee_count} pax)</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(booking.start_time).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">₹{booking.total_price} Total</div>
                    </td>
                    <td className="p-4">
                      {booking.banner_url ? (
                        <div className="flex flex-col gap-1">
                          <a href={booking.banner_url} target="_blank" rel="noreferrer" className="text-ngo-primary hover:underline text-xs flex items-center gap-1">
                            <ImageIcon size={12} /> View Art
                          </a>
                          <div className="flex gap-2">
                            <button onClick={() => handleBannerVerify(booking.id, 'approved')} className={cn("p-1 rounded", booking.banner_status === 'approved' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}><CheckCircle2 size={12} /></button>
                            <button onClick={() => handleBannerVerify(booking.id, 'rejected')} className={cn("p-1 rounded", booking.banner_status === 'rejected' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400")}><XCircle size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleApprove(booking.id, 'approved')} className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">Approve</button>
                          <button onClick={() => handleApprove(booking.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map(asset => (
              <div key={asset.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900">{asset.asset_name}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    asset.health_status === 'Functional' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {asset.health_status}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Serial:</span> <span className="font-mono">{asset.serial_number}</span></div>
                  <div className="flex justify-between"><span>Location:</span> <span>{asset.location}</span></div>
                  <div className="flex justify-between"><span>Warranty:</span> <span>{new Date(asset.warranty_expiry).toLocaleDateString()}</span></div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="font-bold text-slate-900 mb-1 uppercase tracking-tighter text-[10px]">Service History</div>
                    <p className="italic text-slate-500 leading-relaxed">{asset.service_history || 'No records yet.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="p-6 space-y-4">
            {feedback.map(item => (
              <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-ngo-primary font-bold">
                  {item.rating}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">Personnel: {item.personnel_name}</h3>
                      <p className="text-xs text-slate-500">From: {item.beneficiary_name} • {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    {item.is_public_funnel && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} /> Public Funnel
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 italic">"{item.comments}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };
  return (
    <div className={cn("p-4 rounded-3xl border flex items-center gap-4", colors[color])}>
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-black tracking-tighter">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700"
  };
  return (
    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", styles[status] || "bg-slate-100 text-slate-700")}>
      {status}
    </span>
  );
}
