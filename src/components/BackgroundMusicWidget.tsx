import React, { useState, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Radio,
  Disc,
  Sparkles,
  Crown,
  Lock,
} from 'lucide-react';
import { bgMusicEngine, MUSIC_TRACKS, TrackInfo } from '../utils/audioMusic';
import { UserAccount, hasVipAccess } from '../utils/auth';

interface BackgroundMusicWidgetProps {
  currentUser?: UserAccount | null;
  onOpenVipModal?: (trackTitle?: string, requiredTier?: 'Gold' | 'Platinum' | 'Diamond') => void;
}

export const BackgroundMusicWidget: React.FC<BackgroundMusicWidgetProps> = ({
  currentUser,
  onOpenVipModal,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(bgMusicEngine.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(bgMusicEngine.getIsMuted());
  const [volume, setVolume] = useState<number>(bgMusicEngine.getVolume());
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(bgMusicEngine.getCurrentTrack());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [vipNotice, setVipNotice] = useState<string>('');

  useEffect(() => {
    const unsubscribe = bgMusicEngine.subscribe(() => {
      setIsPlaying(bgMusicEngine.getIsPlaying());
      setIsMuted(bgMusicEngine.getIsMuted());
      setVolume(bgMusicEngine.getVolume());
      setCurrentTrack(bgMusicEngine.getCurrentTrack());
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    bgMusicEngine.togglePlay();
  };

  const handleToggleMute = () => {
    bgMusicEngine.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    bgMusicEngine.setVolume(newVol);
  };

  const handleSelectTrack = (track: TrackInfo) => {
    const requiredTier = track.vipLevel || 'Gold';
    const canAccess = hasVipAccess(currentUser, requiredTier);

    if (track.isVip && !canAccess) {
      setVipNotice(`👑 "${track.title}" requires VIP ${requiredTier} access!`);
      setTimeout(() => setVipNotice(''), 4000);
      if (onOpenVipModal) {
        onOpenVipModal(track.title, requiredTier);
      }
      return;
    }

    bgMusicEngine.setTrack(track.id);
    if (!isPlaying) {
      bgMusicEngine.play();
    }
  };

  const handleNextTrack = () => {
    bgMusicEngine.nextTrack();
  };

  const handlePrevTrack = () => {
    bgMusicEngine.prevTrack();
  };

  return (
    <div className="fixed top-20 right-4 z-40 select-none font-sans flex flex-col items-end">
      {!isExpanded ? (
        /* Minimized Floating Disc Button */
        <div className="flex items-center gap-2 animate-fadeIn">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`p-3 rounded-full border shadow-2xl flex items-center justify-center transition-all duration-300 focus:outline-none group active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-cyan-500/40 ring-2 ring-cyan-400/50'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-cyan-400 shadow-slate-950/80'
            }`}
            title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
            id="bg-music-play-pause-min-btn"
          >
            {isPlaying ? (
              <div className="flex items-center justify-center w-5 h-5 relative">
                <Disc className="w-5 h-5 animate-spin text-cyan-200" style={{ animationDuration: '3s' }} />
                <span className="absolute text-[9px] font-black">{currentTrack.icon}</span>
              </div>
            ) : (
              <Music className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Player Widget Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800/95 border border-slate-700/80 text-slate-200 hover:text-cyan-300 text-xs font-bold flex items-center gap-2.5 shadow-2xl backdrop-blur-md transition-all active:scale-95 group"
            id="bg-music-expand-widget-btn"
          >
            {/* Animated Equalizer Bars when playing */}
            {isPlaying && !isMuted ? (
              <div className="flex items-end gap-0.5 h-3.5 w-4">
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                <span className="w-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.1s' }} />
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
              </div>
            ) : (
              <Radio className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
            )}

            <div className="flex flex-col text-left max-w-[120px] sm:max-w-[140px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                {isPlaying ? 'Now Playing' : 'Background Music'}
              </span>
              <span className="text-xs font-extrabold text-slate-100 truncate group-hover:text-cyan-300">
                {currentTrack.title}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-transform" />
          </button>
        </div>
      ) : (
        /* Expanded Floating Audio Music Player Card */
        <div className="w-80 sm:w-88 rounded-3xl bg-slate-900/98 border border-slate-700/80 shadow-2xl shadow-slate-950 p-4.5 backdrop-blur-xl animate-fadeIn space-y-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${isPlaying ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Polar Radio BGM</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold">{currentTrack.genre}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-100 transition-all"
              title="Minimize Music Widget"
              id="bg-music-minimize-btn"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Current Track Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/20 shadow-inner flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-xl shrink-0 ${isPlaying ? 'animate-pulse' : ''}`}>
                <span>{currentTrack.icon}</span>
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-black text-cyan-200 truncate">{currentTrack.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{currentTrack.description}</p>
              </div>
            </div>

            {/* Visualizer bars */}
            {isPlaying && !isMuted && (
              <div className="flex items-end gap-0.5 h-5 w-5 shrink-0 pr-1">
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s' }} />
                <span className="w-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }} />
                <span className="w-1 bg-cyan-200 rounded-full animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.15s' }} />
              </div>
            )}
          </div>

          {/* Main Controls: Prev, Play/Pause, Next, Mute */}
          <div className="flex items-center justify-between gap-3 px-2">
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-cyan-300'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
              id="bg-music-mute-toggle-btn"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevTrack}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-all active:scale-95"
                title="Previous Track"
                id="bg-music-prev-btn"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className={`px-5 py-2.5 rounded-xl border font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-slate-950 shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-cyan-400 text-white shadow-cyan-500/20'
                }`}
                id="bg-music-play-pause-main-btn"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play BGM</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-all active:scale-95"
                title="Next Track"
                id="bg-music-next-btn"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Volume Control Slider */}
          <div className="space-y-1.5 px-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Volume</span>
              <span className="text-cyan-300 font-mono">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              id="bg-music-volume-slider"
            />
          </div>

          {/* VIP Notice Banner */}
          {vipNotice && (
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-black flex items-center justify-between gap-2 animate-fadeIn">
              <span className="truncate">{vipNotice}</span>
              <button
                type="button"
                onClick={onOpenVipModal}
                className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shrink-0 hover:bg-amber-300 transition-colors"
              >
                UPGRADE
              </button>
            </div>
          )}

          {/* Track Selection Pills */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                Select Soundtrack Loop ({MUSIC_TRACKS.length})
              </span>
              <span className="text-[10px] text-amber-400 font-black flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>{MUSIC_TRACKS.filter((t) => t.isVip).length} VIP Tracks</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-0.5">
              {MUSIC_TRACKS.map((t) => {
                const isSelected = t.id === currentTrack.id;
                const requiredTier = t.vipLevel || 'Gold';
                const isLocked = t.isVip && !hasVipAccess(currentUser, requiredTier);

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTrack(t)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 relative group ${
                      isSelected
                        ? t.isVip
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                          : 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-sm'
                        : t.isVip
                        ? 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-500/40 text-amber-200/80 hover:text-amber-200'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base shrink-0">{t.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-[11px] font-black truncate">{t.title}</p>
                        {t.isVip && (
                          <span className={`text-[8px] px-1 py-0.2 rounded font-black shrink-0 uppercase border ${
                            t.vipLevel === 'Diamond'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : t.vipLevel === 'Platinum'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {t.vipLevel || 'VIP'}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium truncate">{t.genre}</p>
                    </div>

                    {isLocked && (
                      <div className="p-1 rounded-md bg-slate-900/90 border border-slate-700 text-slate-400 shrink-0">
                        <Lock className="w-3 h-3 text-amber-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
