import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Users, Shield, Lock, Search, Filter, Plus, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicCount: number;
  postCount: number;
  icon: React.ElementType;
}

interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastPost: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

const CommunitySupport = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([
    { id: '1', name: 'Rural Vitality & Family Harmony', description: 'Discussing family well-being and community growth.', topicCount: 156, postCount: 1240, icon: Users },
    { id: '2', name: 'Youth Empowerment', description: 'A space for young leaders to share ideas and support.', topicCount: 89, postCount: 650, icon: Shield },
    { id: '3', name: 'Health & Wellness', description: 'General health discussions and peer support.', topicCount: 210, postCount: 1800, icon: MessageCircle },
    { id: '4', name: 'Digital Literacy', description: 'Learning and sharing digital skills.', topicCount: 45, postCount: 320, icon: Lock },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([
    { id: '101', categoryId: '1', title: 'How to manage stress during harvest season?', author: 'Farmer_Rajesh', replies: 12, views: 150, lastPost: '2 hours ago', isPinned: true },
    { id: '102', categoryId: '1', title: 'Community kitchen initiative in Lucknow', author: 'SocialWorker_Amit', replies: 8, views: 95, lastPost: '5 hours ago' },
    { id: '103', categoryId: '2', title: 'Digital skills for rural youth - My experience', author: 'Yuva_Priya', replies: 25, views: 340, lastPost: '1 day ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Data Redaction Simulation: Masking potential PII in titles or authors
  const redactData = (text: string) => {
    // Simple regex to mask phone numbers or emails
    return text.replace(/\b\d{10}\b/g, '[REDACTED]')
               .replace(/\b[\w.-]+@[\w.-]+\.\w{2,4}\b/g, '[REDACTED]');
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTopics = selectedCategory 
    ? topics.filter(topic => topic.categoryId === selectedCategory.id)
    : topics;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ngo-primary mb-2">Community Support Hub</h1>
          <p className="text-slate-600">A safe, stigma-free space for peer support and community discussion.</p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search forums or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-ngo-primary/20 focus:border-ngo-primary outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-ngo-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-ngo-primary/90 transition-all">
            <Plus size={20} />
            New Topic
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Categories */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Filter size={16} />
                Categories
              </h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    !selectedCategory ? "bg-ngo-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  All Forums
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3",
                      selectedCategory?.id === cat.id ? "bg-ngo-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <cat.icon size={18} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                <Shield size={18} />
                <span>Privacy First</span>
              </div>
              <p className="text-xs text-blue-600 leading-relaxed">
                All community data is automatically redacted to remove personal identifiers. Your safety and anonymity are our priority.
              </p>
            </div>
          </div>

          {/* Main Content: Topics List */}
          <div className="lg:col-span-3 space-y-6">
            {selectedCategory ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-ngo-primary/10 rounded-2xl flex items-center justify-center text-ngo-primary">
                    <selectedCategory.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-ngo-primary">{selectedCategory.name}</h2>
                    <p className="text-slate-500 text-sm">{selectedCategory.description}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{selectedCategory.topicCount} Topics</span>
                  <span>{selectedCategory.postCount} Posts</span>
                </div>
              </div>
            ) : null}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="col-span-7">Topic</div>
                <div className="col-span-2 text-center">Replies</div>
                <div className="col-span-3 text-right">Last Post</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTopics.map((topic) => (
                  <motion.div 
                    key={topic.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-1 md:col-span-7">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {topic.isPinned ? (
                            <Shield size={16} className="text-amber-500" />
                          ) : (
                            <MessageSquare size={16} className="text-slate-300 group-hover:text-ngo-primary transition-colors" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 group-hover:text-ngo-primary transition-colors mb-1">
                            {redactData(topic.title)}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>by {redactData(topic.author)}</span>
                            <span>•</span>
                            <span>{categories.find(c => c.id === topic.categoryId)?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex md:flex-col items-center justify-center gap-2 md:gap-0">
                      <span className="md:text-lg font-bold text-slate-700">{topic.replies}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Replies</span>
                    </div>
                    <div className="col-span-1 md:col-span-3 text-right flex md:flex-col justify-center gap-2 md:gap-0">
                      <span className="text-sm font-bold text-slate-600">{topic.lastPost}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">by Anonymous</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-400">No topics found in this category.</h3>
                <p className="text-slate-400 text-sm">Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;
