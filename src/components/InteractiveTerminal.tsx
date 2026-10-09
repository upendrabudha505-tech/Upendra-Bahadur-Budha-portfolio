import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, RotateCcw } from 'lucide-react';
import {
  PERSONAL_INFO,
  SOCIAL_LINKS,
  SKILL_GROUPS,
  AcademicProject,
} from '../data/portfolioData';

interface TerminalHistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
}

interface InteractiveTerminalProps {
  isDark: boolean;
  projects: AcademicProject[];
  headingText?: string;
}

const SUPPORTED_COMMANDS = [
  { cmd: 'help', desc: 'List all available interactive terminal commands' },
  { cmd: 'about', desc: 'Read Upendra Bahadur Budha’s biography & entrepreneurial goals' },
  { cmd: 'skills', desc: 'Display technical & creative learning domains' },
  { cmd: 'projects', desc: 'List academic coursework & project concepts' },
  { cmd: 'education', desc: 'Show BSc IT (Cloud Computing) degree details at LBEF College' },
  { cmd: 'github', desc: 'Show official GitHub profile link (@upendrabudha505-tech)' },
  { cmd: 'socials', desc: 'Display LinkedIn, GitHub, Credly, Instagram & Facebook links' },
  { cmd: 'contact', desc: 'Show direct email & phone contact information' },
  { cmd: 'clear', desc: 'Clear terminal screen history' },
];

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  isDark,
  projects,
  headingText = 'Interactive Developer Terminal',
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([
    {
      id: 'welcome',
      command: 'help',
      output: (
        <div className="space-y-2">
          <p className="text-cyan-400 font-semibold">
            Welcome to Upendra Bahadur Budha’s Portfolio Terminal (v2.6 — Safe Simulated Shell)
          </p>
          <p className="text-slate-300 text-xs">
            Type any command below or click a quick-command button to inspect profile data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-1 text-xs">
            {SUPPORTED_COMMANDS.map((item) => (
              <div key={item.cmd} className="flex items-baseline gap-2">
                <span className="text-blue-400 font-semibold w-20 shrink-0">{item.cmd}</span>
                <span className="text-slate-400">· {item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear' || trimmed === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    let outputNode: React.ReactNode;

    switch (trimmed) {
      case 'help':
        outputNode = (
          <div className="space-y-1.5 text-xs">
            <p className="text-cyan-400 font-semibold">Supported Commands:</p>
            {SUPPORTED_COMMANDS.map((item) => (
              <div key={item.cmd} className="flex items-baseline gap-3">
                <span className="text-blue-400 font-semibold w-20 shrink-0">{item.cmd}</span>
                <span className="text-slate-300">{item.desc}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'about':
      case 'whoami':
        outputNode = (
          <div className="space-y-1.5 text-xs leading-relaxed text-slate-200">
            <p className="text-cyan-400 font-semibold">
              {PERSONAL_INFO.name} — {PERSONAL_INFO.roleTitle}
            </p>
            <p>{PERSONAL_INFO.aboutText}</p>
            <p className="text-slate-400">
              Goal: Becoming a skilled IT professional and innovative technology entrepreneur in
              Nepal.
            </p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-cyan-400 font-semibold">
              Skills & Learning Domains (Truthful Academic Progression):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.id} className="border border-slate-800 rounded-lg p-2.5 bg-slate-900/60">
                  <div className="text-blue-400 font-semibold mb-1">{group.category}</div>
                  <div className="text-slate-300">
                    {group.skills.map((s) => `${s.name} (${s.status})`).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-cyan-400 font-semibold">
              Academic Projects & Coursework Concepts ({projects.length}):
            </p>
            <ul className="space-y-1.5">
              {projects.map((p, idx) => (
                <li key={p.id} className="text-slate-200">
                  <span className="text-blue-400 font-semibold">
                    0{idx + 1}. {p.title}
                  </span>{' '}
                  <span className="text-slate-400">[{p.badge}]</span> — {p.shortDescription}
                </li>
              ))}
            </ul>
          </div>
        );
        break;

      case 'education':
        outputNode = (
          <div className="space-y-1 text-xs text-slate-200">
            <p className="text-cyan-400 font-semibold">Academic Background:</p>
            <p>
              <span className="text-blue-400">Degree:</span> BSc IT (Specialization in Cloud
              Computing)
            </p>
            <p>
              <span className="text-blue-400">Institution:</span> LBEF College (Lord Buddha
              Education Foundation), Nepal
            </p>
            <p>
              <span className="text-blue-400">Status:</span> Currently Studying (Undergraduate)
            </p>
          </div>
        );
        break;

      case 'github':
        outputNode = (
          <div className="space-y-1 text-xs text-slate-200">
            <p className="text-cyan-400 font-semibold">Official GitHub Profile:</p>
            <p>
              Username: <span className="text-blue-400">@upendrabudha505-tech</span>
            </p>
            <p>
              URL:{' '}
              <a
                href={SOCIAL_LINKS.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                {SOCIAL_LINKS.githubUrl}
              </a>
            </p>
          </div>
        );
        break;

      case 'socials':
        outputNode = (
          <div className="space-y-1.5 text-xs text-slate-200">
            <p className="text-cyan-400 font-semibold">Verified Social & Credential Profiles:</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <a
                href={SOCIAL_LINKS.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                GitHub →
              </a>
              <a
                href={SOCIAL_LINKS.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                LinkedIn →
              </a>
              <a
                href={SOCIAL_LINKS.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Credly →
              </a>
              <a
                href={SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Instagram →
              </a>
              <a
                href={SOCIAL_LINKS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Facebook →
              </a>
            </div>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs text-slate-200">
            <p className="text-cyan-400 font-semibold">Direct Contact Information:</p>
            <p>
              Email:{' '}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-blue-400 hover:underline"
              >
                {PERSONAL_INFO.email}
              </a>
            </p>
            <p>
              Phone:{' '}
              <a href={`tel:${PERSONAL_INFO.phone}`} className="text-blue-400 hover:underline">
                {PERSONAL_INFO.phone}
              </a>
            </p>
            <p>Location: {PERSONAL_INFO.location}</p>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-xs text-amber-300">
            Command not recognized: <span className="font-semibold">"{rawCmd}"</span>. Type{' '}
            <button
              type="button"
              onClick={() => executeCommand('help')}
              className="text-blue-400 underline cursor-pointer"
            >
              help
            </button>{' '}
            to view available portfolio commands. (OS commands are disabled for security.)
          </div>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: rawCmd.trim(),
        output: outputNode,
      },
    ]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <section
      id="terminal"
      className={`py-20 border-b ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-500">
              05 · Command-Line Portfolio Explorer
            </div>
            <h2
              className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {headingText}
            </h2>
            <p
              className={`text-sm sm:text-base max-w-2xl ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Explore my academic background, cloud computing skills, projects, and social links
              using safe interactive terminal commands.
            </p>
          </div>

          {/* Quick Command Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['help', 'about', 'skills', 'projects', 'github', 'contact', 'clear'].map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => executeCommand(cmd)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/60'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs'
                }`}
              >
                $ {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Window Frame */}
        <div className="rounded-2xl border border-slate-800 bg-[#070B14] text-slate-100 shadow-2xl overflow-hidden font-mono">
          {/* Terminal Top Bar */}
          <div className="px-4 py-3 bg-[#0C1222] border-b border-slate-800/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs text-slate-400 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>upendra@lbef-cloud-portfolio:~</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => executeCommand('clear')}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              title="Clear terminal output"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Terminal Scrollable Output */}
          <div
            ref={terminalBodyRef}
            className="p-5 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto text-xs sm:text-sm"
          >
            {history.length === 0 ? (
              <p className="text-slate-500 text-xs">
                Terminal cleared. Type <span className="text-blue-400">help</span> or click a
                command button above to begin.
              </p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-semibold">
                      upendra@portfolio:~$
                    </span>
                    <span className="text-white font-semibold">{entry.command}</span>
                  </div>
                  <div className="pl-3 border-l-2 border-slate-800">{entry.output}</div>
                </div>
              ))
            )}

            {/* Command Input Prompt */}
            <form onSubmit={handleSubmit} className="pt-2 flex items-center gap-2">
              <label htmlFor="portfolio-terminal-input" className="text-emerald-400 text-xs font-semibold shrink-0">
                upendra@portfolio:~$
              </label>
              <input
                id="portfolio-terminal-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type help, about, skills, projects, github, contact..."
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                aria-label="Run command"
                className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Run</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
