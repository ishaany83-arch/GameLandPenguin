import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  MessageSquare,
  Smile,
  ChevronDown,
  Volume2,
  VolumeX,
  Lightbulb,
  Gamepad2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PenguinSvg } from './PenguinMascot';

interface PebblesSaysWidgetProps {
  onOpenStore?: () => void;
  onOpenPanicModal?: () => void;
}

const PEBBLES_SAYS_QUOTES = [
  {
    text: "Slide into fun! What game are we conquering today? 🐧🎮",
    tag: "Welcome Tip",
    icon: "🎮",
  },
  {
    text: "Nook nook! Pebbles tested all 100+ games for zero lag and 100% unblocked play!",
    tag: "Unblocked Speed",
    icon: "🚀",
  },
  {
    text: "Pro Tip: Press 'P' key anytime to activate the Google Docs Panic Stealth Disguise!",
    tag: "Stealth Mode",
    icon: "🥷",
  },
  {
    text: "Fun Fact: Penguins can't fly, but our arcade high scores sure soar through the roof! 🏆",
    tag: "High Scores",
    icon: "🏆",
  },
  {
    text: "Need extra PTS points? Visit the Store to unlock rare profile frames and titles!",
    tag: "Store Perk",
    icon: "🪙",
  },
  {
    text: "Don't forget to star your favorite games so Pebbles keeps 'em at the top of your list!",
    tag: "Favorites",
    icon: "⭐",
  },
  {
    text: "Glacier Approved! All games run on pure client-side code for maximum safety!",
    tag: "Safe & Unblocked",
    icon: "🧊",
  },
  {
    text: "Waddling into the leaderboards! Earn 1 PTS every single time you complete a game session!",
    tag: "Economy",
    icon: "🪙",
  },
];

export const PebblesSaysWidget: React.FC<PebblesSaysWidgetProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWaddling, setIsWaddling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentQuote = PEBBLES_SAYS_QUOTES[quoteIndex % PEBBLES_SAYS_QUOTES.length];

  const handleNextQuote = () => {
    setIsWaddling(true);
    setQuoteIndex((prev) => (prev + 1) % PEBBLES_SAYS_QUOTES.length);
    playChime();
    setTimeout(() => setIsWaddling(false), 500);
  };

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none font-sans">
      {!isExpanded ? (
        /* Minimized Pebbles Says Floating Button */
        <div className="flex items-center gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              playChime();
            }}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/95 to-sky-950/90 hover:from-slate-800/95 hover:to-sky-900/90 border border-sky-500/40 text-slate-100 text-xs font-bold flex items-center gap-2.5 shadow-2xl backdrop-blur-md transition-all active:scale-95 group hover:border-sky-400"
            id="pebbles-says-min-btn"
            title="Click Pebbles for game tips & penguin wisdom!"
          >
            <div className={`shrink-0 relative transition-transform ${isWaddling ? 'animate-bounce' : 'group-hover:scale-110'}`}>
              <PenguinSvg pose="happy" sizeClass="w-8 h-8" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 border border-slate-900"></span>
              </span>
            </div>

            <div className="flex flex-col text-left max-w-[130px]">
              <span className="text-[10px] text-sky-300 font-extrabold uppercase tracking-wider leading-none flex items-center gap-1">
                <span>Pebbles Says</span>
                <Smile className="w-3 h-3 text-sky-400" />
              </span>
              <span className="text-xs font-black text-slate-100 truncate group-hover:text-sky-200 mt-0.5">
                {currentQuote.text}
              </span>
            </div>

            <span className="px-2 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
              Tip 💡
            </span>
          </button>
        </div>
      ) : (
        /* Expanded Pebbles Says Speech Bubble Card */
        <div className="w-80 sm:w-88 rounded-3xl bg-slate-900/98 border border-sky-500/40 shadow-2xl shadow-slate-950 p-4 backdrop-blur-xl animate-fadeIn space-y-3">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleNextQuote}
                className="shrink-0 transition-transform active:scale-90 hover:scale-105"
                title="Click Pebbles to swap tips!"
              >
                <PenguinSvg pose="happy" sizeClass="w-9 h-9" />
              </button>
              <div>
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Pebbles Says</span>
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                </h4>
                <p className="text-[10px] text-sky-300 font-semibold">Gameland Mascot & Mascot Tips 🐧</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-xl border transition-all ${
                  soundEnabled
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={soundEnabled ? 'Mute tip sound' : 'Enable tip sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-100 transition-all"
                title="Minimize Pebbles Says"
                id="pebbles-says-close-btn"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speech Bubble Content */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border border-sky-500/30 shadow-inner space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-bold flex items-center gap-1">
                <span>{currentQuote.icon}</span>
                <span>{currentQuote.tag}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Tip #{quoteIndex + 1}/{PEBBLES_SAYS_QUOTES.length}</span>
            </div>

            <p className="text-xs font-black text-slate-100 leading-relaxed pt-0.5">
              "{currentQuote.text}"
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Tap Pebbles for next tip!</span>

            <button
              type="button"
              onClick={handleNextQuote}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Next Tip 💡</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
