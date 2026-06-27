/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Match, Message } from '../types';
import { Send, CheckCheck, Users, HelpCircle, Building2, ChevronRight, CheckSquare, Square, CreditCard, Sparkles, MessageSquare } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const ChatMatches: React.FC = () => {
  const { 
    currentUser, 
    matches, 
    messages, 
    sendMessage, 
    profiles, 
    selectedMatchId, 
    setSelectedMatchId,
    activeDealRoomMatchId,
    setActiveDealRoomMatchId,
    getDealState,
    submitDealOffer,
    updateDealStatus,
    toggleDealChecklist,
    payDealFee
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const [offerInput, setOfferInput] = useState('');
  
  const activeMatch = matches.find(m => m.id === selectedMatchId);
  const activePartner = activeMatch 
    ? profiles.find(p => p.username === (activeMatch.user1 === currentUser?.username ? activeMatch.user2 : activeMatch.user1)) 
    : null;

  const chatMessages = messages.filter(m => m.conversationId === selectedMatchId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, selectedMatchId, partnerIsTyping]);

  // Simulate partner typing feedback on sending a message
  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].senderUsername === currentUser?.username) {
      setPartnerIsTyping(true);
      const timer = setTimeout(() => {
        setPartnerIsTyping(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [chatMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedMatchId) return;
    
    sendMessage(selectedMatchId, inputText.trim());
    setInputText('');
  };

  // Deal Room State
  const dealState = selectedMatchId ? getDealState(selectedMatchId) : null;

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerInput || !selectedMatchId) return;
    submitDealOffer(selectedMatchId, Number(offerInput));
    setOfferInput('');
  };

  return (
    <div className="max-w-6xl mx-auto h-[78vh] bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl flex">
      {/* 1. MATCHES SIDEBAR LIST */}
      <div className="w-1/3 border-r border-[#2A2A2A] flex flex-col justify-between bg-[#0D0D0D]">
        <div className="p-4 border-b border-[#2A2A2A]">
          <h3 className="text-sm font-black text-white flex items-center gap-1.5 font-mono">
            <span>MATCH INBOX</span>
            <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] px-1.5 py-0.5 rounded-full font-sans">
              {matches.length} matches
            </span>
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
          {matches.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={Users}
                title="No Active Matches"
                description="Swipe right on founders or products to start a conversation!"
                badge="Inbox Empty"
              />
            </div>
          ) : (
            matches.map(m => {
              const partnerName = m.user1 === currentUser?.username ? m.user2 : m.user1;
              const partnerProfile = profiles.find(p => p.username === partnerName);
              const isSelected = m.id === selectedMatchId;
              const hasUnread = m.unreadCount && m.unreadCount > 0;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMatchId(m.id);
                    // Clear deal room toggle by default on change unless active
                    if (m.type !== 'acquisition') {
                      setActiveDealRoomMatchId(null);
                    }
                  }}
                  className={`w-full p-4 flex items-start gap-3 text-left transition ${
                    isSelected ? 'bg-[#1A1A1A]' : 'hover:bg-[#151515]'
                  }`}
                >
                  <img 
                    src={partnerProfile?.avatarUrl} 
                    alt={partnerProfile?.displayName} 
                    className="w-10 h-10 rounded-xl object-cover border border-[#2A2A2A]"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-white truncate">{partnerProfile?.displayName || partnerName}</span>
                      <span className="text-[9px] text-[#52525B] font-mono">{new Date(m.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    <p className="text-[10px] text-[#A1A1AA] truncate leading-normal">
                      {m.lastMessageText || 'No messages yet.'}
                    </p>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className={`text-[9px] uppercase font-mono px-1.5 rounded-full border ${
                        m.type === 'acquisition' 
                          ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                          : 'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#6366F1]'
                      }`}>
                        {m.type === 'acquisition' ? `💰 Buy ${m.productName}` : '🤝 Co-builder'}
                      </span>

                      {hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CHAT CONVERSATION VIEW & DEAL ROOM PANELS */}
      <div className="flex-1 flex overflow-hidden">
        {activeMatch && activePartner ? (
          <div className="flex-1 flex flex-col justify-between h-full relative">
            {/* Header with Deal room toggle */}
            <div className="p-4 border-b border-[#2A2A2A] bg-[#0D0D0D] flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <img 
                  src={activePartner.avatarUrl} 
                  alt={activePartner.displayName} 
                  className="w-8 h-8 rounded-lg object-cover border border-[#2A2A2A]"
                />
                <div className="text-left">
                  <span className="text-xs font-black text-white block">
                    {activePartner.displayName} 
                    {activePartner.plan === 'pro' && <span className="ml-1 bg-yellow-500/10 text-yellow-500 text-[8px] font-mono px-1 rounded">PRO</span>}
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-mono block">@{activePartner.username}</span>
                </div>
              </div>

              {/* Toggle Deal Room if type is acquisition */}
              {activeMatch.type === 'acquisition' && (
                <button
                  onClick={() => setActiveDealRoomMatchId(activeDealRoomMatchId ? null : activeMatch.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] border transition flex items-center gap-1 cursor-pointer ${
                    activeDealRoomMatchId 
                      ? 'bg-yellow-500 text-black border-yellow-500 font-bold' 
                      : 'bg-[#1C1C1C] text-yellow-500 border-yellow-500/20 hover:border-yellow-500'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{activeDealRoomMatchId ? 'Close Deal Room' : 'Open Deal Room Workspace'}</span>
                </button>
              )}
            </div>

            {/* Acquisition Banner Indicator */}
            {activeMatch.type === 'acquisition' && !activeDealRoomMatchId && (
              <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2.5 flex justify-between items-center text-yellow-500">
                <span className="text-[10px] font-mono tracking-wider font-bold">🛒 COMPLEMENTARY ACQUISITION INQUIRY: {activeMatch.productName}</span>
                <button 
                  onClick={() => setActiveDealRoomMatchId(activeMatch.id)}
                  className="text-[9px] underline font-bold font-mono"
                >
                  Configure Terms & Due Diligence →
                </button>
              </div>
            )}

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]/50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs italic">
                  No chat logs yet. Type a nice greeting to get started!
                </div>
              ) : (
                chatMessages.map(m => {
                  const isCurrentUser = m.senderUsername === currentUser?.username;
                  return (
                    <div 
                      key={m.id} 
                      className={`flex flex-col max-w-[70%] space-y-0.5 ${
                        isCurrentUser ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed text-left ${
                        isCurrentUser 
                          ? 'bg-[#6366F1] text-white rounded-br-none shadow-md' 
                          : 'bg-[#1C1C1C] text-zinc-200 rounded-bl-none border border-[#2A2A2A]'
                      }`}>
                        {m.content}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-[#52525B] font-mono">
                        <span>{new Date(m.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {isCurrentUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Partner Typing State Simulation */}
              {partnerIsTyping && (
                <div className="mr-auto flex items-center gap-2 max-w-[70%] bg-[#1A1A1A] px-4 py-2 rounded-2xl border border-[#2A2A2A]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-300" />
                  </div>
                  <span className="text-[10px] font-mono text-[#A1A1AA]">@{activePartner.username} is drafting...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#2A2A2A] bg-[#0D0D0D] flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message @${activePartner.username}...`}
                className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="bg-[#6366F1] text-white hover:bg-[#4F46E5] px-4 rounded-xl text-xs font-black transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <span>Send</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950/20">
            <EmptyState
              icon={MessageSquare}
              title="Secure DM Chat Workspace"
              description="Select an active partner match or product acquisition query from the left sidebar to access communication history and draft binding terms."
              badge="Encrypted Channel"
            />
          </div>
        )}

        {/* 3. ACQUISITION DEAL ROOM PANEL (Slide drawer on the right side of conversation) */}
        {activeMatch && activeMatch.type === 'acquisition' && activeDealRoomMatchId === activeMatch.id && dealState && (
          <div className="w-80 border-l border-[#2A2A2A] bg-[#0F0F0F] flex flex-col justify-between h-full animate-slide-in">
            <div className="p-4 border-b border-[#2A2A2A]">
              <h4 className="text-xs font-black text-yellow-500 font-mono flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>DEAL WORKSPACE ROOM</span>
              </h4>
              <p className="text-[9px] text-[#A1A1AA] font-mono mt-0.5">Asset: {activeMatch.productName}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              {/* Offer price terms block */}
              <div className="bg-[#1C1C1C] p-3 rounded-xl border border-[#2A2A2A] space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-[#A1A1AA]">ASKING TERMS:</span>
                  <span className="font-bold text-white">${dealState.askingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono pt-1">
                  <span className="text-[#A1A1AA]">CURRENT OFFER:</span>
                  <span className="font-bold text-yellow-500">${dealState.currentOffer.toLocaleString()}</span>
                </div>

                {/* Offer Input form */}
                {dealState.status !== 'closed_won' && dealState.status !== 'closed_lost' && (
                  <form onSubmit={handleOfferSubmit} className="space-y-1.5 pt-1.5 border-t border-[#2A2A2A]">
                    <span className="text-[9px] font-mono text-[#52525B] block">SUBMIT / REVISE OFFER</span>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-[10px] font-mono text-zinc-500">$</span>
                        <input
                          type="number"
                          value={offerInput}
                          onChange={(e) => setOfferInput(e.target.value)}
                          placeholder="Offer sum"
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-5 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold px-3 rounded-lg">
                        Apply
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Due Diligence Checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#FAFAFA] uppercase tracking-wider block">🔍 DUE DILIGENCE CHECKLIST</span>
                <div className="space-y-2 bg-[#0A0A0A] p-3 rounded-xl border border-[#1C1C1C]">
                  {dealState.checklist.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleDealChecklist(activeMatch.id, item.id)}
                      className="w-full flex items-start gap-2 text-left text-xs text-[#A1A1AA] hover:text-white transition group py-1"
                    >
                      <div className="mt-0.5 text-zinc-500 group-hover:text-yellow-500">
                        {item.done ? (
                          <CheckSquare className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className={`text-[11px] leading-tight ${item.done ? 'line-through text-zinc-500' : ''}`}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer confirmation / escrow simulation */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#FAFAFA] uppercase tracking-wider block">💼 TRANSACTION SETTLEMENT</span>
                
                {dealState.status === 'negotiating' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => updateDealStatus(activeMatch.id, 'closed_won')}
                      className="w-full bg-green-500 hover:bg-green-600 text-black text-xs font-black py-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Accept Current Offer (${dealState.currentOffer.toLocaleString()})
                    </button>
                    <button
                      onClick={() => updateDealStatus(activeMatch.id, 'closed_lost')}
                      className="w-full bg-transparent border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-500 text-xs py-1.5 rounded-xl transition"
                    >
                      Reject Deal / Close Room
                    </button>
                  </div>
                )}

                {dealState.status === 'closed_won' && (
                  <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-green-500">
                      <Sparkles className="w-4 h-4 fill-green-500" />
                      <span className="text-xs font-black">Congratulations!</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Deal agreed at <strong className="text-white">${dealState.currentOffer.toLocaleString()}</strong>.
                    </p>

                    {dealState.paymentStatus === 'paid' ? (
                      <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center text-[10px] font-mono text-green-500 font-bold">
                        ✓ Escrow/Fee Paid! Transfer ongoing.
                      </div>
                    ) : (
                      <div className="space-y-1.5 border-t border-zinc-800 pt-2">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                          <span>Broker fee (3%):</span>
                          <span>${(dealState.currentOffer * 0.03).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => payDealFee(activeMatch.id)}
                          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Simulate Stripe Payment Fee</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {dealState.status === 'closed_lost' && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center text-xs text-red-500 font-mono font-bold">
                    🚫 DEAL ROOM COLLAPSED
                  </div>
                )}
              </div>
            </div>

            {/* Escrow note footer */}
            <div className="p-3 bg-[#0A0A0A] border-t border-[#2A2A2A] text-[9px] text-[#52525B] text-center">
              * Escrow and DNS transfers are logged for transparency. microsaas.space charges a 3% platform brokerage fee.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
