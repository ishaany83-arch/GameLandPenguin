import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Gamepad2,
  Gift,
  Coins,
  Bug,
  Lightbulb,
  Sliders,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { Game } from '../types';
import { UserAccount, getCurrentSessionUser } from '../utils/auth';
import { addGameFeedback, GameFeedback, getAllGames } from '../data/gamesData';

interface GameFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGame?: Game | null;
  allGames?: Game[];
  currentUser?: UserAccount | null;
  onUserUpdated?: (user: UserAccount | null) => void;
  onFeedbackSubmitted?: (feedback: GameFeedback, instantPts: number) => void;
}

export const GameFeedbackModal: React.FC<GameFeedbackModalProps> = ({
  isOpen,
  onClose,
  initialGame,
  allGames,
  currentUser,
  onUserUpdated,
  onFeedbackSubmitted,
}) => {
  const [gamesList, setGamesList] = useState<Game[]>(allGames || []);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'graphics' | 'controls' | 'general'>('general');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{ instantPts: number; totalPts?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setMessage('');
      setRating(5);
      setCategory('general');

      const games = allGames && allGames.length > 0 ? allGames : getAllGames();
      setGamesList(games);

      if (initialGame) {
        setSelectedGameId(initialGame.id);
      } else if (games.length > 0) {
        setSelectedGameId(games[0].id);
      }
    }
  }, [isOpen, initialGame, allGames]);

  if (!isOpen) return null;

  const activeUser = currentUser || getCurrentSessionUser();
  const username = activeUser ? activeUser.username : 'Guest';

  const selectedGame = gamesList.find((g) => g.id === selectedGameId) || initialGame || {
    id: 'general-site',
    title: 'General GameLand Arcade',
  };

  const handleRatingHover = (hoverRating: number) => {
    // Optionally handle hover
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);

    const instantReward = 5; // Instant +5 PTS credited upon submission
    const result = addGameFeedback(
      {
        gameId: selectedGame.id,
        gameTitle: selectedGame.title,
        username: username,
        feedbackType: category as any,
        rating,
        comment: message.trim(),
      },
      instantReward
    );

    // Refresh active session user state if logged in
    const updatedUser = getCurrentSessionUser();
    if (onUserUpdated) {
      onUserUpdated(updatedUser);
    }

    setSuccessData({
      instantPts: result.upfrontAwarded,
      totalPts: updatedUser?.points,
    });

    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(result.feedback, result.upfrontAwarded);
    }

    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold shadow-inner">
              <MessageSquare className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                Submit Game Feedback
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Earn PTS on Review
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Share your thoughts to earn points (+5 to +50 PTS) upon Admin review!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            id="feedback-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successData ? (
            /* Success State */
            <div className="py-8 text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/10 animate-bounce">
                🎉
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-100">
                  Feedback Submitted!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your feedback for <strong className="text-cyan-300">{selectedGame.title}</strong> has been received and sent for Admin review!
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Coins className="w-4 h-4 text-amber-400" /> Reward Status:
                  </span>
                  <span className="font-extrabold text-amber-300">Pending Review</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Points Schedule:
                  </span>
                  <span className="text-cyan-300 font-bold">+5 to +50 PTS Upon Approval</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Our admin team reviews feedback daily and grants point rewards upon processing your submission!
              </p>

              <button
                onClick={onClose}
                className="w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all"
                id="feedback-modal-done-btn"
              >
                Awesome, Got It!
              </button>
            </div>
          ) : (
            /* Feedback Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Review Reward Notice Banner */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-lg shrink-0">
                  🪙
                </div>
                <div className="text-xs text-amber-200/90 leading-tight">
                  <strong className="text-amber-300 block font-bold">Points Granted Upon Admin Processing!</strong>
                  Submit your detailed game review. Admin will award <strong className="text-amber-300">+5 to +50 PTS</strong> to your balance after processing.
                </div>
              </div>

              {/* Game Selection */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Game
                </label>
                <div className="relative">
                  <select
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 font-medium"
                    id="feedback-game-select"
                  >
                    {gamesList.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category selector chips */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'general', label: '⭐ General', icon: Star },
                    { id: 'controls', label: '🎮 Controls', icon: Sliders },
                    { id: 'bug', label: '🐛 Bug Report', icon: Bug },
                    { id: 'suggestion', label: '💡 Suggestion', icon: Lightbulb },
                    { id: 'graphics', label: '🎨 Visuals', icon: Palette },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        category === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-black text-amber-300 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Feedback Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`What did you like about ${selectedGame.title}? Any bugs, controls issue, or improvements?`}
                  rows={4}
                  maxLength={500}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 resize-none font-medium leading-relaxed"
                  id="feedback-message-textarea"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Submitting as: <strong className="text-slate-300">{username}</strong></span>
                  <span>{message.length}/500 chars</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-2"
                id="feedback-submit-btn"
              >
                <Send className="w-4 h-4 text-slate-950" />
                Submit Feedback for Admin Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
