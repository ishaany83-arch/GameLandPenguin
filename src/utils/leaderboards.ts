export interface HighScoreEntry {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  date: string;
  avatar?: string;
  isVip?: boolean;
  vipLevel?: string;
}

const LEADERBOARDS_KEY = 'gameland_high_scores_db_v1';

// Seed default player profiles for baseline zero starting scores
const DEFAULT_PLAYERS = [
  { name: 'Pebbles The Penguin 🐧', avatar: '🐧', isVip: true, vipLevel: 'Platinum' },
  { name: 'FrostyGamer99 🧊', avatar: '❄️', isVip: true, vipLevel: 'Gold' },
  { name: 'GlacierPro_X 🏔️', avatar: '⚡', isVip: false, vipLevel: undefined },
  { name: 'SubZeroNinja 🥷', avatar: '🎯', isVip: true, vipLevel: 'Diamond' },
  { name: 'ArcticAce 🌌', avatar: '👑', isVip: false, vipLevel: undefined },
  { name: 'SnowDriftKing 🚀', avatar: '🔥', isVip: false, vipLevel: undefined },
];

// Helper to generate seed scores with 0 baseline scores
function generateZeroSeedScores(gameId: string): HighScoreEntry[] {
  const now = new Date();

  return DEFAULT_PLAYERS.map((p, index) => {
    const timeAgoMs = (index + 1) * 3600000 * 4;
    const dateStr = new Date(now.getTime() - timeAgoMs).toISOString();

    return {
      id: `seed-${gameId}-${index}`,
      gameId,
      playerName: p.name,
      score: 0, // Reset default baseline to zero
      date: dateStr,
      avatar: p.avatar,
      isVip: p.isVip,
      vipLevel: p.vipLevel,
    };
  });
}

// Get all stored leaderboards dictionary
export function getStoredLeaderboards(): Record<string, HighScoreEntry[]> {
  try {
    const raw = localStorage.getItem(LEADERBOARDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse leaderboards from localStorage', e);
    return {};
  }
}

// Save all leaderboards dictionary
export function saveLeaderboards(data: Record<string, HighScoreEntry[]>): void {
  try {
    localStorage.setItem(LEADERBOARDS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save leaderboards to localStorage', e);
  }
}

/**
 * Retrieves the high score list for a specific game.
 * Initializes with zero scores if no data exists.
 */
export function getGameLeaderboard(gameId: string): HighScoreEntry[] {
  const allLeaderboards = getStoredLeaderboards();
  if (!allLeaderboards[gameId] || allLeaderboards[gameId].length === 0) {
    const seed = generateZeroSeedScores(gameId);
    allLeaderboards[gameId] = seed;
    saveLeaderboards(allLeaderboards);
    return seed;
  }
  // Sort descending by score, then date
  return [...allLeaderboards[gameId]].sort((a, b) => b.score - a.score);
}

/**
 * Submits a new high score for a game.
 */
export function submitHighScore(
  gameId: string,
  playerName: string,
  score: number,
  userDetails?: { avatar?: string; isVip?: boolean; vipLevel?: string }
): { updatedList: HighScoreEntry[]; newRank: number; entry: HighScoreEntry } {
  const currentList = getGameLeaderboard(gameId);

  const cleanName = playerName.trim() || 'Anonymous Player';
  const newEntry: HighScoreEntry = {
    id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    gameId,
    playerName: cleanName,
    score: Math.max(0, Math.floor(score)),
    date: new Date().toISOString(),
    avatar: userDetails?.avatar || '🎮',
    isVip: userDetails?.isVip,
    vipLevel: userDetails?.vipLevel,
  };

  const updatedList = [...currentList, newEntry].sort((a, b) => b.score - a.score);

  // Find rank (1-indexed)
  const newRank = updatedList.findIndex((item) => item.id === newEntry.id) + 1;

  // Save updated list
  const allLeaderboards = getStoredLeaderboards();
  allLeaderboards[gameId] = updatedList;
  saveLeaderboards(allLeaderboards);

  return {
    updatedList,
    newRank,
    entry: newEntry,
  };
}

/**
 * Get personal best for a player in a game
 */
export function getUserPersonalBest(gameId: string, playerName: string): HighScoreEntry | null {
  if (!playerName) return null;
  const list = getGameLeaderboard(gameId);
  const userScores = list.filter(
    (e) => e.playerName.toLowerCase() === playerName.toLowerCase()
  );
  if (userScores.length === 0) return null;
  return userScores.reduce((prev, curr) => (curr.score > prev.score ? curr : prev));
}

/**
 * Reset leaderboard for a specific game back to 0 scores
 */
export function resetGameLeaderboardToZero(gameId: string): HighScoreEntry[] {
  const seed = generateZeroSeedScores(gameId);
  const allLeaderboards = getStoredLeaderboards();
  allLeaderboards[gameId] = seed;
  saveLeaderboards(allLeaderboards);
  return seed;
}

/**
 * Reset ALL leaderboards across ALL games to 0 scores
 */
export function resetAllLeaderboardsToZero(): Record<string, HighScoreEntry[]> {
  const allLeaderboards = getStoredLeaderboards();
  const resetMap: Record<string, HighScoreEntry[]> = {};

  Object.keys(allLeaderboards).forEach((gameId) => {
    resetMap[gameId] = generateZeroSeedScores(gameId);
  });

  saveLeaderboards(resetMap);
  return resetMap;
}

/**
 * Delete a specific high score entry by entry ID
 */
export function deleteHighScoreEntry(gameId: string, entryId: string): HighScoreEntry[] {
  const allLeaderboards = getStoredLeaderboards();
  if (allLeaderboards[gameId]) {
    allLeaderboards[gameId] = allLeaderboards[gameId].filter((entry) => entry.id !== entryId);
    saveLeaderboards(allLeaderboards);
    return allLeaderboards[gameId];
  }
  return [];
}
