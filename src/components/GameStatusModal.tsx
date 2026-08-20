import React from 'react';
import { X, ExternalLink, Activity, CheckCircle2 } from 'lucide-react';

interface GameStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameStatusModal: React.FC<GameStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sheetDirectUrl = 'https://docs.google.com/spreadsheets/d/1AfWwayth_3uI4aV7kDoMc1NoMfpWPAER3mwqlYO2ybE/edit?resourcekey=&gid=318272127#gid=318272127';
  const sheetEmbedUrl = 'https://docs.google.com/spreadsheets/d/1AfWwayth_3uI4aV7kDoMc1NoMfpWPAER3mwqlYO2ybE/preview?gid=318272127';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        id="game-status-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Game Status Tracker</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Spreadsheet
                </span>
              </h2>
              <p className="text-xs text-slate-400">Track game updates, requested status, working mirrors, and porting progress.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={sheetDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700/60"
              title="Open Google Sheet in a new tab"
            >
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              id="close-status-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Embedded Google Sheet */}
        <div className="flex-1 bg-slate-950 p-1 sm:p-2 overflow-y-auto relative min-h-[500px]">
          <iframe
            src={sheetEmbedUrl}
            className="w-full h-full min-h-[520px] border-0 rounded-xl"
            title="Game Status Spreadsheet"
            loading="lazy"
          >
            Loading Game Status sheet...
          </iframe>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Updated live by Pebbles The Penguin.</span>
          </div>
          <a
            href={sheetDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold flex items-center gap-1 hover:underline"
          >
            <span>Direct Sheet Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
