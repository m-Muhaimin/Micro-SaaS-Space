/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  Zap, 
  Check, 
  Heart, 
  MessageSquare, 
  DollarSign, 
  ChevronRight, 
  Star, 
  Shield, 
  Lock, 
  Globe, 
  ThumbsUp, 
  Code, 
  Laptop, 
  BarChart3, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  MessageCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for the automatic swipe loop in Hero section
interface MockCard {
  id: number;
  name: string;
  creator: string;
  tagline: string;
  type: 'product' | 'idea' | 'founder';
  tech: string[];
  mrr?: string;
  votes?: string;
  role?: string;
  emoji: string;
  badge: string;
}

const HERO_MOCK_CARDS: MockCard[] = [
  {
    id: 1,
    name: 'Krostio',
    creator: 'skeedo',
    tagline: 'Elegant, single-click feedback widgets that solo builders can drop into their micro-SaaS in 1 minute.',
    type: 'product',
    tech: ['Next.js', 'Supabase', 'Tailwind'],
    mrr: '$320/mo',
    emoji: '⚡',
    badge: '💰 FOR SALE',
  },
  {
    id: 2,
    name: 'LocalRedis Queue',
    creator: 'dev_alex',
    tagline: 'Problem: Heavy task queues are overkill for simple side-projects. Solution: A lightweight Node-SQLite task scheduler.',
    type: 'idea',
    tech: ['SQLite', 'Node.js', 'Redis'],
    votes: '42 / 50 Votes',
    emoji: '💡',
    badge: 'VALIDATING',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    creator: 'elena_codes',
    tagline: 'Ex-Stripe Senior Frontend Developer looking to partner with backend engineer to build low-code Stripe billing panels.',
    type: 'founder',
    tech: ['React', 'TypeScript', 'Tailwind'],
    role: 'Frontend Architect',
    emoji: '👩‍💻',
    badge: 'CO-BUILDER',
  }
];

