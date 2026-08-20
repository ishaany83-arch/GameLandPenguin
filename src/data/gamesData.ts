import { Game, GameFeedback } from '../types';
import rawGames from './games.json';
import { getBuiltInGameHtml } from './gameTemplates';
import { awardGamePoints, getUserPoints, setUserPointsBalance, grantAdminPointsToUser } from '../utils/auth';

const FAVORITES_KEY = 'unblocked_favorites_v1';
const RECENT_KEY = 'unblocked_recent_v1';
const PLAY_COUNTS_KEY = 'unblocked_play_counts_v1';
const CUSTOM_GAMES_KEY = 'gameland_custom_games_v1';
const HIDDEN_GAMES_KEY = 'gameland_hidden_games_v1';
const ANNOUNCEMENT_KEY = 'gameland_announcement_v1';
const GAME_OVERRIDES_KEY = 'gameland_game_overrides_v1';
const AUDIT_LOGS_KEY = 'gameland_audit_logs_v1';
const SITE_CONFIG_KEY = 'gameland_site_config_v1';
const SUGGESTIONS_KEY = 'gameland_game_suggestions_v1';
const CONTACT_KEY = 'gameland_contact_submissions_v1';
const FEEDBACK_KEY = 'gameland_game_feedback_v1';

export type { GameFeedback };

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  category: 'games' | 'users' | 'system' | 'broadcast';
}

export interface SiteConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  siteTitle: string;
  siteTagline: string;
  snowIntensity: 'off' | 'gentle' | 'blizzard';
}

