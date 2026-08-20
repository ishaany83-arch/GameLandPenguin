declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackPageView(pageTitle?: string, pageLocation?: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_location: pageLocation || window.location.href,
    });
  }
}

export function trackGamePlay(gameId: string, gameTitle: string, category: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'play_game', {
      event_category: 'Games',
      event_label: gameTitle,
      game_id: gameId,
      game_category: category,
    });
  }
}

export function trackSearch(searchQuery: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && searchQuery.trim()) {
    window.gtag('event', 'search', {
      search_term: searchQuery,
    });
  }
}

export function trackUserLogin(userType: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'login', {
      method: userType,
    });
  }
}
