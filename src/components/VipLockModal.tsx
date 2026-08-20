import React from 'react';
import { X, Crown, Lock, ShieldCheck, Sparkles, Zap, Award, Gem, Clock } from 'lucide-react';
import { Game } from '../types';
import { UserAccount, getUserPendingVipPass } from '../utils/auth';

interface VipLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
  itemName?: string | null;
  requiredTier?: 'Gold' | 'Platinum' | 'Diamond';
  currentUser: UserAccount | null;
  onOpenAdminModal?: () => void;
  onOpenProfile?: () => void;
  onOpenStore?: () => void;
}

export const VipLockModal: React.FC<VipLockModalProps> = ({
  isOpen,
  onClose,
  game,
  itemName,
  requiredTier = 'Gold',
  currentUser,
  onOpenAdminModal,
  onOpenProfile,
  onOpenStore,
}) => {
  if (!isOpen || (!game && !itemName)) return null;

  const displayTitle = game ? game.title : itemName || 'VIP Exclusive Content';
  const isAdmin = !!(currentUser?.isAdmin || currentUser?.username?.toLowerCase() === 'pebblesthepenguinishaany83');
  const pendingVip = getUserPendingVipPass(currentUser);

  const getTierTheme = () => {
    switch (requiredTier) {
      case 'Diamond':
        return {
          title: 'Diamond VIP Tier Required 💎',
          badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
          gradientBg: 'from-cyan-500 to-blue-500',
          shadowColor: 'shadow-cyan-500/20',
          borderColor: 'border-cyan-500/50',
          icon: <Gem className="w-8 h-8 text-cyan-300 animate-pulse" />,
        };
      case 'Platinum':
        return {
          title: 'Platinum VIP Tier Required ⚡',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          gradientBg: 'from-purple-500 to-pink-500',
          shadowColor: 'shadow-purple-500/20',
          borderColor: 'border-purple-500/50',
          icon: <Zap className="w-8 h-8 text-purple-300 animate-pulse" />,
        };
      case 'Gold':
      default:
        return {
          title: 'Gold VIP Pass Required 👑',
          badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          gradientBg: 'from-amber-500 to-yellow-400',
          shadowColor: 'shadow-amber-500/20',
          borderColor: 'border-amber-500/50',
          icon: <Crown className="w-8 h-8 text-amber-400 animate-pulse" />,
        };
    }
  };

  const theme = getTierTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-lg bg-slate-900 border ${theme.borderColor} rounded-3xl p-5 sm:p-6 shadow-2xl ${theme.shadowColor} text-slate-100 overflow-hidden max-h-[90vh] flex flex-col`}>
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="flex flex-col items-center text-center space-y-3 pt-1 shrink-0">
          {/* Badge Icon */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${theme.gradientBg} p-0.5 shadow-lg flex items-center justify-center`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                {theme.icon}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-amber-400 shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${theme.badgeBg}`}>
              {theme.title}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1.5">
              VIP Content Locked
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              <span className="text-amber-300 font-bold">{displayTitle}</span> requires <span className="text-white font-bold">{requiredTier} VIP</span> membership level.
            </p>
          </div>

          {/* Preview snippet */}
          {game ? (
            <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-3 flex items-center gap-3 text-left">
              <img
                src={game.thumbnailUrl}
                alt={game.title}
                className="w-16 h-12 object-cover rounded-xl border border-amber-500/30 shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-200 truncate">{game.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">{game.category} • ⭐ {game.rating.toFixed(1)} Rating</p>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-3 flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-200 truncate">{displayTitle}</h4>
                <p className="text-[11px] text-amber-300 font-medium truncate">VIP Exclusive Music / Feature</p>
              </div>
            </div>
          )}

          {/* Pending VIP Processing Alert Banner */}
          {pendingVip && (
            <div className="w-full p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex flex-col gap-2 text-left animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                <span className="font-extrabold text-amber-300">⏳ VIP Pass Order Currently Processing</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                You purchased <strong className="text-amber-200">{pendingVip.name}</strong> and it is undergoing verification. Open the Point Shop to complete processing!
              </p>
              {onOpenStore && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStore();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors self-start shadow-md shadow-amber-500/20"
                >
                  Open Point Shop & Complete VIP Processing ➔
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable VIP Levels Differences Section */}
        <div className="my-4 space-y-2 overflow-y-auto custom-scrollbar pr-1 max-h-56">
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Gameland VIP Level Perks Breakdown:</span>
            </h4>

            <div className="space-y-2">
              {/* Gold Tier */}
              <div className={`p-3 rounded-2xl border transition-all ${
                requiredTier === 'Gold' ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Gold VIP (Tier 1)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    1.25x Multiplier
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Unlocks all standard VIP Exclusive Games & Aurora Gold Ambient BGM loop.
                </p>
              </div>

              {/* Platinum Tier */}
              <div className={`p-3 rounded-2xl border transition-all ${
                requiredTier === 'Platinum' ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/30' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Platinum VIP (Tier 2)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    1.5x Multiplier
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Includes Gold + Cyber Synthwave tracks, Custom Disguise Key config & Purple Frame.
                </p>
              </div>

              {/* Diamond Tier */}
              <div className={`p-3 rounded-2xl border transition-all ${
                requiredTier === 'Diamond' ? 'bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/30' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1">
                    <Gem className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Diamond VIP (Tier 3 - Supreme)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    2.0x Multiplier
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Includes All Tiers + Royal Diamond Anthem, Turbo Instant Launching & Diamond Glow Theme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="w-full flex flex-col gap-2 pt-1 shrink-0">
          {/* ONLY show Admin Panel button if the user is ACTUALLY an Admin */}
          {isAdmin && onOpenAdminModal ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminModal();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Open Admin Control Panel to Promote Account</span>
            </button>
          ) : (
            onOpenStore && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStore();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Get VIP Pass in Point Shop (From 🪙 100 PTS)</span>
              </button>
            )
          )}

          {onOpenProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>View VIP Perks in Profile</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close & Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
