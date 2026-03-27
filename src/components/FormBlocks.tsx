import React from 'react';
import { User, Calendar, Shield, MapPin, Phone, MessageCircle, AlertCircle } from 'lucide-react';
import { t } from '../constants/translations';
import { LanguageCode } from '../constants/languages';

interface BlockProps {
  language: LanguageCode;
  formData: any;
  setFormData: (data: any) => void;
}

export const IdentityBlock = ({ language, formData, setFormData }: BlockProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 text-ngo-primary mb-4">
        <User size={20} />
        <h3 className="font-serif font-bold text-xl">{t('identityBlock', language)}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('fullName', language)}</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('dob', language)}</label>
          <input 
            type="date" 
            name="dob"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('fatherSpouseName', language)}</label>
          <input 
            type="text" 
            name="fatherSpouseName"
            value={formData.fatherSpouseName || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('aadhaar', language)} (Encrypted)</label>
          <input 
            type="text" 
            name="aadhaar"
            value={formData.aadhaar || ''}
            onChange={handleChange}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('pincode', language)}</label>
          <input 
            type="text" 
            name="pincode"
            value={formData.pincode || ''}
            onChange={handleChange}
            maxLength={6}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
};

export const ContactBlock = ({ language, formData, setFormData }: BlockProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 text-ngo-primary mb-4">
        <Phone size={20} />
        <h3 className="font-serif font-bold text-xl">{t('contactBlock', language)}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('mobileNumber', language)} (OTP Verified)</label>
          <input 
            type="tel" 
            name="mobileNumber"
            value={formData.mobileNumber || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('whatsappNumber', language)}</label>
          <input 
            type="tel" 
            name="whatsappNumber"
            value={formData.whatsappNumber || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('emergencyContact', language)} (Name & Relation)</label>
          <input 
            type="text" 
            name="emergencyContact"
            value={formData.emergencyContact || ''}
            onChange={handleChange}
            placeholder="e.g. Rajesh (Brother) - 9876543210"
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-ngo-primary outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
};
