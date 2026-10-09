import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Plus,
  Trash2,
  Award,
  BookOpen,
  FolderKanban,
  Inbox,
  Image as ImageIcon,
  BarChart3,
} from 'lucide-react';
import {
  AcademicProject,
  CertificateItem,
  BlogArticle,
} from '../data/portfolioData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  projects: AcademicProject[];
  onOpenAddProject: () => void;
  onEditProject: (project: AcademicProject) => void;
  onDeleteProject: (id: string) => void;
  certificates: CertificateItem[];
  onAddCertificate: (cert: Omit<CertificateItem, 'id'>) => void;
  onDeleteCertificate: (id: string) => void;
  blogArticles: BlogArticle[];
  onAddBlogArticle: (article: Omit<BlogArticle, 'id'>) => void;
  onDeleteBlogArticle: (id: string) => void;
  messagesCount: number;
  unreadMessagesCount: number;
  onOpenInbox: () => void;
  onTriggerProfilePhotoUpload: () => void;
  onResetProfilePhoto: () => void;
  visitorViews: number;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  isDark,
  onClose,
  projects,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  certificates,
  onAddCertificate,
  onDeleteCertificate,
  blogArticles,
  onAddBlogArticle,
  onDeleteBlogArticle,
  messagesCount,
  unreadMessagesCount,
  onOpenInbox,
  onTriggerProfilePhotoUpload,
  onResetProfilePhoto,
  visitorViews,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'blog' | 'projects'>(
    'overview'
  );

  // Certificate form state
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Cloud Computing' as BlogArticle['category'],
    readTime: '4 min read',
    summary: '',
    contentText: '',
    tagsInput: '',
  });

  if (!isOpen) return null;

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) return;
    onAddCertificate({
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      issueDate: certForm.issueDate.trim() || 'Verified Credential',
      credentialUrl: certForm.credentialUrl.trim() || undefined,
    });
    setCertForm({ title: '', issuer: '', issueDate: '', credentialUrl: '' });
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.summary.trim()) return;
    const paragraphs = blogForm.contentText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const tags = blogForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddBlogArticle({
      title: blogForm.title.trim(),
      category: blogForm.category,
      readTime: blogForm.readTime.trim() || '4 min read',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isSamplePlaceholder: false,
      summary: blogForm.summary.trim(),
      content: paragraphs.length > 0 ? paragraphs : [blogForm.summary.trim()],
      tags: tags.length > 0 ? tags : [blogForm.category],
    });
    setBlogForm({
      title: '',
      category: 'Cloud Computing',
      readTime: '4 min read',
      summary: '',
      contentText: '',
      tagsInput: '',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-2xl border overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
          isDark
            ? 'bg-[#0B101E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-[#0E1526]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h3 id="admin-dashboard-title" className="font-display text-lg font-bold">
              Portfolio Content & Admin Manager
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`px-6 py-2.5 border-b flex flex-wrap items-center gap-2 ${
            isDark ? 'border-slate-800 bg-[#090D18]' : 'border-slate-200 bg-slate-100/70'
          }`}
        >
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderKanban },
            { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
            { id: 'blog', label: `Tech Blog (${blogArticles.length})`, icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Privacy-Friendly Analytics & Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-400">Visitor Page Views</div>
                  <div className="font-display text-2xl font-bold mt-1 text-blue-500">
                    {visitorViews}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-400">Academic Projects</div>
                  <div className="font-display text-2xl font-bold mt-1">{projects.length}</div>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-400">Verified Certificates</div>
                  <div className="font-display text-2xl font-bold mt-1">{certificates.length}</div>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-400">Inbox Messages</div>
                  <div className="font-display text-2xl font-bold mt-1">
                    {messagesCount}{' '}
                    {unreadMessagesCount > 0 && (
                      <span className="text-xs font-mono text-emerald-400">
                        ({unreadMessagesCount} new)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Management Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-5 rounded-xl border space-y-3 ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display font-bold text-sm">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Profile Portrait Management</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Update your hero & CV portrait photo across all devices or restore the default
                    studio portrait.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onTriggerProfilePhotoUpload}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                    >
                      Upload New Profile Photo
                    </button>
                    <button
                      type="button"
                      onClick={onResetProfilePhoto}
                      className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                    >
                      Restore Default Photo
                    </button>
                  </div>
                </div>

                <div
                  className={`p-5 rounded-xl border space-y-3 ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display font-bold text-sm">
                    <Inbox className="w-4 h-4 text-blue-500" />
                    <span>Visitor Contact Messages</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    View, mark as read, or reply to messages submitted through the Contact Me form.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenInbox();
                      }}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                    >
                      Open Messages Inbox ({messagesCount})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Add, edit, or remove academic projects & coursework concepts.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddProject();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="font-semibold">{proj.title}</div>
                      <div className="text-xs text-slate-400">
                        {proj.badge} · {proj.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditProject(proj);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        aria-label={`Delete ${proj.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCertSubmit}
                className={`p-5 rounded-xl border space-y-4 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className="font-display text-sm font-bold">
                  Add Earned Certificate / Verified Credential
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="Certificate Title (e.g., Cisco Networking Basics)"
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Issuing Organization (e.g., Cisco / AWS / LBEF)"
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="Issue Date (e.g., Oct 2026)"
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="url"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="Verification URL (e.g., https://www.credly.com/...)"
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Verified Certificate</span>
                </button>
              </form>

              {certificates.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No custom certificates added yet. In accordance with academic honesty, no fake
                  certificates are displayed.
                </p>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                  {certificates.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between gap-4 text-sm">
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        <div className="text-xs text-slate-400">
                          {c.issuer} · {c.issueDate}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteCertificate(c.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-6">
              <form
                onSubmit={handleBlogSubmit}
                className={`p-5 rounded-xl border space-y-4 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className="font-display text-sm font-bold">Publish New Tech Blog Article</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Article Title"
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <select
                    value={blogForm.category}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        category: e.target.value as BlogArticle['category'],
                      })
                    }
                    className={`px-3 py-2 text-xs rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Networking">Networking</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>
                <input
                  type="text"
                  required
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Short 1-2 sentence article summary"
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <textarea
                  rows={3}
                  value={blogForm.contentText}
                  onChange={(e) => setBlogForm({ ...blogForm, contentText: e.target.value })}
                  placeholder="Full article paragraphs (separate paragraphs with a new line)..."
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Article</span>
                </button>
              </form>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                {blogArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="font-semibold">{art.title}</div>
                      <div className="text-xs text-slate-400">
                        {art.category} · {art.date}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteBlogArticle(art.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
