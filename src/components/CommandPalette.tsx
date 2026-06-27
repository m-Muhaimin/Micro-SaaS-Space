/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Lightbulb, Users, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommandPalette: React.FC = () => {
  const { searchOpen, setSearchOpen, products, ideas, profiles, setActiveView, setViewingProfileUsername, setSelectedMatchId } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search Results Grouping
  const filteredProducts = products
    .filter(p => p.isPublished && (p.name.toLowerCase().includes(query.toLowerCase()) || p.tagline.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 3);

  const filteredIdeas = ideas
    .filter(i => i.isPublished && (i.title.toLowerCase().includes(query.toLowerCase()) || i.problem.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 3);

  const filteredFounders = profiles
    .filter(p => !p.isBanned && (p.username.toLowerCase().includes(query.toLowerCase()) || p.displayName.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 3);

  const allResults = [
    ...filteredProducts.map(p => ({ type: 'product' as const, id: p.id, title: p.name, subtitle: p.tagline, item: p })),
    ...filteredIdeas.map(i => ({ type: 'idea' as const, id: i.id, title: i.title, subtitle: i.problem, item: i })),
    ...filteredFounders.map(f => ({ type: 'founder' as const, id: f.username, title: f.displayName, subtitle: `@${f.username} · ${f.location}`, item: f }))
  ];

  // Recents searches simulation
  const [recents, setRecents] = useState<string[]>(() => {
    const saved = localStorage.getItem('mss_recent_searches');
    return saved ? JSON.parse(saved) : ['Krostio', 'BDStack', 'Skeedo', 'GDPR privacy'];
  });

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (!searchOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(allResults.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(allResults.length, 1)) % Math.max(allResults.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, selectedIndex, allResults]);

  const handleSelect = (result: typeof allResults[0]) => {
    // Add to recents
    if (query.trim() && !recents.includes(query.trim())) {
      const updated = [query.trim(), ...recents.slice(0, 3)];
      setRecents(updated);
      localStorage.setItem('mss_recent_searches', JSON.stringify(updated));
    }

    setSearchOpen(false);

    if (result.type === 'product') {
      setActiveView('explore');
      // Set active explore tab to products and open modal indirectly or show product
    } else if (result.type === 'idea') {
      setActiveView('explore');
    } else if (result.type === 'founder') {
      setViewingProfileUsername(result.id);
      setActiveView('profile');
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 md:px-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />

      {/* Main Panel */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#2A2A2A]">
          <Search className="w-5 h-5 text-[#A1A1AA]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a product, validation idea, or @username..."
            className="flex-1 bg-transparent border-none text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:ring-0 text-base"
          />
          <button 
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-[#1A1A1A] text-[#A1A1AA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            // Recents View
            <div>
              <p className="text-xs font-mono text-[#52525B] uppercase tracking-wider mb-2">Recent Searches</p>
              <div className="grid grid-cols-2 gap-2">
                {recents.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 px-3 py-2 text-left text-sm text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] transition"
                  >
                    <Search className="w-3.5 h-3.5 text-[#52525B]" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : allResults.length === 0 ? (
            // Empty State
            <div className="text-center py-8 text-[#A1A1AA]">
              <p className="text-sm">No results found for &ldquo;<span className="font-semibold text-[#FAFAFA]">{query}</span>&rdquo;</p>
              <p className="text-xs text-[#52525B] mt-1">Try searching for &quot;Krostio&quot;, &quot;Skeedo&quot;, or &quot;Freelance&quot;.</p>
            </div>
          ) : (
            // Result List
            <div className="space-y-3">
              {allResults.map((result, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left border ${
                      isSelected 
                        ? 'bg-[#1A1A1A] border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                        : 'bg-transparent border-transparent hover:bg-[#151515] hover:border-[#2A2A2A]'
                    }`}
                  >
                    {/* Icon based on Type */}
                    <div className="mt-0.5">
                      {result.type === 'product' && (
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      {result.type === 'idea' && (
                        <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                      )}
                      {result.type === 'founder' && (
                        <div className="p-2 rounded-lg bg-[#22C55E]/10 text-[#22C55E]">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#FAFAFA] truncate">{result.title}</span>
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                          result.type === 'product' ? 'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#6366F1]' :
                          result.type === 'idea' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]' :
                          'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] mt-1 truncate">{result.subtitle}</p>
                    </div>

                    {/* Arrow Right Indicator */}
                    {isSelected && (
                      <div className="self-center text-[#6366F1]">
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-[#0A0A0A] border-t border-[#2A2A2A] text-[11px] text-[#52525B] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#2A2A2A] text-[#A1A1AA]">↑↓</kbd> to navigate</span>
            <span><kbd className="bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#2A2A2A] text-[#A1A1AA]">Enter</kbd> to select</span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
