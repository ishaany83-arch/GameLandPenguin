import React from 'react';
import { Play, Star, Heart, Flame, Eye, Sparkles, Crown, Lock } from 'lucide-react';
import { Game } from '../types';
import { formatPlayCount } from '../data/gamesData';
import { UserAccount, hasVipAccess } from '../utils/auth';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  isVipUser?: boolean;
  currentUser?: UserAccount | null;
  onSelectGame: (game: Game) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onVipLockClick?: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  isVipUser = false,
  currentUser,
  onSelectGame,
  onToggleFavorite,
  onVipLockClick,
}) => {
  const requiredTier = game.vipLevel || 'Gold';
  const isLocked = game.isVipExclusive && (currentUser ? !hasVipAccess(currentUser, requiredTier) : !isVipUser);

  const handleClick = () => {
    if (isLocked && onVipLockClick) {
      onVipLockClick(game);
    } else {
      onSelectGame(game);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
        game.isVipExclusive
          ? isLocked
            ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20'
            : 'bg-slate-900/90 border-amber-500/60 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/30'
          : 'bg-slate-900/80 border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30'
      }`}
      id={`game-card-${game.slug}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            isLocked ? 'opacity-70 group-hover:opacity-80 grayscale-30' : 'opacity-90 group-hover:opacity-100'
          }`}
          loading="lazy"
        />

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              {game.category}
            </span>

            {/* VIP Exclusive Badges */}
            {game.isVipExclusive && (
              isLocked ? (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/30 animate-pulse"
                  title={`Requires VIP ${requiredTier} - Click to Unlock`}
                >
                  <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
                  <Lock className="w-2.5 h-2.5 text-slate-950" />
                  <span>VIP {requiredTier}</span>
                </span>
              ) : (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-500/50 backdrop-blur-md flex items-center gap-1 shadow-xs"
                  title="VIP Access Granted"
                >
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>VIP {requiredTier}</span>
                </span>
              )
            )}

            {(game.isNew || game.isCustom) && !game.isVipExclusive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md uppercase tracking-wider animate-pulse" title="Newly Added Game">
                <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
                <span>NEW</span>
              </span>
            )}
            {game.rating >= 4.7 && !game.isVipExclusive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500 text-slate-950 flex items-center gap-1 shadow-md" title="Pebbles Pick">
                <span>🐧 Pick</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
            {game.isPopular && (
              <span className="p-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 backdrop-blur-md" title="Popular Hot Game">
                <Flame className="w-3.5 h-3.5" />
              </span>
            )}
            <button
              onClick={(e) => onToggleFavorite(game.id, e)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-100 border border-slate-700/60'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              id={`fav-btn-${game.slug}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Play Overlay or Lock Overlay */}
        {isLocked ? (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform mb-1.5">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Pass Required</span>
            </span>
            <span className="text-[10px] text-slate-300 mt-0.5">Click for access info</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
              game.isVipExclusive
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/40'
                : 'bg-cyan-500 text-slate-950 shadow-cyan-500/40'
            }`}>
              <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
        <div>
          <h3 className={`font-bold text-sm transition-colors line-clamp-1 flex items-center gap-1.5 ${
            game.isVipExclusive ? 'text-amber-200 group-hover:text-amber-300' : 'text-slate-100 group-hover:text-cyan-300'
          }`}>
            <span>{game.title}</span>
            {game.isVipExclusive && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 inline" />}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Rating and Play Count */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatPlayCount(game.playCount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
