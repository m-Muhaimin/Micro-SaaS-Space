/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, ArrowLeft, Terminal, MapPin, Sparkles, Code, Target, Rocket, Link } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { completeOnboarding, submitProduct, currentUser } = useApp();
  const [step, setStep] = useState(1);
  
  // Form State
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [stack, setStack] = useState<string[]>(['Next.js', 'React']);
  const [lookingFor, setLookingFor] = useState<string[]>(['collab', 'beta_test']);
  const [customStack, setCustomStack] = useState('');

  // Step 3 Product Form States
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDemoUrl, setProdDemoUrl] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodError, setProdError] = useState('');

  const stackSuggestions = ['Next.js', 'React', 'Supabase', 'Tailwind CSS', 'Node.js', 'Firebase', 'TypeScript', 'Vue.js', 'Vite', 'Python', 'OpenAI', 'Stripe', 'n8n', 'Redis', 'PostgreSQL'];
  
  const targetBehaviors = [
    { key: 'collab', label: '🤝 Find a Co-founder / Partner', desc: 'Team up with other builders' },
    { key: 'beta_test', label: '🧪 Beta Testers', desc: 'Get initial hands-on reviews' },
    { key: 'acquire', label: '💰 Buy / Acquire SaaS', desc: 'Acquire micro side-projects' },
    { key: 'feedback', label: '💬 Honest Feedback', desc: 'Get code and UX feedback' },
    { key: 'connect', label: '🌐 Networking', desc: 'Connect with fellow indie builders' }
  ];

  // Pre-fill Step 3's product tagline with the user tagline from Step 1
  useEffect(() => {
    if (step === 3 && !prodTagline) {
      setProdTagline(tagline);
    }
  }, [step, tagline]);

  const handleToggleStack = (item: string) => {
    if (stack.includes(item)) {
      setStack(stack.filter(s => s !== item));
    } else {
      setStack([...stack, item]);
    }
  };

  const handleAddCustomStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStack.trim() && !stack.includes(customStack.trim())) {
      setStack([...stack, customStack.trim()]);
      setCustomStack('');
    }
  };

  const handleToggleLookingFor = (key: string) => {
    if (lookingFor.includes(key)) {
      setLookingFor(lookingFor.filter(l => l !== key));
    } else {
      setLookingFor([...lookingFor, key]);
    }
  };

  // Skip onboarding entirely (redirect to dashboard with current values)
  const handleSkipAll = () => {
    completeOnboarding(
      tagline || 'Building cool micro-utilities in public',
      location || 'Global',
      stack.length > 0 ? stack : ['Next.js', 'React'],
      lookingFor.length > 0 ? lookingFor : ['collab', 'beta_test']
    );
  };

  // Submit the optional product and then complete onboarding
  const handleListProductAndFinish = () => {
    if (!prodName.trim()) {
      setProdError('Product Name is required to list a product.');
      return;
    }
    if (!prodDesc.trim()) {
      setProdError('Please add a short description of what your product does.');
      return;
    }

    // List the product
    submitProduct({
      name: prodName.trim(),
      tagline: prodTagline.trim() || tagline || 'A new indie product',
      description: prodDesc.trim(),
      demoUrl: prodDemoUrl.trim() || undefined,
      status: 'beta',
      primaryStack: stack,
      isPublished: true,
      logoUrl: '🚀'
    });

    // Complete onboarding and redirect
    completeOnboarding(
      tagline || 'Building cool micro-utilities in public',
      location || 'Global',
      stack,
      lookingFor as any
    );
  };

  // Finish onboarding without submitting a product
  const handleFinishWithoutProduct = () => {
    completeOnboarding(
      tagline || 'Building cool micro-utilities in public',
      location || 'Global',
      stack,
      lookingFor as any
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex items-center justify-center py-12 px-4 md:px-0">
      <div className="w-full max-w-xl bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle top indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1C1C1C]">
          <div 
            className="h-full bg-gradient-to-r from-[#6366F1] to-[#A5B4FC] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Steps header */}
        <div className="flex justify-between items-center text-xs text-[#52525B] font-mono">
          <span>STEP {step} OF 3</span>
          <span className="uppercase tracking-wider">
            {step === 1 && 'Personal Details'}
            {step === 2 && 'Intent & Matching'}
            {step === 3 && 'List your first product'}
          </span>
        </div>

        {/* STEP 1: Personal details (Tagline, Location, Stack) */}
        {step === 1 && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-[#6366F1]" />
                <span>Tell us about yourself</span>
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Let other builders know who you are and what you build.
              </p>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] flex justify-between">
                <span>Tagline / Bio (One-liner) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-zinc-500 font-normal">Required · max 80 chars</span>
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 80))}
                placeholder="e.g. Building Krostio, BDStack, and Coaching Center OS from Dhaka"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] focus:outline-none transition"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#52525B]">
                <span>A brief, impactful statement</span>
                <span className={tagline.length > 80 ? 'text-rose-500 font-bold' : ''}>{tagline.length}/80</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#52525B]" /> Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] focus:outline-none transition"
              />
            </div>

            {/* Tech Stack selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5 text-[#52525B]" /> Primary Stack Chips</span>
              </label>
              
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl">
                {stackSuggestions.map((item) => {
                  const active = stack.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleStack(item)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition border cursor-pointer ${
                        active 
                          ? 'bg-[#6366F1]/10 border-[#6366F1] text-white' 
                          : 'bg-[#151515] border-[#222222] text-[#A1A1AA] hover:border-[#52525B]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Custom Stack Add */}
              <form onSubmit={handleAddCustomStack} className="flex gap-2">
                <input
                  type="text"
                  value={customStack}
                  onChange={(e) => setCustomStack(e.target.value)}
                  placeholder="Add custom stack item (e.g. Rust)"
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#6366F1] transition"
                />
                <button
                  type="submit"
                  className="bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-xs text-[#FAFAFA] px-3 rounded-lg transition cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Intent & Matching */}
        {step === 2 && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-[#F59E0B]" />
                <span>What are you looking for?</span>
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Choose your collaboration priorities. This drives your cards matching on the Founders deck.
              </p>
            </div>

            <div className="space-y-3">
              {targetBehaviors.map((item) => {
                const active = lookingFor.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleLookingFor(item.key)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition cursor-pointer ${
                      active 
                        ? 'bg-[#6366F1]/5 border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.05)]' 
                        : 'bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#151515] hover:border-[#52525B]'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      active ? 'bg-[#6366F1] border-[#6366F1] text-white' : 'border-[#52525B]'
                    }`}>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: List your first product (strongly nudged but optional) */}
        {step === 3 && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-indigo-400" />
                <span>List your first product</span>
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Pre-fill this optional form to get your product swiped by our 5,000+ indie builders right away.
              </p>
            </div>

            {prodError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{prodError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => {
                    setProdName(e.target.value.slice(0, 60));
                    setProdError('');
                  }}
                  placeholder="e.g. Krostio"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:outline-none transition"
                />
              </div>

              {/* Product Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA] flex justify-between">
                  <span>Product Tagline</span>
                  <span>{prodTagline.length}/120</span>
                </label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value.slice(0, 120))}
                  placeholder="e.g. Single-click feedback widgets for solo builders"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:outline-none transition"
                />
              </div>

              {/* Demo URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                  Demo URL (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                    <Link className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={prodDemoUrl}
                    onChange={(e) => setProdDemoUrl(e.target.value)}
                    placeholder="https://yourproduct.com"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => {
                    setProdDesc(e.target.value);
                    setProdError('');
                  }}
                  rows={3}
                  placeholder="Tell us what this is, who it is for, and how you built it..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:border-[#6366F1] focus:outline-none transition resize-none"
                />
              </div>

              {/* Stack Preview */}
              <div className="space-y-1">
                <span className="block text-[10px] font-mono uppercase text-[#52525B]">INHERITED TECH STACK</span>
                <div className="flex flex-wrap gap-1">
                  {stack.map((item) => (
                    <span key={item} className="px-2 py-0.5 text-[10px] font-mono bg-indigo-950/20 text-indigo-400 border border-indigo-900/30 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1C1C1C]">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {/* Quick Skip button (available on Step 2 and Step 3) */}
          {step > 1 && (
            <button
              onClick={handleSkipAll}
              className="px-4 py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
            >
              Skip to Dashboard
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && !tagline.trim()) {
                  alert('Please enter your tagline to tell fellow builders what you are working on.');
                  return;
                }
                if (step === 2 && lookingFor.length === 0) {
                  alert('Please select at least one collaboration goal to help match your co-builder deck.');
                  return;
                }
                setStep(prev => prev + 1);
              }}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm px-5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
              disabled={step === 1 && !tagline.trim()}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleFinishWithoutProduct}
                className="px-4 py-2.5 text-sm font-medium text-[#A1A1AA] hover:text-white transition cursor-pointer"
              >
                Skip Product
              </button>
              <button
                onClick={handleListProductAndFinish}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm px-5 py-2.5 rounded-xl font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg shadow-[#6366F1]/10"
              >
                <span>List Product</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
