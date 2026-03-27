import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Calendar, 
  Users, 
  Utensils, 
  ShieldCheck, 
  QrCode, 
  Wrench, 
  CheckCircle2, 
  Clock,
  LayoutDashboard,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../types';

interface FormProps {
  userId?: string;
  onSuccess?: () => void;
}

// Facility Booking Form
export const FacilityBookingForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    resource: 'Sushila-Sarojini Hall',
    purpose: 'Educational Workshop',
    date: '',
    time_slot: 'Morning (9 AM - 1 PM)',
    book_for_someone: false,
    someone_name: '',
    someone_phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'facility_booking',
          payload: { ...formData, userId },
          secure_url: '/campus'
        })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting facility booking:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Booking Confirmed</h3>
        <p className="text-slate-600">Your reservation for {formData.resource} has been logged.</p>
        <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">
          * A 60-minute maintenance buffer has been added after your slot.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Building size={14} /> Facility / Room
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.resource}
            onChange={e => setFormData({ ...formData, resource: e.target.value })}
          >
            <option>Sushila-Sarojini Hall</option>
            <option>Bio-Well Diagnostic Room</option>
            <option>Joy Room</option>
            <option>Media Recording Studio</option>
            <option>Meditation Hall</option>
            <option>Transit/Guest Accommodation</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <LayoutDashboard size={14} /> Event Purpose
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
          >
            <option>Public Medical Camp</option>
            <option>Educational Workshop</option>
            <option>Corporate CSR Event</option>
            <option>Award Felicitation Ceremony</option>
            <option>Strategic Board Meeting</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={14} /> Date
          </label>
          <input
            required
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} /> Time Slot
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.time_slot}
            onChange={e => setFormData({ ...formData, time_slot: e.target.value })}
          >
            <option>Morning (9 AM - 1 PM)</option>
            <option>Afternoon (2 PM - 6 PM)</option>
            <option>Full Day (9 AM - 6 PM)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <input
          type="checkbox"
          id="book_for_someone"
          className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          checked={formData.book_for_someone}
          onChange={e => setFormData({ ...formData, book_for_someone: e.target.checked })}
        />
        <label htmlFor="book_for_someone" className="text-sm text-slate-600 font-medium cursor-pointer">
          Book for someone else (Elderly parent / Beneficiary)
        </label>
      </div>

      {formData.book_for_someone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Beneficiary Name</label>
            <input
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              value={formData.someone_name}
              onChange={e => setFormData({ ...formData, someone_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Beneficiary Phone</label>
            <input
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              value={formData.someone_phone}
              onChange={e => setFormData({ ...formData, someone_phone: e.target.value })}
            />
          </div>
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Confirm Campus Booking'}
      </button>
    </form>
  );
};

// Sukh-Shiksha Attendance Form
export const AttendanceForm: React.FC<FormProps> = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    scholar_id: '',
    meal_distributed: false,
    notes: ''
  });

  // Auto-populate from URL query params (M10 Phase 7)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('scholar_id');
    if (id) {
      setFormData(prev => ({ ...prev, scholar_id: id }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'attendance_log',
          payload: { ...formData, userId },
          secure_url: '/campus'
        })
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error submitting attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Attendance Logged</h3>
        <p className="text-slate-600 text-sm">Scholar ID: {formData.scholar_id}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <QrCode size={14} /> Scholar Unique ID
        </label>
        <input
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="e.g. VAT-2024-001"
          value={formData.scholar_id}
          onChange={e => setFormData({ ...formData, scholar_id: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
        <input
          type="checkbox"
          id="meal_distributed"
          className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
          checked={formData.meal_distributed}
          onChange={e => setFormData({ ...formData, meal_distributed: e.target.checked })}
        />
        <label htmlFor="meal_distributed" className="text-sm text-emerald-800 font-bold cursor-pointer flex items-center gap-2">
          <Utensils size={16} /> Meal Distributed
        </label>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Submit Daily Attendance'}
      </button>
    </form>
  );
};

// Visitor Security Log
export const VisitorSecurityLog: React.FC<FormProps> = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    uin: '',
    purpose: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'visitor_log',
          payload: { ...formData, timestamp: new Date().toISOString() },
          secure_url: '/campus'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting visitor log:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 text-slate-800">
        <ShieldCheck size={20} className="shrink-0 text-indigo-600" />
        <p className="text-xs font-medium">Child & Senior Safety: All visitors must log entry against their unique UIN.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor UIN</label>
          <input 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200" 
            placeholder="e.g. UIN-12345"
            value={formData.uin}
            onChange={e => setFormData({ ...formData, uin: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose of Visit</label>
          <input 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
          />
        </div>
      </div>

      <button
        disabled={loading || submitted}
        type="submit"
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
      >
        {submitted ? 'Entry Logged' : 'Log Campus Entry'}
      </button>
    </form>
  );
};

// Asset Maintenance Log
export const AssetMaintenanceLog: React.FC<FormProps> = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    asset: 'Bio-Well Device',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'asset_maintenance',
          payload: { ...formData, timestamp: new Date().toISOString() },
          secure_url: '/campus'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting asset maintenance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Wrench size={14} /> Asset to Service
        </label>
        <select 
          className="w-full px-4 py-3 rounded-xl border border-slate-200"
          value={formData.asset}
          onChange={e => setFormData({ ...formData, asset: e.target.value })}
        >
          <option>Bio-Well Device</option>
          <option>Recording Studio Mics/Cameras</option>
          <option>Campus Laptops</option>
          <option>Solar Power System</option>
          <option>Water Filtration Plant</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Details</label>
        <textarea 
          required 
          rows={3} 
          className="w-full px-4 py-3 rounded-xl border border-slate-200"
          value={formData.details}
          onChange={e => setFormData({ ...formData, details: e.target.value })}
        />
      </div>

      <button
        disabled={loading || submitted}
        type="submit"
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
      >
        {submitted ? 'Service Logged' : 'Log Asset Maintenance'}
      </button>
    </form>
  );
};
