/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'motion/react';
import { Heart, X, Star, Sparkles, Lightbulb, Users, HelpCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SwipeDeckProps {
  deckType: 'products' | 'ideas' | 'founders';
  cards: any[];
  onSwipe: (direction: 'left' | 'right' | 'up', card: any) => void;
  onCardTap: (card: any) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ deckType, cards, onSwipe, onCardTap }) => {
  const { currentUser, swipesCountToday, upgradeToPro } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform drag values to styling updates
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  
  // Transform drag values to show UI text overlays
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const upOpacity = useTransform(y, [-100, 0], [1, 0]);

  const controls = useAnimation();

  // Reset index when cards list changes or switches
  useEffect(() => {
    setCurrentIndex(0);
  }, [deckType, cards.length]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0 || currentIndex >= cards.length) return;
      if (currentUser?.plan === 'free' && swipesCountToday >= 20) return;

      const activeCard = cards[currentIndex];

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerAnimatedSwipe('right', activeCard);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerAnimatedSwipe('left', activeCard);
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerAnimatedSwipe('up', activeCard);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards, currentUser, swipesCountToday]);

  const triggerAnimatedSwipe = async (dir: 'left' | 'right' | 'up', card: any) => {
    if (dir === 'right') {
      await controls.start({ x: 400, opacity: 0, transition: { duration: 0.2 } });
    } else if (dir === 'left') {
      await controls.start({ x: -400, opacity: 0, transition: { duration: 0.2 } });
    } else if (dir === 'up') {
      await controls.start({ y: -400, opacity: 0, transition: { duration: 0.2 } });
    }

    onSwipe(dir, card);
    setCurrentIndex(prev => prev + 1);
    
    // Reset positions
    x.set(0);
    y.set(0);
    controls.set({ x: 0, y: 0, opacity: 1 });
  };

  const handleDragEnd = async (event: any, info: PanInfo, card: any) => {
    const swipeThreshold = 100;
    
    if (currentUser?.plan === 'free' && swipesCountToday >= 20) {
      // Snaps back
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      return;
    }

    if (info.offset.x > swipeThreshold) {
      triggerAnimatedSwipe('right', card);
    } else if (info.offset.x < -swipeThreshold) {
      triggerAnimatedSwipe('left', card);
    } else if (info.offset.y < -swipeThreshold) {
      triggerAnimatedSwipe('up', card);
    } else {
      // Snap back if threshold not met
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  // Quota Exceeded Block View
  if (currentUser?.plan === 'free' && swipesCountToday >= 20) {
    return (
      <div className="w-full max-w-[350px] aspect-[4/5] bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col justify-between text-center shadow-xl">
        <div className="my-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mx-auto shadow-inner">
            <Zap className="w-8 h-8 fill-[#6366F1]" />
          </div>
          <h3 className="text-xl font-black text-white">Daily Limit Reached!</h3>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
            You have used up your <strong className="text-white">20 free swipes</strong> for today. Upgrade to Pro to get unlimited swipe access and match with co-builders immediately!
          </p>
        </div>

        <button
          onClick={upgradeToPro}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#6366F1]/20 cursor-pointer"
        >
          <span>Upgrade to Pro ($12/mo)</span>
          <Sparkles className="w-4 h-4 fill-white" />
        </button>
      </div>
    );
  }

  // End of Queue Empty State
  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="w-full max-w-[350px] aspect-[4/5] bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col justify-between text-center shadow-xl">
        <div className="my-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">End of the Deck</h3>
          <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
            You have swiped on everything in the <span className="font-mono text-white font-bold">{deckType}</span> deck. Come back tomorrow for freshly submitted side projects or change filters inside directory explorer.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-white hover:border-[#6366F1] py-3 rounded-xl font-mono transition"
        >
          RESET SWIPED LOGS
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const nextCard = currentIndex + 1 < cards.length ? cards[currentIndex + 1] : null;

  return (
    <div className="relative w-full max-w-[350px] aspect-[4/5] select-none">
      
      {/* Background card peek (Next Card) */}
      {nextCard && (
        <div className="absolute inset-0 bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6 shadow-md scale-[0.96] translate-y-3 opacity-60 flex flex-col justify-between pointer-events-none z-0">
          <CardLayout deckType={deckType} card={nextCard} />
        </div>
      )}

      {/* Main card (Current Card) */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={(e, info) => handleDragEnd(e, info, currentCard)}
        style={{ x, y, rotate, opacity }}
        animate={controls}
        whileDrag={{ scale: 1.02 }}
        className="absolute inset-0 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl flex flex-col justify-between hover:border-[#6366F1]/40 transition duration-200 cursor-grab active:cursor-grabbing z-10 overflow-hidden"
      >
        {/* Dynamic Drag Hint Overlays */}
        {/* RIGHT (Upvote) */}
        <motion.div 
          style={{ opacity: rightOpacity }}
          className="absolute inset-0 bg-green-500/10 border-2 border-green-500 pointer-events-none rounded-2xl flex items-center justify-center z-20"
        >
          <div className="bg-[#111111]/90 border border-green-500 text-green-500 font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg scale-110">
            <Heart className="w-5 h-5 fill-green-500" />
            <span>UPVOTE</span>
          </div>
        </motion.div>

        {/* LEFT (Skip) */}
        <motion.div 
          style={{ opacity: leftOpacity }}
          className="absolute inset-0 bg-red-500/10 border-2 border-red-500 pointer-events-none rounded-2xl flex items-center justify-center z-20"
        >
          <div className="bg-[#111111]/90 border border-red-500 text-red-500 font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg scale-110">
            <X className="w-5 h-5" />
            <span>SKIP</span>
          </div>
        </motion.div>

        {/* UP (Save) */}
        <motion.div 
          style={{ opacity: upOpacity }}
          className="absolute inset-0 bg-yellow-500/10 border-2 border-yellow-500 pointer-events-none rounded-2xl flex items-center justify-center z-20"
        >
          <div className="bg-[#111111]/90 border border-yellow-500 text-yellow-500 font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg scale-110">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span>SAVE</span>
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div onClick={() => onCardTap(currentCard)} className="flex-1 flex flex-col justify-between cursor-pointer">
          <CardLayout deckType={deckType} card={currentCard} />
        </div>

        {/* Visual action buttons (Desktop/Mobile alternative to dragging) */}
        <div className="flex justify-around items-center border-t border-[#1C1C1C] pt-3 mt-4 gap-2 z-30">
          <button
            onClick={() => triggerAnimatedSwipe('left', currentCard)}
            className="w-11 h-11 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] hover:border-red-500/50 text-red-500 flex items-center justify-center transition active:scale-90"
            title="ArrowLeft (Skip)"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => triggerAnimatedSwipe('up', currentCard)}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] hover:border-yellow-500/50 text-yellow-500 flex items-center justify-center transition active:scale-90"
            title="ArrowUp (Save)"
          >
            <Star className="w-4 h-4" />
          </button>

          <button
            onClick={() => triggerAnimatedSwipe('right', currentCard)}
            className="w-11 h-11 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] hover:border-green-500/50 text-green-500 flex items-center justify-center transition active:scale-90"
            title="ArrowRight (Upvote)"
          >
            <Heart className="w-5 h-5 fill-green-500" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Internal Layout Router for Decks
const CardLayout: React.FC<{ deckType: 'products' | 'ideas' | 'founders'; card: any }> = ({ deckType, card }) => {
  if (deckType === 'products') {
    return <ProductCardContent product={card} />;
  }
  if (deckType === 'ideas') {
    return <IdeaCardContent idea={card} />;
  }
  return <FounderCardContent founder={card} />;
};

const ProductCardContent: React.FC<{ product: any }> = ({ product }) => {
  return (
    <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl w-9 h-9 rounded-lg bg-zinc-800/50 flex items-center justify-center">{product.logoUrl}</span>
            <div>
              <h4 className="text-sm font-black text-white">{product.name}</h4>
              <p className="text-[9px] text-[#A1A1AA] font-mono">by @{product.founderUsername}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          {product.status === 'for_sale' ? (
            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              for sale
            </span>
          ) : (
            <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase">
              {product.status}
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-sm text-[#FAFAFA] font-medium leading-relaxed line-clamp-3">
          &ldquo;{product.tagline}&rdquo;
        </p>

        {/* Stack chips */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap gap-1">
            {product.primaryStack.slice(0, 3).map((s: string) => (
              <span key={s} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom meta stats */}
      <div className="space-y-2 mt-auto">
        <div className="flex justify-between items-center text-[10px] font-mono text-[#52525B]">
          <span>MRR: {product.mrrRange}</span>
          <span>TAGS: #{product.tags[0]}</span>
        </div>

        {/* For sale golden banner if applicable */}
        {product.status === 'for_sale' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-xl flex items-center justify-between text-yellow-500">
            <div className="text-[10px] font-mono">
              <span className="block font-black">💰 ACQUISITION DEAL</span>
              <span className="text-[9px] text-zinc-400">Asking price: ${product.askingPrice?.toLocaleString()}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};

const IdeaCardContent: React.FC<{ idea: any }> = ({ idea }) => {
  const isClaimed = !!idea.claimedBy;
  const isFull = idea.swipeRightCount >= 50;

  return (
    <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#52525B]">deck</span>
            <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase">
              idea validation
            </span>
          </div>
          {idea.isBoosted && (
            <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
              ⚡ Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-black text-white leading-snug line-clamp-2">
          {idea.title}
        </h4>

        {/* Problem description clip */}
        <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">
          {idea.problem}
        </p>
      </div>

      {/* Validation progress or builder claimed badge */}
      <div className="space-y-2 mt-auto">
        {isClaimed ? (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 p-2 rounded-xl text-[10px] font-mono text-[#22C55E]">
            🔨 Being built by <strong className="text-white">@{idea.claimedBy}</strong>
          </div>
        ) : isFull ? (
          <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-xl text-[10px] font-mono text-green-500">
            ✅ VALIDATED — 50+ builders think this works!
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#52525B]">
              <span>VALIDATION PROGRESS</span>
              <span>{idea.swipeRightCount}/50 SWIPES</span>
            </div>
            {/* Custom progress bar */}
            <div className="h-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F59E0B]"
                style={{ width: `${Math.min((idea.swipeRightCount / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-[9px] font-mono text-[#52525B] pt-1">
          <span>Audience: {idea.targetAudience}</span>
          <span>By @{idea.authorUsername}</span>
        </div>
      </div>
    </div>
  );
};

const FounderCardContent: React.FC<{ founder: any }> = ({ founder }) => {
  return (
    <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header / Avatar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={founder.avatarUrl} 
              alt={founder.displayName} 
              className="w-10 h-10 rounded-xl object-cover border border-[#2A2A2A]"
            />
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1">
                <span>{founder.displayName}</span>
                {founder.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[8px] font-mono" title="Verified Creator">✓</span>
                )}
              </h4>
              <p className="text-[9px] text-[#A1A1AA] font-mono">@{founder.username} · {founder.location}</p>
            </div>
          </div>

          {founder.plan === 'pro' && (
            <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-mono px-1.5 py-0.5 rounded-full font-bold">
              PRO FOUNDER
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs text-[#FAFAFA] font-medium leading-relaxed line-clamp-3">
          &ldquo;{founder.tagline}&rdquo;
        </p>

        {/* Stack chips */}
        <div className="space-y-1 pt-1">
          <p className="text-[9px] font-mono text-[#52525B]">BUILDING WITH:</p>
          <div className="flex flex-wrap gap-1">
            {founder.primaryStack.slice(0, 3).map((s: string) => (
              <span key={s} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-mono px-2 py-0.5 rounded text-[#A1A1AA]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Match seeks / looking for list */}
      <div className="space-y-2 mt-auto">
        <p className="text-[9px] font-mono text-[#52525B]">LOOKING FOR:</p>
        <div className="flex flex-wrap gap-1">
          {founder.lookingFor.slice(0, 3).map((item: string) => (
            <span key={item} className="bg-[#6366F1]/10 text-[#6366F1] text-[9px] font-mono px-2 py-0.5 rounded border border-[#6366F1]/10">
              {item === 'collab' && '🤝 co-builder'}
              {item === 'beta_test' && '🧪 beta testers'}
              {item === 'acquire' && '💰 acquire deals'}
              {item === 'feedback' && '💬 feedback'}
              {item === 'connect' && '🌐 networking'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
