/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  badge?: string;
  iconColorClass?: string;
  borderColorClass?: string;
  glowColorClass?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
  badge,
  iconColorClass = 'text-indigo-400',
  borderColorClass = 'border-indigo-500/20',
  glowColorClass = 'bg-indigo-500/10',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-slate-900/20 border border-slate-800/80 rounded-2xl max-w-lg mx-auto my-4 relative overflow-hidden group shadow-xl">
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Decorative Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full ${glowColorClass} blur-[60px] opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity duration-500`} />

      {/* Decorative floating dots/accents */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-700/40 select-none">✦</div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-700/40 select-none">✦</div>

      {/* Icon Wrapper with nested, glowing concentric borders */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute w-24 h-24 rounded-full border border-slate-800/60 animate-pulse" />
        {/* Middle Ring */}
        <div className="absolute w-20 h-20 rounded-full border border-slate-800/80" />
        
        {/* Main Icon Box */}
        <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 border ${borderColorClass} ${iconColorClass} shadow-2xl z-10 transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="w-6 h-6 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Badge Indicator */}
      {badge && (
        <span className="inline-block mb-3 bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-[9px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          {badge}
        </span>
      )}

      {/* Title */}
      <h3 className="text-sm font-black text-slate-100 font-mono uppercase tracking-wider mb-2 z-10">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6 z-10 font-sans">
        {description}
      </p>

      {/* Action Button */}
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="z-10 relative inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-mono font-bold px-4 py-2.5 rounded-xl transition duration-200 active:scale-95 cursor-pointer hover:shadow-lg shadow-black/50"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
