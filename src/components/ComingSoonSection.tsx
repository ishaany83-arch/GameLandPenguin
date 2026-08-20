import React, { useState, useEffect } from 'react';
import {
  Rocket,
  ThumbsUp,
  Bell,
  BellRing,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Tag,
  Check,
  Zap,
  Layers,
  Search
} from 'lucide-react';
import {
  UpcomingGame,
  getUpcomingGames,
  toggleUpvoteUpcoming,
  toggleSubscribeUpcoming
} from '../data/comingSoonData';
import { CategoryType } from '../types';

interface ComingSoonSectionProps {
  onOpenSuggestForm?: () => void;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ onOpenSuggestForm }) => {
  const [games, setGames] = useState<ReturnType<typeof getUpcomingGames>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'votes' | 'progress' | 'soonest'>('votes');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  useEffect(() => {
    refreshGames();
  }, []);

  const refreshGames = () => {
    setGames(getUpcomingGames());
  };

  const handleUpvote = (id: string, title: string) => {
    const res = toggleUpvoteUpcoming(id);
    refreshGames();
    showToast(
      res.isUpvoted
        ? `👍 Upvoted "${title}"! Total votes: ${res.newCount}`
        : `Removed upvote from "${title}".`
    );
  };

  const handleSubscribe = (id: string, title: string) => {
    const res = toggleSubscribeUpcoming(id);
    refreshGames();
    showToast(
      res.isSubscribed
        ? `🔔 Subscribed! You'll be notified when "${title}" launches.`
        : `Unsubscribed from notifications for "${title}".`
    );
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast((current) => (current === msg ? null : current));
    }, 3500);
  };

  const filteredGames = games
    .filter((game) => {
      if (selectedCategory !== 'All' && game.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          game.title.toLowerCase().includes(q) ||
          game.description.toLowerCase().includes(q) ||
          game.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.upvotes - a.upvotes;
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'soonest') return a.estimatedRelease.localeCompare(b.estimatedRelease);
      return 0;
    });

  const categories = ['All', 'Action', 'Arcade', 'Puzzle', 'Racing', 'Strategy', 'Proxies'];

  return (
    <section className="mt-12 pt-8 border-t border-slate-800/80 space-y-6" id="coming-soon-catalog-section">
      
      {/* Toast Notification Banner */}
      {notificationToast && (
        <div className="fixed bottom-20 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide uppercase">
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upcoming Releases & Community Voting</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Coming Soon to GameLand</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vote for upcoming HTML5 ports, games, and web proxy engines in active development.
              Upvote to prioritize release dates or subscribe to get launch notifications!
            </p>
          </div>

          {/* Action to suggest games */}
          {onOpenSuggestForm && (
            <button
              onClick={onOpenSuggestForm}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
              id="coming-soon-suggest-btn"
            >
              <Zap className="w-4 h-4" />
              <span>Suggest An Upcoming Game</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search upcoming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="votes">🔥 Most Upvoted</option>
            <option value="progress">⚡ Highest Progress</option>
            <option value="soonest">📅 Releasing Soonest</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Image Banner & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{game.status}</span>
                  </span>
                </div>

                {/* Estimated Release Tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    {game.estimatedRelease}
                  </span>
                </div>

                {/* Upvotes Badge overlay */}
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950/90 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{game.upvotes} Upvotes</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950/90 text-cyan-300 border border-cyan-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <Bell className="w-3 h-3 text-cyan-400" />
                    <span>{game.subscribersCount} Subscribed</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold shrink-0">
                      {game.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span>Development Progress</span>
                      <span className="text-cyan-400">{game.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${game.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Developer Note */}
                  {game.developerNotes && (
                    <p className="text-[10px] italic text-slate-500 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      💬 Dev Note: {game.developerNotes}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 mt-2">
                  
                  {/* Upvote Button */}
                  <button
                    onClick={() => handleUpvote(game.id, game.title)}
                    className={`py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      game.isUpvoted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${game.isUpvoted ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span>{game.isUpvoted ? 'Upvoted' : 'Upvote'}</span>
                  </button>

                  {/* Subscribe / Notify Button */}
                  <button
                    onClick={() => handleSubscribe(game.id, game.title)}
                    className={`py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      game.isSubscribed
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    {game.isSubscribed ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Notifying</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-slate-400" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-xs">No upcoming games match your search or filter.</p>
        </div>
      )}

    </section>
  );
};
