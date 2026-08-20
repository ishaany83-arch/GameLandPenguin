import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Smile,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Award,
  Gamepad2,
  Snowflake,
  MessageSquare,
  Gift,
} from 'lucide-react';
import { PenguinSvg } from './PenguinMascot';
import { UserAccount, getUserPoints, awardGamePoints } from '../utils/auth';

interface JokeItem {
  id: string;
  category: 'gaming' | 'ice' | 'stealth' | 'school';
  question: string;
  punchline: string;
  emoji: string;
}

const PEBBLES_JOKES: JokeItem[] = [
  {
    id: 'j1',
    category: 'gaming',
    question: "What's a penguin's favorite video game?",
    punchline: 'Mario Kart-ic! 🏎️❄️',
    emoji: '🏎️',
  },
  {
    id: 'j2',
    category: 'gaming',
    question: 'Why did the gamer penguin wear a thick scarf?',
    punchline: 'Because his gaming PC had too much cool-ing! 💻❄️',
    emoji: '💻',
  },
  {
    id: 'j3',
    category: 'ice',
    question: 'What do penguins wear to gaming tournaments?',
    punchline: 'Their formal TUX-edos! 🐧🎮',
    emoji: '🐧',
  },
  {
    id: 'j4',
    category: 'gaming',
    question: 'How do gamer penguins catch fish online?',
    punchline: 'With their high-speed net-work connection! 🌐🐟',
    emoji: '🌐',
  },
  {
    id: 'j5',
    category: 'stealth',
    question: "What is Pebbles' favorite key on the keyboard?",
    punchline: 'The ICE-cape key (ESC)! ⌨️🧊',
    emoji: '⌨️',
  },
  {
    id: 'j6',
    category: 'stealth',
    question: 'Why are penguins so good at stealth games in class?',
    punchline: 'Because they always play it cool under pressure! 🥷🐧',
    emoji: '🥷',
  },
  {
    id: 'j7',
    category: 'ice',
    question: 'What kind of math do arcade penguins excel at?',
    punchline: 'Al-ICE-bra! 📐❄️',
    emoji: '📐',
  },
  {
    id: 'j8',
    category: 'gaming',
    question: "What's Pebbles' favorite dessert after beating a boss level?",
    punchline: 'Ice cream sundaes with extra point toppings! 🍨🏆',
    emoji: '🍨',
  },
  {
    id: 'j9',
    category: 'ice',
    question: 'Why did the penguin refuse to play local co-op?',
    punchline: 'He wanted to be a solo flipper! 🎮🐧',
    emoji: '🎮',
  },
  {
    id: 'j10',
    category: 'gaming',
    question: 'What do you call a penguin with an unbreakable high score?',
    punchline: 'A FLIPPER CHAMPION! 🥇🏆',
    emoji: '🥇',
  },
  {
    id: 'j11',
    category: 'gaming',
    question: 'What happens when a penguin gets rage-quitted?',
    punchline: 'He gives the keyboard the cold shoulder! 🧊😤',
    emoji: '🧊',
  },
  {
    id: 'j12',
    category: 'gaming',
    question: "What's a penguin's favorite retro 8-bit console?",
    punchline: 'The Nintendo SNES (Snow Entertainment System)! 🕹️❄️',
    emoji: '🕹️',
  },
  {
    id: 'j13',
    category: 'ice',
    question: 'Why do gamer penguins love cold winter weather?',
    punchline: 'Free unlimited natural cooling for maximum overclocking! ⚡❄️',
    emoji: '⚡',
  },
  {
    id: 'j14',
    category: 'school',
    question: 'How do penguins send secret game codes to friends in school?',
    punchline: 'By Morse Cod! 🐟📡',
    emoji: '📡',
  },
  {
    id: 'j15',
    category: 'ice',
    question: "What's Pebbles' favorite genre of music to play games to?",
    punchline: 'Freeze-style hip hop and retro chiptunes! 🎧🎵',
    emoji: '🎧',
  },
  {
    id: 'j16',
    category: 'gaming',
    question: 'Why was the penguin so unbeatable at Tetris?',
    punchline: 'Because he knows how to stack ice blocks like an igloo pro! 🧩🧊',
    emoji: '🧩',
  },
  {
    id: 'j17',
    category: 'school',
    question: "What is a penguin's favorite web browser for unblocked games?",
    punchline: 'Fire-Fowl! 🔥🐧',
    emoji: '🔥',
  },
  {
    id: 'j18',
    category: 'gaming',
    question: 'What do gamer penguins drink during 10-hour gaming marathons?',
    punchline: 'Ice-T! 🧋🧊',
    emoji: '🧋',
  },
  {
    id: 'j19',
    category: 'school',
    question: 'Why did Pebbles bring a ladder to the arcade?',
    punchline: 'To reach the top of the leaderboard ladder! 🪜🏆',
    emoji: '🪜',
  },
  {
    id: 'j20',
    category: 'stealth',
    question: 'What do you call a penguin who masters the Panic Disguise key?',
    punchline: 'Cyber-Pebbles the Stealth Agent! 🥷💻',
    emoji: '🥷',
  },
];

interface PebblesJokesWidgetProps {
  currentUser?: UserAccount | null;
  onUserUpdated?: (updated: UserAccount) => void;
}

