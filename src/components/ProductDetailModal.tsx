/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, MessageSquare, ExternalLink, Github, Send, ArrowRight, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    currentUser, 
    upvoteProduct, 
    comments, 
    addComment, 
    upvoteComment, 
    matches, 
    setMatches, 
    setSelectedMatchId, 
    setActiveView, 
    setActiveDealRoomMatchId 
  } = useApp();
  
  const [newComment, setNewComment] = useState('');

  // Filter comments for this product
  const productComments = comments.filter(c => c.targetId === product.id && c.targetType === 'product');

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteProduct(product.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(product.id, 'product', newComment.trim());
    setNewComment('');
  };

  // Acquisition Trigger Logic
  const handleInitiateAcquisition = () => {
    if (!currentUser) return;

    // Check if acquisition match already exists
    let existingMatch = matches.find(m => 
      m.type === 'acquisition' && 
      m.productName === product.name &&
      ((m.user1 === currentUser.username && m.user2 === product.founderUsername) ||
       (m.user2 === currentUser.username && m.user1 === product.founderUsername))
    );

    if (existingMatch) {
      setSelectedMatchId(existingMatch.id);
      setActiveDealRoomMatchId(existingMatch.id);
      setActiveView('matches');
      onClose();
      return;
    }

    // Otherwise, create an acquisition match Node!
    const newMatchId = `match_acq_${Date.now()}`;
    const newMatch = {
      id: newMatchId,
      type: 'acquisition' as const,
      productName: product.name,
      user1: currentUser.username,
      user2: product.founderUsername,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      lastMessageText: `Acquisition Deal Room opened for ${product.name}! Make an initial offer.`
    };

    setMatches([newMatch, ...matches]);
    setSelectedMatchId(newMatchId);
    setActiveDealRoomMatchId(newMatchId);
    setActiveView('matches');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Side Sheet Panel */}
      <div className="relative w-full max-w-lg h-full bg-[#111111] border-l border-[#2A2A2A] shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] bg-[#0A0A0A]/50">
          <div className="flex items-center gap-2">
            <span className="text-xl w-8 h-8 rounded-lg bg-[#2A2A2A]/50 flex items-center justify-center">{product.logoUrl}</span>
            <div>
              <h3 className="text-sm font-black text-white">{product.name}</h3>
              <p className="text-[10px] text-[#A1A1AA] font-mono">by @{product.founderUsername}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1A1A1A] text-[#A1A1AA] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Cover image / screenshots */}
          {product.coverUrl && (
            <img 
              src={product.coverUrl} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-xl border border-[#2A2A2A] shadow-lg"
            />
          )}

          {/* Tagline */}
          <p className="text-base font-medium text-white italic leading-relaxed border-l-2 border-[#6366F1] pl-3">
            &ldquo;{product.tagline}&rdquo;
          </p>

          {/* Pricing gold banner if acquisition */}
          {product.status === 'for_sale' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-yellow-500">
                <span className="text-xs font-mono font-bold tracking-wider uppercase">💰 ACQUISITION DETAILS</span>
                <span className="text-sm font-black">${product.askingPrice?.toLocaleString()}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong>Seller note:</strong> {product.acquisitionRationale}
              </p>
              
              {product.founderUsername !== currentUser?.username && (
                <button
                  onClick={handleInitiateAcquisition}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                >
                  <span>Open Deal Room / Make Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Description Markdown Render */}
          <div className="space-y-2 text-xs text-[#A1A1AA] leading-relaxed text-left border-t border-[#1C1C1C] pt-4">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">PROJECT PITCH</h4>
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1C1C1C] overflow-x-auto font-sans whitespace-pre-wrap space-y-3">
              {product.description}
            </div>
          </div>

          {/* Stack & Metrics */}
          <div className="space-y-3 border-t border-[#1C1C1C] pt-4 text-left">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider">TECH DETAILS</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.primaryStack.map(s => (
                <span key={s} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[10px] font-mono px-2.5 py-1 rounded text-[#A1A1AA]">
                  {s}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3 text-left">
                <span className="text-[10px] font-mono text-[#52525B] block">MRR TRACTION</span>
                <span className="text-xs font-bold text-white block mt-0.5">{product.mrrRange}</span>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl p-3 text-left">
                <span className="text-[10px] font-mono text-[#52525B] block">TARGET MARKET</span>
                <span className="text-xs font-bold text-white block mt-0.5 truncate">{product.targetMarket || 'General Developers'}</span>
              </div>
            </div>
          </div>

          {/* Interactive buttons */}
          <div className="flex items-center gap-3 border-t border-[#1C1C1C] pt-4">
            {product.demoUrl && (
              <a 
                href={product.demoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] hover:border-zinc-700 hover:bg-[#252525] py-2.5 rounded-xl text-xs text-white flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {product.repoUrl && (
              <a 
                href={product.repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] hover:border-zinc-700 hover:bg-[#252525] py-2.5 rounded-xl text-xs text-white flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>GitHub Code</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4 border-t border-[#1C1C1C] pt-4 text-left">
            <h4 className="text-xs font-mono text-[#FAFAFA] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#52525B]" />
              <span>Discussion ({productComments.length})</span>
            </h4>

            {/* List comments */}
            <div className="space-y-3">
              {productComments.length === 0 ? (
                <p className="text-xs text-[#52525B] italic">No comments yet. Start the conversation below!</p>
              ) : (
                productComments.map(c => (
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
                  placeholder="Ask the founder a question..."
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
                <button type="submit" className="p-2 rounded-xl bg-[#6366F1] text-white hover:bg-[#4F46E5] transition flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer info upvote summary drawer */}
        <div className="px-5 py-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex justify-between items-center z-20">
          <div className="text-xs text-[#A1A1AA] font-mono">
            <span>Views: {product.viewsCount}</span>
            <span className="mx-2">·</span>
            <span>Saves: {product.savesCount}</span>
          </div>

          <button
            onClick={handleUpvote}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{product.upvotesCount} Upvotes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