export interface GameSuggestion {
  id: string;
  gameTitle: string;
  category: string;
  description: string;
  webUrl?: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

export function getGameOverrides(): Record<string, Partial<Game>> {
  try {
    const raw = localStorage.getItem(GAME_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveGameOverrides(overrides: Record<string, Partial<Game>>): void {
  try {
    localStorage.setItem(GAME_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save game overrides', e);
  }
}

export function toggleGameFlag(id: string, flag: 'isPopular' | 'isNew' | 'isFeatured'): boolean {
  const overrides = getGameOverrides();
  const current = overrides[id] || {};

  // Check baseline game default
  const all = getAllGames(true);
  const baseline = all.find((g) => g.id === id);
  const currentVal = current[flag] !== undefined ? current[flag] : (baseline ? Boolean((baseline as any)[flag]) : false);
  const newVal = !currentVal;

  overrides[id] = {
    ...current,
    [flag]: newVal,
  };
  saveGameOverrides(overrides);
  addAuditLog(`Toggled badge "${flag}" for ${baseline ? baseline.title : id}`, `New value: ${newVal}`, 'games');
  return newVal;
}

export function updateGameDetails(id: string, updates: Partial<Game>): void {
  // If custom game, update custom list directly
  const customList = getCustomGames();
  const customIndex = customList.findIndex((g) => g.id === id);
  if (customIndex >= 0) {
    customList[customIndex] = { ...customList[customIndex], ...updates };
    saveCustomGames(customList);
  } else {
    // For built-in games, save in overrides
    const overrides = getGameOverrides();
    overrides[id] = { ...(overrides[id] || {}), ...updates };
    saveGameOverrides(overrides);
  }
  addAuditLog(`Updated details for game ID ${id}`, JSON.stringify(updates), 'games');
}

export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addAuditLog(
  action: string,
  details: string,
  category: 'games' | 'users' | 'system' | 'broadcast' = 'system'
): void {
  try {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      category,
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error('Failed to write audit log', e);
  }
}

export function clearAuditLogs(): void {
  try {
    localStorage.removeItem(AUDIT_LOGS_KEY);
  } catch (e) {
    console.error('Failed to clear audit logs', e);
  }
}

export function getSiteConfig(): SiteConfig {
  const defaultConfig: SiteConfig = {
    maintenanceMode: false,
    maintenanceMessage: 'GameLand is currently undergoing scheduled arctic maintenance. Please check back soon!',
    siteTitle: 'GameLand Arcade',
    siteTagline: 'Unblocked Browser Gaming Portal',
    snowIntensity: 'gentle',
  };
  try {
    const raw = localStorage.getItem(SITE_CONFIG_KEY);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function saveSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(updated));
    addAuditLog('Updated Site System Configuration', JSON.stringify(config), 'system');
  } catch (e) {
    console.error('Failed to save site config', e);
  }
  return updated;
}

export function getGameSuggestions(): GameSuggestion[] {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY);
    if (raw) return JSON.parse(raw);
    
    // Seed initial mock suggestions for demo/testing
    const initialSuggestions: GameSuggestion[] = [
      {
        id: 'sugg-1',
        gameTitle: 'Slope 3D Rush',
        category: 'Racing',
        description: '3D ball rolling down infinite neon obstacle ramps.',
        webUrl: 'https://y8.com/games/slope',
        submittedBy: 'arctic_gamer99',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'pending',
      },
      {
        id: 'sugg-2',
        gameTitle: 'Subway Surfers HTML5',
        category: 'Action',
        description: 'Endless runner train dodge game with high score leaderboard.',
        webUrl: 'https://poki.com/en/g/subway-surfers',
        submittedBy: 'ice_skater',
        submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'pending',
      },
    ];
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(initialSuggestions));
    return initialSuggestions;
  } catch {
    return [];
  }
}

export function addGameSuggestion(
  suggestion: Omit<GameSuggestion, 'id' | 'submittedAt' | 'status'>
): GameSuggestion {
  const suggestions = getGameSuggestions();
  const newSuggestion: GameSuggestion = {
    ...suggestion,
    id: `sugg-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  suggestions.unshift(newSuggestion);
  try {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
  } catch (e) {
    console.error('Failed to save game suggestion', e);
  }
  return newSuggestion;
}

export function updateSuggestionStatus(id: string, status: 'pending' | 'approved' | 'dismissed'): void {
  const suggestions = getGameSuggestions();
  const item = suggestions.find((s) => s.id === id);
  if (item) {
    item.status = status;
    try {
      localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
      addAuditLog(`Updated suggestion "${item.gameTitle}" status to ${status}`, `ID: ${id}`, 'games');
    } catch (e) {
      console.error('Failed to update suggestion status', e);
    }
  }
}

export function deleteGameSuggestion(id: string): void {
  const suggestions = getGameSuggestions().filter((s) => s.id !== id);
  try {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
  } catch (e) {
    console.error('Failed to delete game suggestion', e);
  }
}

export function getContactSubmissions(): ContactSubmission[] {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (raw) return JSON.parse(raw);

    const initialContacts: ContactSubmission[] = [
      {
        id: 'contact-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        subject: 'Game Request & Speedrun Feedback',
        message: 'Hey Ishaan! Loved the site. Can you add more retro arcade games like Galaga or Space Invaders?',
        submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: 'unread',
      },
      {
        id: 'contact-2',
        name: 'Sophia Chen',
        email: 'sophia.c@example.com',
        subject: 'Partnership & Unblocked Proxies Inquiry',
        message: 'Hi Pebbles Admin! Great work on GameLand. Just wanted to ask if you plan to launch more proxy mirrors for school devices.',
        submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        status: 'unread',
      },
    ];
    localStorage.setItem(CONTACT_KEY, JSON.stringify(initialContacts));
    return initialContacts;
  } catch {
    return [];
  }
}

export function addContactSubmission(
  submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>
): ContactSubmission {
  const contacts = getContactSubmissions();
  const newSubmission: ContactSubmission = {
    ...submission,
    id: `contact-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'unread',
  };
  contacts.unshift(newSubmission);
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(contacts));
    addAuditLog(`Received new contact submission from ${submission.name} (${submission.email})`, submission.subject, 'system');
  } catch (e) {
    console.error('Failed to save contact submission', e);
  }
  return newSubmission;
}

export function updateContactSubmissionStatus(
  id: string,
  status: 'unread' | 'read' | 'replied' | 'archived'
): void {
  const contacts = getContactSubmissions();
  const item = contacts.find((c) => c.id === id);
  if (item) {
    item.status = status;
    try {
      localStorage.setItem(CONTACT_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.error('Failed to update contact submission status', e);
    }
  }
}

export function deleteContactSubmission(id: string): void {
  const contacts = getContactSubmissions().filter((c) => c.id !== id);
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to delete contact submission', e);
  }
}

