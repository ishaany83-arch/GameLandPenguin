import { CategoryType } from '../types';

export interface UpcomingGame {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  estimatedRelease: string;
  thumbnailUrl: string;
  tags: string[];
  upvotes: number;
  subscribersCount: number;
  status: 'In Development' | 'Testing Beta' | 'Porting HTML5' | 'Community Priority';
  progress: number; // 0 - 100
  developerNotes?: string;
}

const UPVOTED_KEY = 'gameland_upvoted_upcoming_v4';
const SUBSCRIBED_KEY = 'gameland_subscribed_upcoming_v4';
const UPCOMING_COUNTS_KEY = 'gameland_upcoming_counts_v4';
const CUSTOM_UPCOMING_KEY = 'gameland_custom_upcoming_v1';

const INITIAL_UPCOMING_GAMES: UpcomingGame[] = [];

export function getCustomUpcomingGames(): UpcomingGame[] {
  try {
    const raw = localStorage.getItem(CUSTOM_UPCOMING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomUpcomingGames(games: UpcomingGame[]): void {
  try {
    localStorage.setItem(CUSTOM_UPCOMING_KEY, JSON.stringify(games));
  } catch (e) {
    console.error('Failed to save custom upcoming games', e);
  }
}

export function addUpcomingGame(game: Omit<UpcomingGame, 'id' | 'upvotes' | 'subscribersCount'> & { id?: string }): UpcomingGame {
  const custom = getCustomUpcomingGames();
  const newGame: UpcomingGame = {
    ...game,
    id: game.id || `upcoming-${Date.now()}`,
    upvotes: 0,
    subscribersCount: 0,
  };
  custom.push(newGame);
  saveCustomUpcomingGames(custom);
  return newGame;
}

export function deleteUpcomingGame(id: string): void {
  const custom = getCustomUpcomingGames().filter((g) => g.id !== id);
  saveCustomUpcomingGames(custom);
}

export function getAllUpcomingGameList(): UpcomingGame[] {
  const custom = getCustomUpcomingGames();
  return [...INITIAL_UPCOMING_GAMES, ...custom];
}

export function getUpvotedUpcomingIds(): string[] {
  try {
    const raw = localStorage.getItem(UPVOTED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSubscribedUpcomingIds(): string[] {
  try {
    const raw = localStorage.getItem(SUBSCRIBED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUpcomingCounts(): Record<string, { upvotes: number; subscribers: number }> {
  try {
    const raw = localStorage.getItem(UPCOMING_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUpcomingCounts(counts: Record<string, { upvotes: number; subscribers: number }>) {
  try {
    localStorage.setItem(UPCOMING_COUNTS_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error('Failed to save upcoming counts', e);
  }
}

export function getUpcomingGames(): (UpcomingGame & { isUpvoted: boolean; isSubscribed: boolean })[] {
  const upvotedIds = getUpvotedUpcomingIds();
  const subscribedIds = getSubscribedUpcomingIds();
  const customCounts = getUpcomingCounts();
  const allList = getAllUpcomingGameList();

  return allList.map((game) => {
    const overrides = customCounts[game.id] || { upvotes: game.upvotes, subscribers: game.subscribersCount };
    return {
      ...game,
      upvotes: overrides.upvotes,
      subscribersCount: overrides.subscribers,
      isUpvoted: upvotedIds.includes(game.id),
      isSubscribed: subscribedIds.includes(game.id),
    };
  });
}

export function toggleUpvoteUpcoming(id: string): { isUpvoted: boolean; newCount: number } {
  let upvoted = getUpvotedUpcomingIds();
  const counts = getUpcomingCounts();
  const allList = getAllUpcomingGameList();
  const game = allList.find((g) => g.id === id);
  if (!game) return { isUpvoted: false, newCount: 0 };

  const currentCounts = counts[id] || { upvotes: game.upvotes, subscribers: game.subscribersCount };
  let isUpvotedNow = false;

  if (upvoted.includes(id)) {
    upvoted = upvoted.filter((itemId) => itemId !== id);
    currentCounts.upvotes = Math.max(0, currentCounts.upvotes - 1);
    isUpvotedNow = false;
  } else {
    upvoted.push(id);
    currentCounts.upvotes += 1;
    isUpvotedNow = true;
  }

  counts[id] = currentCounts;
  saveUpcomingCounts(counts);

  try {
    localStorage.setItem(UPVOTED_KEY, JSON.stringify(upvoted));
  } catch (e) {
    console.error('Failed to update upvoted upcoming games', e);
  }

  return { isUpvoted: isUpvotedNow, newCount: currentCounts.upvotes };
}

export function toggleSubscribeUpcoming(id: string): { isSubscribed: boolean; newCount: number } {
  let subscribed = getSubscribedUpcomingIds();
  const counts = getUpcomingCounts();
  const allList = getAllUpcomingGameList();
  const game = allList.find((g) => g.id === id);
  if (!game) return { isSubscribed: false, newCount: 0 };

  const currentCounts = counts[id] || { upvotes: game.upvotes, subscribers: game.subscribersCount };
  let isSubscribedNow = false;

  if (subscribed.includes(id)) {
    subscribed = subscribed.filter((itemId) => itemId !== id);
    currentCounts.subscribers = Math.max(0, currentCounts.subscribers - 1);
    isSubscribedNow = false;
  } else {
    subscribed.push(id);
    currentCounts.subscribers += 1;
    isSubscribedNow = true;
  }

  counts[id] = currentCounts;
  saveUpcomingCounts(counts);

  try {
    localStorage.setItem(SUBSCRIBED_KEY, JSON.stringify(subscribed));
  } catch (e) {
    console.error('Failed to update subscribed upcoming games', e);
  }

  return { isSubscribed: isSubscribedNow, newCount: currentCounts.subscribers };
}
