import React from 'react';
import { Phone, AlertTriangle, Shield, ExternalLink, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const EmergencyPage = () => {
  const governmentHelplines = [
    { name: 'Kiran Helpline (Mental Health)', number: '1800-599-0019', description: '24/7 National Mental Health Helpline by Govt. of India' },
    { name: 'Childline', number: '1098', description: '24/7 Emergency helpline for children in distress' },
    { name: 'Women Helpline', number: '181', description: '24/7 Helpline for women in distress' },
    { name: 'Police', number: '112', description: 'Emergency response service' },
  ];

  const handleHelplineClick = (helpline: any) => {
    // M5 Webhook: Log Emergency Helpline Click
    fetch('/api/m5/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: 'M12_EMERGENCY_HELPLINE',
        payload: {
          helpline_name: helpline.name,
          helpline_number: helpline.number,
          timestamp: new Date().toISOString()
        },
        secure_url: '/emergency'
      })
    }).catch(err => console.error('M5 Emergency Log Failed:', err));
  };

  return (
    <div className="min-h-screen bg-rose-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-red-600"
        >
          <div className="bg-red-600 p-8 text-white text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-serif font-black uppercase tracking-tighter">Need Immediate Support?</h1>
            <p className="mt-2 text-red-100 font-medium">You are not alone. Help is available right now.</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Immediate Action */}
            <section className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6">
              <h2 className="text-xl font-serif font-bold text-red-700 flex items-center gap-2 mb-4">
                <Phone size={24} />
                Call a Helpline Immediately
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {governmentHelplines.map((helpline) => (
                  <a 
                    key={helpline.number}
                    href={`tel:${helpline.number.replace(/-/g, '')}`}
                    onClick={() => handleHelplineClick(helpline)}
                    className="bg-white p-4 rounded-2xl border border-yellow-200 hover:border-red-400 hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{helpline.name}</span>
                      <Phone size={16} className="text-red-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-black text-red-600 mb-1">{helpline.number}</div>
                    <p className="text-xs text-slate-500">{helpline.description}</p>
                  </a>
                ))}
              </div>
            </section>

            {/* Liability Shift / Digital Bridge Notice */}
            <section className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="bg-ngo-primary/10 p-3 rounded-2xl text-ngo-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-slate-900 mb-2">Manisha Mandir Digital Bridge</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our platform acts as a bridge to professional care. In cases of severe mental illness, self-harm risk, or legal danger, our system is designed to facilitate immediate transition to government health frameworks and emergency services.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="bg-ngo-primary text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-ngo-primary/90 transition-all">
                      <MapPin size={14} />
                      Find Nearest Hospital
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                      <ExternalLink size={14} />
                      Govt. Health Portal
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Self-Harm Warning */}
            <div className="text-center p-6 border-2 border-dashed border-red-200 rounded-3xl">
              <p className="text-red-600 font-bold italic">
                "If you are currently experiencing thoughts of self-harm or suicide, please call 112 or visit the nearest emergency room immediately."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyPage;
