import React, { useState } from 'react';
import {
  X,
  Inbox,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Mail,
  Copy,
} from 'lucide-react';

export interface VisitorMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read?: boolean;
}

interface MessagesInboxModalProps {
  isOpen: boolean;
  isDark: boolean;
  messages: VisitorMessage[];
  isLoading: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const MessagesInboxModal: React.FC<MessagesInboxModalProps> = ({
  isOpen,
  isDark,
  messages,
  isLoading,
  onClose,
  onRefresh,
  onMarkRead,
  onDelete,
  onNotify,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const displayed =
    filter === 'unread' ? messages.filter((m) => !m.read) : messages;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inbox-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-2xl border overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
          isDark
            ? 'bg-[#0B101E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-blue-500" />
            <div>
              <h3 id="inbox-modal-title" className="font-display text-lg font-bold">
                Received Visitor Messages ({messages.length})
              </h3>
              <p className="text-xs text-slate-400">
                Messages submitted via your Contact Me form arrive directly here.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              title="Refresh messages from server"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close Inbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {displayed.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Inbox className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-display text-base font-semibold">
                {filter === 'unread' ? 'No unread messages' : 'No messages received yet'}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When visitors fill out your Contact Me form, their messages are saved to the server
                and appear here automatically.
              </p>
            </div>
          ) : (
            displayed.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl border p-5 space-y-3 transition-colors ${
                  !msg.read
                    ? isDark
                      ? 'bg-blue-950/20 border-blue-800/70'
                      : 'bg-blue-50/60 border-blue-200'
                    : isDark
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {!msg.read && (
                        <span className="text-blue-400 font-semibold">NEW ·</span>
                      )}
                      <span className={isDark ? 'text-slate-200 font-semibold' : 'text-slate-900 font-semibold'}>
                        {msg.fullName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-500">{msg.email}</span>
                    </div>
                    <h4
                      className={`font-display text-base font-bold mt-1 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {msg.subject}
                    </h4>
                  </div>

                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {msg.submittedAt}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {msg.message}
                </p>

                <div className="pt-2 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {!msg.read && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(msg.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-medium cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `Re: ${msg.subject}`
                      )}`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium ${
                        isDark
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `From: ${msg.fullName} (${msg.email})\nSubject: ${msg.subject}\n\n${msg.message}`
                        );
                        onNotify('Message copied to clipboard.');
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium cursor-pointer ${
                        isDark
                          ? 'border-slate-800 text-slate-400 hover:text-white'
                          : 'border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(msg.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-rose-400 hover:bg-rose-950/40 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
