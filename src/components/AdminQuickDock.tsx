import React, { useState, useEffect } from 'react';
import {
  Crown,
  Zap,
  Gift,
  Megaphone,
  Snowflake,
  ShieldCheck,
  X,
  Sliders,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserAccount } from '../utils/auth';
import {
  getGlobalAdminSettings,
  toggleDoublePointsEvent,
  triggerMassPointsDrop,
  saveGlobalAdminSettings,
} from '../utils/adminVipPerks';

interface AdminQuickDockProps {
  currentUser: UserAccount | null;
  onOpenAdminModal: () => void;
  onTriggerSnowstorm?: () => void;
}

export function AdminQuickDock({
  currentUser,
  onOpenAdminModal,
  onTriggerSnowstorm,
}: AdminQuickDockProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [adminSettings, setAdminSettings] = useState(getGlobalAdminSettings());
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isAdmin = !!(
    currentUser?.isAdmin ||
    currentUser?.username?.toLowerCase() === 'pebblesthepenguinishaany83'
  );

  useEffect(() => {
    const handleUpdate = () => {
      setAdminSettings(getGlobalAdminSettings());
    };
    window.addEventListener('gameland_admin_settings_updated', handleUpdate);
    return () => window.removeEventListener('gameland_admin_settings_updated', handleUpdate);
  }, []);

  if (!isAdmin) return null;

  const handleToggleDoublePoints = () => {
    const nextState = toggleDoublePointsEvent();
    setAdminSettings(getGlobalAdminSettings());
    showNotice(nextState ? '⚡ 2x Double XP Event ACTIVATED!' : 'Double XP Event Deactivated');
  };

  const handleMassPointsDrop = () => {
    const count = triggerMassPointsDrop(25);
    setAdminSettings(getGlobalAdminSettings());
    showNotice(`🎁 +25 XP Mass Points Drop sent to ${count} users!`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    saveGlobalAdminSettings({
      announcementText: broadcastText.trim(),
      announcementActive: true,
    });
    setBroadcastText('');
    setAdminSettings(getGlobalAdminSettings());
    showNotice('📢 Global Alert Broadcasted!');
  };

  const handleToggleChatSlowMode = () => {
    const nextSec = adminSettings.chatSlowModeSeconds === 0 ? 5 : 0;
    saveGlobalAdminSettings({ chatSlowModeSeconds: nextSec });
    setAdminSettings(getGlobalAdminSettings());
    showNotice(nextSec > 0 ? '⏱️ Chat Slow Mode (5s Cooldown) Active' : 'Chat Slow Mode Disabled');
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-50">
      {actionNotice && (
        <div className="mb-2 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl animate-in slide-in-from-bottom-2 duration-200 border border-amber-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{actionNotice}</span>
        </div>
      )}

      {isExpanded ? (
        <div className="w-80 sm:w-96 p-4 rounded-2xl bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/80 backdrop-blur-xl space-y-3.5 animate-in zoom-in-95 duration-200 ring-1 ring-amber-400/30">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black">
                👑
              </div>
              <div>
                <h3 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  Admin Command Dock
                </h3>
                <p className="text-[10px] text-slate-400">Realtime system controls & actions</p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Double XP Toggle */}
            <button
              type="button"
              onClick={handleToggleDoublePoints}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                adminSettings.doublePointsActive
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md animate-pulse'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4" />
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950/40 font-black">
                  {adminSettings.doublePointsActive ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="font-extrabold text-[11px] pt-1">2x Double Points</span>
            </button>

            {/* Mass Points Drop */}
            <button
              type="button"
              onClick={handleMassPointsDrop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between text-emerald-400">
                <Gift className="w-4 h-4" />
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 font-black">+25 XP</span>
              </div>
              <span className="font-extrabold text-[11px] pt-1">Mass Points Drop</span>
            </button>

            {/* Chat Slow-Mode */}
            <button
              type="button"
              onClick={handleToggleChatSlowMode}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                adminSettings.chatSlowModeSeconds > 0
                  ? 'bg-purple-500 text-slate-950 border-purple-300 font-black shadow-md'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <Clock className="w-4 h-4" />
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950/40 font-black">
                  {adminSettings.chatSlowModeSeconds > 0 ? '5s' : 'OFF'}
                </span>
              </div>
              <span className="font-extrabold text-[11px] pt-1">Chat Slow Mode</span>
            </button>

            {/* Snowstorm / Confetti Effect */}
            <button
              type="button"
              onClick={onTriggerSnowstorm}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-left transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between text-cyan-400">
                <Snowflake className="w-4 h-4" />
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 font-black">PARTY</span>
              </div>
              <span className="font-extrabold text-[11px] pt-1">Snow Party</span>
            </button>
          </div>

          {/* Broadcast Message Input */}
          <form onSubmit={handleSendBroadcast} className="flex items-center gap-2 pt-1 border-t border-slate-900">
            <input
              type="text"
              placeholder="Broadcast alert message to header..."
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!broadcastText.trim()}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs shrink-0 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Open Full Admin Modal Button */}
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              onOpenAdminModal();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 border border-amber-300 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>OPEN FULL ADMIN CONTROL PANEL</span>
          </button>
        </div>
      ) : (
        /* Floating Button Trigger */
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          title="Open Admin Quick Control Dock"
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-2xl shadow-amber-500/40 border-2 border-white ring-2 ring-amber-400/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Crown className="w-4 h-4 fill-slate-950" />
          <span className="uppercase tracking-wide font-black">ADMIN DOCK</span>
          {adminSettings.doublePointsActive && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[9px] font-black animate-pulse">
              2x XP
            </span>
          )}
        </button>
      )}
    </div>
  );
}
