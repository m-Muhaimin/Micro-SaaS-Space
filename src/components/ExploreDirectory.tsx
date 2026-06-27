/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, Lightbulb, Users, SlidersHorizontal, Heart, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Product, Idea, Profile } from '../types';

interface ExploreDirectoryProps {
  onProductSelect: (p: Product) => void;
  onIdeaSelect: (i: Idea) => void;
}

export const ExploreDirectory: React.FC<ExploreDirectoryProps> = ({ onProductSelect, onIdeaSelect }) => {
  const { 
    products, 
    ideas, 
    profiles, 
    activeExploreTab, 
    setActiveExploreTab,
    currentUser,
    setViewingProfileUsername,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const allTags = ['all', 'developer-tools', 'feedback', 'analytics', 'productivity', 'privacy', 'ai', 'design-tools', 'api', 'datasets', 'fintech', 'marketing', 'legaltech', 'gig-economy'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || p.tags.includes(selectedTag);
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return p.isPublished && matchesSearch && matchesTag && matchesStatus;
  });

  const filteredIdeas = ideas.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.problem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || i.tags.includes(selectedTag);
    const matchesStatus = selectedStatus === 'all' || i.status === selectedStatus;
    return i.isPublished && matchesSearch && matchesTag && matchesStatus;
  });

  const filteredFounders = profiles.filter(f => {
    const matchesSearch = f.username.toLowerCase().includes(searchQuery.toLowerCase()) || f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || f.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || f.primaryStack.some(s => s.toLowerCase() === selectedTag.toLowerCase());
    return !f.isBanned && matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 space-y-6 text-left">
      
      {/* 1. Explore Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-md">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white tracking-tight">SaaS Discovery Explorer</h2>
          <p className="text-xs text-[#A1A1AA]">Browse the complete directory list of published micro-SaaS assets, research drafts, and builders.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 bg-[#0A0A0A] border border-[#2A2A2A] p-1 rounded-xl">
          <button
            onClick={() => { setActiveExploreTab('products'); setSelectedStatus('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeExploreTab === 'products' ? 'bg-[#6366F1] text-white' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <button
            onClick={() => { setActiveExploreTab('ideas'); setSelectedStatus('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeExploreTab === 'ideas' ? 'bg-[#F59E0B] text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Ideas</span>
          </button>
          <button
            onClick={() => { setActiveExploreTab('founders'); setSelectedStatus('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeExploreTab === 'founders' ? 'bg-[#22C55E] text-white' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Co-builders</span>
          </button>
        </div>
      </div>

      {/* 2. Filters Row */}
      <div className="grid md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#52525B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeExploreTab}...`}
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        {/* Tag select dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#6366F1]"
          >
            <option value="all">All Tech Tags / Industries</option>
            {allTags.filter(t => t !== 'all').map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>

        {/* Status Filter for products */}
        {activeExploreTab === 'products' && (
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#6366F1]"
            >
              <option value="all">All Launch Statuses</option>
              <option value="live">Live / Running</option>
              <option value="beta">Beta Phase</option>
              <option value="for_sale">💰 Assets For Sale</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. Grid Views */}
      <div>
        {activeExploreTab === 'products' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-zinc-500 text-xs">
                No products found matching those search criteria.
              </div>
            ) : (
              filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => onProductSelect(p)}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#6366F1]/50 transition duration-300 cursor-pointer flex flex-col justify-between h-52 relative group overflow-hidden"
                >
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xl w-8 h-8 rounded-lg bg-zinc-800/30 flex items-center justify-center">{p.logoUrl}</span>
                        <div>
                          <h4 className="text-xs font-black text-white truncate max-w-[120px]">{p.name}</h4>
                          <p className="text-[9px] text-zinc-500 font-mono">@{p.founderUsername}</p>
                        </div>
                      </div>

                      {p.status === 'for_sale' ? (
                        <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-mono px-2 py-0.5 rounded-full font-bold">
                          FOR SALE
                        </span>
                      ) : (
                        <span className="bg-zinc-800 text-zinc-400 text-[8px] font-mono px-2 py-0.5 rounded-full uppercase">
                          {p.status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-3">
                      {p.tagline}
                    </p>
                  </div>

                  <div className="border-t border-[#1C1C1C] pt-2 mt-auto flex justify-between items-center text-[9px] font-mono text-[#52525B]">
                    <span>MRR: {p.mrrRange}</span>
                    <span className="flex items-center gap-0.5 text-zinc-400">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {p.upvotesCount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeExploreTab === 'ideas' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIdeas.length === 0 ? (
              <div className="col-span-full text-center py-16 text-zinc-500 text-xs">
                No validation ideas found matching those search criteria.
              </div>
            ) : (
              filteredIdeas.map(i => {
                const isValidated = i.swipeRightCount >= 50;
                return (
                  <div
                    key={i.id}
                    onClick={() => onIdeaSelect(i)}
                    className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#F59E0B]/50 transition duration-300 cursor-pointer flex flex-col justify-between h-52 text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-zinc-500">pitched by @{i.authorUsername}</span>
                        {isValidated ? (
                          <span className="bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-mono px-2 py-0.5 rounded">VALIDATED</span>
                        ) : (
                          <span className="bg-[#1C1C1C] text-zinc-400 text-[8px] font-mono px-2 py-0.5 rounded">OPEN PITCH</span>
                        )}
                      </div>

                      <h4 className="text-xs font-black text-white leading-snug line-clamp-2">
                        {i.title}
                      </h4>

                      <p className="text-[11px] text-[#A1A1AA] line-clamp-3 leading-relaxed">
                        {i.problem}
                      </p>
                    </div>

                    <div className="border-t border-[#1C1C1C] pt-2 mt-auto flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[#52525B]">Audience: {i.targetAudience}</span>
                      <span className="text-[#F59E0B] font-bold">{i.swipeRightCount} right swipes</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeExploreTab === 'founders' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFounders.length === 0 ? (
              <div className="col-span-full text-center py-16 text-zinc-500 text-xs">
                No co-builders matched those search parameters.
              </div>
            ) : (
              filteredFounders.map(f => (
                <div
                  key={f.username}
                  onClick={() => {
                    setViewingProfileUsername(f.username);
                    setActiveView('profile');
                  }}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#22C55E]/50 transition duration-300 cursor-pointer flex flex-col justify-between h-52 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <img src={f.avatarUrl} alt={f.displayName} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1">
                          {f.displayName}
                          {f.isVerified && <span className="w-3 h-3 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[7px]">✓</span>}
                        </h4>
                        <p className="text-[9px] font-mono text-zinc-500">@{f.username} · {f.location}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-3 leading-normal">
                      &ldquo;{f.tagline}&rdquo;
                    </p>
                  </div>

                  <div className="border-t border-[#1C1C1C] pt-2 mt-auto flex flex-wrap gap-1 max-h-12 overflow-hidden">
                    {f.primaryStack.slice(0, 3).map(s => (
                      <span key={s} className="bg-[#1C1C1C] text-[#A1A1AA] border border-[#2A2A2A] text-[8px] font-mono px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
