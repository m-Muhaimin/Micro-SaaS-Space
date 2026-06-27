/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, ArrowLeft, Tag, DollarSign, Sparkles } from 'lucide-react';

export const ProductForm: React.FC = () => {
  const { submitProduct, setActiveView, currentUser } = useApp();
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState<'stealth' | 'beta' | 'live' | 'paused' | 'for_sale'>('live');
  const [logoUrl, setLogoUrl] = useState('⚡');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80');
  const [description, setDescription] = useState('');
  const [stackInput, setStackInput] = useState('');
  const [primaryStack, setPrimaryStack] = useState<string[]>(['React', 'Vercel']);
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [mrrRange, setMrrRange] = useState('$0/mo');
  const [mrrExact, setMrrExact] = useState<number | undefined>(undefined);
  const [targetMarket, setTargetMarket] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['developer-tools']);
  
  // For Sale terms
  const [askingPrice, setAskingPrice] = useState<number | undefined>(undefined);
  const [acquisitionRationale, setAcquisitionRationale] = useState('');

  const tagsPreset = ['developer-tools', 'feedback', 'analytics', 'productivity', 'privacy', 'ai', 'design-tools', 'api', 'datasets', 'fintech', 'marketing', 'legaltech'];
  const mrrOptions = ['$0/mo', '$0–$200/mo', '$200–$500/mo', '$500–$1K/mo', '$1K–$5K/mo', '$5K+'];

  const handleAddStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (stackInput.trim() && !primaryStack.includes(stackInput.trim())) {
      setPrimaryStack([...primaryStack, stackInput.trim()]);
      setStackInput('');
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tagline) return;

    submitProduct({
      name,
      tagline,
      status,
      logoUrl,
      coverUrl,
      description: description || `No description provided yet for **${name}**.`,
      primaryStack,
      demoUrl: demoUrl || undefined,
      repoUrl: repoUrl || undefined,
      mrrRange,
      mrrExact,
      targetMarket: targetMarket || undefined,
      tags: selectedTags,
      screenshots: [coverUrl],
      askingPrice: status === 'for_sale' ? (askingPrice || 5000) : undefined,
      acquisitionRationale: status === 'for_sale' ? (acquisitionRationale || 'N/A') : undefined,
      isPublished: true
    });

    // Go back to explorer or user profile
    setActiveView('explore');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-left">
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        
        {/* Progress header */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#52525B]">
          <span>STEP {step} OF {status === 'for_sale' ? 4 : 3}</span>
          <span className="uppercase tracking-wider">Submit micro-SaaS Product</span>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6366F1]" />
              <span>Basic Information</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Krostio"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Tagline / One-liner *</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Instant feedback widgets for micro-SaaS builders"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">Product Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="beta">Beta / Sandbox</option>
                  <option value="live">Live / Active</option>
                  <option value="stealth">Stealth Mode</option>
                  <option value="paused">Paused</option>
                  <option value="for_sale">💰 For Sale / Acquisition</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">Logo Emoji or Icon</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="e.g. ⚡"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] text-center focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Cover Image URL</label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/..."
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-[#A1A1AA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Tech details & Description */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Full Product Pitch</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Detailed Pitch Description (Markdown supported)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="### Why this product?
Write a compelling story about how this product helps solo developers..."
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-xs font-mono text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">Demo URL</label>
                <input
                  type="text"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="e.g. https://krostio.com"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">GitHub / Repo URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="e.g. https://github.com/..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#A1A1AA]">Primary Stack Chips</label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl">
                {primaryStack.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px] text-[#A1A1AA] flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => setPrimaryStack(primaryStack.filter(x => x !== s))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="Add stack element (e.g. Next.js)"
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
                <button type="button" onClick={handleAddStack} className="bg-[#1C1C1C] text-xs px-3 rounded-lg border border-[#2A2A2A] text-white">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Monetization & Tags */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Traction & Category Tags</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">MRR Range Estimate</label>
                <select
                  value={mrrRange}
                  onChange={(e) => setMrrRange(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                >
                  {mrrOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#A1A1AA]">Exact MRR (private numeric)</label>
                <input
                  type="number"
                  value={mrrExact || ''}
                  onChange={(e) => setMrrExact(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 350"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Target Market</label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="e.g. Solo developers, creators, small agency teams"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#A1A1AA]">Select Platform tags (Max 3)</label>
              <div className="flex flex-wrap gap-1.5">
                {tagsPreset.map(t => {
                  const selected = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleTag(t)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition ${
                        selected 
                          ? 'bg-[#6366F1]/10 border-[#6366F1] text-white' 
                          : 'bg-[#0A0A0A] border-[#2A2A2A] text-[#A1A1AA] hover:border-zinc-700'
                      }`}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Acquisition details (only if status is for_sale) */}
        {step === 4 && status === 'for_sale' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <span>Acquisition Pricing & Terms</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Asking Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#52525B] font-mono">$</span>
                <input
                  type="number"
                  value={askingPrice || ''}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  placeholder="e.g. 3500"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-8 pr-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#A1A1AA]">Acquisition Rationale & Details</label>
              <textarea
                value={acquisitionRationale}
                onChange={(e) => setAcquisitionRationale(e.target.value)}
                rows={4}
                placeholder="Explain why you are selling, what is included in the deal (domain, database, support), and what the expansion possibilities are."
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-xs text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        )}

        {/* Navigation / Actions bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1C1C1C]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveView('explore')}
              className="px-4 py-2 text-xs font-mono text-zinc-500 hover:text-white transition"
            >
              Cancel
            </button>
          )}

          {/* Logic to either go next or submit */}
          {(step < 3 || (status === 'for_sale' && step < 4)) ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!name || !tagline)) {
                  alert('Please fill out name and tagline');
                  return;
                }
                setStep(step + 1);
              }}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1 transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name || !tagline}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer shadow-lg shadow-[#6366F1]/10 disabled:opacity-50"
            >
              <span>Publish Product</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
