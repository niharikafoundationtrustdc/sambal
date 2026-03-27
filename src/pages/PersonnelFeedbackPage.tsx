import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PersonnelFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPublicFunnel, setIsPublicFunnel] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    const payload = {
      beneficiaryId: 1, // Mock
      personnelId: 1, // Mock
      sessionId: 1, // Mock
      rating,
      comments
    };

    try {
      const res = await fetch('/api/campus/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        // M5 Webhook: Log Feedback
        fetch('/api/m5/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_id: 'M10_PERSONNEL_FEEDBACK',
            payload,
            secure_url: '/personnel/feedback'
          })
        }).catch(err => console.error('M5 Feedback Log Failed:', err));

        setSuccess(true);
        setIsPublicFunnel(data.isPublicFunnel);
      }
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Personnel Feedback</h1>
        <p className="text-slate-600">
          Your feedback helps us maintain high quality standards for our volunteers and experts.
          All feedback is routed privately to the M8 Audit Council.
        </p>
      </header>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You for Your Feedback!</h2>
          <p className="text-slate-600 mb-8">
            Your input has been securely logged in our private audit ledger.
          </p>

          {isPublicFunnel && (
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-left">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Star className="text-indigo-600" size={20} fill="currentColor" />
                Share Your Experience Publicly?
              </h3>
              <p className="text-sm text-indigo-700 mb-4">
                Since you had a great experience, would you like to leave a review on Google to help others find us?
              </p>
              <a 
                href="https://g.page/r/your-google-review-link/review" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Leave Google Review <ExternalLink size={16} />
              </a>
            </div>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center">
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Rate your experience</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    size={40} 
                    className={cn(
                      "transition-colors",
                      (hoverRating || rating) >= star ? "text-amber-400 fill-amber-400" : "text-slate-200"
                    )} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Confidential Comments</label>
            <textarea
              required
              rows={4}
              placeholder="Share your thoughts on the session or personnel..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-ngo-primary/20 outline-none resize-none"
              value={comments}
              onChange={e => setComments(e.target.value)}
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="text-ngo-primary mt-0.5" size={20} />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Privacy Shield:</strong> Your comments are strictly confidential and will only be seen by the M8 Audit Council. 
              We do not share negative feedback publicly to protect both beneficiaries and personnel.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-4 bg-ngo-primary text-white rounded-2xl font-bold hover:bg-ngo-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ngo-primary/20"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
}
