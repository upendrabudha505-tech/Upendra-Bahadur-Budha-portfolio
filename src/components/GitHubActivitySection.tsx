import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  RefreshCw,
  GitBranch,
  Star,
  Code2,
  FolderGit2,
  AlertCircle,
} from 'lucide-react';
import { SOCIAL_LINKS } from '../data/portfolioData';

interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

interface GitHubActivitySectionProps {
  isDark: boolean;
  headingText?: string;
}

export const GitHubActivitySection: React.FC<GitHubActivitySectionProps> = ({
  isDark,
  headingText = 'GitHub Activity & Repositories',
}) => {
  const username = SOCIAL_LINKS.githubUsername || 'upendrabudha505-tech';
  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`,
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        ),
      ]);

      if (!userRes.ok) {
        throw new Error(`GitHub API returned status ${userRes.status}`);
      }

      const userData: GitHubUserProfile = await userRes.json();
      const reposData: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

      setProfile(userData);
      setRepos(Array.isArray(reposData) ? reposData : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not reach GitHub API at this moment.'
      );
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  return (
    <section
      id="github"
      className={`py-20 border-b ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-500">
              06 · Open Source & Code Profile
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
              Connected directly to my official GitHub profile (
              <span className="font-mono text-blue-500">@{username}</span>) via the official
              GitHub REST API.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchGitHubData}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh API</span>
            </button>

            <a
              href={SOCIAL_LINKS.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
            >
              <span>Open GitHub Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Profile Overview Banner */}
        <div
          className={`rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/90'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-display text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile?.name || 'Upendra Bahadur Budha'}
                </h3>
                <span className="text-xs font-mono text-blue-500">@{username}</span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {profile?.bio ||
                  'BSc IT Student (Cloud Computing) at LBEF College · Exploring Cloud, Networking, Cybersecurity & Web Development'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Public Repos: </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {profile ? profile.public_repos : '—'}
              </span>
            </div>
            <div>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Followers: </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {profile ? profile.followers : '—'}
              </span>
            </div>
            <div>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Following: </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {profile ? profile.following : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`rounded-2xl border p-6 space-y-3 animate-pulse ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="h-4 w-1/3 rounded bg-slate-700/40" />
                <div className="h-5 w-2/3 rounded bg-slate-700/40" />
                <div className="h-12 w-full rounded bg-slate-700/30" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            className={`rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Live GitHub API temporarily rate-limited or offline</p>
                <p className="text-xs opacity-80">
                  {error}. You can view my repositories directly on GitHub at{' '}
                  <a
                    href={SOCIAL_LINKS.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {SOCIAL_LINKS.githubDisplay}
                  </a>
                  .
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchGitHubData}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shrink-0 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Repositories Grid or Truthful Empty State */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <article
                key={repo.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-slate-900/55 border-slate-800/90 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-blue-500">
                    <span className="inline-flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{repo.language || 'Repository'}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3" /> {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {repo.forks_count}
                      </span>
                    </span>
                  </div>

                  <h3
                    className={`font-display text-lg font-bold break-words ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition-colors"
                    >
                      {repo.name}
                    </a>
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {repo.description ||
                      'Academic coursework and coding repository maintained by Upendra Bahadur Budha.'}
                  </p>
                </div>

                <div
                  className={`mt-5 pt-4 border-t flex items-center justify-between gap-2 text-xs font-mono ${
                    isDark
                      ? 'border-slate-800/80 text-slate-400'
                      : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span>
                    Updated{' '}
                    {new Date(repo.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div
            className={`rounded-2xl border p-8 text-center space-y-3 ${
              isDark
                ? 'bg-slate-900/45 border-slate-800/90 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            <p className="font-display text-base font-bold">
              Connected to @{username} — Public Repositories Coming Soon
            </p>
            <p className="text-xs sm:text-sm max-w-xl mx-auto opacity-80">
              My GitHub account is active and connected. As I publish BSc IT coursework code,
              cloud scripts, and web development prototypes to public repositories, they will
              automatically appear here in real time.
            </p>
            <div className="pt-2">
              <a
                href={SOCIAL_LINKS.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <span>Follow @{username} on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
