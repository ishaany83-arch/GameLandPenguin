import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  X,
  Zap,
  Award,
  Gift,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Star,
  Gamepad2,
  Lock,
  Volume2,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Coins,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import {
  UserAccount,
  getStoredUsers,
  saveUsers,
  getUserPoints,
  upgradeVipLevelWithPoints,
  getUserPendingVipPass,
  approvePendingVipPass,
  cancelPendingVipPass,
  VIP_TIER_PRICES,
} from '../utils/auth';
import {
  getVipCustomTitle,
  setVipCustomTitle,
  getVipGlowTheme,
  setVipGlowTheme,
  VipGlowTheme,
  isVipDailySpinClaimedToday,
  claimVipDailySpin,
  VipDailyClaimResult,
  PRESET_VIP_TITLES,
} from '../utils/adminVipPerks';

interface VipLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated?: (user: UserAccount) => void;
  onOpenStore?: () => void;
  onOpenAdmin?: () => void;
}

export function VipLoungeModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenStore,
  onOpenAdmin,
}: VipLoungeModalProps) {
  const [selectedTitle, setSelectedTitle] = useState<string>(
    getVipCustomTitle(currentUser?.username) || '💎 VIP Member'
  );
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [glowTheme, setGlowTheme] = useState<VipGlowTheme>(
    getVipGlowTheme(currentUser?.username)
  );
  const [spinResult, setSpinResult] = useState<VipDailyClaimResult | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isVip = !!(
    currentUser?.isVip ||
    currentUser?.isAdmin ||
    currentUser?.username?.toLowerCase() === 'pebblesthepenguinishaany83'
  );
  const currentTier = currentUser?.vipLevel || (currentUser?.isAdmin ? 'Diamond' : null);
  const userPoints = getUserPoints(currentUser);
  const pendingVip = getUserPendingVipPass(currentUser);

  useEffect(() => {
    if (currentUser?.username) {
      setSelectedTitle(getVipCustomTitle(currentUser.username) || '💎 VIP Member');
      setGlowTheme(getVipGlowTheme(currentUser.username));
      setHasClaimedToday(isVipDailySpinClaimedToday(currentUser.username));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSaveCustomization = () => {
    if (!currentUser?.username) return;
    const finalTitle = customTitleInput.trim() || selectedTitle;
    setVipCustomTitle(currentUser.username, finalTitle);
    setVipGlowTheme(currentUser.username, glowTheme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDailySpin = () => {
    if (!currentUser?.username || isSpinning || hasClaimedToday) return;
    setIsSpinning(true);
    setTimeout(() => {
      const res = claimVipDailySpin(currentUser.username);
      setSpinResult(res);
      setIsSpinning(false);
      setHasClaimedToday(true);
    }, 1200);
  };

  const handleUpgradeTier = (tier: 'Gold' | 'Platinum' | 'Diamond') => {
    setFeedback(null);
    const res = upgradeVipLevelWithPoints(currentUser, tier);
    if (res.success) {
      if (res.user && onUserUpdated) {
        onUserUpdated(res.user);
      }
      setFeedback({ type: 'success', message: res.message });
      window.dispatchEvent(new CustomEvent('gameland_vip_perks_updated'));
      window.dispatchEvent(new CustomEvent('gameland_auth_changed'));
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const getUpgradeCost = (tier: 'Gold' | 'Platinum' | 'Diamond') => {
    const targetPrice = VIP_TIER_PRICES[tier];
    const currentTierVal = currentTier ? VIP_TIER_PRICES[currentTier as keyof typeof VIP_TIER_PRICES] || 0 : 0;
    return Math.max(0, targetPrice - currentTierVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/80 flex flex-col overflow-hidden ring-1 ring-amber-400/30">
        {/* Header Bar */}
        <div className="relative p-5 bg-gradient-to-r from-amber-950 via-slate-950 to-amber-900 border-b border-amber-500/30 flex items-center justify-between shrink-0 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3.5 z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-2 border-amber-200 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 animate-pulse">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">VIP Elite Lounge</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {currentTier ? `${currentTier} TIER ACTIVE` : 'REGULAR MEMBER'}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium flex items-center gap-2">
                <span>Balance: <strong className="text-amber-300">🪙 {userPoints} PTS</strong></span>
                <span>•</span>
                <span>Exclusive perks & custom VIP aura customization</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900/80 text-amber-200 hover:text-white hover:bg-slate-800 border border-amber-500/30 transition-all z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-slate-200">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-in zoom-in-95 duration-200 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-950/50'
                  : 'bg-rose-950/80 border-rose-500/60 text-rose-200 shadow-lg shadow-rose-950/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>

              {feedback.type === 'error' && onOpenStore && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStore();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shrink-0 cursor-pointer shadow-md flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Open Point Shop</span>
                </button>
              )}
            </div>
          )}

          {/* Pending VIP Request Banner */}
          {pendingVip && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-950 to-yellow-950/90 border-2 border-amber-500/60 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        ⏳ Pending Admin Approval
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/30 text-amber-200 border border-amber-500/40">
                        Awaiting Review
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">
                      {pendingVip.name} (🪙 {pendingVip.price} PTS)
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Your VIP upgrade request was submitted and is waiting for an Admin to review and approve it from the Admin Control Panel.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentUser?.isAdmin || currentUser?.username?.toLowerCase() === 'pebblesthepenguinishaany83' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const res = approvePendingVipPass(currentUser);
                        if (res.success) {
                          setFeedback({ type: 'success', message: res.message });
                          if (res.user && onUserUpdated) onUserUpdated(res.user);
                          window.dispatchEvent(new CustomEvent('gameland_vip_perks_updated'));
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Admin Approve ⚡</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin Approval Required</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const res = cancelPendingVipPass(currentUser);
                      if (res.success) {
                        setFeedback({ type: 'success', message: res.message });
                        if (res.user && onUserUpdated) onUserUpdated(res.user);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel & Refund
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isVip ? (
            /* Locked VIP Access Screen for Non-VIPs */
            <div className="py-8 px-4 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/30 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                    <Crown className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-slate-900 border-2 border-amber-500 text-amber-400 shadow-xl">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 max-w-lg">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight">VIP Elite Lounge Access Restricted</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider font-extrabold">
                    VIP Only 🔒
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The VIP Elite Lounge is strictly reserved for active VIP members. Non-VIP members cannot enter or access lounge features, daily loot spins, chat aura customizations, or VIP multiplier perks.
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-extrabold mt-1">
                  Your Current Balance: <strong className="text-amber-200">🪙 {userPoints} PTS</strong>
                </div>
              </div>

              <div className="w-full max-w-xl space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Choose a VIP Pass Tier to Unlock Lounge Access</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tier: 'Gold', price: 100, mult: '1.25x', color: 'border-amber-500/40 text-amber-300' },
                    { tier: 'Platinum', price: 250, mult: '1.5x', color: 'border-cyan-500/40 text-cyan-300' },
                    { tier: 'Diamond', price: 500, mult: '2.0x', color: 'border-indigo-500/40 text-indigo-300' },
                  ].map((t) => (
                    <div key={t.tier} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-3 text-left shadow-lg">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-black text-xs ${t.color}`}>VIP {t.tier}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 font-extrabold border border-amber-500/30">
                            🪙 {t.price} PTS
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">XP Multiplier: {t.mult}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpgradeTier(t.tier as any)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Crown className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Unlock VIP {t.tier}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {onOpenStore && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStore();
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>View VIP Passes in Point Shop</span>
                </button>
              )}
            </div>
          ) : (
            /* FULL VIP LOUNGE FEATURES EXCLUSIVELY FOR VIP MEMBERS */
            <>
              {/* SECTION 1: Daily VIP Fortune Wheel / Bonus Chest */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <span>VIP Daily Bonus Wheel & Loot Chest</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
                          RESET DAILY
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Spin the wheel once per day to claim bonus points & rare titles</p>
                    </div>
                  </div>

                  <button
                    disabled={hasClaimedToday || isSpinning}
                    onClick={handleDailySpin}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 border border-amber-300 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Zap className={`w-4 h-4 fill-slate-950 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{hasClaimedToday ? '✅ Claimed Today' : isSpinning ? 'Spinning...' : 'SPIN VIP WHEEL'}</span>
                  </button>
                </div>

                {spinResult && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-3 animate-in zoom-in duration-200">
                    <Award className="w-6 h-6 text-amber-300 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-white">{spinResult.message}</p>
                      <p className="text-[11px] text-amber-200/80">Reward applied directly to your VIP profile balance!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Custom VIP Title & Chat Glow Selector */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">VIP Custom Title & Chat Glow Aura</h3>
                      <p className="text-xs text-slate-400">Customize how your username & chat messages stand out</p>
                    </div>
                  </div>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Customizations Saved!</span>
                    </span>
                  )}
                </div>

                {/* Custom Titles Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-300 block">Select VIP Custom Display Title:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_VIP_TITLES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTitle(t);
                          setCustomTitleInput('');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left truncate cursor-pointer ${
                          selectedTitle === t && !customTitleInput
                            ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Custom Title Input */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Or type custom VIP Title (e.g. ⚡ Cyber Emperor)..."
                      value={customTitleInput}
                      onChange={(e) => setCustomTitleInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Chat Glow Aura Theme Selector */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <label className="text-xs font-bold text-amber-300 block">Select Chat Message Aura Theme:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'gold', name: '✨ Gold Aura', color: 'border-amber-400 text-amber-300' },
                      { id: 'diamond', name: '💎 Diamond Sparkle', color: 'border-cyan-400 text-cyan-300' },
                      { id: 'neon', name: '⚡ Neon Cyber', color: 'border-emerald-400 text-emerald-300' },
                      { id: 'amethyst', name: '🔮 Royal Amethyst', color: 'border-purple-400 text-purple-300' },
                      { id: 'none', name: '🚫 Standard', color: 'border-slate-700 text-slate-400' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGlowTheme(g.id as VipGlowTheme)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          glowTheme === g.id
                            ? 'bg-slate-900 border-amber-400 text-white font-black ring-2 ring-amber-400/40 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{g.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveCustomization}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Save VIP Customization
                  </button>
                </div>
              </div>

              {/* SECTION 3: VIP Perks Matrix Grid */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Your Active VIP Perks Matrix</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/20 space-y-1">
                    <div className="flex items-center gap-2 text-amber-300 font-extrabold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Up to 2.5x Points Boost</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Earn maximum XP points per game & joke submission.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-300 font-extrabold">
                      <Gamepad2 className="w-4 h-4" />
                      <span>Exclusive Games</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Full access to VIP exclusive arcade titles.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-300 font-extrabold">
                      <Volume2 className="w-4 h-4" />
                      <span>VIP Audio Synth</span>
                    </div>
                    <p className="text-[11px] text-slate-400">4 exclusive ambient audio lounge tracks unlocked.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Tier Switcher & Pricing */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">VIP Level Upgrades & Pricing</h3>
                    <p className="text-xs text-slate-400">Upgrade your VIP level using earned GameLand XP Points</p>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
                    Balance: 🪙 {userPoints} PTS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tier: 'Gold', price: 100, mult: '1.25x', color: 'border-amber-500/40 text-amber-300' },
                    { tier: 'Platinum', price: 250, mult: '1.5x', color: 'border-cyan-500/40 text-cyan-300' },
                    { tier: 'Diamond', price: 500, mult: '2.0x', color: 'border-indigo-500/40 text-indigo-300' },
                  ].map((t) => {
                    const cost = getUpgradeCost(t.tier as any);
                    const isCurrent = currentTier === t.tier;

                    return (
                      <div
                        key={t.tier}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 ${
                          isCurrent
                            ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-black text-xs ${t.color}`}>VIP {t.tier}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold border border-amber-500/30">
                              🪙 {t.price} PTS
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">XP Multiplier: {t.mult}</span>
                        </div>

                        {isCurrent ? (
                          <div className="w-full py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 font-black text-xs text-center">
                            CURRENT LEVEL ✅
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpgradeTier(t.tier as any)}
                            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>{cost > 0 ? `Upgrade (🪙 ${cost} PTS)` : `Unlock VIP ${t.tier}`}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

