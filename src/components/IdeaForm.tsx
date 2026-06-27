/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowLeft, Lightbulb } from 'lucide-react';

export const IdeaForm: React.FC = () => {
  const { submitIdea, setActiveView } = useApp();

  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [monetizationHint, setMonetizationHint] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['fintech']);

  const tagsPreset = ['fintech', 'gig-economy', 'freelance', 'devtools', 'tailwind', 'design-to-code', 'privacy', 'ai', 'analytics', 'marketing', 'productivity'];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !problem) return;

    submitIdea({
      title,
      problem,
      solution: solution || undefined,
      targetAudience,
      monetizationHint: monetizationHint || undefined,
      tags: selectedTags,
      isPublished: true
    });

    setActiveView('explore');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-left">
      <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div className="flex justify-between items-center text-[10px] font-mono text-[#52525B]">
          <span>IDEA SUBMISSION ENGINE</span>
          <span>SUBMIT RESEARCH IDEA</span>
        </div>

        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
          <span>Pitch Your Raw Idea</span>
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-mono text-[#A1A1AA]">Idea / Problem Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Localized split-remittance tracker for gig workers"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-[#A1A1AA]">The Problem (Describe the pain point clearly) *</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            placeholder="What frustrating problem does this solve? Be descriptive."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-xs text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-[#A1A1AA]">Proposed Solution (Optional)</label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={3}
            placeholder="How do you propose to build or resolve this pain point?"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-xs text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#A1A1AA]">Target Audience *</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Gig workers, freelancers"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#A1A1AA]">Proposed Monetization</label>
            <input
              type="text"
              value={monetizationHint}
              onChange={(e) => setMonetizationHint(e.target.value)}
              placeholder="e.g. $5/mo SaaS or free extension"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#A1A1AA]">Select Related Tags (Max 2)</label>
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
                      ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-white' 
                      : 'bg-[#0A0A0A] border-[#2A2A2A] text-[#A1A1AA] hover:border-zinc-700'
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1C1C1C]">
          <button
            type="button"
            onClick={() => setActiveView('explore')}
            className="px-4 py-2 text-xs font-mono text-[#A1A1AA] hover:text-white flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            disabled={!title || !problem}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1 transition shadow-lg shadow-[#F59E0B]/10 cursor-pointer disabled:opacity-50"
          >
            <span>Launch Validation Draft</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
