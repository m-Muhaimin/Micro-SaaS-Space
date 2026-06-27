/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, MessageSquare, Heart, Lightbulb, Hammer, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Idea } from '../types';

interface IdeaDetailModalProps {
  idea: Idea;
  onClose: () => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ idea, onClose }) => {
  const { currentUser, comments, addComment, upvoteComment, claimIdea } = useApp();
  const [newComment, setNewComment] = useState('');

  // Filter comments for this idea
  const ideaComments = comments.filter(c => c.targetId === idea.id && c.targetType === 'idea');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(idea.id, 'idea', newComment.trim());
    setNewComment('');
  };

  const handleClaim = () => {
    claimIdea(idea.id);
  };

  const isClaimed = !!idea.claimedBy;
  const isValidated = idea.swipeRightCount >= 50;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative w-full max-w-lg h-full bg-[#111111] border-l border-[#2A2A2A] shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] bg-[#0A0A0A]/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white line-clamp-1">{idea.title}</h3>
              <p className="text-[10px] text-[#A1A1AA] font-mono">pitched by @{idea.authorUsername}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1A1A1A] text-[#A1A1AA] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Validation block banner */}
          <div className="space-y-3">
            {isClaimed ? (
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-4 rounded-xl text-left space-y-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-[#22C55E]">🔨 DEVELOPMENT STATUS: BUILDING</span>
                <p className="text-xs text-zinc-300">
                  This idea has been claimed and is being built by <strong className="text-white">@{idea.claimedBy}</strong>. Say hello to them in the community!
                </p>
              </div>
            ) : isValidated ? (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-left space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-green-500">🎉 COMMUNITY VALIDATION MATCH</span>
                <p className="text-xs text-zinc-300">
                  This idea has surpassed its validation threshold with over 50 right-swipes from developers agreeing this pain point is worth solving.
                </p>
                {idea.authorUsername !== currentUser?.username && (
                  <button
                    onClick={handleClaim}
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#22C55E]/10"
                  >
                    <Hammer className="w-4 h-4" />
                    <span>Claim & Build This Idea</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#1C1C1C] border border-[#2A2A2A] p-4 rounded-xl space-y-2 text-left">
                <div className="flex justify-between text-xs font-mono text-[#A1A1AA]">
                  <span>VALIDATION SWIPES PROGRESS</span>
                  <span className="text-[#F59E0B] font-bold">{idea.swipeRightCount} / 50</span>
                </div>
                <div className="h-2 bg-[#0A0A0A] border border-[#222222] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#F59E0B]"
                    style={{ width: `${Math.min((idea.swipeRightCount / 50) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#52525B] leading-relaxed">
                  Needs 50 positive developer clicks to unlock build-custody claim triggers.
                </p>
              </div>
            )}
          </div>

          {/* Problem description */}
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">THE CORE PROBLEM Pain Point</h4>
            <div className="bg-[#0A0A0A] p-4 border border-[#1C1C1C] rounded-xl text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
              {idea.problem}
            </div>
          </div>

          {/* Solution pitch if provided */}
          {idea.solution && (
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">PROPOSED SOLUTION PITCH</h4>
              <div className="bg-[#0A0A0A] p-4 border border-[#1C1C1C] rounded-xl text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {idea.solution}
              </div>
            </div>
          )}

          {/* Demographics & Monetization metadata */}
          <div className="grid grid-cols-2 gap-4 text-left pt-2">
            <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3">
              <span className="text-[10px] font-mono text-[#52525B] block">TARGET DEMOGRAPHIC</span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">{idea.targetAudience}</span>
            </div>
            <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3">
              <span className="text-[10px] font-mono text-[#52525B] block">PROPOSED SUBSCRIPTION</span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">{idea.monetizationHint || '$9/mo Starter'}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1 text-left border-t border-[#1C1C1C] pt-4">
            <span className="text-[10px] font-mono text-[#52525B]">IDEA TAGS:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {idea.tags.map(t => (
                <span key={t} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Discussion comments */}
          <div className="space-y-4 border-t border-[#1C1C1C] pt-4 text-left">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#52525B]" />
              <span>Developer Discussion ({ideaComments.length})</span>
            </h4>

            {/* List comments */}
            <div className="space-y-3">
              {ideaComments.length === 0 ? (
                <p className="text-xs text-[#52525B] italic">No comments yet. Validate and comment below!</p>
              ) : (
                ideaComments.map(c => (
                  <div key={c.id} className="bg-[#0A0A0A] border border-[#1A1A1A] p-3 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#52525B]">
                      <span className="font-bold text-white">@{c.authorUsername}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{c.content}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button 
                        onClick={() => upvoteComment(c.id)}
                        className="text-[10px] font-mono text-zinc-500 hover:text-red-500 flex items-center gap-1 transition"
                      >
                        <Heart className="w-3 h-3" />
                        <span>{c.upvotes} Upvotes</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post comment form */}
            {currentUser && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share advice, feedback, or tech tips..."
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
                <button type="submit" className="p-2 rounded-xl bg-[#F59E0B] text-black hover:bg-[#D97706] transition flex items-center justify-center">
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex justify-between items-center">
          <span className="text-xs text-[#52525B] font-mono">
            Submitted: {new Date(idea.createdAt).toLocaleDateString()}
          </span>

          <span className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-mono px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{idea.swipeRightCount} Validation Votes</span>
          </span>
        </div>

      </div>
    </div>
  );
};
