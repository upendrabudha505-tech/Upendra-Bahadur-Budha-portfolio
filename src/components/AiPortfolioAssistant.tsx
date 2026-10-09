import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../data/portfolioData';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  mode?: 'ai' | 'demo';
}

interface AiPortfolioAssistantProps {
  isDark: boolean;
}

const QUICK_PROMPTS = [
  'Who is Upendra?',
  'What are his skills?',
  'Tell me about his projects',
  'GitHub & social links',
  'How can I contact him?',
];

export const AiPortfolioAssistant: React.FC<AiPortfolioAssistantProps> = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'ai' | 'demo'>('demo');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hi! I’m Upendra Bahadur Budha’s Portfolio Assistant. Ask me anything about his BSc IT (Cloud Computing) studies at LBEF College, skills, academic projects, GitHub (@${SOCIAL_LINKS.githubUsername}), or contact details!`,
      mode: 'demo',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        const mode: 'ai' | 'demo' = data.mode === 'ai' ? 'ai' : 'demo';
        setAssistantMode(mode);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text:
              data.reply ||
              `Upendra Bahadur Budha is a BSc IT student specializing in Cloud Computing at LBEF College, Nepal. You can reach him at ${PERSONAL_INFO.email} or ${PERSONAL_INFO.phone}.`,
            mode,
          },
        ]);
      } else {
        throw new Error('Fallback to local demo');
      }
    } catch {
      setAssistantMode('demo');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: getClientDemoReply(trimmed),
          mode: 'demo',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Portfolio Assistant"
            className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-blue-950/40 hover:bg-blue-500 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Portfolio Assistant</span>
          </button>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Portfolio Assistant"
          className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[540px] ${
            isDark
              ? 'bg-[#0A0F1D] border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3.5 border-b flex items-center justify-between gap-2 ${
              isDark ? 'bg-[#0E1528] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-display font-bold truncate">
                  Portfolio Assistant
                </div>
                <div className="text-[11px] font-mono text-blue-400">
                  {assistantMode === 'ai' ? 'Live Gemini AI · Connected' : 'Demo Mode · Instant Q&A'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Portfolio Assistant"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[320px] text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-slate-800 text-blue-400'
                      : 'bg-slate-200 text-blue-700'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>
                <div
                  className={`rounded-xl px-3.5 py-2.5 max-w-[82%] leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs font-mono text-slate-400 pl-8">Thinking...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggested Questions */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto ${
              isDark ? 'border-slate-800/80 bg-[#080C17]' : 'border-slate-100 bg-slate-50/70'
            }`}
          >
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-blue-500/50'
                    : 'border-slate-200 bg-white text-slate-700 hover:text-blue-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className={`p-3 border-t flex items-center gap-2 ${
              isDark ? 'border-slate-800 bg-[#0A0F1D]' : 'border-slate-200 bg-white'
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects, GitHub..."
              className={`flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send question"
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

function getClientDemoReply(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('skill') || q.includes('tech') || q.includes('cloud') || q.includes('cisco')) {
    return 'Upendra’s core skills & study domains include Cloud Computing (BSc IT specialization), Cisco Networking, Cybersecurity fundamentals, Web Development (HTML5, CSS3, JavaScript), Video Editing, and Content Creation.';
  }
  if (q.includes('project') || q.includes('work') || q.includes('nepal invest') || q.includes('robot')) {
    return 'Upendra’s academic projects & concepts include:\n1. Nepal Invest (Investment & IPO concept)\n2. Clothing Marketplace (E-commerce concept)\n3. Smart Home (Automation & IoT concept)\n4. Emergency Response Robot (Robotics telemetry concept)\n5. Student Event Website (Web development coursework).';
  }
  if (q.includes('github') || q.includes('social') || q.includes('instagram') || q.includes('linkedin')) {
    return `Official Profiles:\n• GitHub: ${SOCIAL_LINKS.githubUrl}\n• LinkedIn: ${SOCIAL_LINKS.linkedinUrl}\n• Instagram: ${SOCIAL_LINKS.instagramUrl}\n• Credly: ${SOCIAL_LINKS.credlyUrl}`;
  }
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
    return `You can contact Upendra Bahadur Budha directly via:\n• Email: ${PERSONAL_INFO.email}\n• Phone: ${PERSONAL_INFO.phone}\n• Or use the Contact Me form on this website.`;
  }
  return `Upendra Bahadur Budha is a BSc IT student specializing in Cloud Computing at LBEF College, Nepal, aspiring to become an IT professional and entrepreneur. Ask me about his skills, academic projects, GitHub (${SOCIAL_LINKS.githubDisplay}), or contact info!`;
}
