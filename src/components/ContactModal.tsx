import React, { useState } from 'react';
import { X, Mail, User, Send, Check, Copy, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { addContactSubmission } from '../data/gamesData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSuggestForm?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onOpenSuggestForm }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const contactEmail = 'ishaany83@gmail.com';
  const contactName = 'Ishaan Yadav';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Save to local storage for admin contact sheet view
    addContactSubmission({
      name: 'Gamer Visitor',
      email: contactEmail,
      subject: subject || 'GameLand Inquiry',
      message: message,
    });

    // Create mailto link for seamless direct sending
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject || 'GameLand Inquiry')}&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, '_blank');

    setSentStatus('Message sent & logged into admin contact sheet!');
    setTimeout(() => {
      setSentStatus(null);
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        id="contact-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Contact Us</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  Direct Line
                </span>
              </h2>
              <p className="text-xs text-slate-400">Get in touch with the creator of GameLand.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            id="close-contact-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-slate-950/70 p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300 custom-scrollbar">
          
          {/* Main Contact Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-cyan-500/20 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-cyan-400" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Developer</span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{contactName}</h3>
                <p className="text-xs text-cyan-400 font-medium">Founder & Operator of GameLand (Pebbles The Penguin)</p>
              </div>

              {/* Email Copy Box */}
              <div className="w-full sm:w-auto bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-mono font-semibold">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{contactEmail}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1 text-xs font-sans font-bold"
                  title="Copy email to clipboard"
                  id="copy-contact-email-btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Send a Quick Message</span>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Broken Game Report, Feature Idea, Feedback..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50"
                  id="contact-subject-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50 resize-none"
                  id="contact-message-input"
                />
              </div>

              {sentStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{sentStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-xs text-slate-400 hover:text-cyan-400 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Open Email Client directly</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 active:scale-95"
                  id="send-contact-form-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>

          {/* Alternative Suggestion Form CTA */}
          {onOpenSuggestForm && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-amber-300">Looking to request a specific game?</h4>
                <p className="text-[11px] text-slate-400">Use our dedicated Google Form to submit new game suggestions or proxy mirrors.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenSuggestForm();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs transition-colors shrink-0 border border-amber-500/30"
              >
                Game Form
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>GameLand By Pebbles The Penguin</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
