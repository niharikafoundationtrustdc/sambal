import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Tag, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  Coins,
  Package
} from 'lucide-react';

interface MerchItem {
  id: number;
  name: string;
  description: string;
  price_credits: number;
  image_url: string;
  category: string;
}

export default function SnehBazaar() {
  const [items, setItems] = useState<MerchItem[]>([
    {
      id: 1,
      name: "Hand-Woven Scarf",
      description: "Crafted by artisans in our Lucknow vocational center.",
      price_credits: 500,
      image_url: "https://picsum.photos/seed/scarf/400/400",
      category: "Apparel"
    },
    {
      id: 2,
      name: "Terracotta Planter",
      description: "Eco-friendly planters made by local youth.",
      price_credits: 300,
      image_url: "https://picsum.photos/seed/pot/400/400",
      category: "Home"
    },
    {
      id: 3,
      name: "Artisan Notebook",
      description: "Recycled paper with hand-painted covers.",
      price_credits: 200,
      image_url: "https://picsum.photos/seed/notebook/400/400",
      category: "Stationery"
    }
  ]);

  const [userCredits, setUserCredits] = useState(750); // Mock credits
  const [orderedId, setOrderedId] = useState<number | null>(null);

  const handleOrder = async (item: MerchItem) => {
    if (userCredits < item.price_credits) {
      alert("Insufficient Sneh-Sarthi credits!");
      return;
    }

    try {
      // Mock API call to order
      const payload = {
        item_id: item.id,
        item_name: item.name,
        price_credits: item.price_credits,
        user_id: 1 // Mock
      };

      // M5 Webhook: Log Order
      fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'M6_MERCH_ORDER',
          payload,
          secure_url: '/sneh-bazaar'
        })
      }).catch(err => console.error('M5 Merch Log Failed:', err));

      setOrderedId(item.id);
      setUserCredits(prev => prev - item.price_credits);
      setTimeout(() => setOrderedId(null), 3000);
    } catch (error) {
      console.error('Error ordering merch:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">Sneh-Bazaar</h1>
          <p className="text-lg text-slate-600 max-w-xl">
            Digital Artisan Catalog. Redeem your Sneh-Sarthi credits for hand-crafted merchandise made by our beneficiaries.
          </p>
        </div>
        <div className="bg-amber-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/20 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Coins size={32} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Your Balance</div>
            <div className="text-4xl font-serif font-bold">{userCredits} Credits</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-900">
                {item.category}
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{item.name}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{item.description}</p>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <Coins size={18} /> {item.price_credits}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Truck size={14} /> Free Shipping
                </div>
              </div>

              {orderedId === item.id ? (
                <div className="w-full py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Order Placed!
                </div>
              ) : (
                <button 
                  onClick={() => handleOrder(item)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Redeem Now <ArrowRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-emerald-50 rounded-[3rem] border border-emerald-100">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={32} />
            </div>
            <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">Artisan Direct</h4>
            <p className="text-sm text-slate-500">100% of the credit value goes back to supporting the artisan's livelihood.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Tag size={32} />
            </div>
            <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">Zero Waste</h4>
            <p className="text-sm text-slate-500">All products are made using sustainable materials and ethical processes.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} />
            </div>
            <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">Trackable Impact</h4>
            <p className="text-sm text-slate-500">Each item comes with a QR code showing the story of the artisan who made it.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
