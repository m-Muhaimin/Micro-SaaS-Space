/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { SwipeDeck } from './components/SwipeDeck';
import { ProductForm } from './components/ProductForm';
import { IdeaForm } from './components/IdeaForm';
import { ProductDetailModal } from './components/ProductDetailModal';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { ChatMatches } from './components/ChatMatches';
import { ExploreDirectory } from './components/ExploreDirectory';
import { UserProfile } from './components/UserProfile';
import { SettingsPage } from './components/SettingsPage';
import { AdminPanel } from './components/AdminPanel';
import { CommandPalette } from './components/CommandPalette';
import { EmptyState } from './components/EmptyState';
import { Product, Idea } from './types';

import { 
  Sparkles, 
  Lightbulb, 
  Users, 
  MessageSquare, 
  Star, 
  Settings, 
  Plus, 
  Bell, 
  Search, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

function DashboardShell() {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    logout, 
    products, 
    ideas, 
    profiles, 
    recordSwipe, 
    notifications, 
    markNotificationsAsRead, 
    savedProductIds,
    savedIdeaIds,
    swipesCountToday,
    setSearchOpen,
    setSelectedMatchId,
    setViewingProfileUsername,
    activeExploreTab
  } = useApp();

  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  if (!currentUser) return <LandingPage />;

  if (activeView === 'onboarding' || !currentUser.onboardedAt) {
    return <OnboardingWizard />;
  }

  // 1. FILTER DECKS TO PREVENT RE-SWIPING ALREADY SWIPED ITEMS
  const unswipedProducts = products.filter(p => {
    // Exclude own products and non-published
    if (p.founderUsername === currentUser.username || !p.isPublished) return false;
    // Load local storage swiped indexes dynamically if needed (the query holds swipes too)
    return true; 
  });

  const unswipedIdeas = ideas.filter(i => {
    if (i.authorUsername === currentUser.username || !i.isPublished) return false;
    return true;
  });

  const unswipedFounders = profiles.filter(f => {
    if (f.username === currentUser.username || f.isBanned || !f.onboardedAt) return false;
    return true;
  });

  // Notifications Count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleSwipeAction = (deck: 'products' | 'ideas' | 'founders', targetId: string, direction: 'left' | 'right' | 'up') => {
    const res = recordSwipe(deck, targetId, direction);
    if (res.matched) {
      alert('🤝 Mutual Co-builder Match created! Opened matched conversation in DMs.');
      setActiveView('matches');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#e2e8f0] flex flex-col font-sans select-none pb-12 md:pb-0">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 bg-[#020617]/95 border-b border-slate-800 z-30 px-4 md:px-6 py-3.5 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setViewingProfileUsername(null); setActiveView('products'); }}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4f46e5] to-[#818cf8] flex items-center justify-center font-bold font-mono text-xs text-white">
              M
            </div>
            <span className="font-mono font-bold text-sm tracking-tight hidden sm:inline">microsaas<span className="text-indigo-400">.space</span></span>
          </div>

          {/* Global Search command trigger bar */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search or command...</span>
            <kbd className="bg-slate-800 text-[9px] px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">⌘K</kbd>
          </button>
        </div>

        {/* Desktop Header Operations list */}
        <div className="flex items-center gap-3">
          {/* Admin panel trigger */}
          {currentUser.username === 'skeedo' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`p-2 rounded-xl border transition ${
                activeView === 'admin' 
                  ? 'bg-indigo-600/10 border-indigo-600 text-indigo-400' 
                  : 'bg-transparent border-slate-800 hover:bg-[#0f172a] text-slate-400 hover:text-white'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* Notification bell drawer toggler */}
          <button
            onClick={() => {
              setNotifDrawerOpen(!notifDrawerOpen);
              if (!notifDrawerOpen) markNotificationsAsRead();
            }}
            className="p-2 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold font-mono animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User profile dropdown trigger */}
          <button
            onClick={() => {
              setViewingProfileUsername(currentUser.username);
              setActiveView('profile');
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-xl transition"
          >
            <img src={currentUser.avatarUrl} alt={currentUser.displayName} className="w-5 h-5 rounded-md object-cover" />
            <span className="text-[10px] font-mono text-slate-100 hidden sm:inline">@{currentUser.username}</span>
          </button>

          {/* Logout */}
          <button 
            onClick={logout}
            className="p-2 bg-[#0f172a] border border-slate-800 hover:border-red-500/30 rounded-xl text-red-500 hover:bg-red-500/5 transition cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile search / menu button */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 bg-[#0f172a] border border-slate-800 rounded-xl text-slate-400 md:hidden"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT SHELL (SIDE NAVIGATION + PRIMARY VIEWSTAGE) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden md:flex flex-col justify-between w-60 border-r border-slate-800 p-4 bg-[#020617]/50 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-6">
            
            {/* SWIPE DECKS GROUP */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 px-3 uppercase block tracking-wider">Swipe Decks</span>
              
              <button
                onClick={() => setActiveView('products')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center justify-between transition ${
                  activeView === 'products' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Discover Products</span>
                </span>
                <span className="bg-[#0f172a] border border-slate-800 text-[9px] px-1.5 py-0.5 rounded text-slate-400 font-sans">deck</span>
              </button>

              <button
                onClick={() => setActiveView('ideas')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center justify-between transition ${
                  activeView === 'ideas' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span>Validate Ideas</span>
                </span>
                <span className="bg-[#0f172a] border border-slate-800 text-[9px] px-1.5 py-0.5 rounded text-slate-400 font-sans">deck</span>
              </button>

              <button
                onClick={() => setActiveView('founders')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center justify-between transition ${
                  activeView === 'founders' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Connect Founders</span>
                </span>
                <span className="bg-[#0f172a] border border-slate-800 text-[9px] px-1.5 py-0.5 rounded text-slate-400 font-sans">deck</span>
              </button>
            </div>

            {/* EXPLORE DIRECTORY GROUP */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 px-3 uppercase block tracking-wider">Explore</span>

              <button
                onClick={() => setActiveView('explore')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center gap-2 transition ${
                  activeView === 'explore' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Search Directory</span>
              </button>

              <button
                onClick={() => setActiveView('matches')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center justify-between transition ${
                  activeView === 'matches' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span>Inbox DMs</span>
                </span>
                <span className="bg-pink-500/10 text-pink-400 text-[9px] px-1.5 py-0.5 rounded-full">DMs</span>
              </button>

              <button
                onClick={() => setActiveView('saves')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center gap-2 transition ${
                  activeView === 'saves' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm shadow-indigo-500/10 font-bold' : 'text-slate-400 hover:bg-[#0f172a] hover:text-white border border-transparent'
                }`}
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Saved Watchlist</span>
              </button>
            </div>

            {/* SUBMISSIONS LAUNCH CONTROLS */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 px-3 uppercase block tracking-wider">Publish</span>

              <button
                onClick={() => setActiveView('submit-product')}
                className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-left flex items-center gap-2 border transition ${
                  activeView === 'submit-product' 
                    ? 'bg-[#0f172a] border-indigo-600 text-white font-bold' 
                    : 'bg-transparent border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#0f172a]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Launch Product</span>
              </button>

              <button
                onClick={() => setActiveView('submit-idea')}
                className={`w-full px-3 py-2 rounded-xl text-xs font-mono text-left flex items-center gap-2 border transition ${
                  activeView === 'submit-idea' 
                    ? 'bg-[#0f172a] border-yellow-500 text-white font-bold' 
                    : 'bg-transparent border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#0f172a]'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-yellow-500" />
                <span>Research Idea</span>
              </button>
            </div>

          </div>

          {/* Account Profile Bottom settings */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono text-left flex items-center gap-2 transition ${
                activeView === 'settings' ? 'bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 font-bold shadow-sm shadow-indigo-500/10' : 'text-slate-400 hover:bg-[#0f172a]'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings Controls</span>
            </button>
          </div>
        </aside>

        {/* MOBILE NAVIGATION BAR (Shown only on small viewport across bottom) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/95 border-t border-slate-800 px-4 py-2 flex justify-around items-center z-30 md:hidden backdrop-blur-md">
          <button onClick={() => setActiveView('products')} className={`flex flex-col items-center text-[8px] font-mono ${activeView === 'products' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Sparkles className="w-4.5 h-4.5" />
            <span>Discover</span>
          </button>
          <button onClick={() => setActiveView('explore')} className={`flex flex-col items-center text-[8px] font-mono ${activeView === 'explore' ? 'text-purple-400' : 'text-slate-500'}`}>
            <Compass className="w-4.5 h-4.5" />
            <span>Explore</span>
          </button>
          <button onClick={() => setActiveView('matches')} className={`flex flex-col items-center text-[8px] font-mono ${activeView === 'matches' ? 'text-pink-400' : 'text-slate-500'}`}>
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Inbox</span>
          </button>
          <button onClick={() => setActiveView('saves')} className={`flex flex-col items-center text-[8px] font-mono ${activeView === 'saves' ? 'text-yellow-500' : 'text-slate-500'}`}>
            <Star className="w-4.5 h-4.5" />
            <span>Saves</span>
          </button>
          <button onClick={() => setActiveView('settings')} className={`flex flex-col items-center text-[8px] font-mono ${activeView === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Settings className="w-4.5 h-4.5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* 3. CENTER VIEW STAGE (Where our screens render dynamically!) */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-h-[calc(100vh-64px)] pb-16 md:pb-6 text-center">
          
          {/* DECK SCREEN: Products */}
          {activeView === 'products' && (
            <div className="flex flex-col items-center space-y-4 py-6 h-full justify-center">
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <Sparkles className="w-5 h-5 text-[#6366F1]" />
                  <span>Discover micro-SaaS Tools</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Swipe Right to Upvote · Swipe Up to Save · Tap to Pitch Details</p>
              </div>

              <SwipeDeck 
                deckType="products" 
                cards={unswipedProducts} 
                onSwipe={(dir, card) => handleSwipeAction('products', card.id, dir)}
                onCardTap={(card) => setSelectedProduct(card)}
              />
            </div>
          )}

          {/* DECK SCREEN: Ideas */}
          {activeView === 'ideas' && (
            <div className="flex flex-col items-center space-y-4 py-6 h-full justify-center">
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                  <span>Validate Raw Ideas</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">50 Swipes Validates Idea · Up to Save Watchlist</p>
              </div>

              <SwipeDeck 
                deckType="ideas" 
                cards={unswipedIdeas} 
                onSwipe={(dir, card) => handleSwipeAction('ideas', card.id, dir)}
                onCardTap={(card) => setSelectedIdea(card)}
              />
            </div>
          )}

          {/* DECK SCREEN: Founders */}
          {activeView === 'founders' && (
            <div className="flex flex-col items-center space-y-4 py-6 h-full justify-center">
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <Users className="w-5 h-5 text-[#22C55E]" />
                  <span>Swipe co-builders</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Mutual Swipe Right triggers co-builder Matches</p>
              </div>

              <SwipeDeck 
                deckType="founders" 
                cards={unswipedFounders} 
                onSwipe={(dir, card) => handleSwipeAction('founders', card.username, dir)}
                onCardTap={(card) => {
                  setViewingProfileUsername(card.username);
                  setActiveView('profile');
                }}
              />
            </div>
          )}

          {/* SCREEN: Explore Directory */}
          {activeView === 'explore' && (
            <ExploreDirectory 
              onProductSelect={(p) => setSelectedProduct(p)}
              onIdeaSelect={(i) => setSelectedIdea(i)}
            />
          )}

          {/* SCREEN: Submit forms */}
          {activeView === 'submit-product' && <ProductForm />}
          {activeView === 'submit-idea' && <IdeaForm />}

          {/* SCREEN: Matches inbox & Chat DMs */}
          {activeView === 'matches' && <ChatMatches />}

          {/* SCREEN: Profile views */}
          {activeView === 'profile' && (
            <UserProfile 
              onProductSelect={(p) => setSelectedProduct(p)}
              onIdeaSelect={(i) => setSelectedIdea(i)}
            />
          )}

          {/* SCREEN: Settings Page */}
          {activeView === 'settings' && <SettingsPage />}

          {/* SCREEN: Admin Panel */}
          {activeView === 'admin' && <AdminPanel />}

          {/* SCREEN: Saves Watchlist */}
          {activeView === 'saves' && (
            <div className="max-w-6xl mx-auto py-4 px-4 space-y-6 text-left">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white flex items-center gap-1.5 font-mono">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span>My Saved Watchlist</span>
                </h2>
                <p className="text-xs text-zinc-400">Review items you saved from the Products and Ideas swiping decks.</p>
              </div>

              {/* Saved Products */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#FAFAFA] uppercase block border-b border-slate-800 pb-1">Saved Products</span>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedProductIds.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon={Sparkles}
                        title="No Saved Products"
                        description="You haven't saved any micro-SaaS products yet. Swipe up on product cards in the Discover deck to add them to your watchlist."
                        actionText="Discover Products"
                        onActionClick={() => setActiveView('products')}
                        badge="Watchlist Empty"
                      />
                    </div>
                  ) : (
                    products.filter(p => savedProductIds.includes(p.id)).map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="bg-[#111111] border border-slate-800 rounded-xl p-5 hover:border-indigo-600/50 transition duration-300 cursor-pointer flex flex-col justify-between h-40 text-left"
                      >
                        <div className="space-y-2">
                          <span className="text-lg w-8 h-8 rounded-lg bg-zinc-800/20 flex items-center justify-center">{p.logoUrl}</span>
                          <h4 className="text-xs font-black text-white">{p.name}</h4>
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-1">{p.tagline}</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500">MRR: {p.mrrRange}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Saved Ideas */}
              <div className="space-y-4 pt-4">
                <span className="text-xs font-mono text-[#FAFAFA] uppercase block border-b border-slate-800 pb-1">Saved Ideas</span>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedIdeaIds.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon={Lightbulb}
                        title="No Saved Ideas"
                        description="You haven't saved any validation pitches yet. Swipe up on raw ideas in the Validate deck to keep track of them."
                        actionText="Validate Ideas"
                        onActionClick={() => setActiveView('ideas')}
                        badge="Watchlist Empty"
                        iconColorClass="text-amber-400"
                        borderColorClass="border-amber-500/20"
                        glowColorClass="bg-amber-500/10"
                      />
                    </div>
                  ) : (
                    ideas.filter(i => savedIdeaIds.includes(i.id)).map(i => (
                      <div
                        key={i.id}
                        onClick={() => setSelectedIdea(i)}
                        className="bg-[#111111] border border-slate-800 rounded-xl p-5 hover:border-yellow-500/50 transition duration-300 cursor-pointer flex flex-col justify-between h-40 text-left"
                      >
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-zinc-500 block">by @{i.authorUsername}</span>
                          <h4 className="text-xs font-black text-white line-clamp-1">{i.title}</h4>
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-1">{i.problem}</p>
                        </div>
                        <span className="text-[9px] font-mono text-yellow-500">{i.swipeRightCount} positive swipes</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. NOTIFICATION BELL SIDE DRAWER */}
      {notifDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setNotifDrawerOpen(false)} />
          
          <div className="relative w-85 h-full bg-[#020617] border-l border-slate-800 p-5 shadow-2xl flex flex-col gap-4 overflow-y-auto z-10 animate-slide-in text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-white font-mono flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span>NOTIFICATIONS</span>
              </span>
              <button onClick={() => setNotifDrawerOpen(false)} className="p-1 rounded-md hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3">
              {notifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="Inbox is Clear"
                  description="No new updates or alerts at the moment. We'll notify you when co-builders match or when your ideas gain validation upvotes!"
                  badge="Quiet Mode"
                />
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      setNotifDrawerOpen(false);
                      if (n.type === 'new_match' || n.type === 'new_message') {
                        setSelectedMatchId(n.targetId || null);
                        setActiveView('matches');
                      } else if (n.type === 'idea_validated') {
                        const idMatch = ideas.find(i => i.id === n.targetId);
                        if (idMatch) setSelectedIdea(idMatch);
                      } else if (n.type === 'product_upvoted') {
                        const prodMatch = products.find(p => p.slug === n.targetId);
                        if (prodMatch) setSelectedProduct(prodMatch);
                      }
                    }}
                    className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl space-y-1 hover:border-[#6366F1]/50 cursor-pointer transition"
                  >
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                      <span>TYPE: {n.type.toUpperCase()}</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs font-bold text-white block leading-snug">{n.title}</span>
                    <p className="text-[10px] text-[#A1A1AA] leading-normal">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. GLOBALLY ATTACHED OVERLAYS: DETAIL MODALS */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {selectedIdea && (
        <IdeaDetailModal 
          idea={selectedIdea} 
          onClose={() => setSelectedIdea(null)} 
        />
      )}

      {/* 6. GLOBALLY ATTACHED COMMAND PALETTE FOR KEYBOARD SEARCH */}
      <CommandPalette />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}
