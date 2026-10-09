import React, { useState } from 'react';
import { BookOpen, ArrowUpRight, X } from 'lucide-react';
import { BlogArticle } from '../data/portfolioData';

interface TechBlogSectionProps {
  isDark: boolean;
  articles: BlogArticle[];
  headingText?: string;
}

export const TechBlogSection: React.FC<TechBlogSectionProps> = ({
  isDark,
  articles,
  headingText = 'Tech Blog & Learning Notes',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  const categories = ['All', 'Cloud Computing', 'Networking', 'Cybersecurity', 'Web Development'];

  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <section
      id="blog"
      className={`py-20 border-b ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-blue-500">
              08 · Articles & Academic Study Notes
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
              Study notes and conceptual write-ups on Cloud Computing, Cisco Networking,
              Cybersecurity, and Web Development. Sample placeholders are clearly marked until full
              articles are published.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div
            className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-slate-900/55 border-slate-800/90 hover:border-slate-700'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Clean unboxed typographic metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-blue-500">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {article.readTime}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {article.date}
                  </span>
                </div>

                <h3
                  className={`font-display text-lg sm:text-xl font-bold leading-snug ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {article.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {article.summary}
                </p>
              </div>

              <div
                className={`mt-5 pt-4 border-t flex items-center justify-between gap-4 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}
              >
                <div
                  className={`text-xs font-mono truncate ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {article.tags.join(' · ')}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 shrink-0 cursor-pointer"
                >
                  <span>Read Note</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-article-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setActiveArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl max-h-[88vh] flex flex-col ${
              isDark
                ? 'bg-[#0B101E] border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono text-blue-500">
                <BookOpen className="w-4 h-4" />
                <span>
                  {activeArticle.category} · {activeArticle.readTime} · {activeArticle.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h3 id="blog-article-modal-title" className="font-display text-2xl font-bold">
                {activeArticle.title}
              </h3>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                {activeArticle.content.map((para, idx) => (
                  <p
                    key={idx}
                    className={isDark ? 'text-slate-300' : 'text-slate-700'}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div
                className={`pt-4 border-t text-xs font-mono ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                Topics: {activeArticle.tags.join(' · ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
