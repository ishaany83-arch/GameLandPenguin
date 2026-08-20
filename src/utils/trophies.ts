// Penguin Trophies & Achievements System for Gameland
// Tracks playtime, favorite counts, game launches, and login streaks

import { getFavoriteIds } from '../data/gamesData';
import { UserAccount, getCurrentSessionUser, getStoredUsers, saveUsers, setCurrentSessionUser } from './auth';

export interface PenguinTrophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'playtime' | 'favorites' | 'streak' | 'vip';
  requirementType: 'games_played' | 'playtime_minutes' | 'favorite_count' | 'streak_days' | 'vip_status';
  requirementValue: number;
  badgeLabel: string;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalPlaytimeMinutes: number;
  favoriteCount: number;
}

export interface UnlockedTrophyRecord {
  id: string;
  unlockedAt: string;
}

export const PENGUIN_TROPHIES: PenguinTrophy[] = [
  {
    id: 'first_game',
    title: 'Egg Hatching',
    description: 'Launched your very first game on Gameland.',
    icon: '🥚',
    category: 'playtime',
    requirementType: 'games_played',
    requirementValue: 1,
    badgeLabel: '1 Game Played',
  },
  {
    id: 'play_5_games',
    title: 'Penguin Arcade Racer',
    description: 'Launched 5 different game sessions.',
    icon: '🐧',
    category: 'playtime',
    requirementType: 'games_played',
    requirementValue: 5,
    badgeLabel: '5 Games Played',
  },
  {
    id: 'play_15_games',
    title: 'Polar Game Master',
    description: 'Explored and launched 15 game sessions!',
    icon: '🕹️',
    category: 'playtime',
    requirementType: 'games_played',
    requirementValue: 15,
    badgeLabel: '15 Games Played',
  },
  {
    id: 'playtime_1m',
    title: 'Ice Breaker',
    description: 'Clocked 1 minute of active gameplay time.',
    icon: '⏱️',
    category: 'playtime',
    requirementType: 'playtime_minutes',
    requirementValue: 1,
    badgeLabel: '1 Min Playtime',
  },
  {
    id: 'playtime_10m',
    title: 'Glacier Marathoner',
    description: 'Spent 10 total minutes gaming on Gameland.',
    icon: '🧊',
    category: 'playtime',
    requirementType: 'playtime_minutes',
    requirementValue: 10,
    badgeLabel: '10 Mins Playtime',
  },
  {
    id: 'playtime_30m',
    title: 'Emperor of Playtime',
    description: 'Spent 30 total minutes enjoying polar games!',
    icon: '🏆',
    category: 'playtime',
    requirementType: 'playtime_minutes',
    requirementValue: 30,
    badgeLabel: '30 Mins Playtime',
  },
  {
    id: 'favorite_1',
    title: 'Fish Hoarder',
    description: 'Saved 1 game to your Favorites collection.',
    icon: '🐟',
    category: 'favorites',
    requirementType: 'favorite_count',
    requirementValue: 1,
    badgeLabel: '1 Favorite',
  },
  {
    id: 'favorite_5',
    title: 'Ice Vault Curator',
    description: 'Saved 5 favorite games to your polar library.',
    icon: '💖',
    category: 'favorites',
    requirementType: 'favorite_count',
    requirementValue: 5,
    badgeLabel: '5 Favorites',
  },
  {
    id: 'favorite_10',
    title: 'Archivist Emperor',
    description: 'Curated 10 or more favorite games in your vault!',
    icon: '👑',
    category: 'favorites',
    requirementType: 'favorite_count',
    requirementValue: 10,
    badgeLabel: '10 Favorites',
  },
  {
    id: 'streak_3d',
    title: 'Polar Loyalty',
    description: 'Maintained a 3-day consecutive login check-in streak.',
    icon: '🔥',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 3,
    badgeLabel: '3-Day Streak',
  },
  {
    id: 'vip_unlocked',
    title: 'Golden Igloo Elite',
    description: 'Unlocked VIP membership or equipped an exclusive frame.',
    icon: '💎',
    category: 'vip',
    requirementType: 'vip_status',
    requirementValue: 1,
    badgeLabel: 'VIP / Frame Unlocked',
  },
];

const STATS_STORAGE_KEY_PREFIX = 'gameland_user_stats_v1_';
const TROPHIES_STORAGE_KEY_PREFIX = 'gameland_user_trophies_v1_';

