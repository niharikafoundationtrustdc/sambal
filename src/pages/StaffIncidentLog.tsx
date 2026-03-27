import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2 } from 'lucide-react';

const StaffIncidentLog: React.FC = () => {
  const [beneficiaryUin, setBeneficiaryUin] = useState('');
  const [incidentType, setIncidentType] = useState('SOS Protocol');
  const [actionTaken, setActionTaken] = useState('Helpline Provided');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const payload = {
      beneficiary_uin: beneficiaryUin,
      incident_type: incidentType,
      action_taken: actionTaken,
    };

    try {
      const response = await fetch('/api/m5/incident-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId') || '',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // M5 Webhook: Log Incident
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M5_STAFF_INCIDENT',
            payload,
            secure_url: '/staff/incident-log'
          })
        }).catch(err => console.error('M5 Incident Log Failed:', err));

        setStatus('success');
        setBeneficiaryUin('');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error logging incident:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-ngo-primary p-8 text-white text-center">
          <ShieldAlert className="mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-serif font-bold">Staff Incident Log</h1>
          <p className="text-ngo-light text-sm mt-2">Secure gateway for staff data input</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Beneficiary UIN
            </label>
            <input
              type="text"
              required
              placeholder="Do not enter names"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
              value={beneficiaryUin}
              onChange={(e) => setBeneficiaryUin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Incident Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
            >
              <option value="SOS Protocol">SOS Protocol</option>
              <option value="Duplicate Account">Duplicate Account</option>
              <option value="Offline Support">Offline Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Action Taken
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
            >
              <option value="Helpline Provided">Helpline Provided</option>
              <option value="Account Suspended">Account Suspended</option>
              <option value="Escalated to Admin">Escalated to Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              status === 'success' ? 'bg-green-500' : 'bg-ngo-primary hover:bg-ngo-dark'
            }`}
          >
            {status === 'submitting' ? (
              'Logging...'
            ) : status === 'success' ? (
              <>
                <CheckCircle2 size={20} /> Logged Successfully
              </>
            ) : (
              <>
                <Send size={20} /> Submit Incident
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffIncidentLog;
