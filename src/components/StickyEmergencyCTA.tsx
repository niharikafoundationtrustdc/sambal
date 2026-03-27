import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';

const StickyEmergencyCTA = () => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[60]"
    >
      <Link 
        to="/emergency"
        className="flex items-center gap-3 bg-yellow-400 text-red-600 px-6 py-4 rounded-full font-black shadow-[0_0_30px_rgba(234,67,53,0.6)] hover:bg-yellow-500 transition-all hover:scale-110 border-4 border-red-600 group"
      >
        <div className="bg-red-600 text-white p-2 rounded-full group-hover:rotate-12 transition-transform">
          <Activity size={24} className="animate-pulse" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] uppercase tracking-widest opacity-80">Emergency</span>
          <span className="text-sm uppercase tracking-tighter">Need Immediate Support</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default StickyEmergencyCTA;