export const LandingPage: React.FC = () => {
  const { loginWithGitHub } = useApp();
  const [activeDeckTab, setActiveDeckTab] = useState<'products' | 'ideas' | 'founders'>('products');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Swipe animation index state
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);

  // Auto-swipe cycle
  useEffect(() => {
    const timer = setInterval(() => {
      // Determine next direction randomly for realistic swipe effect
      const directions: ('left' | 'right' | 'up')[] = ['right', 'left', 'up'];
      const nextDir = directions[Math.floor(Math.random() * directions.length)];
      setSwipeDirection(nextDir);
      
      // Delay step to let exit animation finish before loading next card
      setTimeout(() => {
        setCardIndex((prev) => (prev + 1) % HERO_MOCK_CARDS.length);
        setSwipeDirection(null);
      }, 500);

    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeMockCard = HERO_MOCK_CARDS[cardIndex];

  // Helper to scroll to element
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#e2e8f0] flex flex-col font-sans selection:bg-indigo-600/30 overflow-x-hidden antialiased">
      
      {/* Decorative Top Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] -z-20" />

      {/* 1. TOP NAVBAR / HEADER */}
      <header className="sticky top-0 bg-[#020617]/85 border-b border-slate-900 z-50 px-4 md:px-8 py-4 flex justify-between items-center backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold font-mono text-sm text-white shadow-lg shadow-indigo-600/20">
                M
              </div>
              <span className="font-mono font-bold text-lg tracking-tight text-white">
                microsaas<span className="text-indigo-400">.space</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
              <button onClick={() => scrollToSection('three-decks')} className="hover:text-white transition">Decks</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">Flow</button>
              <button onClick={() => scrollToSection('stats')} className="hover:text-white transition">Proof</button>
              <button onClick={() => scrollToSection('for-builders')} className="hover:text-white transition">For Builders</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Pricing</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loginWithGitHub}
              className="relative inline-flex items-center gap-2 bg-[#0f172a] border border-slate-800 hover:border-indigo-600 text-xs font-mono text-slate-200 hover:text-white px-4 py-2.5 rounded-xl transition active:scale-95 cursor-pointer shadow-md hover:shadow-indigo-500/10"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative max-w-7xl mx-auto w-full px-6 md:px-8 pt-12 md:pt-20 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text details */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-3 py-1.5 text-[11px] font-mono text-indigo-400 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 animate-pulse" />
            <span>SWIPE-FIRST HUB FOR SOLO BUILDERS</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white select-none">
            Swipe. Build. <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">Ship.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-base md:text-lg max-w-xl font-sans leading-relaxed">
            Discover micro-SaaS products, validate ideas before you build, and find collaborators — all in one place. Connect with verified builders through mutual-match swipe cards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={loginWithGitHub}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-mono text-xs font-bold tracking-wide shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer hover:shadow-2xl hover:shadow-indigo-600/30"
            >
              <span>Join Free (GitHub)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('three-decks')}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white px-6 py-4 rounded-xl font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Explore Products
            </button>
          </div>

          {/* Avatars Row */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex -space-x-2.5">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Founder avatar 1" className="w-8 h-8 rounded-full border border-[#020617] object-cover ring-2 ring-slate-800/40 hover:scale-110 transition-transform duration-200" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Founder avatar 2" className="w-8 h-8 rounded-full border border-[#020617] object-cover ring-2 ring-slate-800/40 hover:scale-110 transition-transform duration-200" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Founder avatar 3" className="w-8 h-8 rounded-full border border-[#020617] object-cover ring-2 ring-slate-800/40 hover:scale-110 transition-transform duration-200" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80" alt="Founder avatar 4" className="w-8 h-8 rounded-full border border-[#020617] object-cover ring-2 ring-slate-800/40 hover:scale-110 transition-transform duration-200" />
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=64&h=64&q=80" alt="Founder avatar 5" className="w-8 h-8 rounded-full border border-[#020617] object-cover ring-2 ring-slate-800/40 hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Join <strong className="text-white font-semibold">5,240+</strong> solo founders from Dhaka, SF, and Berlin</span>
            </div>
          </div>
        </div>

        {/* Right Column (Framer Motion Live Swipable Deck Mockup) */}
        <div className="lg:col-span-5 relative flex justify-center py-8">
          
          {/* Behind glowing core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[300px] bg-indigo-600/10 blur-[80px] pointer-events-none rounded-full" />

          {/* Swipe Card Deck Area */}
          <div className="relative w-full max-w-[340px] aspect-[4/5] h-[400px]">
            
            {/* Background Peeking Card (simulating depth) */}
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-slate-900/60 border border-slate-800/40 rounded-2xl p-6 shadow-2xl scale-[0.96] opacity-30 translate-y-3 pointer-events-none transition-all duration-300" />

            {/* Core Swiping Card with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeMockCard.id}
                initial={{ scale: 0.95, opacity: 0, y: 15, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : swipeDirection === 'up' ? 0 : 0,
                  x: swipeDirection === 'left' ? -200 : swipeDirection === 'right' ? 200 : 0,
                  y: swipeDirection === 'up' ? -200 : 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  x: swipeDirection === 'left' ? -350 : swipeDirection === 'right' ? 350 : 0,
                  y: swipeDirection === 'up' ? -350 : 0,
                  transition: { duration: 0.35 }
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="absolute inset-0 bg-[#070b19] border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors duration-300 group cursor-grab active:cursor-grabbing text-left"
              >
                
                {/* Visual Feedback Badges when swiping */}
                {swipeDirection === 'right' && (
                  <div className="absolute top-8 left-8 rotate-[-12deg] bg-emerald-500 text-slate-950 font-black font-mono text-sm px-4 py-1.5 rounded-lg border-2 border-emerald-400 z-30 shadow-xl tracking-wider uppercase">
                    UPVOTE!
                  </div>
                )}
                {swipeDirection === 'left' && (
                  <div className="absolute top-8 right-8 rotate-[12deg] bg-rose-500 text-white font-black font-mono text-sm px-4 py-1.5 rounded-lg border-2 border-rose-400 z-30 shadow-xl tracking-wider uppercase">
                    PASS
                  </div>
                )}
                {swipeDirection === 'up' && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 font-black font-mono text-sm px-4 py-1.5 rounded-lg border-2 border-yellow-400 z-30 shadow-xl tracking-wider uppercase">
                    SAVE
                  </div>
                )}

                {/* Card Header details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-inner">
                        {activeMockCard.emoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-100 font-mono tracking-tight flex items-center gap-1.5">
                          {activeMockCard.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">by @{activeMockCard.creator}</p>
                      </div>
                    </div>

                    <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/40 text-[9px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                      {activeMockCard.badge}
                    </span>
                  </div>

                  {/* Main Pitch */}
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans min-h-[70px]">
                    &ldquo;{activeMockCard.tagline}&rdquo;
                  </p>

                  {/* Badges / Metrics */}
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {activeMockCard.tech.map((t, idx) => (
                        <span key={idx} className="bg-slate-900/80 border border-slate-800 text-[9px] font-mono px-2 py-0.5 rounded-md text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                      {activeMockCard.type === 'product' && (
                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                          <DollarSign className="w-3 h-3" />
                          <span>MRR: {activeMockCard.mrr}</span>
                        </div>
                      )}
                      {activeMockCard.type === 'idea' && (
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                          <CheckCircle className="w-3 h-3" />
                          <span>Status: {activeMockCard.votes}</span>
                        </div>
                      )}
                      {activeMockCard.type === 'founder' && (
                        <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                          <Users className="w-3 h-3" />
                          <span>Role: {activeMockCard.role}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom interactive hints */}
                <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
                  <div className="flex gap-2 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> 42</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 8</span>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 flex items-center gap-1">
                    Swipe Right to Match <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* SECTION 2: THREE DECKS FEATURE SECTION */}
      <section id="three-decks" className="bg-[#040815] border-y border-slate-900 py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              Three ways to use microsaas.space
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Three Focused Decks. One Unified Flow.
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              We split the micro-SaaS journey into three gamified decks tailored to solve critical phases of the solo founder lifecycle.
            </p>
          </div>

          {/* Side-by-side Cards Layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Cards 1: Products Deck */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-slate-800 transition duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/15 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Products Deck</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Discover real indie products, not VC-funded launches. Showcase your shipments, get organic backlinks, and find interested buyers with direct message deal rooms.
                </p>
              </div>

              {/* Mini Card Mockup inside card */}
              <div className="mt-8 bg-[#020617] border border-slate-900 rounded-xl p-4 text-left relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1">
                    <span className="text-emerald-400">📄</span> DocuVibe
                  </span>
                  <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">
                    $280 MRR
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  Generate PDF contracts on the fly from React components. Includes dynamic templates.
                </p>
                <div className="mt-3 flex items-center justify-between text-[8px] font-mono text-slate-600">
                  <span>Swipe right to upvote</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <ThumbsUp className="w-2.5 h-2.5 fill-emerald-500/10" /> UPVOTED
                  </span>
                </div>
              </div>
            </div>

            {/* Cards 2: Ideas Deck */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-slate-800 transition duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/15 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Ideas Deck</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Submit a raw idea or problem pitch. Users swipe right to validate. Once an idea hits a threshold of 50 positive swipes, it is community validated and open to claim.
                </p>
              </div>

              {/* Mini Card Mockup inside card */}
              <div className="mt-8 bg-[#020617] border border-slate-900 rounded-xl p-4 text-left relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1">
                    <span className="text-amber-400">⚡</span> AI Rate Limiter
                  </span>
                  <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase">
                    Validating
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  A smart edge rate limiter that optimizes tokens usage dynamically across Claude and Gemini API keys.
                </p>
                {/* Validation progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[8px] font-mono text-slate-500">
                    <span>Validation progress:</span>
                    <span className="text-amber-500 font-bold">42/50 swipes</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-900">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Cards 3: Founders Deck */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-slate-800 transition duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Founders Deck</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Swipe right on a founder based on stack tags, location, and goals. When they swipe right on you too, it is a mutual match! Instantly unlock chat rooms to start building.
                </p>
              </div>

              {/* Mini Card Mockup inside card */}
              <div className="mt-8 bg-[#020617] border border-slate-900 rounded-xl p-4 text-left relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&h=64&q=80" alt="Sarah Miller" className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-800" />
                    Sarah Miller
                  </span>
                  <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">
                    Next.js expert
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  Ex-founder looking to build developer utilities. High proficiency in React, Node, and Vercel edge configs.
                </p>
                <div className="mt-3 flex items-center justify-between text-[8px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Mutual swipe right
                  </span>
                  <span className="font-bold underline">CHATTING NOW</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative max-w-7xl mx-auto w-full px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            A step-by-step solo founder roadmap
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            No heavy applications or complex directories. Join free, fill in your tech, and start swiping to launch your empire.
          </p>
        </div>

        {/* Steps Road block layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[1px] bg-slate-800 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-22 h-22 rounded-2xl bg-[#020617] border-2 border-slate-800 flex items-center justify-center relative font-mono text-lg font-black text-indigo-400 shadow-xl group hover:border-indigo-600 transition duration-300">
              <Code className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition" />
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-[#020617]">
                1
              </div>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Sign in with GitHub</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Authenticate instantly using your GitHub profile. We import your real profile avatar, username, and bio parameters automatically.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-22 h-22 rounded-2xl bg-[#020617] border-2 border-slate-800 flex items-center justify-center relative font-mono text-lg font-black text-indigo-400 shadow-xl group hover:border-indigo-600 transition duration-300">
              <Laptop className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition" />
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-[#020617]">
                2
              </div>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Complete Profile</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Configure your primary tech stack tags (React, Node, Rust, PostgreSQL), listing roles, and whether you have SaaS products to sell.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-22 h-22 rounded-2xl bg-[#020617] border-2 border-slate-800 flex items-center justify-center relative font-mono text-lg font-black text-indigo-400 shadow-xl group hover:border-indigo-600 transition duration-300">
              <Sparkle className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition" />
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-[#020617]">
                3
              </div>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Start Swiping</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Explore products, upvote ideas, or match with co-builders. Swipe right to upvote/connect, left to skip, and up to save to watchlist.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: SOCIAL PROOF / STATS & TESTIMONIALS */}
      <section id="stats" className="bg-[#040815] border-y border-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Real Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center border border-slate-900 bg-slate-950/50 rounded-2xl p-8 shadow-xl mb-20 relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black font-mono text-indigo-400 tracking-tight block">
                500+
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block">Products Listed</span>
            </div>
            <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-slate-900 py-6 sm:py-0">
              <span className="text-4xl md:text-5xl font-black font-mono text-amber-500 tracking-tight block">
                1,000+
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block">Ideas Validated</span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black font-mono text-emerald-400 tracking-tight block">
                200+
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block">Founder Matches</span>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              REVIEWS FROM INDIE CHAMPIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Loved by solo builders worldwide
            </h2>
          </div>

          {/* Testimonial quotes layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            
            {/* Quote 1 */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute top-4 right-4 text-3xl font-serif text-slate-800 select-none">“</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                "Listed my widget platform Krostio on microsaas.space. Within 2 days, I got over 200 upvotes and landed my first 3 paid enterprise contracts from founders I matched with."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Sarah Miller" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">Sarah Miller</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Founder, Krostio</p>
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute top-4 right-4 text-3xl font-serif text-slate-800 select-none">“</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                "I had a raw concept for a serverless cron worker but was scared to write code. Launched an idea card here and reached the 50 swipes validation threshold in 4 hours. Absolute confidence booster!"
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Tariq Islam" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">Tariq Islam</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Developer, CronFlow</p>
                </div>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute top-4 right-4 text-3xl font-serif text-slate-800 select-none">“</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                "Solo building is lonely. I filter co-builders by Next.js and Tailwind on Founders Deck. Swiped right on Alex, matched, and we've now built a SaaS with $2k recurring revenue together."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Mia Thorne" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">Mia Thorne</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Co-Founder, RankUp</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FOR BUILDERS */}
      <section id="for-builders" className="py-24 relative max-w-5xl mx-auto w-full px-6 md:px-8">
        
        {/* Background ambient glow behind builders block */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/5 blur-[90px] rounded-full pointer-events-none" />

        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
            <Code className="w-32 h-32 text-white" />
          </div>

          <div className="max-w-2xl text-left space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
              GROW YOUR INDIE PRODUCT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Built by Builders, for Builders.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upvote products, receive feedback, and attract potential acquisitions seamlessly. When you publish a card to the Products Deck, it immediately rotates through our 5,000+ daily user list.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Free high-quality SEO backlink
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Authentic product reviews
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Dynamic OG social image cards
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Direct-to-inbox user queries
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={loginWithGitHub}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-6 py-4 rounded-xl shadow-xl shadow-indigo-600/20 inline-flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>List your first product</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOR SALE / ACQUISITION */}
      <section className="bg-[#040815] border-y border-slate-900 py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center sm:text-left">
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl grid md:grid-cols-12 gap-8 items-center">
            
            {/* Left side info */}
            <div className="md:col-span-8 text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 text-[10px] font-mono text-yellow-500 shadow-inner">
                <DollarSign className="w-3.5 h-3.5" />
                <span>MICRO-ACQUISITION PROTOCOLS</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none">
                Buying or selling a micro-SaaS?
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
                Browse listed projects explicitly marked <strong className="text-yellow-500 font-bold">💰 For Sale</strong>. Match with buyers instantly through private encrypted chat. We provide structured Escrow guidance and only charge a flat 3% processing fee upon successful close.
              </p>
            </div>

            {/* Right side CTA Button */}
            <div className="md:col-span-4 flex justify-center sm:justify-end">
              <button
                onClick={loginWithGitHub}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold px-6 py-4 rounded-xl shadow-xl shadow-amber-500/10 inline-flex items-center gap-2 transition active:scale-95 cursor-pointer w-full justify-center sm:w-auto"
              >
                <span>Browse for-sale products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING SECTION */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto w-full px-6 md:px-8 text-center relative">
        
        {/* Background glow behind price cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            FAIR, TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Start Free, Scale as You Grow
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Free accounts receive daily swipes to explore micro-SaaS and validate ideas. Upgrade to unlock unlimited deals, validated idea claims, and chat matches.
          </p>

          {/* Monthly/Yearly Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-mono font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle((prev) => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-slate-900 border border-slate-800 rounded-full p-1 transition-colors relative cursor-pointer"
            >
              <div 
                className={`w-4 h-4 bg-indigo-500 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} 
              />
            </button>
            <span className={`text-xs font-mono font-bold ${billingCycle === 'yearly' ? 'text-indigo-400' : 'text-slate-500'} flex items-center gap-1.5`}>
              Yearly <span className="text-[10px] bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 30%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left mb-16">
          
          {/* Solo Free */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">Solo Free</h3>
                <p className="text-xs text-slate-500 mt-1">For casual builders exploring side-projects</p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-extrabold font-mono">$0</span>
                <span className="text-xs text-slate-500 font-mono">/ forever</span>
              </div>

              <div className="h-[1px] bg-slate-900" />

              <ul className="space-y-3.5 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" /> 20 swipes per day
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" /> List up to 3 products
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Submit up to 5 ideas / mo
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" /> 10 messages per match
                </li>
                <li className="flex items-center gap-2.5 text-slate-600">
                  <Lock className="w-4 h-4" /> Save cards to watchlists
                </li>
              </ul>
            </div>

            <button
              onClick={loginWithGitHub}
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white py-3.5 rounded-xl transition cursor-pointer"
            >
              Sign In Free
            </button>
          </div>

          {/* Founder Pro */}
          <div className="bg-slate-950/80 border border-indigo-600/40 shadow-[0_0_24px_rgba(99,102,241,0.06)] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md shadow-indigo-600/20">
              POPULAR
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-1.5">
                  <span>Founder Pro</span>
                  <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">For serious shipbuilders and micro-acquirers</p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-extrabold font-mono">
                  {billingCycle === 'monthly' ? '$12' : '$99'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  / {billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>

              <div className="h-[1px] bg-slate-900" />

              <ul className="space-y-3.5 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400" /> <strong>Unlimited</strong> daily swipes
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400" /> <strong>Unlimited</strong> product listings
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400" /> <strong>Unlimited</strong> validation pitches
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400" /> <strong>Unlimited</strong> chat messages & matches
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400" /> Claim validated ideas instantly
                </li>
                <li className="flex items-center gap-2.5 font-bold text-indigo-400">
                  <Check className="w-4 h-4" /> Gold PRO badge on profile card
                </li>
              </ul>
            </div>

            <button
              onClick={loginWithGitHub}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold text-white py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Unlock Pro Access
            </button>
          </div>

        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-3xl mx-auto border border-slate-900 bg-slate-950/30 rounded-2xl p-6 md:p-8 text-left shadow-lg">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-6">
            Detailed Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500">
                  <th className="pb-3 font-semibold text-left">Feature Capabilities</th>
                  <th className="pb-3 font-semibold text-center w-24">Free Tier</th>
                  <th className="pb-3 font-semibold text-center w-24">Pro Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                <tr>
                  <td className="py-3.5 text-left font-sans">Daily Swipes Limit</td>
                  <td className="py-3.5 text-center text-slate-400">20 / day</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Live Product Listings</td>
                  <td className="py-3.5 text-center text-slate-400">Max 3 listings</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Raw Ideas Submitted</td>
                  <td className="py-3.5 text-center text-slate-400">5 / month</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Mutual Match DM Limit</td>
                  <td className="py-3.5 text-center text-slate-400">10 msgs / chat</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Acquisition Deal Room View</td>
                  <td className="py-3.5 text-center text-slate-400">Yes</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Yes</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Claim Validated Ideas</td>
                  <td className="py-3.5 text-center text-slate-500">No</td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">Immediate</td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-sans">Gold PRO badge & priority indexing</td>
                  <td className="py-3.5 text-center text-slate-500">No</td>
                  <td className="py-3.5 text-center text-indigo-400 font-bold">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="bg-[#010410] border-t border-slate-900 py-16 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Tagline details */}
          <div className="col-span-2 md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2 select-none">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold font-mono text-xs text-white">
                M
              </div>
              <span className="font-mono font-bold text-sm tracking-tight text-white">
                microsaas<span className="text-indigo-400">.space</span>
              </span>
            </div>
            <p className="text-slate-400 font-sans max-w-xs leading-relaxed">
              The swipe-first community and validation sandbox designed for modern indie hackers and solo founders. Discover validated projects, find partners, and purchase micro-acquisitions securely.
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              © 2026 microsaas.space. Created with passion by Skeedo.
            </p>
          </div>

          {/* Links col 1 */}
          <div className="col-span-1 md:col-span-2 text-left space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Decks</h4>
            <ul className="space-y-2 font-mono">
              <li><button onClick={() => scrollToSection('three-decks')} className="hover:text-slate-300 transition">Products Deck</button></li>
              <li><button onClick={() => scrollToSection('three-decks')} className="hover:text-slate-300 transition">Ideas Validation</button></li>
              <li><button onClick={() => scrollToSection('three-decks')} className="hover:text-slate-300 transition">Founders Match</button></li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div className="col-span-1 md:col-span-2 text-left space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Acquisition</h4>
            <ul className="space-y-2 font-mono">
              <li><button onClick={loginWithGitHub} className="hover:text-slate-300 transition">For Sale List</button></li>
              <li><button onClick={loginWithGitHub} className="hover:text-slate-300 transition">Buyer Escrow</button></li>
              <li><button onClick={loginWithGitHub} className="hover:text-slate-300 transition">Invoice Generator</button></li>
            </ul>
          </div>

          {/* Links col 3 */}
          <div className="col-span-1 md:col-span-2 text-left space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Pricing</h4>
            <ul className="space-y-2 font-mono">
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-slate-300 transition">Founder Pro</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-slate-300 transition">Billing Table</button></li>
              <li><button onClick={loginWithGitHub} className="hover:text-slate-300 transition">Pro Refund Policy</button></li>
            </ul>
          </div>

          {/* Links col 4 */}
          <div className="col-span-1 md:col-span-2 text-left space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Community</h4>
            <ul className="space-y-2 font-mono">
              <li><a href="https://twitter.com/microsaasspace" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">Twitter / X</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">GitHub Sandbox</a></li>
              <li><a href="#" className="hover:text-slate-300 transition">Medium Blog</a></li>
            </ul>
          </div>

        </div>

        {/* Legal disclosures */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600">
          <div className="flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-slate-400">Terms of Use</a>
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-slate-400">Privacy Protocols</a>
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-slate-400">Security Disclosures</a>
          </div>
          <p className="text-[10px]">Made with ☕ and passion by Skeedo. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
