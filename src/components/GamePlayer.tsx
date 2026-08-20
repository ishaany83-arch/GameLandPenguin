import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RotateCw,
  Heart,
  Star,
  Share2,
  Flag,
  Keyboard,
  Eye,
  Check,
  Gamepad2,
  Trophy,
  Coins,
  MessageSquare,
} from 'lucide-react';
import { Game } from '../types';
import { GameCard } from './GameCard';
import { formatPlayCount } from '../data/gamesData';
import { PenguinMascot } from './PenguinMascot';
import { LeaderboardSection } from './LeaderboardSection';
import { GameFeedbackModal } from './GameFeedbackModal';
import { UserAccount, getCurrentSessionUser } from '../utils/auth';
import { recordGameLaunch, addPlaytimeMinutes } from '../utils/trophies';

interface GamePlayerProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
  relatedGames: Game[];
  onSelectGame: (game: Game) => void;
  favoriteIds: string[];
  currentUser?: UserAccount | null;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  relatedGames,
  onSelectGame,
  favoriteIds,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'leaderboard'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [key, setKey] = useState(0); // For iframe force reload
  const [showFocusBanner, setShowFocusBanner] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const effectiveUser = currentUser || getCurrentSessionUser();

  // Track game launch and playtime for Penguin Trophies
  useEffect(() => {
    const uname = effectiveUser?.username;
    // Record 1 game launch
    recordGameLaunch(uname);

    // Track active playtime: add 1 minute every 60 seconds
    const interval = setInterval(() => {
      addPlaytimeMinutes(1, uname);
    }, 60000);

    return () => clearInterval(interval);
  }, [game.id, effectiveUser?.username]);

  // Focus the iframe to ensure WASD / Arrow keys & mouse pointer lock work properly
  const handleFocusIframe = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.focus();
      } catch (e) {
        console.log('Focus error', e);
      }
    }
  };

  // Prevent parent window scrolling on Space / Arrow keys while playing
  useEffect(() => {
    const handlePreventScroll = (e: KeyboardEvent) => {
      const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
      if (keysToPrevent.includes(e.key)) {
        if (
          document.activeElement === iframeRef.current ||
          iframeContainerRef.current?.contains(document.activeElement)
        ) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handlePreventScroll, { passive: false });
    return () => window.removeEventListener('keydown', handlePreventScroll);
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setShowFocusBanner(true);
    setKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        iframeContainerRef.current.requestFullscreen().catch(() => {});
        handleFocusIframe();
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = () => {
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Navigation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
          id="player-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
            {game.category}
          </span>
          <h1 className="font-extrabold text-base sm:text-lg text-slate-100 line-clamp-1">
            {game.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Focus Controls helper button */}
          <button
            onClick={handleFocusIframe}
            className="px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Focus Keyboard & Mouse Controls"
            id="player-focus-btn"
          >
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Focus Controls</span>
          </button>

          {/* Favorite */}
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-slate-100'
            }`}
            title="Favorite"
            id="player-fav-btn"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-all"
            title="Reload Game"
            id="player-reload-btn"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Copy Game Link"
            id="player-share-btn"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Submit Feedback Button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Submit Feedback & Earn Points!"
            id="player-feedback-btn"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Feedback</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
            id="player-fullscreen-btn"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main iFrame Player Container */}
      <div
        ref={iframeContainerRef}
        onClick={handleFocusIframe}
        className="relative w-full aspect-video sm:aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center group"
        id="iframe-player-wrapper"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading Game Embed...</p>
          </div>
        )}

        {/* Floating Focus Hint Bar Overlay */}
        {!isLoading && showFocusBanner && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-slate-100 px-4 py-2 rounded-full shadow-xl flex items-center gap-3 text-xs pointer-events-auto animate-fadeIn">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              Click game screen to lock mouse & enable controls!
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFocusBanner(false);
                handleFocusIframe();
              }}
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              OK
            </button>
          </div>
        )}

        {game.embedType === 'srcDoc' && game.srcDocContent ? (
          <iframe
            ref={iframeRef}
            key={key}
            srcDoc={game.srcDocContent}
            title={game.title}
            className="w-full h-full border-0 rounded-2xl"
            onLoad={() => {
              setIsLoading(false);
              handleFocusIframe();
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; pointer-lock; gamepad; display-capture; focus-without-user-activation; web-share"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals allow-downloads allow-presentation"
          />
        ) : (
          <iframe
            ref={iframeRef}
            key={key}
            src={game.embedUrl}
            title={game.title}
            className="w-full h-full border-0 rounded-2xl"
            onLoad={() => {
              setIsLoading(false);
              handleFocusIframe();
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; pointer-lock; gamepad; display-capture; focus-without-user-activation; web-share"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals allow-downloads allow-presentation"
          />
        )}
      </div>

      {/* Player Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'details'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
          id="game-tab-overview-btn"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Overview & Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-800'
          }`}
          id="game-tab-highscores-btn"
        >
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>High Scores & Leaderboards</span>
          <span className="text-[9px] px-1.5 py-0.2 bg-amber-950/80 text-amber-300 rounded font-black border border-amber-500/40 uppercase">
            LOCAL
          </span>
        </button>
      </div>

      {/* Tab 1: Overview & Controls Panel */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Game Controls Guide */}
          <div className="lg:col-span-1 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Keyboard className="w-4 h-4" />
              <span>How to Play & Controls</span>
            </div>

            <div className="space-y-2">
              {game.controls && game.controls.length > 0 ? (
                game.controls.map((ctrl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs"
                  >
                    <span className="font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {ctrl.key}
                    </span>
                    <span className="text-slate-300 font-medium">{ctrl.action}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Use Mouse or Arrow Keys / WASD to control this game.</p>
              )}
            </div>

            {/* Rate this game */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Rate this game:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`p-1 transition-transform hover:scale-125 ${
                      (userRating || Math.round(game.rating)) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                    id={`rate-star-${star}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
                {userRating && (
                  <span className="text-xs text-emerald-400 font-bold ml-2">Rated {userRating}/5!</span>
                )}
              </div>
            </div>
          </div>

          {/* Game Info & Description */}
          <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-extrabold text-lg text-slate-100">{game.title}</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {game.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {formatPlayCount(game.playCount)}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
                {game.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 text-[11px] font-semibold border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Pebbles Penguin Review Box */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center gap-3">
                <PenguinMascot pose="gaming" size="sm" interactive showSpeechBubble={false} />
                <div className="text-xs">
                  <span className="font-extrabold text-cyan-300 block">Pebbles' Arctic Review:</span>
                  <span className="text-slate-300">
                    "This game is 100% smooth and tested on glacier speeds! Have fun beat'n your best score!"
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Metadata & Report */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
              <span>Author: <strong className="text-slate-300">{game.author || 'Community'}</strong></span>

              <button
                onClick={handleReport}
                className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors font-medium"
                id="report-broken-game-btn"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{reportSent ? 'Reported ✓' : 'Report issue'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: High Scores Leaderboard Section */}
      {activeTab === 'leaderboard' && (
        <LeaderboardSection game={game} currentUser={effectiveUser} />
      )}

      {/* Related Games Grid */}
      {relatedGames.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
            <span>More Unblocked Games You Might Like</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedGames.map((relGame) => (
              <GameCard
                key={relGame.id}
                game={relGame}
                isFavorite={favoriteIds.includes(relGame.id)}
                onSelectGame={onSelectGame}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Game Feedback Modal */}
      <GameFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        initialGame={game}
        currentUser={effectiveUser}
      />
    </div>
  );
};