export function getUserStats(username?: string): UserStats {
  const user = username ? { username } : getCurrentSessionUser();
  const uname = (user?.username || 'guest').toLowerCase();
  try {
    const raw = localStorage.getItem(`${STATS_STORAGE_KEY_PREFIX}${uname}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        totalGamesPlayed: parsed.totalGamesPlayed || 0,
        totalPlaytimeMinutes: parsed.totalPlaytimeMinutes || 0,
        favoriteCount: typeof parsed.favoriteCount === 'number' ? parsed.favoriteCount : getFavoriteIds().length,
      };
    }
  } catch {
    // fallback
  }
  return {
    totalGamesPlayed: 0,
    totalPlaytimeMinutes: 0,
    favoriteCount: getFavoriteIds().length,
  };
}

export function saveUserStats(stats: UserStats, username?: string): void {
  const user = username ? { username } : getCurrentSessionUser();
  const uname = (user?.username || 'guest').toLowerCase();
  try {
    localStorage.setItem(`${STATS_STORAGE_KEY_PREFIX}${uname}`, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function getUnlockedTrophyRecords(username?: string): UnlockedTrophyRecord[] {
  const user = username ? { username } : getCurrentSessionUser();
  const uname = (user?.username || 'guest').toLowerCase();
  try {
    const raw = localStorage.getItem(`${TROPHIES_STORAGE_KEY_PREFIX}${uname}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveUnlockedTrophyRecords(records: UnlockedTrophyRecord[], username?: string): void {
  const user = username ? { username } : getCurrentSessionUser();
  const uname = (user?.username || 'guest').toLowerCase();
  try {
    localStorage.setItem(`${TROPHIES_STORAGE_KEY_PREFIX}${uname}`, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save trophies', e);
  }
}

/**
 * Main evaluation function to check if any new trophies should be unlocked.
 */
export function evaluateTrophies(
  username?: string,
  overrideFavoritesCount?: number
): { unlockedTrophies: PenguinTrophy[]; newUnlocks: PenguinTrophy[]; stats: UserStats } {
  const sessionUser = getCurrentSessionUser();
  const uname = (username || sessionUser?.username || 'guest').toLowerCase();
  const user = username ? getStoredUsers()[uname] || sessionUser : sessionUser;

  const stats = getUserStats(uname);
  if (typeof overrideFavoritesCount === 'number') {
    stats.favoriteCount = overrideFavoritesCount;
    saveUserStats(stats, uname);
  } else {
    stats.favoriteCount = getFavoriteIds().length;
    saveUserStats(stats, uname);
  }

  const currentRecords = getUnlockedTrophyRecords(uname);
  const unlockedIds = new Set(currentRecords.map((r) => r.id));

  const streakDays = user?.loginStreak || 1;
  const isVip = !!(user?.isVip || user?.activeProfileFrame);

  const newUnlocks: PenguinTrophy[] = [];
  const updatedRecords = [...currentRecords];

  PENGUIN_TROPHIES.forEach((trophy) => {
    if (unlockedIds.has(trophy.id)) return;

    let isMet = false;
    switch (trophy.requirementType) {
      case 'games_played':
        isMet = stats.totalGamesPlayed >= trophy.requirementValue;
        break;
      case 'playtime_minutes':
        isMet = stats.totalPlaytimeMinutes >= trophy.requirementValue;
        break;
      case 'favorite_count':
        isMet = stats.favoriteCount >= trophy.requirementValue;
        break;
      case 'streak_days':
        isMet = streakDays >= trophy.requirementValue;
        break;
      case 'vip_status':
        isMet = isVip;
        break;
    }

    if (isMet) {
      newUnlocks.push(trophy);
      updatedRecords.push({
        id: trophy.id,
        unlockedAt: new Date().toISOString(),
      });
      unlockedIds.add(trophy.id);
    }
  });

  if (newUnlocks.length > 0) {
    saveUnlockedTrophyRecords(updatedRecords, uname);

    // Sync back to stored user object if authenticated
    if (uname !== 'guest') {
      const users = getStoredUsers();
      if (users[uname]) {
        users[uname].unlockedTrophyIds = Array.from(unlockedIds);
        saveUsers(users);
      }
      if (sessionUser && sessionUser.username.toLowerCase() === uname) {
        const updatedSession: UserAccount = {
          ...sessionUser,
          unlockedTrophyIds: Array.from(unlockedIds),
        };
        setCurrentSessionUser(updatedSession);
      }
    }
  }

  const unlockedTrophies = PENGUIN_TROPHIES.filter((t) => unlockedIds.has(t.id));

  return {
    unlockedTrophies,
    newUnlocks,
    stats,
  };
}

/**
 * Record starting a game session.
 */
export function recordGameLaunch(username?: string): { stats: UserStats; newUnlocks: PenguinTrophy[] } {
  const stats = getUserStats(username);
  stats.totalGamesPlayed += 1;
  saveUserStats(stats, username);

  const { newUnlocks } = evaluateTrophies(username);
  return { stats, newUnlocks };
}

/**
 * Record active playtime in minutes.
 */
export function addPlaytimeMinutes(minutesToAdd: number, username?: string): { stats: UserStats; newUnlocks: PenguinTrophy[] } {
  const stats = getUserStats(username);
  stats.totalPlaytimeMinutes += minutesToAdd;
  saveUserStats(stats, username);

  const { newUnlocks } = evaluateTrophies(username);
  return { stats, newUnlocks };
}

/**
 * Record favorite count change.
 */
export function recordFavoritesChange(count: number, username?: string): { stats: UserStats; newUnlocks: PenguinTrophy[] } {
  const { stats, newUnlocks } = evaluateTrophies(username, count);
  return { stats, newUnlocks };
}
