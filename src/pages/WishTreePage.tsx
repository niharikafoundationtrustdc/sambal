import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TreeDeciduous, 
  Package, 
  Laptop, 
  Book, 
  Stethoscope, 
  CheckCircle2,
  ArrowRight,
  Heart
} from 'lucide-react';

interface WishItem {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
}

export default function WishTreePage() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fulfilledId, setFulfilledId] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/wish-items');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching wish items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (id: number) => {
    try {
      const payload = { userId: 1, wishId: id }; // Mock userId
      const res = await fetch(`/api/wish-items/${id}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // M5 Webhook: Log Wish Fulfillment
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M1_WISH_FULFILLMENT',
            payload,
            secure_url: '/wish-tree'
          })
        }).catch(err => console.error('M5 Wish Log Failed:', err));

        setFulfilledId(id);
        setTimeout(() => {
          setFulfilledId(null);
          fetchItems();
        }, 3000);
      }
    } catch (error) {
      console.error('Error fulfilling wish:', error);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Physical': return <Package size={24} />;
      case 'Skill': return <Laptop size={24} />;
      case 'National_Orphan_Fund': return <Heart size={24} />;
      default: return <Book size={24} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <TreeDeciduous size={40} />
        </div>
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Digital Wish-Tree</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real-time physical needs of our Lucknow campus and national orphan funds. Fulfill a wish today.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400">Loading wishes...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
                fulfilledId === item.id ? "border-emerald-500 bg-emerald-50" : "border-slate-100 hover:border-ngo-primary/30"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                fulfilledId === item.id ? "bg-emerald-500 text-white" : "bg-ngo-primary/10 text-ngo-primary"
              }`}>
                {fulfilledId === item.id ? <CheckCircle2 size={28} /> : getIcon(item.category)}
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">{item.description}</p>
              
              {fulfilledId === item.id ? (
                <div className="text-emerald-600 font-bold flex items-center gap-2">
                  <CheckCircle2 size={20} /> Pledge Received!
                </div>
              ) : (
                <button 
                  onClick={() => handleFulfill(item.id)}
                  className="w-full bg-ngo-primary text-white py-4 rounded-2xl font-bold hover:bg-ngo-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  Fulfill Wish <ArrowRight size={18} />
                </button>
              )}
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">All current wishes have been fulfilled. Check back soon!</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ngo-primary/20 blur-[100px] rounded-full" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">Project Vatsalya</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Pan-India orphan support. Cash contributions are tagged for the National Orphan Fund, while in-kind pledges are routed to local verified NGOs for decentralized fulfillment.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/10 rounded-xl border border-white/10 text-sm font-bold">
                Decentralized In-Kind
              </div>
              <div className="px-6 py-3 bg-white/10 rounded-xl border border-white/10 text-sm font-bold">
                M4 Verified Routing
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Heart className="text-rose-500" fill="currentColor" /> Recent Fulfillment
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-sm">Laptop for Delhi Hub</span>
                <span className="text-xs font-bold text-emerald-400">FULFILLED</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-sm">Medical Kit for Lucknow</span>
                <span className="text-xs font-bold text-emerald-400">FULFILLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
