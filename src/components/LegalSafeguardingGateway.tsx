import React from 'react';
import { ShieldAlert, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface GatewayProps {
  onBack: () => void;
}

export default function LegalSafeguardingGateway({ onBack }: GatewayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[200] bg-red-600 flex items-center justify-center p-4 text-white"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <ShieldAlert size={64} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-serif font-bold">Immediate Safety Required</h2>
          <p className="text-xl opacity-90">
            You indicated that you feel physically unsafe. Your safety is our absolute priority. 
            The current process has been paused to provide you with immediate government support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="tel:1098" 
            className="bg-white text-red-600 p-6 rounded-[2rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-2"
          >
            <Phone size={32} />
            <span className="font-bold text-2xl">1098</span>
            <span className="text-xs uppercase tracking-widest font-bold">Govt Childline</span>
          </a>
          <a 
            href="tel:1091" 
            className="bg-white text-red-600 p-6 rounded-[2rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-2"
          >
            <Phone size={32} />
            <span className="font-bold text-2xl">1091</span>
            <span className="text-xs uppercase tracking-widest font-bold">Women's Helpline</span>
          </a>
        </div>

        <div className="pt-8 border-t border-white/20">
          <button 
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            Return to Safety Information
          </button>
        </div>
      </div>
    </motion.div>
  );
}