export function getGameFeedbackList(): GameFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (raw) return JSON.parse(raw);

    const sampleFeedback: GameFeedback[] = [
      {
        id: 'fb-sample-1',
        gameId: '2048',
        gameTitle: '2048 Arctic Edition',
        username: 'GlacierGamer',
        feedbackType: 'suggestion',
        rating: 5,
        comment: 'Loved the smooth ice-sliding animations! Could you add an undo button or time trial mode?',
        upfrontPoints: 5,
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'fb-sample-2',
        gameId: 'flappy-bird',
        gameTitle: 'Flappy Penguin',
        username: 'ArcticRacer',
        feedbackType: 'bug',
        rating: 4,
        comment: 'The glacier spike hitbox is slightly wider on smaller phone screens. Fun game overall!',
        upfrontPoints: 5,
        adminBonusPoints: 15,
        status: 'bonus_awarded',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        processedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        adminNotes: 'Great bug report! Granted +15 PTS bonus.',
      },
    ];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(sampleFeedback));
    return sampleFeedback;
  } catch {
    return [];
  }
}

export function addGameFeedback(
  data: Partial<GameFeedback> & { gameId: string; gameTitle: string },
  upfrontAmount: number = 0
): { feedback: GameFeedback; upfrontAwarded: number; instantPointsAwarded: number } {
  const list = getGameFeedbackList();

  const userKey = data.submittedBy || data.username || 'Guest';
  // DO NOT grant points before processing! Points are granted upon admin processing.

  const commentText = data.message || data.comment || 'Feedback submitted.';

  const newFeedback: GameFeedback = {
    ...data,
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    gameId: data.gameId,
    gameTitle: data.gameTitle,
    username: userKey,
    submittedBy: userKey,
    comment: commentText,
    message: commentText,
    rating: data.rating || 5,
    category: data.category || 'general',
    feedbackType: data.feedbackType || data.category || 'general',
    upfrontPoints: 0,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  list.unshift(newFeedback);
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
    addAuditLog(
      `User "${userKey}" submitted feedback on "${data.gameTitle}"`,
      `Feedback pending admin review. Comment: ${commentText.substring(0, 80)}`,
      'games'
    );
  } catch (e) {
    console.error('Failed to save game feedback', e);
  }

  return { feedback: newFeedback, upfrontAwarded: 0, instantPointsAwarded: 0 };
}

export function adminProcessFeedback(
  id: string,
  bonusPoints: number = 0,
  adminNotes?: string,
  newStatus: 'processed' | 'bonus_awarded' = 'bonus_awarded'
): { success: boolean; bonusGranted: number } {
  const list = getGameFeedbackList();
  const target = list.find((f) => f.id === id);
  if (!target) return { success: false, bonusGranted: 0 };

  let granted = 0;
  if (bonusPoints > 0) {
    granted = bonusPoints;
    if (target.username && target.username.toLowerCase() !== 'guest') {
      const current = getUserPoints({ username: target.username } as any);
      setUserPointsBalance(target.username, current + bonusPoints);
    } else {
      try {
        const guestPts = parseInt(localStorage.getItem('PEBBLES_GUEST_POINTS') || '10', 10);
        localStorage.setItem('PEBBLES_GUEST_POINTS', (guestPts + bonusPoints).toString());
      } catch (e) {
        console.error(e);
      }
    }
  }

  target.status = bonusPoints > 0 ? 'bonus_awarded' : newStatus;
  target.adminBonusPoints = (target.adminBonusPoints || 0) + granted;
  if (adminNotes) {
    target.adminNotes = adminNotes;
  }
  target.processedAt = new Date().toISOString();

  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
    addAuditLog(
      `Admin processed feedback for "${target.gameTitle}" by ${target.username}`,
      `Bonus PTS: +${granted}, Status: ${target.status}`,
      'games'
    );
  } catch (e) {
    console.error('Failed to save updated feedback', e);
  }

  return { success: true, bonusGranted: granted };
}

export const getGameFeedbacks = getGameFeedbackList;
export const updateGameFeedbackStatus = adminProcessFeedback;

export function deleteGameFeedback(id: string): void {
  const list = getGameFeedbackList().filter((f) => f.id !== id);
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete game feedback', e);
  }
}