export const PebblesJokesWidget: React.FC<PebblesJokesWidgetProps> = ({
  currentUser,
  onUserUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [showPunchline, setShowPunchline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [likedJokes, setLikedJokes] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredJokes = PEBBLES_JOKES.filter(
    (j) => selectedCategory === 'all' || j.category === selectedCategory
  );

  const currentJoke = filteredJokes[jokeIndex % filteredJokes.length] || PEBBLES_JOKES[0];

  const handleNextJoke = () => {
    setShowPunchline(false);
    setJokeIndex((prev) => (prev + 1) % filteredJokes.length);
    playChime(440, 550);
  };

  const handleTogglePunchline = () => {
    const nextState = !showPunchline;
    setShowPunchline(nextState);
    if (nextState) {
      playChime(660, 880);
    }
  };

  const handleCopyJoke = () => {
    const text = `🐧 Pebbles Joke: ${currentJoke.question} -> ${currentJoke.punchline}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLikeJoke = () => {
    if (likedJokes[currentJoke.id]) return;

    setLikedJokes((prev) => ({ ...prev, [currentJoke.id]: true }));

    // Award point using centralized daily-capped awardGamePoints
    const res = awardGamePoints(currentUser?.username, 1);
    if (res.user && onUserUpdated) {
      onUserUpdated(res.user);
    }

    if (res.earned > 0) {
      setFeedback(`🎉 +${res.earned} PTS Earned for laughing at Pebbles joke!`);
    } else {
      setFeedback('🛑 Daily 10 PTS limit reached! Reset tomorrow.');
    }
    setTimeout(() => setFeedback(''), 3000);

    playChime(523, 659);
  };

  const playChime = (freq1: number, freq2: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // ignore audio context errors
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none font-sans">
      {!isExpanded ? (
        /* Minimized Floating Pebbles Joke Button */
        <div className="flex items-center gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-900/90 via-slate-900/95 to-slate-900/95 hover:from-cyan-800/90 hover:to-slate-800/95 border border-cyan-500/40 text-slate-100 text-xs font-bold flex items-center gap-2.5 shadow-2xl backdrop-blur-md transition-all active:scale-95 group hover:border-cyan-400"
            id="pebbles-jokes-min-btn"
            title="Click for Pebbles Penguin Jokes!"
          >
            <div className="shrink-0 relative group-hover:scale-110 transition-transform">
              <PenguinSvg pose="happy" sizeClass="w-8 h-8" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border border-slate-900"></span>
              </span>
            </div>

            <div className="flex flex-col text-left max-w-[130px]">
              <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider leading-none flex items-center gap-1">
                <span>Pebbles Jokes</span>
                <Smile className="w-3 h-3 text-cyan-400" />
              </span>
              <span className="text-xs font-black text-slate-100 truncate group-hover:text-cyan-200 mt-0.5">
                {currentJoke.question}
              </span>
            </div>

            <span className="px-2 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              Tell Joke 🎭
            </span>
          </button>
        </div>
      ) : (
        /* Expanded Floating Pebbles Joke Stand Card */
        <div className="w-80 sm:w-88 rounded-3xl bg-slate-900/98 border border-cyan-500/40 shadow-2xl shadow-slate-950 p-4 backdrop-blur-xl animate-fadeIn space-y-3.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                <PenguinSvg pose="gaming" sizeClass="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Pebbles Joke Stand</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h4>
                <p className="text-[10px] text-cyan-300 font-semibold">100% Unblocked Penguin Humor 🐧</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-xl border transition-all ${
                  soundEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={soundEnabled ? 'Mute joke chimes' : 'Enable joke chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-100 transition-all"
                title="Minimize Jokes Widget"
                id="pebbles-jokes-close-btn"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[11px] font-extrabold text-center animate-fade-in">
              {feedback}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10px]">
            {[
              { id: 'all', label: 'All Jokes 🐧' },
              { id: 'gaming', label: 'Arcade 🎮' },
              { id: 'ice', label: 'Ice ❄️' },
              { id: 'stealth', label: 'Stealth 🥷' },
              { id: 'school', label: 'School 📐' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setJokeIndex(0);
                  setShowPunchline(false);
                }}
                className={`px-2.5 py-1 rounded-xl font-extrabold shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Joke Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-inner space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-2xl shrink-0">{currentJoke.emoji}</span>
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                  Joke #{((jokeIndex % filteredJokes.length) + 1)} of {filteredJokes.length}
                </span>
                <p className="text-xs font-black text-slate-100 leading-snug">
                  {currentJoke.question}
                </p>
              </div>
            </div>

            {/* Punchline Display or Reveal Button */}
            {showPunchline ? (
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-400/50 text-cyan-200 text-xs font-extrabold leading-snug animate-fade-in flex items-center justify-between gap-2">
                <span>{currentJoke.punchline}</span>
                <span className="text-sm shrink-0">🤣</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleTogglePunchline}
                className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md group"
              >
                <span>Tap to Reveal Punchline</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleLikeJoke}
                disabled={likedJokes[currentJoke.id]}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  likedJokes[currentJoke.id]
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Laugh & Rate Joke (+1 PTS)"
              >
                <span>😂</span>
                <span>{likedJokes[currentJoke.id] ? 'Hilarious!' : 'LOL (+1 PTS)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJoke}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                title="Copy Joke to Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextJoke}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Next Joke 🎲</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
