/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, User, CreditCard, Bell, RefreshCw, Sparkles, ShieldAlert, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile, upgradeToPro, resetAllData } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'system'>('profile');

  // Form State
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [tagline, setTagline] = useState(currentUser?.tagline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [twitter, setTwitter] = useState(currentUser?.twitter || '');
  const [github, setGithub] = useState(currentUser?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || '');

  // Notifications state simulation
  const [notifMatch, setNotifMatch] = useState(true);
  const [notifVal, setNotifVal] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      tagline,
      bio,
      location,
      website,
      twitter,
      github,
      linkedin
    });
    alert('Profile settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 text-left">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left column navigation sidebar tabs */}
        <div className="w-full md:w-1/4 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 h-fit space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full px-3 py-2 text-xs font-mono rounded-xl text-left flex items-center gap-2 transition ${
              activeTab === 'profile' ? 'bg-[#1C1C1C] text-white border-l-2 border-[#6366F1] font-bold' : 'text-zinc-400 hover:bg-[#151515] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-[#6366F1]" />
            <span>Profile Details</span>
          </button>
          
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full px-3 py-2 text-xs font-mono rounded-xl text-left flex items-center gap-2 transition ${
              activeTab === 'billing' ? 'bg-[#1C1C1C] text-white border-l-2 border-[#6366F1] font-bold' : 'text-zinc-400 hover:bg-[#151515] hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-yellow-500" />
            <span>Premium Billing</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full px-3 py-2 text-xs font-mono rounded-xl text-left flex items-center gap-2 transition ${
              activeTab === 'notifications' ? 'bg-[#1C1C1C] text-white border-l-2 border-[#6366F1] font-bold' : 'text-zinc-400 hover:bg-[#151515] hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-green-500" />
            <span>Notification Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full px-3 py-2 text-xs font-mono rounded-xl text-left flex items-center gap-2 transition ${
              activeTab === 'system' ? 'bg-[#1C1C1C] text-white border-l-2 border-[#6366F1] font-bold' : 'text-zinc-400 hover:bg-[#151515] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>System Reset</span>
          </button>
        </div>

        {/* Right column main content panel */}
        <div className="flex-1 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-sm">
          
          {/* PROFILE FORM */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-1.5 font-mono">
                <span>PROFILE DETAILS</span>
              </h3>
              <p className="text-xs text-zinc-400">Configure your public credentials. These will be indexed in Search and the Co-builders Deck.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#A1A1AA]">Profile One-liner Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#A1A1AA]">Detailed Biography (bio)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">Website Portfolio URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">GitHub URL</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">Twitter Handle</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#A1A1AA]">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-[#6366F1]/10"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Credentials</span>
              </button>
            </form>
          )}

          {/* BILLING / STRIPE UPGRADE SIMULATION */}
          {activeTab === 'billing' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-white flex items-center gap-1.5 font-mono">
                <span>PREMIUM SUBSCRIPTIONS PLAN</span>
              </h3>

              {currentUser?.plan === 'pro' ? (
                <div className="bg-[#1C1C1C] border border-[#2A2A2A] p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center shadow-inner">
                    <Sparkles className="w-6 h-6 fill-yellow-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">Your Plan is ACTIVE: Founder PRO Premium</h4>
                    <p className="text-[10px] text-zinc-400 font-mono">Status: Paid via Stripe Webhook · Renews June 2027</p>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-sm">
                    You have unlocked unlimited daily swipes, unlimited product portfolios, claims over validated research, and a gold verified co-builder card status!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#1C1C1C] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">CURRENT STANDARD RATE:</span>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Solo Free Tier</span>
                        <span className="bg-zinc-800 text-zinc-400 text-[8px] font-mono px-2 py-0.5 rounded-full uppercase">active</span>
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">Limited to 20 swipes daily and 3 product list limits.</p>
                    </div>

                    <button
                      type="button"
                      onClick={upgradeToPro}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-lg shadow-yellow-500/10 shrink-0"
                    >
                      <Sparkles className="w-4 h-4 fill-black" />
                      <span>Upgrade to Pro ($12/mo)</span>
                    </button>
                  </div>

                  {/* Pricing features breakdown list */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">UNLOCKED ADVANTAGES WITH PRO</span>
                    <ul className="grid grid-cols-2 gap-3 bg-[#0A0A0A] p-4 rounded-xl border border-[#1C1C1C] text-zinc-400">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-500" /> Unlimited discovery swipes</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-500" /> Unlimited micro-SaaS listings</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-500" /> Immediate claim on validated ideas</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-yellow-500" /> Gold PRO verified badge</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATION LOGICS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-1.5 font-mono">
                <span>NOTIFICATIONS CONTROL</span>
              </h3>
              <p className="text-xs text-zinc-400">Select which automated alert flows you want to enable on your developer account.</p>

              <div className="space-y-2 bg-[#0A0A0A] p-4 rounded-2xl border border-[#1C1C1C]">
                <label className="flex items-center justify-between p-2 hover:bg-[#111111] rounded-xl transition cursor-pointer">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Mutual Match Matches</span>
                    <span className="text-[10px] text-zinc-500 block">Alert me immediately on mutual founder DMs matches.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifMatch}
                    onChange={(e) => setNotifMatch(e.target.checked)}
                    className="w-4 h-4 text-[#6366F1] bg-[#111111] border-[#2A2A2A] rounded focus:ring-0 focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-2 hover:bg-[#111111] rounded-xl transition cursor-pointer">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Community Validation Milestones</span>
                    <span className="text-[10px] text-zinc-500 block">Email me when my submitted raw ideas hit 50 right-swipes.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifVal}
                    onChange={(e) => setNotifVal(e.target.checked)}
                    className="w-4 h-4 text-[#6366F1] bg-[#111111] border-[#2A2A2A] rounded focus:ring-0 focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-2 hover:bg-[#111111] rounded-xl transition cursor-pointer">
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Weekly Digest Newsletter</span>
                    <span className="text-[10px] text-zinc-500 block">Weekly recap of trending micro-SaaS and dealrooms.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifDigest}
                    onChange={(e) => setNotifDigest(e.target.checked)}
                    className="w-4 h-4 text-[#6366F1] bg-[#111111] border-[#2A2A2A] rounded focus:ring-0 focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>
          )}

          {/* SYSTEM HARD RESET DATABASE */}
          {activeTab === 'system' && (
            <div className="space-y-5 text-left">
              <h3 className="text-base font-black text-red-500 flex items-center gap-1.5 font-mono">
                <span>SYSTEM RESET CENTRE</span>
              </h3>
              
              <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl space-y-4">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-red-500 block">⚠️ DESTRUCTIVE OPERATION DANGER ZONE</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Resetting all storage clears all local swipes, custom products published, matched deal conversations, and escrow states. This returns the application instantly to its seeded prototype state. This cannot be undone.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you absolutely sure you want to hard reset all localStorage databases? This resets all swipes, matches, and custom products.')) {
                      resetAllData();
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-lg shadow-red-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Hard Reset Workspace Local Databases</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
