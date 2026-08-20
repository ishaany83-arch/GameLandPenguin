import { UserAccount, getStoredUsers, saveUsers, getCurrentSessionUser } from './auth';

export interface GlobalAdminSettings {
  doublePointsActive: boolean;
  announcementText: string;
  announcementActive: boolean;
  chatSlowModeSeconds: number; // 0 = off, e.g. 5 = 5 sec cooldown
  pinnedChatMessage?: {
    id: string;
    content: string;
    author: string;
    pinnedAt: string;
  } | null;
  maintenanceMode: boolean;
  maintenanceReason?: string;
}

const ADMIN_SETTINGS_KEY = 'gameland_admin_global_settings_v1';
const VIP_TITLES_KEY = 'gameland_vip_custom_titles_v1';
const VIP_GLOWS_KEY = 'gameland_vip_custom_glows_v1';
const VIP_SPIN_KEY = 'gameland_vip_daily_spin_v1';

// Default global admin settings
export function getGlobalAdminSettings(): GlobalAdminSettings {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load global admin settings', e);
  }
  return {
    doublePointsActive: false,
    announcementText: '🔥 Welcome to GameLand! Daily Double Points Event coming soon!',
    announcementActive: false,
    chatSlowModeSeconds: 0,
    pinnedChatMessage: null,
    maintenanceMode: false,
  };
}

export function saveGlobalAdminSettings(settings: Partial<GlobalAdminSettings>): GlobalAdminSettings {
  const current = getGlobalAdminSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updated));
    // Dispatch storage event / custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent('gameland_admin_settings_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save global admin settings', e);
  }
  return updated;
}

// Toggle double points
export function toggleDoublePointsEvent(): boolean {
  const current = getGlobalAdminSettings();
  const next = !current.doublePointsActive;
  saveGlobalAdminSettings({ doublePointsActive: next });
  return next;
}

// Broadcast mass points drop
export function triggerMassPointsDrop(amount: number = 25): number {
  const users = getStoredUsers();
  let updatedCount = 0;
  Object.keys(users).forEach((key) => {
    const currentPoints = typeof users[key].points === 'number' ? users[key].points : 10;
    users[key].points = currentPoints + amount;
    updatedCount++;
  });
  saveUsers(users);

  // Broadcast announcement alert
  saveGlobalAdminSettings({
    announcementText: `🎁 MASS POINTS DROP! Admin just awarded +${amount} Bonus Points to all players!`,
    announcementActive: true,
  });

  return updatedCount;
}

// VIP Custom Title Storage
export function getVipCustomTitle(username?: string): string | null {
  if (!username) return null;
  try {
    const raw = localStorage.getItem(VIP_TITLES_KEY);
    if (raw) {
      const titles = JSON.parse(raw);
      return titles[username.toLowerCase()] || null;
    }
  } catch (e) {
    console.error('Failed to read VIP title', e);
  }
  return null;
}

export function setVipCustomTitle(username: string, title: string): void {
  try {
    const raw = localStorage.getItem(VIP_TITLES_KEY);
    const titles = raw ? JSON.parse(raw) : {};
    titles[username.toLowerCase()] = title;
    localStorage.setItem(VIP_TITLES_KEY, JSON.stringify(titles));
    window.dispatchEvent(new CustomEvent('gameland_vip_perks_updated'));
  } catch (e) {
    console.error('Failed to set VIP title', e);
  }
}

// VIP Custom Glow Aura Storage
export type VipGlowTheme = 'gold' | 'diamond' | 'neon' | 'amethyst' | 'emerald' | 'none';

export function getVipGlowTheme(username?: string): VipGlowTheme {
  if (!username) return 'none';
  try {
    const raw = localStorage.getItem(VIP_GLOWS_KEY);
    if (raw) {
      const glows = JSON.parse(raw);
      return glows[username.toLowerCase()] || 'gold';
    }
  } catch (e) {
    console.error('Failed to read VIP glow', e);
  }
  return 'gold';
}

export function setVipGlowTheme(username: string, glow: VipGlowTheme): void {
  try {
    const raw = localStorage.getItem(VIP_GLOWS_KEY);
    const glows = raw ? JSON.parse(raw) : {};
    glows[username.toLowerCase()] = glow;
    localStorage.setItem(VIP_GLOWS_KEY, JSON.stringify(glows));
    window.dispatchEvent(new CustomEvent('gameland_vip_perks_updated'));
  } catch (e) {
    console.error('Failed to set VIP glow', e);
  }
}

// VIP Daily Wheel Claim
export interface VipDailyClaimResult {
  rewardType: 'points' | 'title' | 'multiplier' | 'badge';
  rewardValue: string | number;
  message: string;
}

export function isVipDailySpinClaimedToday(username?: string): boolean {
  if (!username) return false;
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `${VIP_SPIN_KEY}_${username.toLowerCase()}_${today}`;
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function claimVipDailySpin(username: string): VipDailyClaimResult {
  const today = new Date().toISOString().split('T')[0];
  const key = `${VIP_SPIN_KEY}_${username.toLowerCase()}_${today}`;
  localStorage.setItem(key, 'true');

  const rewards: VipDailyClaimResult[] = [
    {
      rewardType: 'points',
      rewardValue: 50,
      message: '🎉 Jackpot! You won +50 VIP Bonus XP Points!',
    },
    {
      rewardType: 'points',
      rewardValue: 30,
      message: '🌟 Super Spin! You earned +30 VIP Bonus XP Points!',
    },
    {
      rewardType: 'title',
      rewardValue: '👑 Penguin Sovereign',
      message: '👑 Legendary Title Unlocked: "Penguin Sovereign"!',
    },
    {
      rewardType: 'points',
      rewardValue: 20,
      message: '💎 VIP Bonus: You gained +20 Bonus XP Points!',
    },
    {
      rewardType: 'multiplier',
      rewardValue: '2.5x Boost',
      message: '⚡ 24-Hour VIP Ultra Multiplier active!',
    },
  ];

  const outcome = rewards[Math.floor(Math.random() * rewards.length)];

  if (outcome.rewardType === 'points' && typeof outcome.rewardValue === 'number') {
    const users = getStoredUsers();
    const uKey = username.toLowerCase();
    if (users[uKey]) {
      const cur = typeof users[uKey].points === 'number' ? users[uKey].points : 10;
      users[uKey].points = cur + outcome.rewardValue;
      saveUsers(users);
    }
  } else if (outcome.rewardType === 'title' && typeof outcome.rewardValue === 'string') {
    setVipCustomTitle(username, outcome.rewardValue);
  }

  window.dispatchEvent(new CustomEvent('gameland_vip_perks_updated'));
  return outcome;
}

export const PRESET_VIP_TITLES = [
  '💎 Diamond Mastermind',
  '🌟 Gold Legend',
  '👑 Penguin Sovereign',
  '⚡ Speed Runner Prime',
  '✨ Galactic VIP',
  '🛡️ Paragon VIP',
  '🎮 Arcade Overlord',
  '🚀 Cosmic Gamer',
];
