/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Lightbulb, Users, Check, AlertTriangle, UserMinus, UserCheck, Star, Trash2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    ideas, 
    profiles, 
    approveProduct, 
    featureProduct, 
    rejectProduct, 
    banUser, 
    verifyUser 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'users' | 'analytics'>('listings');

  // Stats Counters
  const totalSwipes = 1420; // Mock historical tracker
  const pendingCount = products.filter(p => !p.isPublished).length;
  const verifiedFoundersCount = profiles.filter(p => p.isVerified).length;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 text-left">
      {/* Admin Header Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#6366F1]" />
            <span>Administrator Control Desk</span>
          </h2>
          <p className="text-xs text-zinc-400">Manage queue moderate product publications, verify credentials, and view metrics.</p>
        </div>

        {/* Sub tabs */}
        <div className="flex gap-2 bg-[#0A0A0A] border border-[#2A2A2A] p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeSubTab === 'listings' ? 'bg-[#6366F1] text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Listings Review
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeSubTab === 'users' ? 'bg-[#6366F1] text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            User Controls
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeSubTab === 'analytics' ? 'bg-[#6366F1] text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Analytics Insights
          </button>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#2A2A2A] p-4 rounded-2xl shadow-sm">
          <span className="text-[9px] font-mono text-[#52525B] block uppercase">Platform Users</span>
          <span className="text-2xl font-black text-white block mt-0.5">{profiles.length}</span>
        </div>
        <div className="bg-[#111111] border border-[#2A2A2A] p-4 rounded-2xl shadow-sm">
          <span className="text-[9px] font-mono text-[#52525B] block uppercase">Daily Swipes Index</span>
          <span className="text-2xl font-black text-white block mt-0.5">{totalSwipes}</span>
        </div>
        <div className="bg-[#111111] border border-[#2A2A2A] p-4 rounded-2xl shadow-sm">
          <span className="text-[9px] font-mono text-[#52525B] block uppercase">Pending Products</span>
          <span className="text-2xl font-black text-yellow-500 block mt-0.5">{pendingCount}</span>
        </div>
        <div className="bg-[#111111] border border-[#2A2A2A] p-4 rounded-2xl shadow-sm">
          <span className="text-[9px] font-mono text-[#52525B] block uppercase">Verified Creators</span>
          <span className="text-2xl font-black text-[#22C55E] block mt-0.5">{verifiedFoundersCount}</span>
        </div>
      </div>

      {/* SUBTAB CONTENT */}
      {activeSubTab === 'listings' && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white font-mono uppercase">Products Publication Queue</h3>
            <p className="text-xs text-zinc-400">Approve or reject custom product launches or promote them with boost triggers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-zinc-500 font-mono">
                  <th className="pb-3">PRODUCT</th>
                  <th className="pb-3">FOUNDER</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">UPVOTES</th>
                  <th className="pb-3 text-right">ADMIN OPERATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#151515] transition">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.logoUrl}</span>
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-zinc-500 block truncate max-w-xs">{p.tagline}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-400">@{p.founderUsername}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                        p.isPublished 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {p.isPublished ? 'published' : 'pending review'}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-400">{p.upvotesCount}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* Approval triggers */}
                        {!p.isPublished ? (
                          <button
                            onClick={() => approveProduct(p.id)}
                            className="bg-green-500 hover:bg-green-600 text-black font-bold px-2.5 py-1 rounded text-[10px] transition"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => rejectProduct(p.id)}
                            className="bg-transparent border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-500 px-2 py-1 rounded text-[10px] transition"
                          >
                            Unpublish
                          </button>
                        )}

                        <button
                          onClick={() => featureProduct(p.id)}
                          className={`px-2.5 py-1 rounded text-[10px] border transition flex items-center gap-0.5 ${
                            p.isFeatured 
                              ? 'bg-yellow-500 text-black border-yellow-500 font-bold' 
                              : 'bg-[#1C1C1C] border-[#2A2A2A] text-yellow-500'
                          }`}
                        >
                          <Star className="w-3 h-3 fill-yellow-500" />
                          <span>{p.isFeatured ? 'Featured' : 'Feature'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white font-mono uppercase">User Account Controls</h3>
            <p className="text-xs text-zinc-400">Suspend or moderate profiles or issue developer verification badges.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-zinc-500 font-mono">
                  <th className="pb-3">BUILDER PROFILE</th>
                  <th className="pb-3">PLAN TIER</th>
                  <th className="pb-3">VERIFIED STATUS</th>
                  <th className="pb-3">MODERATED</th>
                  <th className="pb-3 text-right">ACCOUNT MANAGEMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {profiles.map(u => (
                  <tr key={u.username} className="hover:bg-[#151515] transition">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2">
                        <img src={u.avatarUrl} alt={u.displayName} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-white block">{u.displayName}</span>
                          <span className="text-[10px] text-zinc-500 block font-mono">@{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 uppercase font-mono text-zinc-400">{u.plan}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                        u.isVerified 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {u.isVerified ? 'verified creator' : 'standard'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-mono rounded">
                          banned
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-mono text-[9px]">active</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => verifyUser(u.username)}
                          className="bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-white px-2.5 py-1 rounded text-[10px] transition"
                        >
                          Verify Badge
                        </button>
                        <button
                          onClick={() => banUser(u.username)}
                          className={`px-2.5 py-1 rounded text-[10px] transition ${
                            u.isBanned 
                              ? 'bg-green-500 text-black font-bold' 
                              : 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {u.isBanned ? 'Lift Ban' : 'Ban User'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white font-mono uppercase">Platform Analytics Insights</h3>
            <p className="text-xs text-zinc-400">Track daily signups and discovery matches inside native SVG visual graphics.</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col justify-between items-center space-y-4">
            <span className="text-xs font-mono text-zinc-500 self-start uppercase">Daily Registrations Curve (June 2026)</span>
            
            {/* Native SVG responsive chart */}
            <svg viewBox="0 0 500 150" className="w-full max-h-40 text-[#6366F1]">
              {/* Grids */}
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1A1A1A" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1A1A1A" strokeWidth="1" />
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1A1A1A" strokeWidth="1" />
              
              {/* Line graph coordinates */}
              <path 
                d="M 10,110 L 80,105 L 150,85 L 220,95 L 290,45 L 360,65 L 430,25 L 490,15" 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Overlay points */}
              <circle cx="10" cy="110" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="80" cy="105" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="150" cy="85" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="220" cy="95" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="290" cy="45" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="360" cy="65" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="430" cy="25" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
              <circle cx="490" cy="15" r="4.5" className="fill-white stroke-[#6366F1] stroke-2" />
            </svg>

            {/* Chart legend notes */}
            <div className="flex justify-between w-full text-[10px] font-mono text-[#52525B]">
              <span>June 1 (Launch)</span>
              <span>June 15</span>
              <span>June 27 (Today)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
