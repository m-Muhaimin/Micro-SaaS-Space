/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Lightbulb, Users, ArrowRight, Zap, Check, Heart, MessageSquare, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { loginWithGitHub } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'ideas' | 'founders'>('products');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col font-sansSelection selection:bg-[#6366F1]/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center font-bold font-mono text-base text-white shadow-lg shadow-[#6366F1]/20">
            M
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">microsaas<span className="text-[#6366F1]">.space</span></span>
        </div>
        <button
          onClick={loginWithGitHub}
          className="bg-[#111111] border border-[#2A2A2A] hover:border-[#6366F1] text-sm text-[#FAFAFA] px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#1A1A1A] transition active:scale-95"
        >
          <span>Sign in with GitHub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto w-full px-6 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center overflow-hidden">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full px-3 py-1 text-xs text-[#6366F1]">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Introducing the Swipe-First Solo Founder Hub</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight md:leading-none text-white">
            Swipe. Build. <span className="bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] bg-clip-text text-transparent">Ship.</span>
          </h1>

          <p className="text-[#A1A1AA] text-lg max-w-xl font-sans leading-relaxed">
            Discover validated micro-SaaS products, launch validation surveys for raw ideas before you write code, and swipe right on co-builders for mutual-match DMs.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={loginWithGitHub}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-3.5 rounded-xl font-medium text-base shadow-xl shadow-[#6366F1]/20 flex items-center justify-center gap-2 transition hover:shadow-2xl active:scale-95 cursor-pointer"
            >
              <span>Get Started Free (GitHub)</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={loginWithGitHub}
              className="bg-[#111111] border border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#FAFAFA] px-6 py-3.5 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition"
            >
              Explore Products
            </button>
          </div>

          <div className="pt-4 flex items-center gap-4 text-xs text-[#52525B]">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-7 h-7 rounded-full border border-[#0A0A0A] object-cover" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-7 h-7 rounded-full border border-[#0A0A0A] object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-7 h-7 rounded-full border border-[#0A0A0A] object-cover" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-7 h-7 rounded-full border border-[#0A0A0A] object-cover" />
            </div>
            <span>Join 5,000+ solo founders from Dhaka, SF, and Berlin</span>
          </div>
        </div>

        {/* Right column (Animated Mock Card Deck Showcase) */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/5] bg-transparent">
            {/* Peeking Background Card */}
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-[#151515] border border-[#222222] rounded-2xl p-6 shadow-2xl scale-95 opacity-40 translate-y-4" />

            {/* Foreground Main Card Mockup */}
            <div className="absolute inset-0 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl flex flex-col justify-between hover:border-[#6366F1]/50 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="text-base font-bold text-white">Krostio</h4>
                      <p className="text-[10px] text-[#52525B] font-mono">by @skeedo</p>
                    </div>
                  </div>
                  <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[10px] font-mono px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <p className="text-sm text-[#FAFAFA] font-medium leading-relaxed">
                  &ldquo;Elegant, single-click feedback widgets that solo builders can drop into their micro-SaaS in 1 minute.&rdquo;
                </p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">Next.js</span>
                    <span className="bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">Supabase</span>
                    <span className="bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">Tailwind CSS</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#A1A1AA]">
                    <span>MRR: $200–$500/mo</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Interaction Simulators */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 mt-4">
                <div className="flex gap-1.5 text-xs text-[#A1A1AA]">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> 42</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 8</span>
                </div>
                <span className="text-[10px] font-mono text-[#6366F1]">Swipe Right to Upvote →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Decks Presentation Tabber */}
      <section className="bg-[#111111] border-y border-[#2A2A2A] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">Three Focused Decks. One Unified Flow.</h2>
            <p className="text-[#A1A1AA] text-sm">Switch seamlessly between decks tailored to solve critical phases of the solo founder journey.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition ${
                activeTab === 'products'
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#0A0A0A] border border-[#2A2A2A] text-[#A1A1AA] hover:border-zinc-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Products Deck</span>
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition ${
                activeTab === 'ideas'
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#0A0A0A] border border-[#2A2A2A] text-[#A1A1AA] hover:border-zinc-700'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Ideas Validation</span>
            </button>
            <button
              onClick={() => setActiveTab('founders')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition ${
                activeTab === 'founders'
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#0A0A0A] border border-[#2A2A2A] text-[#A1A1AA] hover:border-zinc-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Founders Deck</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            {activeTab === 'products' && (
              <>
                <div className="space-y-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Showcase Your Shipments</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    List your micro-SaaS apps, add screenshots, describe their core value props, and tag your tech stack. Swipe-right acts as an upvote. 
                  </p>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Mark your product <strong className="text-yellow-500">💰 For Sale</strong> to attract vetted investors, establishing immediate private deal rooms with Stripe-powered secure invoice simulator processing.
                  </p>
                </div>
                <div className="bg-[#111111] p-4 rounded-xl border border-[#2A2A2A] text-left text-xs font-mono text-[#A1A1AA] space-y-2">
                  <p className="text-[#6366F1] font-bold">// DISCOVERY STATISTICS</p>
                  <p>• 500+ products listed globally</p>
                  <p>• 12,000+ weekly organic swipes</p>
                  <p>• Built-in SEO dynamic OG image templates</p>
                </div>
              </>
            )}

            {activeTab === 'ideas' && (
              <>
                <div className="space-y-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Validate Before Building</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Submit raw problems and solution pitches. Users swipe right to validate. Once an idea hits a threshold of <strong className="text-green-500">50 positive swipes</strong>, it is marked as officially validated.
                  </p>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Other builders can claim a validated idea to build it. Authors get instant notifications, sparking open-source collaboration.
                  </p>
                </div>
                <div className="bg-[#111111] p-4 rounded-xl border border-[#2A2A2A] text-left text-xs font-mono text-[#A1A1AA] space-y-2">
                  <p className="text-[#F59E0B] font-bold">// VALIDATION PROGRESS ENGINE</p>
                  <p>• Progress Bar: 38 / 50 Votes</p>
                  <p>• Validation Confidence: High (76%)</p>
                  <p>• Claim status: Unclaimed (Pro badge required)</p>
                </div>
              </>
            )}

            {activeTab === 'founders' && (
              <>
                <div className="space-y-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Find Your Co-Builder</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Build partnerships that last. Swipe through co-builders filtered by stack chips, target interests, and collaboration goals.
                  </p>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    A mutual swipe right automatically triggers a match and initiates a real-time presence-enabled DM conversation immediately!
                  </p>
                </div>
                <div className="bg-[#111111] p-4 rounded-xl border border-[#2A2A2A] text-left text-xs font-mono text-[#A1A1AA] space-y-2">
                  <p className="text-[#22C55E] font-bold">// FOUNDER CARD METRICS</p>
                  <p>• Active co-builders online: 1,420</p>
                  <p>• Dhaka-Berlin-SF match nodes active</p>
                  <p>• Auto-triggers: instant email notification</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-20 text-center">
        <div className="space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">Fair, Transparent Pricing</h2>
          <p className="text-[#A1A1AA] text-sm">Start free, upgrade to unlock unlimited micro-SaaS discovery.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col justify-between text-left relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold text-white">Solo Free</h3>
              <p className="text-xs text-[#A1A1AA] mt-1">For casual builders exploring side ideas</p>
              <div className="mt-4 flex items-baseline gap-1 text-white">
                <span className="text-3xl font-black">$0</span>
                <span className="text-xs text-[#52525B]">/ forever</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-[#A1A1AA]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 20 swipes per day</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> List up to 3 products</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Submit up to 5 ideas / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 10 messages per match</li>
                <li className="flex items-center gap-2 text-zinc-600"><Check className="w-4 h-4 text-zinc-600" /> Save items to watchlist</li>
              </ul>
            </div>

            <button
              onClick={loginWithGitHub}
              className="mt-8 w-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] hover:border-[#6366F1] text-sm text-[#FAFAFA] py-3 rounded-xl transition"
            >
              Sign In Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#111111] border border-[#6366F1]/50 shadow-[0_0_24px_rgba(99,102,241,0.1)] rounded-2xl p-8 flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-[#6366F1] text-white text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
              POPULAR
            </div>

            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                <span>Founder Pro</span>
                <Zap className="w-4 h-4 text-[#6366F1] fill-[#6366F1]" />
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">For serious shipbuilders and acquirers</p>
              <div className="mt-4 flex items-baseline gap-1 text-white">
                <span className="text-3xl font-black">$12</span>
                <span className="text-xs text-[#52525B]">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-[#A1A1AA]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> <strong>Unlimited</strong> daily swipes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> <strong>Unlimited</strong> product listings</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> <strong>Unlimited</strong> validation submissions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> <strong>Unlimited</strong> chat messages & matches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> Claim validated ideas immediately</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6366F1]" /> Gold PRO Badge on founder cards</li>
              </ul>
            </div>

            <button
              onClick={loginWithGitHub}
              className="mt-8 w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm py-3 rounded-xl transition shadow-lg shadow-[#6366F1]/20"
            >
              Unlock Pro Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-[#1A1A1A] py-10 mt-auto text-center text-xs text-[#52525B]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm tracking-tight text-white">microsaas<span className="text-[#6366F1]">.space</span></span>
          </div>
          <p>© 2026 microsaas.space. Created with passion by Skeedo. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-zinc-400">Terms</a>
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-zinc-400">Privacy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); loginWithGitHub(); }} className="hover:text-zinc-400">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
