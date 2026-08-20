import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Key, ExternalLink, Eye, CheckCircle2, RefreshCw, Layers, Sparkles, Globe } from 'lucide-react';
import {
  PanicSettings,
  getPanicSettings,
  savePanicSettings,
  triggerPanicRedirect,
  DEFAULT_PANIC_SETTINGS,
} from '../utils/panicSettings';

interface PanicKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerDisguise: () => void;
}

export const PanicKeyModal: React.FC<PanicKeyModalProps> = ({
  isOpen,
  onClose,
  onTriggerDisguise,
}) => {
  const [settings, setSettings] = useState<PanicSettings>(DEFAULT_PANIC_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isCapturingKey, setIsCapturingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getPanicSettings());
    }
  }, [isOpen]);

  // Keypress recorder listener
  useEffect(() => {
    if (!isCapturingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keyName = e.key;
      const display = keyName === '`' ? '` (Tilde / Backquote ~)' : keyName === ' ' ? 'Spacebar' : keyName;

      setSettings((prev) => ({
        ...prev,
        panicKey: keyName,
        panicKeyDisplay: display,
      }));
      setIsCapturingKey(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isCapturingKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePanicSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestPanic = () => {
    if (settings.mode === 'disguise') {
      onClose();
      onTriggerDisguise();
    } else {
      triggerPanicRedirect(settings.redirectUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        id="panic-key-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-rose-500/20 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>Emergency Panic Key & Disguise System</span>
              </h2>
              <p className="text-xs text-slate-400">
                Instantly redirect or hide GameLand when a supervisor walks by
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            id="close-panic-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Master Enable Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Enable Global Panic Shortcut</span>
              <span className="text-[11px] text-slate-400 block">
                Pressing your Panic Key anywhere on GameLand will trigger your emergency response immediately.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Panic Key Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Panic Shortcut Key</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Active Key:</span>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-mono text-cyan-300 text-xs font-bold">
                  {settings.panicKeyDisplay || settings.panicKey}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCapturingKey(true)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isCapturingKey
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {isCapturingKey ? 'Press Any Key Now...' : 'Record Keypress'}
              </button>
            </div>
          </div>

          {/* Panic Response Mode Choice */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Panic Emergency Action</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'redirect' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  settings.mode === 'redirect'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Emergency Redirect</span>
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Instantly replaces tab URL with Google Classroom, Canvas, or Drive.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'disguise' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  settings.mode === 'disguise'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Instant Disguise Screen</span>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Overlays a realistic Google Docs essay view instantly on screen.
                </p>
              </button>
            </div>
          </div>

          {/* Redirect Destination URL */}
          {settings.mode === 'redirect' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                Redirect Destination URL
              </label>

              <input
                type="url"
                required
                value={settings.redirectUrl}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                placeholder="https://classroom.google.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          {/* Tab & Favicon Masking */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Browser Tab Disguise (Title & Favicon)</span>
            </label>

            <select
              value={settings.tabMask}
              onChange={(e) =>
                setSettings({ ...settings, tabMask: e.target.value as PanicSettings['tabMask'] })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="none">GameLand 🐧 Default Title</option>
              <option value="drive">My Drive - Google Drive</option>
              <option value="classroom">Classes - Google Classroom</option>
              <option value="canvas">Dashboard - Canvas LMS</option>
              <option value="wikipedia">Wikipedia, the free encyclopedia</option>
            </select>
          </div>

          {/* Test & Save Actions */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestPanic}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>TEST PANIC MODE NOW</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-md"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Panic Settings</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
