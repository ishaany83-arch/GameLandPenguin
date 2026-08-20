import React, { useState } from 'react';
import { X, ExternalLink, Lightbulb, Send, CheckCircle2 } from 'lucide-react';
import { addGameSuggestion } from '../data/gamesData';
import { CategoryType } from '../types';
import { UserAccount } from '../utils/auth';

interface SuggestGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
}

export const SuggestGameModal: React.FC<SuggestGameModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'google'>('quick');
  const [gameTitle, setGameTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Arcade');
  const [description, setDescription] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSckADOjOu15l5UGyyibvjLE08PTtSToGhb70VUyMuHOl11YeQ/viewform?usp=publish-editor';
  const googleFormEmbeddedUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSckADOjOu15l5UGyyibvjLE08PTtSToGhb70VUyMuHOl11YeQ/viewform?embedded=true';

  const handleSubmitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle) return;

    addGameSuggestion({
      gameTitle,
      category,
      description: description || 'No details provided',
      webUrl: webUrl || undefined,
      submittedBy: submittedBy || currentUser?.username || 'Guest Gamer',
    });

    setSubmittedSuccess(true);
    setGameTitle('');
    setDescription('');
    setWebUrl('');
    setSubmittedBy('');

    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        id="suggest-game-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Suggest a Game</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  Community Box
                </span>
              </h2>
              <p className="text-xs text-slate-400">Want a game added to GameLand? Suggest it directly to admin!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            id="close-suggest-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 p-2 px-6 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'quick'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Quick Direct Submission
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'google'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Google Form Mode
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto relative min-h-[380px]">
          {activeTab === 'quick' ? (
            <div className="space-y-4">
              {submittedSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <h3 className="text-base font-extrabold">Suggestion Submitted!</h3>
                  <p className="text-xs text-slate-300">
                    Pebbles The Penguin has received your suggestion and will review it in the Admin Panel shortly!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuick} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Game Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                        placeholder="e.g. Slope 3D / Subway Surfers"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CategoryType)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="Arcade">Arcade</option>
                        <option value="Action">Action</option>
                        <option value="Puzzle">Puzzle</option>
                        <option value="Sports">Sports</option>
                        <option value="Racing">Racing</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Retro">Retro</option>
                        <option value="Proxies">Proxies</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Game URL / Source Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        placeholder="e.g. https://poki.com or https://y8.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Why should we add this game?
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Brief description or features of the game..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        Your Username or Gamer Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={submittedBy}
                        onChange={(e) => setSubmittedBy(e.target.value)}
                        placeholder="e.g. ice_master99"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Suggestion</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="w-full h-full min-h-[450px]">
              <iframe
                src={googleFormEmbeddedUrl}
                className="w-full h-full min-h-[450px] border-0 rounded-xl"
                title="Suggest a Game Form"
                loading="lazy"
              >
                Loading form...
              </iframe>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct suggestions go straight into Pebbles' Admin Review Box.</span>
          </div>
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 font-bold flex items-center gap-1 hover:underline"
          >
            <span>External Google Form</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

