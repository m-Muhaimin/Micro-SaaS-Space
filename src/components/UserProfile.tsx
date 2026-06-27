/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Globe, Twitter, Github, Linkedin, Sparkles, Lightbulb, MapPin, Check, Plus } from 'lucide-react';
import { Product, Idea } from '../types';

interface UserProfileProps {
  onProductSelect: (p: Product) => void;
  onIdeaSelect: (i: Idea) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onProductSelect, onIdeaSelect }) => {
  const { 
    currentUser, 
    profiles, 
    products, 
    ideas, 
    viewingProfileUsername, 
    setViewingProfileUsername,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'ideas'>('products');
  const [isFollowed, setIsFollowed] = useState(false);

  const targetUsername = viewingProfileUsername || currentUser?.username;
  const profile = profiles.find(p => p.username === targetUsername);

  if (!profile) {
    return (
      <div className="text-center py-20 text-zinc-500 text-xs">
        Profile &ldquo;{targetUsername}&rdquo; not found.
      </div>
    );
  }

  // Filter owned products and ideas
  const userProducts = products.filter(p => p.founderUsername === profile.username && p.isPublished);
  const userIdeas = ideas.filter(i => i.authorUsername === profile.username && i.isPublished);

  const isSelf = currentUser?.username === profile.username;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 text-left">
      {/* Back button if viewing someone else */}
      {!isSelf && (
        <button
          onClick={() => setViewingProfileUsername(null)}
          className="text-xs font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition"
        >
          <span>← Back to My Dashboard</span>
        </button>
      )}

      {/* Profile Header Card */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        
        {/* Profile info block */}
        <div className="flex items-start md:items-center gap-4 flex-1">
          <img 
            src={profile.avatarUrl} 
            alt={profile.displayName} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-[#2A2A2A] shadow-md"
          />
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg md:text-xl font-black text-white">{profile.displayName}</h2>
              {profile.isVerified && (
                <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  ✓ VERIFIED
                </span>
              )}
              {profile.plan === 'pro' && (
                <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-mono px-2 py-0.5 rounded-full font-bold">
                  PRO FOUNDER
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 font-mono">@{profile.username}</p>
            
            <p className="text-xs text-zinc-300 max-w-lg leading-relaxed">{profile.tagline}</p>
            
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#52525B] pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>
              <span>·</span>
              <span>Joined {new Date(profile.createdAt).toLocaleDateString([], {month: 'long', year: 'numeric'})}</span>
            </div>
          </div>
        </div>

        {/* Action button side */}
        <div className="w-full md:w-auto flex flex-col items-stretch gap-2.5 shrink-0">
          {isSelf ? (
            <button
              onClick={() => setActiveView('settings')}
              className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-white px-4 py-2.5 rounded-xl text-center font-medium transition"
            >
              Edit Profile Settings
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsFollowed(!isFollowed)}
                className={`text-xs px-4 py-2.5 rounded-xl font-bold text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                  isFollowed 
                    ? 'bg-transparent border border-[#2A2A2A] text-[#A1A1AA]' 
                    : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-lg shadow-[#6366F1]/15'
                }`}
              >
                {isFollowed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Follow Founder</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  // Direct message trigger
                  setActiveView('matches');
                }}
                className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-zinc-300 px-4 py-2 rounded-xl transition text-center"
              >
                Send Message
              </button>
            </div>
          )}

          {/* Social icons row */}
          <div className="flex gap-2 justify-center md:justify-end pt-1 text-zinc-500">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-white transition p-1 rounded hover:bg-[#1C1C1C]">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-white transition p-1 rounded hover:bg-[#1C1C1C]">
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition p-1 rounded hover:bg-[#1C1C1C]">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition p-1 rounded hover:bg-[#1C1C1C]">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Bio and Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Bio & Skills */}
        <div className="md:col-span-2 space-y-5 bg-[#111111] border border-[#2A2A2A] p-6 rounded-2xl shadow-sm text-left">
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">BIO DESCRIPTION</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {profile.bio || "No detailed biography provided yet. This solo founder lets their products speak for them!"}
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#1C1C1C]">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">PRIMARY STACK CHIPS</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.primaryStack.map(s => (
                <span key={s} className="bg-[#0A0A0A] border border-[#1C1C1C] px-2.5 py-1 text-xs text-[#A1A1AA] rounded-lg font-mono">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Stats */}
        <div className="space-y-4">
          <div className="bg-[#111111] border border-[#2A2A2A] p-6 rounded-2xl shadow-sm space-y-4 text-left">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">PORTFOLIO TRACK</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3 text-center">
                <span className="text-[9px] font-mono text-[#52525B] block">PRODUCTS</span>
                <span className="text-xl font-black text-white block mt-0.5">{userProducts.length}</span>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3 text-center">
                <span className="text-[9px] font-mono text-[#52525B] block">IDEAS</span>
                <span className="text-xl font-black text-white block mt-0.5">{userIdeas.length}</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3.5 space-y-1 text-xs">
              <span className="text-[9px] font-mono text-[#52525B] block">LOOKING FOR CO-BUILD</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {profile.lookingFor.map(item => (
                  <span key={item} className="bg-[#6366F1]/10 text-[#6366F1] text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#6366F1]/10 uppercase">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Owned Content lists */}
      <div className="space-y-4">
        {/* Tabs selector */}
        <div className="flex gap-2 border-b border-[#2A2A2A] pb-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-mono text-xs flex items-center gap-1.5 transition ${
              activeTab === 'products' ? 'text-white border-b-2 border-[#6366F1] font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Published Products ({userProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-4 py-2 font-mono text-xs flex items-center gap-1.5 transition ${
              activeTab === 'ideas' ? 'text-white border-b-2 border-yellow-500 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Validation Ideas ({userIdeas.length})</span>
          </button>
        </div>

        {/* Tab Items grids */}
        <div>
          {activeTab === 'products' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {userProducts.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-6 col-span-full text-center">No published micro-SaaS products listed yet.</p>
              ) : (
                userProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onProductSelect(p)}
                    className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#6366F1]/50 transition duration-300 cursor-pointer flex flex-col justify-between h-44 text-left relative"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg w-8 h-8 rounded-lg bg-zinc-800/20 flex items-center justify-center">{p.logoUrl}</span>
                        <span className="text-[8px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                          {p.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white">{p.name}</h4>
                      <p className="text-[11px] text-[#A1A1AA] line-clamp-2">{p.tagline}</p>
                    </div>

                    <div className="border-t border-zinc-800 pt-2 mt-auto text-[9px] font-mono text-zinc-500 flex justify-between items-center">
                      <span>MRR: {p.mrrRange}</span>
                      <span>{p.upvotesCount} upvotes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'ideas' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {userIdeas.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-6 col-span-full text-center">No validation research ideas submitted yet.</p>
              ) : (
                userIdeas.map(i => (
                  <div
                    key={i.id}
                    onClick={() => onIdeaSelect(i)}
                    className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 hover:border-yellow-500/50 transition duration-300 cursor-pointer flex flex-col justify-between h-44 text-left"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-zinc-500 block">pitched by @{i.authorUsername}</span>
                      <h4 className="text-xs font-black text-white leading-snug line-clamp-2">{i.title}</h4>
                      <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed">{i.problem}</p>
                    </div>

                    <div className="border-t border-zinc-800 pt-2 mt-auto text-[9px] font-mono text-zinc-500 flex justify-between items-center">
                      <span>Audience: {i.targetAudience}</span>
                      <span className="text-yellow-500 font-bold">{i.swipeRightCount} swipes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
