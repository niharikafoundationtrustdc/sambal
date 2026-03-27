import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, CreditCard, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Resource {
  id: number;
  name: string;
  description: string;
  max_capacity: number;
  base_price_corporate: number;
  subsidized_price_ngo: number;
}

export default function CampusBookingPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    activityType: '',
    attendeeCount: 1,
    startTime: '',
    endTime: '',
    bannerUrl: '',
    projectId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/campus/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      });
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/campus/book', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '1' // Mock user ID
        },
        body: JSON.stringify({
          userId: 1,
          resourceId: selectedResource.id,
          ...formData
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSuccess(true);
        
        // M5 Webhook: Log Booking Request
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M8_CAMPUS_BOOKING',
            payload: { ...formData, resourceId: selectedResource.id, userId: 1 },
            secure_url: '/campus/book'
          })
        }).catch(err => console.error('M5 Booking Log Failed:', err));
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading resources...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Campus Facility Booking</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Reserve spaces at our Lucknow campus for educational, wellness, or corporate activities. 
          Internal activities and NGO partners receive subsidized rates.
        </p>
      </header>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Booking Request Submitted!</h2>
          <p className="text-emerald-700 mb-6">
            Your request has been sent to the M8 Council for vetting. 
            You will receive a confirmation once approved.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
          >
            Make Another Booking
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resource Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="text-ngo-primary" size={20} />
              Select Venue
            </h2>
            <div className="grid gap-4">
              {resources.map(resource => (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all duration-300",
                    selectedResource?.id === resource.id 
                      ? "border-ngo-primary bg-ngo-primary/5 ring-2 ring-ngo-primary/20" 
                      : "border-slate-200 hover:border-ngo-primary/50 bg-white"
                  )}
                >
                  <div className="font-bold text-slate-900">{resource.name}</div>
                  <div className="text-sm text-slate-500 mb-2">{resource.description}</div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> Max {resource.max_capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard size={14} /> ₹{resource.subsidized_price_ngo} (NGO) / ₹{resource.base_price_corporate} (Corp)
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="text-ngo-primary" size={20} />
              Booking Details
            </h2>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Type</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                  value={formData.activityType}
                  onChange={e => setFormData({...formData, activityType: e.target.value})}
                >
                  <option value="">Select type...</option>
                  <option value="Educational Workshop">Educational Workshop</option>
                  <option value="Wellness Session">Wellness Session</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="NGO Meeting">NGO Meeting</option>
                  <option value="Joy Room Activity">Joy Room Activity (Tier 1)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Attendees</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max={selectedResource?.max_capacity || 200}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                    value={formData.attendeeCount}
                    onChange={e => setFormData({...formData, attendeeCount: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PRJ-001"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                    value={formData.projectId}
                    onChange={e => setFormData({...formData, projectId: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <ImageIcon size={16} />
                  Banner Artwork URL (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none"
                  value={formData.bannerUrl}
                  onChange={e => setFormData({...formData, bannerUrl: e.target.value})}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Corporate sponsors can display temporary banners (M8 approval required).
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedResource}
                className="w-full py-3 bg-ngo-primary text-white rounded-xl font-bold hover:bg-ngo-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ngo-primary/20"
              >
                {submitting ? 'Processing...' : 'Request Booking'}
              </button>
              
              <p className="text-[10px] text-center text-slate-400">
                * All bookings include a mandatory 60-minute maintenance buffer before and after.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { MapPin } from 'lucide-react';
