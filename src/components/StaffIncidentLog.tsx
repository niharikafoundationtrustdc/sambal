import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Shield, User, FileText, Send, CheckCircle } from 'lucide-react';
import { UserRole, IncidentLog } from '../types';
import { M5Service } from '../services/m5Service';

interface StaffIncidentLogProps {
  userRole: UserRole;
  userId: string;
}

export const StaffIncidentLog: React.FC<StaffIncidentLogProps> = ({ userRole, userId }) => {
  const [beneficiaryUin, setBeneficiaryUin] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentLog['incidentType']>('SOS Protocol');
  const [actionTaken, setActionTaken] = useState<IncidentLog['actionTaken']>('Helpline Provided');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Ultimate Member style content restriction
  const allowedRoles = [UserRole.TRIAGE_DESK, UserRole.COUNSELOR, UserRole.SUPER_ADMIN];
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Access Restricted</h2>
        <p className="text-red-700">This page is only accessible to authorized staff members.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await M5Service.logIncident({
        beneficiaryUin,
        incidentType,
        actionTaken,
        staffId: userId,
      });
      setSuccess(true);
      setBeneficiaryUin('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to log incident:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Incident Log</h1>
          <p className="text-sm text-gray-500 italic">Secure Gateway to M5 Master Ledger</p>
        </div>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Incident successfully logged to M5 Master Ledger. Audit trail updated.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" /> Beneficiary UIN
          </label>
          <input
            type="text"
            required
            placeholder="Do not enter names (e.g., MM-UP-226001-042)"
            value={beneficiaryUin}
            onChange={(e) => setBeneficiaryUin(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">Strictly use UIN for DPDP compliance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Incident Type</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="SOS Protocol">SOS Protocol</option>
              <option value="Duplicate Account">Duplicate Account</option>
              <option value="Offline Support">Offline Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Action Taken</label>
            <select
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="Helpline Provided">Helpline Provided</option>
              <option value="Account Suspended">Account Suspended</option>
              <option value="Escalated to Admin">Escalated to Admin</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Shield className="w-3 h-3" /> Audit Metadata (Auto-Captured)
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>Staff ID: <span className="text-gray-900">{userId}</span></div>
            <div>Timestamp: <span className="text-gray-900">{new Date().toLocaleTimeString()}</span></div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          Push to M5 Master Ledger
        </button>
      </form>

      <div className="mt-8 pt-6 border-t text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] uppercase font-bold tracking-wider">
          <FileText className="w-3 h-3" /> Uncanny Automator Bridge Active
        </div>
      </div>
    </div>
  );
};
