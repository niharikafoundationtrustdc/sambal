import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ClipboardCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Users,
  Accessibility,
  Wallet
} from 'lucide-react';
import { t } from '../constants/translations';
import { LanguageCode } from '../constants/languages';
import { IdentityBlock, ContactBlock } from '../components/FormBlocks';
import { generateUIN } from '../lib/sambalUtils';
import { dbService } from '../services/db';

import { auth } from '../firebase';

const FormPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState<any>({
    identity: {
      fullName: '',
      dob: '',
      aadhaar: '',
      pincode: ''
    },
    contact: {
      mobileNumber: '',
      emergencyContact: ''
    },
    education: {
      schoolName: '',
      grade: '',
      stream: ''
    },
    socioEconomic: {
      bplStatus: 'APL',
      familyIncome: ''
    },
    disability: {
      hasDisability: false,
      type: '',
      percentage: ''
    },
    consent: false
  });

  // Form 1: Master Beneficiary & Student Registration
  const isForm1 = formId === '1';

  const handleIdentityChange = (data: any) => {
    setFormData((prev: any) => ({ ...prev, identity: { ...prev.identity, ...data } }));
  };

  const handleContactChange = (data: any) => {
    setFormData((prev: any) => ({ ...prev, contact: { ...prev.contact, ...data } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Please login to submit the form');
      return;
    }

    if (!formData.consent) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    try {
      const uin = generateUIN();
      const recordPayload = {
        uin,
        branchId: 'LKO-01',
        formId: formId || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'Pending' as const,
        data: {
          ...formData,
          submittedBy: auth.currentUser.uid,
          submittedAt: new Date().toISOString()
        }
      };

      await dbService.saveRecord(recordPayload);
      setSubmitStatus('success');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('formSuccess', language)}</h2>
          <p className="text-slate-600 mb-6">Your application has been logged in the SAMBAL Master Ledger. Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-ngo-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-ngo-primary p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <ClipboardCheck size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isForm1 ? 'Master Beneficiary & Student Registration' : `Form ${formId}`}
                </h1>
                <p className="text-white/80 text-sm">SAMBAL National Nodal Hub - Official Registration</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {/* Section 1: Identity */}
            <section>
              <IdentityBlock 
                language={language} 
                formData={formData.identity} 
                setFormData={handleIdentityChange} 
              />
            </section>

            {/* Section 2: Contact */}
            <section>
              <ContactBlock 
                language={language} 
                formData={formData.contact} 
                setFormData={handleContactChange} 
              />
            </section>

            {isForm1 && (
              <>
                {/* Section 3: Education */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <GraduationCap size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{t('educationBlock', language)}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('schoolName', language)}</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
                        value={formData.education.schoolName}
                        onChange={(e) => setFormData({ ...formData, education: { ...formData.education, schoolName: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('grade', language)}</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
                        value={formData.education.grade}
                        onChange={(e) => setFormData({ ...formData, education: { ...formData.education, grade: e.target.value } })}
                      />
                    </div>
                  </div>
                </section>

                {/* Section 4: Socio-Economic */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{t('socioEconomicBlock', language)}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('bplStatus', language)}</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
                        value={formData.socioEconomic.bplStatus}
                        onChange={(e) => setFormData({ ...formData, socioEconomic: { ...formData.socioEconomic, bplStatus: e.target.value } })}
                      >
                        <option value="APL">APL (Above Poverty Line)</option>
                        <option value="BPL">BPL (Below Poverty Line)</option>
                        <option value="Antyodaya">Antyodaya (AAY)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t('familyIncome', language)}</label>
                      <input 
                        type="number"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary focus:border-transparent outline-none transition-all"
                        value={formData.socioEconomic.familyIncome}
                        onChange={(e) => setFormData({ ...formData, socioEconomic: { ...formData.socioEconomic, familyIncome: e.target.value } })}
                      />
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Section: Consent */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">{t('legalUndertaking', language)}</h3>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-5 h-5 text-ngo-primary rounded border-slate-300 focus:ring-ngo-primary"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                />
                <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed">
                  {t('consentCheckbox', language)}
                </label>
              </div>
            </section>

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{t('formError', language)}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-ngo-primary/20 hover:bg-ngo-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ClipboardCheck size={24} />
                  {t('submitForm', language)}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
