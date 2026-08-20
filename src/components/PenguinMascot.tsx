import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Snowflake, ChevronRight, RefreshCw, Smile } from 'lucide-react';

interface PenguinMascotProps {
  pose?: 'gaming' | 'happy' | 'chill' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  className?: string;
}

const PENGUIN_QUOTES = [
  "Slide into fun! What are we playing today? 🐧🎮",
  "Nook nook! Pebbles tested all 100+ games for zero lag!",
  "Pro tip: Hit the Stealth Panic key (P) if you need a quick Google Docs cover!",
  "Fun fact: Penguins can't fly, but our frame-rate sure soars! 🚀",
  "Chilling out in the Igloo Arcade is the best way to spend the day!",
  "Don't forget to star your favorite games so Pebbles can keep 'em handy!",
  "Glacier approved! 100% unblocked and ready to play! 🧊",
  "Waddling into the high scores! Let's break some records!",
];

export const PenguinSvg: React.FC<{ pose?: string; sizeClass?: string }> = ({ pose = 'gaming', sizeClass = 'w-12 h-12' }) => {
  return (
    <svg className={`${sizeClass} filter drop-shadow-md transition-transform duration-300 hover:scale-105`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Glow / Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#iceGlow)" opacity="0.3" />

      <defs>
        <radialGradient id="iceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="bodyGrad" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="bellyGrad" x1="50" y1="30" x2="50" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        <linearGradient id="beakGrad" x1="50" y1="42" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* Feet */}
      <ellipse cx="38" cy="85" rx="8" ry="4" fill="#f97316" />
      <ellipse cx="62" cy="85" rx="8" ry="4" fill="#f97316" />

      {/* Main Body */}
      <path d="M50 12 C 28 12 20 30 20 56 C 20 78 30 86 50 86 C 70 86 80 78 80 56 C 80 30 72 12 50 12 Z" fill="url(#bodyGrad)" stroke="#38bdf8" strokeWidth="1.5" />

      {/* White Belly */}
      <path d="M50 32 C 34 32 30 48 30 64 C 30 78 38 82 50 82 C 62 82 70 78 70 64 C 70 48 66 32 50 32 Z" fill="url(#bellyGrad)" />

      {/* Flippers */}
      {pose === 'happy' ? (
        <>
          <path d="M20 45 C 10 35 8 20 16 18 C 22 22 24 35 21 48 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <path d="M80 45 C 90 35 92 20 84 18 C 78 22 76 35 79 48 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        </>
      ) : (
        <>
          <path d="M21 45 C 12 52 10 65 18 68 C 22 62 24 52 22 45 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <path d="M79 45 C 88 52 90 65 82 68 C 78 62 76 52 78 45 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        </>
      )}

      {/* Eyes */}
      <circle cx="41" cy="35" r="4.5" fill="#0f172a" />
      <circle cx="59" cy="35" r="4.5" fill="#0f172a" />
      <circle cx="42.5" cy="33.5" r="1.5" fill="#ffffff" />
      <circle cx="60.5" cy="33.5" r="1.5" fill="#ffffff" />

      {/* Blushing Cheeks */}
      <ellipse cx="34" cy="40" rx="3" ry="2" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="66" cy="40" rx="3" ry="2" fill="#f43f5e" opacity="0.4" />

      {/* Beak */}
      <path d="M44 42 L56 42 L50 51 Z" fill="url(#beakGrad)" />

      {/* Cozy Winter Beanie Hat */}
      <path d="M28 22 C 32 10 68 10 72 22 C 74 24 26 24 28 22 Z" fill="#0284c7" />
      <rect x="25" y="20" width="50" height="6" rx="3" fill="#38bdf8" />
      <circle cx="50" cy="8" r="5" fill="#e0f2fe" />

      {/* Gamer Accessories (Headset) for 'gaming' pose */}
      {pose === 'gaming' && (
        <>
          {/* Headset Band */}
          <path d="M26 28 C 26 12 74 12 74 28" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
          {/* Earcups */}
          <rect x="18" y="28" width="8" height="14" rx="4" fill="#a855f7" />
          <rect x="74" y="28" width="8" height="14" rx="4" fill="#a855f7" />
          <circle cx="22" cy="35" r="2" fill="#38bdf8" />
          <circle cx="78" cy="35" r="2" fill="#38bdf8" />
          {/* Mic */}
          <path d="M22 40 C 22 50 35 52 42 50" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43" cy="50" r="2.5" fill="#22c55e" />
        </>
      )}

      {/* Cozy Scarf */}
      <path d="M30 48 Q50 52 70 48 C72 56 28 56 30 48 Z" fill="#f43f5e" />
      <path d="M58 52 L58 68 C58 70 64 70 64 68 L64 52 Z" fill="#e11d48" />
    </svg>
  );
};

export const PenguinMascot: React.FC<PenguinMascotProps> = ({
  pose = 'gaming',
  size = 'md',
  showSpeechBubble = false,
  interactive = true,
  className = '',
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWaddling, setIsWaddling] = useState(false);

  const nextQuote = () => {
    setIsWaddling(true);
    setQuoteIndex((prev) => (prev + 1) % PENGUIN_QUOTES.length);
    setTimeout(() => setIsWaddling(false), 500);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`inline-flex items-center gap-3 relative ${className}`}>
      {interactive ? (
        <button
          type="button"
          onClick={nextQuote}
          className={`relative focus:outline-none group cursor-pointer transition-transform active:scale-90 ${
            isWaddling ? 'animate-bounce' : ''
          }`}
          title="Click Pebbles for a penguin tip!"
        >
          <PenguinSvg pose={pose} sizeClass={sizeClasses[size]} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-900"></span>
          </span>
        </button>
      ) : (
        <div
          className={`relative ${isWaddling ? 'animate-bounce' : ''}`}
          title="Pebbles The Penguin"
        >
          <PenguinSvg pose={pose} sizeClass={sizeClasses[size]} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-900"></span>
          </span>
        </div>
      )}

      {showSpeechBubble && (
        <div className="bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md p-3 rounded-2xl shadow-xl max-w-xs text-xs text-slate-200 relative animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-slate-900" />
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-[11px] mb-0.5">
                <Smile className="w-3.5 h-3.5" />
                <span>Pebbles Says:</span>
              </div>
              <p className="leading-snug text-slate-300 font-medium">{PENGUIN_QUOTES[quoteIndex]}</p>
            </div>
            {interactive && (
              <button
                onClick={nextQuote}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 shrink-0 transition-colors"
                title="Next Penguin Tip"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