export function getCustomGames(): Game[] {
  try {
    const raw = localStorage.getItem(CUSTOM_GAMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomGames(games: Game[]): void {
  try {
    localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(games));
  } catch (e) {
    console.error('Failed to save custom games', e);
  }
}

export function getHiddenGameIds(): string[] {
  try {
    const raw = localStorage.getItem(HIDDEN_GAMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setHiddenGameIds(ids: string[]): void {
  try {
    localStorage.setItem(HIDDEN_GAMES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save hidden game ids', e);
  }
}

export function getStoredPlayCounts(): Record<string, number> {
  try {
    const data = localStorage.getItem(PLAY_COUNTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setGamePlayCount(id: string, count: number): void {
  try {
    const stored = getStoredPlayCounts();
    stored[id] = Math.max(0, count);
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(stored));
  } catch (e) {
    console.error('Failed to update game play count', e);
  }
}

export function resetAllPlayCounts(): void {
  try {
    const all = [...(rawGames as Game[]), ...getCustomGames()];
    const resetObj: Record<string, number> = {};
    all.forEach((g) => {
      resetObj[g.id] = 0;
    });
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(resetObj));
  } catch (e) {
    console.error('Failed to reset play counts', e);
  }
}

export function incrementPlayCount(id: string): number {
  try {
    const stored = getStoredPlayCounts();
    const all = [...(rawGames as Game[]), ...getCustomGames()];
    const gamesMap = all.reduce((acc, g) => {
      acc[g.id] = g.playCount || 0;
      return acc;
    }, {} as Record<string, number>);

    const currentCount = stored[id] !== undefined ? stored[id] : (gamesMap[id] || 0);
    const newCount = currentCount + 1;
    stored[id] = newCount;
    localStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(stored));
    return newCount;
  } catch {
    return 1;
  }
}

export function formatPlayCount(count: number): string {
  if (!count || count <= 0) return '0 plays';
  if (count === 1) return '1 play';
  if (count < 1000) return `${count.toLocaleString()} plays`;
  if (count < 1000000) {
    const formatted = (count / 1000).toLocaleString(undefined, {
      maximumFractionDigits: count % 1000 === 0 ? 0 : 1,
    });
    return `${formatted}k plays`;
  }
  const formatted = (count / 1000000).toLocaleString(undefined, {
    maximumFractionDigits: count % 1000000 === 0 ? 0 : 2,
  });
  return `${formatted}M plays`;
}

const BUILTIN_GAMES: Game[] = [
  {
    id: '2048',
    title: '2048 Arctic Edition',
    slug: '2048',
    category: 'Puzzle',
    description: 'Join tiles to reach the legendary 2048 tile in this icy puzzle challenge!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['puzzle', 'math', '2048', 'popular'],
    rating: 4.8,
    playCount: 14200,
    controls: [{ key: 'Arrow Keys / WASD', action: 'Slide Tiles' }],
    author: 'Gabriele Cirulli / Igloo Edition',
    isPopular: true,
    isNew: false,
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Penguin',
    slug: 'flappy-bird',
    category: 'Arcade',
    description: 'Flap through ice pipes and reach high scores without crashing into the glaciers!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['arcade', 'flappy', 'penguin', 'skill'],
    rating: 4.7,
    playCount: 18900,
    controls: [{ key: 'Space / Click', action: 'Flap Wings' }],
    author: 'Pebbles Studio',
    isPopular: true,
    isNew: true,
  },
  {
    id: 'snake',
    title: 'Retro Ice Snake',
    slug: 'snake',
    category: 'Retro',
    description: 'Classic arcade snake game with arctic fish food pickups and power-ups.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['retro', 'snake', 'arcade', 'classic'],
    rating: 4.6,
    playCount: 12100,
    controls: [{ key: 'Arrow Keys', action: 'Steer Snake' }],
    author: 'Arcade Classics',
    isNew: false,
  },
  {
    id: 'tetris',
    title: 'Tetris Glacier Rush',
    slug: 'tetris',
    category: 'Puzzle',
    description: 'Stack falling ice polyominos, complete full lines, and clean up the grid!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['tetris', 'puzzle', 'classic', 'blocks'],
    rating: 4.9,
    playCount: 22400,
    controls: [
      { key: 'Left / Right', action: 'Move Block' },
      { key: 'Up Arrow', action: 'Rotate' },
      { key: 'Down Arrow', action: 'Soft Drop' },
      { key: 'Space', action: 'Hard Drop' },
    ],
    author: 'Alexey Pajitnov / Igloo',
    isPopular: true,
    isNew: true,
  },
  {
    id: 'pacman',
    title: 'Pac-Penguin Arcade',
    slug: 'pacman',
    category: 'Retro',
    description: 'Chomp all ice dots while dodging Yeti ghosts in the icy maze!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['retro', 'pacman', 'arcade', 'maze'],
    rating: 4.8,
    playCount: 16800,
    controls: [{ key: 'Arrow Keys', action: 'Navigate Maze' }],
    author: 'Namco / Igloo Edition',
    isPopular: true,
    isNew: false,
  },
  {
    id: 'cookie-clicker',
    title: 'Fish Clicker Tycoon',
    slug: 'cookie-clicker',
    category: 'Strategy',
    description: 'Click the mega fish, hire penguins, build fish farms, and automate your empire!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&q=80&w=600',
    embedUrl: 'about:blank',
    embedType: 'srcDoc',
    tags: ['clicker', 'tycoon', 'idle', 'strategy'],
    rating: 4.7,
    playCount: 31000,
    controls: [{ key: 'Left Click', action: 'Catch Fish & Buy Upgrades' }],
    author: 'Pebbles Idle Games',
    isPopular: true,
    isNew: true,
  },
];

export function getAllGames(includeHidden = false): Game[] {
  const storedCounts = getStoredPlayCounts();
  const hiddenIds = getHiddenGameIds();
  const customGames = getCustomGames();
  const overrides = getGameOverrides();

  const baseGames = Array.isArray(rawGames) && rawGames.length > 0 ? (rawGames as Game[]) : BUILTIN_GAMES;
  const combined = [...baseGames, ...customGames];

  return combined
    .filter((g) => includeHidden || !hiddenIds.includes(g.id))
    .map((g) => {
      const playCount = storedCounts[g.id] !== undefined ? storedCounts[g.id] : g.playCount;
      const gameOverride = overrides[g.id] || {};
      const baseGame = { ...g, ...gameOverride, playCount };
      if (baseGame.embedType === 'srcDoc' || baseGame.embedUrl === 'about:blank') {
        return {
          ...baseGame,
          embedType: 'srcDoc' as const,
          srcDocContent: baseGame.srcDocContent || getBuiltInGameHtml(baseGame.slug) || getBuiltInGameHtml(baseGame.id),
        };
      }
      return baseGame;
    });
}

export function addCustomGame(newGame: Omit<Game, 'id' | 'playCount'>): Game {
  const customList = getCustomGames();
  const game: Game = {
    ...newGame,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    playCount: 0,
    isCustom: true,
    isNew: true,
  };
  customList.unshift(game);
  saveCustomGames(customList);
  return game;
}

export function deleteGame(id: string): void {
  // If custom game, remove from custom list
  const customList = getCustomGames().filter((g) => g.id !== id);
  saveCustomGames(customList);

  // Mark as hidden so built-in games disappear too
  const hidden = getHiddenGameIds();
  if (!hidden.includes(id)) {
    setHiddenGameIds([...hidden, id]);
  }
}

export function removeAllGames(): void {
  saveCustomGames([]);
  const all = getAllGames(true);
  const allIds = all.map((g) => g.id);
  setHiddenGameIds(allIds);
}

// Clear hidden games so the new game catalog is visible
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    setHiddenGameIds([]);
  }
} catch (e) {
  console.error('Failed to reset hidden games', e);
}

export function restoreDefaultGames(): void {
  setHiddenGameIds([]);
  saveCustomGames([]);
  saveGameOverrides({});
}

export function toggleHideGame(id: string): boolean {
  const hidden = getHiddenGameIds();
  const isHidden = hidden.includes(id);
  if (isHidden) {
    setHiddenGameIds(hidden.filter((h) => h !== id));
    return false; // Now visible
  } else {
    setHiddenGameIds([...hidden, id]);
    return true; // Now hidden
  }
}

export function getSiteAnnouncement(): { message: string; active: boolean } {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.message && parsed.message.includes('Pebblesthepenguinishaany83')) {
        localStorage.removeItem(ANNOUNCEMENT_KEY);
        return { message: '', active: false };
      }
      return parsed;
    }
    return { message: '', active: false };
  } catch {
    return { message: '', active: false };
  }
}

export function setSiteAnnouncement(message: string, active: boolean): void {
  try {
    localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify({ message, active }));
  } catch (e) {
    console.error('Failed to set announcement', e);
  }
}


export function getFavoriteIds(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(id: string): string[] {
  const current = getFavoriteIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function getRecentlyPlayedIds(): string[] {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentlyPlayedId(id: string): void {
  const current = getRecentlyPlayedIds().filter((item) => item !== id);
  const updated = [id, ...current].slice(0, 10);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}
