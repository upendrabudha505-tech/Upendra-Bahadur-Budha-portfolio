/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * UPENDRA BAHADUR BUDHA — PERSONAL ACADEMIC PORTFOLIO
 * BSc IT – Cloud Computing Student | LBEF College
 * ============================================================================
 * WHERE TO CUSTOMIZE THIS PORTFOLIO IN CODE:
 * [1] Change Profile Photo    -> Edit `DEFAULT_PROFILE_IMAGE` in `src/data/portfolioData.ts` (or use "Change Profile Photo" on screen)
 * [2] Add Project Images      -> Edit `DEFAULT_ACADEMIC_PROJECTS` (`imageUrl`) in `src/data/portfolioData.ts` (or use "Add Project Image" on each card)
 * [3] Add / Replace Your CV   -> Place your PDF in `public/assets/cv/Upendra-Bahadur-Budha-CV.pdf` (or upload a custom PDF in the Resume section)
 * [4] Update LinkedIn         -> Edit `SOCIAL_LINKS.linkedinUrl` in `src/data/portfolioData.ts`
 * [5] Update Credly           -> Edit `SOCIAL_LINKS.credlyUrl` in `src/data/portfolioData.ts`
 * [6] Add Future Certificates -> Edit `EARNED_CERTIFICATES` in `src/data/portfolioData.ts`
 * [7] Add Future Projects     -> Edit `DEFAULT_ACADEMIC_PROJECTS` in `src/data/portfolioData.ts` (or click "Add Academic Project" on screen)
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Download,
  Upload,
  ImagePlus,
  Trash2,
  ExternalLink,
  Phone,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  FileText,
  BookOpen,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Edit3,
  Inbox,
  Mail,
} from 'lucide-react';
import {
  DEFAULT_PROFILE_IMAGE,
  PERSONAL_INFO,
  SOCIAL_LINKS,
  SKILL_GROUPS,
  AREAS_OF_INTEREST,
  DEFAULT_ACADEMIC_PROJECTS,
  EARNED_CERTIFICATES,
  AcademicProject,
  CertificateItem,
} from './data/portfolioData';
import {
  triggerCvDownload,
  EditableCvData,
  getDefaultCvData,
  normalizeCvData,
} from './utils/cvGenerator';
import { ShortVideoSection } from './components/ShortVideoSection';
import { CvEditorModal } from './components/CvEditorModal';
import { A4CvSheet } from './components/A4CvSheet';
import { MessagesInboxModal, VisitorMessage } from './components/MessagesInboxModal';
import { EditProjectModal } from './components/EditProjectModal';

const STORAGE_KEYS = {
  THEME: 'upendra_portfolio_theme_v1',
  PROFILE_IMAGE: 'upendra_portfolio_profile_img_v1',
  PROJECT_IMAGES: 'upendra_portfolio_project_imgs_v1',
  ALL_PROJECTS: 'upendra_portfolio_all_projects_v2',
  PROJECTS_SECTION_META: 'upendra_portfolio_projects_meta_v1',
  CUSTOM_CERTIFICATES: 'upendra_portfolio_custom_certs_v1',
  CUSTOM_CV_DATA: 'upendra_portfolio_custom_cv_data_v1',
  CUSTOM_CV_NAME: 'upendra_portfolio_custom_cv_name_v1',
  EDITABLE_CV_JSON: 'upendra_portfolio_editable_cv_json_v1',
  CONTACT_MESSAGES: 'upendra_portfolio_messages_v1',
};

export default function App() {
  // Theme state (Dark futuristic default, with full Light mode support)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved ? saved === 'dark' : true;
  });

  // Mobile navigation menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // [1] Profile Photo Management State
  const [customProfilePhoto, setCustomProfilePhoto] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE);
  });
  const [profileImgError, setProfileImgError] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);

  // [2] & [7] Academic Projects & Project Image Management State
  const [projectImages, setProjectImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECT_IMAGES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [projectsList, setProjectsList] = useState<AcademicProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_PROJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_ACADEMIC_PROJECTS;
    } catch {
      return DEFAULT_ACADEMIC_PROJECTS;
    }
  });

  const [projectsSectionMeta, setProjectsSectionMeta] = useState<{
    kicker: string;
    title: string;
    subtitle: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS_SECTION_META);
      return saved
        ? JSON.parse(saved)
        : {
            kicker: '04 · Coursework & Concept Explorations',
            title: 'Academic Projects & Concepts',
            subtitle: PERSONAL_INFO.academicNote,
          };
    } catch {
      return {
        kicker: '04 · Coursework & Concept Explorations',
        title: 'Academic Projects & Concepts',
        subtitle: PERSONAL_INFO.academicNote,
      };
    }
  });
  const [isEditingSectionMeta, setIsEditingSectionMeta] = useState(false);

  // Active project filter, detail modal, edit modal & add modal state
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<AcademicProject | null>(null);
  const [editingProject, setEditingProject] = useState<AcademicProject | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  // Active skill domain filter
  const [skillFilter, setSkillFilter] = useState<string>('All');

  // [3] Custom CV upload override & Interactive Editable CV state
  const [customCvDataUrl, setCustomCvDataUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_CV_DATA);
  });
  const [customCvName, setCustomCvName] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_CV_NAME);
  });
  const [editableCvData, setEditableCvData] = useState<EditableCvData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EDITABLE_CV_JSON);
      return saved ? normalizeCvData(JSON.parse(saved)) : getDefaultCvData();
    } catch {
      return getDefaultCvData();
    }
  });
  const [isCvEditorOpen, setIsCvEditorOpen] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement | null>(null);

  // [6] Earned Certificates State (starts empty unless user adds real certificates)
  const [customCertificates, setCustomCertificates] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CERTIFICATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Contact Form & Server-Backed Messages Inbox State
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitted'>('idle');
  const [savedMessages, setSavedMessages] = useState<VisitorMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // New Academic Project Form State
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    badge: 'Academic Project / Concept',
    category: 'Web & Concept' as AcademicProject['category'],
    shortDescription: '',
    detailedOverview: '',
    topicsInput: '',
    imageUrl: '',
  });

  // Code Customization Guide Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setEditingProject(null);
        setIsAddProjectModalOpen(false);
        setIsGuideOpen(false);
        setIsCvEditorOpen(false);
        setIsInboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch messages & saved CV from server on mount + periodic poll for new visitor messages
  const fetchMessagesFromServer = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setSavedMessages(data.messages);
          localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(data.messages));
        }
      }
    } catch {
      // Fallback to localStorage messages when offline
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessagesFromServer();
    fetch('/api/cv')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.cvData) {
          const normalized = normalizeCvData(data.cvData);
          setEditableCvData(normalized);
          localStorage.setItem(STORAGE_KEYS.EDITABLE_CV_JSON, JSON.stringify(normalized));
        }
      })
      .catch(() => {});

    fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.projects)) {
          setProjectsList(data.projects);
          localStorage.setItem(STORAGE_KEYS.ALL_PROJECTS, JSON.stringify(data.projects));
        }
        if (data?.sectionMeta) {
          setProjectsSectionMeta(data.sectionMeta);
          localStorage.setItem(
            STORAGE_KEYS.PROJECTS_SECTION_META,
            JSON.stringify(data.sectionMeta)
          );
        }
      })
      .catch(() => {});

    const interval = setInterval(fetchMessagesFromServer, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveEditableCv = async (updated: EditableCvData) => {
    setEditableCvData(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.EDITABLE_CV_JSON, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
    try {
      await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: updated }),
      });
    } catch {
      // Ignore network error
    }
    showToast('CV updated! Clicking "Download CV" will now download your edited CV.');
  };

  // [1] Handler: Upload or change profile photo
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomProfilePhoto(reader.result);
        setProfileImgError(false);
        try {
          localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, reader.result);
          showToast('Profile photo updated and saved to browser storage.');
        } catch {
          showToast('Profile photo updated for this session (image is large).');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetProfilePhoto = () => {
    setCustomProfilePhoto(null);
    setProfileImgError(false);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
    showToast('Restored default studio portrait.');
  };

  // [2] Handler: Add / Change / Remove Project Image
  const handleProjectImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = { ...projectImages, [projectId]: reader.result };
        setProjectImages(updated);
        try {
          localStorage.setItem(STORAGE_KEYS.PROJECT_IMAGES, JSON.stringify(updated));
          showToast('Project image added and saved.');
        } catch {
          showToast('Project image updated for this session.');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveProjectImage = (projectId: string) => {
    const updated = { ...projectImages };
    delete updated[projectId];
    setProjectImages(updated);
    localStorage.setItem(STORAGE_KEYS.PROJECT_IMAGES, JSON.stringify(updated));
    showToast('Project image removed. Showing "Project Image Coming Soon" placeholder.');
  };

  // Persist projects list & section meta to localStorage and server
  const persistProjectsAndMeta = async (
    nextProjects: AcademicProject[],
    nextMeta = projectsSectionMeta
  ) => {
    setProjectsList(nextProjects);
    setProjectsSectionMeta(nextMeta);
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_PROJECTS, JSON.stringify(nextProjects));
      localStorage.setItem(STORAGE_KEYS.PROJECTS_SECTION_META, JSON.stringify(nextMeta));
    } catch {
      // Ignore storage error
    }
    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: nextProjects, sectionMeta: nextMeta }),
      });
    } catch {
      // Ignore network error
    }
  };

  // [7] Handler: Add a new academic project
  const handleCreateAcademicProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim() || !newProjectForm.shortDescription.trim()) return;

    const id = `custom-${Date.now()}`;
    const topics = newProjectForm.topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created: AcademicProject = {
      id,
      title: newProjectForm.title.trim(),
      badge: newProjectForm.badge.trim() || 'Academic Project / Concept',
      category: newProjectForm.category,
      shortDescription: newProjectForm.shortDescription.trim(),
      detailedOverview:
        newProjectForm.detailedOverview.trim() || newProjectForm.shortDescription.trim(),
      learningObjectives: [
        'Created as part of academic coursework and practical learning',
        'Focused on conceptual architecture, user interface design, and technical exploration',
      ],
      topics: topics.length > 0 ? topics : ['Academic Coursework', 'Project Concept'],
      imageUrl: '',
      suggestedAssetPath: `assets/projects/${id}.jpg`,
    };

    const nextList = [...projectsList, created];
    persistProjectsAndMeta(nextList);

    if (newProjectForm.imageUrl) {
      const nextImgs = { ...projectImages, [id]: newProjectForm.imageUrl };
      setProjectImages(nextImgs);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECT_IMAGES, JSON.stringify(nextImgs));
      } catch {
        // Ignore quota limits
      }
    }

    setNewProjectForm({
      title: '',
      badge: 'Academic Project / Concept',
      category: 'Web & Concept',
      shortDescription: '',
      detailedOverview: '',
      topicsInput: '',
      imageUrl: '',
    });
    setIsAddProjectModalOpen(false);
    showToast(`Added "${created.title}" to Academic Projects & Concepts.`);
  };

  const handleUpdateAcademicProject = (updated: AcademicProject) => {
    const nextList = projectsList.map((p) => (p.id === updated.id ? updated : p));
    persistProjectsAndMeta(nextList);
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
    showToast(`Updated "${updated.title}".`);
  };

  const handleDeleteAcademicProject = (projectId: string) => {
    const target = projectsList.find((p) => p.id === projectId);
    const nextList = projectsList.filter((p) => p.id !== projectId);
    persistProjectsAndMeta(nextList);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    if (editingProject?.id === projectId) {
      setEditingProject(null);
    }
    showToast(`Deleted "${target?.title || 'Project'}" from Academic Projects & Concepts.`);
  };

  const handleRestoreDefaultProjects = () => {
    const defaultMeta = {
      kicker: '04 · Coursework & Concept Explorations',
      title: 'Academic Projects & Concepts',
      subtitle: PERSONAL_INFO.academicNote,
    };
    persistProjectsAndMeta(DEFAULT_ACADEMIC_PROJECTS, defaultMeta);
    showToast('Restored all 5 default academic projects.');
  };

  // [3] Handler: Replace CV PDF file
  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomCvDataUrl(reader.result);
        setCustomCvName(file.name);
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CV_DATA, reader.result);
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CV_NAME, file.name);
          showToast(`CV file "${file.name}" uploaded. "Download CV" will now serve your file.`);
        } catch {
          showToast(`CV file "${file.name}" active for this session.`);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetCv = () => {
    setCustomCvDataUrl(null);
    setCustomCvName(null);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CV_DATA);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CV_NAME);
    showToast('Reset to default generated CV PDF.');
  };

  // Contact form handler (Sends to server `/api/messages` so Upendra receives visitor messages in his Inbox)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactForm.fullName.trim() ||
      !contactForm.email.trim() ||
      !contactForm.subject.trim() ||
      !contactForm.message.trim()
    ) {
      return;
    }

    const payload = {
      fullName: contactForm.fullName.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim(),
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setSavedMessages(data.messages);
          localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(data.messages));
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      const fallbackMsg: VisitorMessage = {
        id: `msg-${Date.now()}`,
        ...payload,
        submittedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
      };
      const updated = [fallbackMsg, ...savedMessages];
      setSavedMessages(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
    }

    setContactStatus('submitted');
    setContactForm({ fullName: '', email: '', subject: '', message: '' });
    showToast('Message delivered to Upendra’s portfolio inbox!');
  };

  const handleMarkMessageRead = async (id: string) => {
    const next = savedMessages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setSavedMessages(next);
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(next));
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PATCH' });
    } catch {
      // Ignore network error
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const next = savedMessages.filter((m) => m.id !== id);
    setSavedMessages(next);
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(next));
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    } catch {
      // Ignore network error
    }
    showToast('Message deleted from inbox.');
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    showToast('Phone number 9701269514 copied to clipboard.');
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    showToast(`Email ${PERSONAL_INFO.email} copied to clipboard.`);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const allProjects: AcademicProject[] = projectsList;
  const filteredProjects =
    projectFilter === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === projectFilter);

  const filteredSkillGroups =
    skillFilter === 'All'
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((g) => g.category === skillFilter);

  const allCertificates: CertificateItem[] = [...EARNED_CERTIFICATES, ...customCertificates];

  const activeProfilePhoto = customProfilePhoto || DEFAULT_PROFILE_IMAGE;

  const getProjectImage = (project: AcademicProject): string => {
    return projectImages[project.id] || project.imageUrl || '';
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#060911] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200'
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-blue-600/20 selection:text-blue-900'
      }`}
    >
      {/* Subtle Ambient Background Lighting (10% Accent Budget) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          className={`absolute -top-48 right-1/4 h-[460px] w-[460px] rounded-full blur-[130px] transition-opacity duration-500 ${
            isDark ? 'bg-blue-600/12 opacity-100' : 'bg-blue-500/10 opacity-70'
          }`}
        />
        <div
          className={`absolute top-[42%] -left-32 h-[380px] w-[380px] rounded-full blur-[130px] transition-opacity duration-500 ${
            isDark ? 'bg-indigo-600/10 opacity-100' : 'bg-indigo-400/10 opacity-60'
          }`}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-150 max-w-md ${
            isDark
              ? 'bg-slate-900/95 border-slate-700/80 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-slate-200 p-1"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =====================================================================
          STICKY TOP BAR (3-Zone Contract: Brand | Nav Links | Primary Actions)
          ===================================================================== */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
          isDark
            ? 'bg-[#060911]/85 border-slate-800/80'
            : 'bg-white/85 border-slate-200/90'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            className={`font-display text-base sm:text-lg font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
              isDark ? 'text-white hover:text-blue-400' : 'text-slate-900 hover:text-blue-600'
            }`}
          >
            Upendra Bahadur Budha
          </a>

          {/* Zone 2: Clean typography navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {[
              { label: 'Home', href: '#home' },
              { label: 'About', href: '#about' },
              { label: 'Skills', href: '#skills' },
              { label: 'Academic Work', href: '#academic-work' },
              { label: 'Education', href: '#education' },
              { label: 'Credentials', href: '#credentials' },
              { label: 'Contact', href: '#contact' },
            ].map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`${index >= 5 ? 'hidden xl:inline-block' : ''} whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent transition-colors duration-150 ${
                  isDark
                    ? 'text-slate-300 hover:text-white hover:border-blue-500'
                    : 'text-slate-600 hover:text-slate-900 hover:border-blue-600'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Theme Toggle + Download CV + Mobile Trigger) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`h-10 w-10 inline-flex items-center justify-center rounded-lg border transition-colors duration-150 ${
                isDark
                  ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'border-slate-200 bg-slate-100/80 text-slate-700 hover:text-slate-950 hover:border-slate-300'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => triggerCvDownload(editableCvData, customCvDataUrl, customCvName)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className={`lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg border transition-colors ${
                isDark
                  ? 'border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-b px-6 py-5 space-y-3 ${
              isDark ? 'bg-[#090D18] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Skills', href: '#skills' },
                { label: 'Academic Work', href: '#academic-work' },
                { label: 'Education', href: '#education' },
                { label: 'Credentials', href: '#credentials' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'text-slate-200 hover:bg-slate-800/80'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800/40 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerCvDownload(editableCvData, customCvDataUrl, customCvName);
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ===================================================================
            HERO SECTION (Split-Screen Editorial Layout + Profile Management)
            =================================================================== */}
        <section
          id="home"
          className="pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/40"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left Column: Typographic Hierarchy & Primary CTAs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Unboxed metadata kicker (Zero-Pill Discipline) */}
                <div
                  className={`flex flex-wrap items-center gap-2 text-xs font-mono tracking-wide ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  <span>{PERSONAL_INFO.course}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PERSONAL_INFO.college}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PERSONAL_INFO.location}</span>
                </div>

                <div className="space-y-3">
                  <h1
                    className={`font-display text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.12] ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {PERSONAL_INFO.heroGreeting}
                  </h1>
                  <p
                    className={`text-lg sm:text-xl font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {PERSONAL_INFO.roleTitle}{' '}
                    <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>·</span>{' '}
                    <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                      {PERSONAL_INFO.college}
                    </span>
                  </p>
                </div>

                <p
                  className={`text-base sm:text-[17px] leading-relaxed max-w-[62ch] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {PERSONAL_INFO.heroIntro}
                </p>

                {/* Primary & Secondary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#academic-work"
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <span>View Academic Work</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => triggerCvDownload(editableCvData, customCvDataUrl, customCvName)}
                    className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isDark
                        ? 'border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:border-slate-600'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Download className="w-4 h-4 text-blue-500" />
                    <span>Download CV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCvEditorOpen(true)}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/50 text-blue-400 hover:bg-slate-800 hover:text-blue-300'
                        : 'border-slate-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit CV</span>
                  </button>

                  <a
                    href="#contact"
                    className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      isDark
                        ? 'border-slate-800 bg-transparent text-slate-300 hover:text-white hover:border-slate-700'
                        : 'border-slate-200 bg-transparent text-slate-700 hover:text-slate-950 hover:border-slate-300'
                    }`}
                  >
                    <span>Contact Me</span>
                  </a>
                </div>

                {/* Social & Verified Profile Links (LinkedIn, Credly, Facebook, Instagram, Email) */}
                <div
                  className={`pt-4 border-t flex flex-wrap items-center gap-5 text-sm ${
                    isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-mono text-slate-500">Profiles:</span>
                  {/* [4] UPDATE LINKEDIN */}
                  <a
                    href={SOCIAL_LINKS.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                      isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {/* [5] UPDATE CREDLY */}
                  <a
                    href={SOCIAL_LINKS.credlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                      isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <span>Credly</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {/* FACEBOOK */}
                  <a
                    href={SOCIAL_LINKS.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                      isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <span>Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {/* INSTAGRAM */}
                  <a
                    href={SOCIAL_LINKS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                      isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {/* EMAIL */}
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                      isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>{PERSONAL_INFO.email}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Prominent Portrait & Profile Image Management */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                <div className="w-full max-w-[370px]">
                  {/* Floating Portrait Card */}
                  <div
                    className={`animate-float-profile relative rounded-2xl overflow-hidden border transition-colors ${
                      isDark
                        ? 'bg-slate-900/70 border-slate-800 shadow-2xl shadow-blue-950/20'
                        : 'bg-white border-slate-200 shadow-xl shadow-slate-200/70'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full relative overflow-hidden bg-slate-900">
                      {!profileImgError ? (
                        <img
                          src={activeProfilePhoto}
                          alt="Upendra Bahadur Budha — BSc IT Cloud Computing Student at LBEF College"
                          referrerPolicy="no-referrer"
                          onError={() => setProfileImgError(true)}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
                          <span className="font-display text-3xl font-bold text-blue-400 mb-2">
                            UBB
                          </span>
                          <p className="text-sm font-medium">{PERSONAL_INFO.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{PERSONAL_INFO.roleTitle}</p>
                        </div>
                      )}

                      {/* Subtle bottom contrast scrim with name caption */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-12">
                        <p className="font-display text-base font-bold text-white">
                          {PERSONAL_INFO.name}
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {PERSONAL_INFO.course} · {PERSONAL_INFO.college}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* [1] PROFILE IMAGE MANAGEMENT BAR */}
                  <div
                    className={`mt-3 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800/90'
                        : 'bg-white border-slate-200/90'
                    }`}
                  >
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                      id="profile-photo-upload-input"
                    />
                    <button
                      type="button"
                      onClick={() => profileFileInputRef.current?.click()}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white'
                          : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-500" />
                      <span>Change Profile Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => profileFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Upload New Photo</span>
                    </button>

                    {customProfilePhoto && (
                      <button
                        type="button"
                        onClick={handleResetProfilePhoto}
                        title="Restore default portrait"
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SHORT VIDEO / INTRO SHOWCASE SECTION (Right after Profile/Hero)
            =================================================================== */}
        <ShortVideoSection isDark={isDark} onNotify={showToast} />

        {/* ===================================================================
            ABOUT SECTION (Biography + Structured Profile Card)
            =================================================================== */}
        <section
          id="about"
          className={`py-20 border-b ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Biography Prose */}
              <div className="lg:col-span-7 space-y-5">
                <div className="text-xs font-mono text-blue-500">01 · Introduction</div>
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  About Me
                </h2>
                <p
                  className={`text-base sm:text-[16.5px] leading-[1.75] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {PERSONAL_INFO.aboutText}
                </p>

                <div
                  className={`pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm ${
                    isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-mono text-slate-500">Current Academic Track</div>
                    <div className="font-medium mt-0.5">BSc IT – Cloud Computing</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-500">Learning Approach</div>
                    <div className="font-medium mt-0.5">
                      Academic Coursework & Concept Prototyping
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Card (Single-level elevation, clean hairline rows) */}
              <div className="lg:col-span-5">
                <div
                  className={`rounded-2xl border p-6 sm:p-7 ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/90'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <h3
                    className={`font-display text-lg font-bold pb-4 border-b ${
                      isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'
                    }`}
                  >
                    Student Profile Overview
                  </h3>
                  <dl
                    className={`divide-y text-sm ${
                      isDark ? 'divide-slate-800/80' : 'divide-slate-200/80'
                    }`}
                  >
                    {[
                      { label: 'Name', value: PERSONAL_INFO.name },
                      { label: 'Education', value: PERSONAL_INFO.course },
                      { label: 'College', value: PERSONAL_INFO.college },
                      { label: 'Focus', value: PERSONAL_INFO.focus },
                      { label: 'Location', value: PERSONAL_INFO.location },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                          {row.label}
                        </dt>
                        <dd
                          className={`font-semibold text-right ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SKILLS SECTION (Grouped by Domain + Learning/Developing Statuses)
            =================================================================== */}
        <section
          id="skills"
          className={`py-20 border-b ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-blue-500">02 · Technical & Creative</div>
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Skills & Learning Domains
                </h2>
                <p
                  className={`text-sm sm:text-base max-w-2xl ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Grouped by core study areas. Status labels indicate current academic progression
                  rather than arbitrary percentages.
                </p>
              </div>

              {/* Interactive Segmented Filter Control */}
              <div
                className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                {['All', 'Networking', 'Cyber Security', 'Cloud', 'Development', 'Creative'].map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSkillFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                        skillFilter === tab
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Skill Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkillGroups.map((group, idx) => (
                <div
                  key={group.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-slate-900/55 border-slate-800/90 hover:border-slate-700'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono text-blue-500 tabular-nums">
                        0{idx + 1} · {group.category}
                      </span>
                      <span
                        className={`text-xs font-mono tabular-nums ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {group.skills.length} {group.skills.length === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>

                    <h3
                      className={`font-display text-lg font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {group.category}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed mb-5 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {group.summary}
                    </p>
                  </div>

                  {/* Unboxed skill rows with typographic status separators (Zero-Pill) */}
                  <ul
                    className={`divide-y border-t text-sm ${
                      isDark
                        ? 'divide-slate-800/80 border-slate-800/80'
                        : 'divide-slate-100 border-slate-100'
                    }`}
                  >
                    {group.skills.map((skill) => (
                      <li
                        key={skill.name}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <span
                          className={`font-medium ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {skill.name}
                        </span>
                        <span
                          className={`text-xs font-mono shrink-0 ${
                            skill.status === 'Developing'
                              ? isDark
                                ? 'text-blue-400'
                                : 'text-blue-600'
                              : isDark
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          · {skill.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ===============================================================
                AREAS OF INTEREST & SKILLS (6 Professional Cards)
                =============================================================== */}
            <div className="pt-12 border-t border-slate-800/40 space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono text-blue-500">
                  03 · Focus Areas & Capabilities
                </div>
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Areas of Interest & Skills
                </h2>
                <p
                  className={`text-sm sm:text-base max-w-2xl ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Core technical and creative disciplines I explore through BSc IT coursework,
                  self-study, and academic projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AREAS_OF_INTEREST.map((area) => (
                  <div
                    key={area.index}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-slate-900/45 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="text-xs font-mono text-blue-500">
                        {area.index}. {area.category}
                      </div>
                      <h3
                        className={`font-display text-lg font-bold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {area.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {area.description}
                      </p>
                    </div>

                    {/* Clean unboxed metadata topics */}
                    <div
                      className={`mt-5 pt-4 border-t text-xs font-mono ${
                        isDark
                          ? 'border-slate-800/80 text-slate-400'
                          : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      {area.keyTopics.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            ACADEMIC PROJECTS & CONCEPTS SECTION
            =================================================================== */}
        <section
          id="academic-work"
          className={`py-20 border-b ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 flex-1">
                {!isEditingSectionMeta ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono text-blue-500">
                        {projectsSectionMeta.kicker}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingSectionMeta(true)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                          isDark
                            ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Heading</span>
                      </button>
                    </div>
                    <h2
                      className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {projectsSectionMeta.title}
                    </h2>
                    <p
                      className={`text-sm sm:text-base max-w-2xl ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {projectsSectionMeta.subtitle}
                    </p>
                  </>
                ) : (
                  <div
                    className={`p-4 rounded-xl border space-y-3 max-w-xl ${
                      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-blue-500">
                        Section Subtitle / Kicker
                      </label>
                      <input
                        type="text"
                        value={projectsSectionMeta.kicker}
                        onChange={(e) =>
                          setProjectsSectionMeta({
                            ...projectsSectionMeta,
                            kicker: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-blue-500">
                        Section Main Heading
                      </label>
                      <input
                        type="text"
                        value={projectsSectionMeta.title}
                        onChange={(e) =>
                          setProjectsSectionMeta({
                            ...projectsSectionMeta,
                            title: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-1.5 text-sm font-bold rounded-lg border outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-blue-500">
                        Section Description
                      </label>
                      <textarea
                        rows={2}
                        value={projectsSectionMeta.subtitle}
                        onChange={(e) =>
                          setProjectsSectionMeta({
                            ...projectsSectionMeta,
                            subtitle: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-white'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          persistProjectsAndMeta(projectsList, projectsSectionMeta);
                          setIsEditingSectionMeta(false);
                          showToast('Section heading updated.');
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                      >
                        Save Heading
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const cleared = {
                            kicker: '',
                            title: 'Academic Projects & Concepts',
                            subtitle: '',
                          };
                          persistProjectsAndMeta(projectsList, cleared);
                          setIsEditingSectionMeta(false);
                          showToast('Cleared section subtitle.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-600/15 text-rose-400 hover:bg-rose-600/25 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Subtitle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingSectionMeta(false)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Tabs + Add Academic Project + Reset Default Button */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div
                  className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  {['All', 'Web & Concept', 'Cloud & Systems', 'Hardware & IoT'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                        projectFilter === cat
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

                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreDefaultProjects}
                  title="Restore default academic projects"
                  className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Defaults</span>
                </button>
              </div>
            </div>

            {/* Academic Honesty & Disclaimer Banner */}
            <div
              className={`rounded-xl border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isDark
                  ? 'bg-blue-950/20 border-blue-900/50 text-slate-300'
                  : 'bg-blue-50/80 border-blue-200 text-slate-700'
              }`}
            >
              <p className="leading-relaxed">
                <strong className={isDark ? 'text-blue-400' : 'text-blue-700'}>
                  Academic Work Notice:
                </strong>{' '}
                {PERSONAL_INFO.academicNote}
              </p>
              <span className="font-mono text-[11px] shrink-0 opacity-80">
                5 Core Coursework Concepts
              </span>
            </div>

            {/* Academic Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const currentImg = getProjectImage(project);
                const fileInputId = `project-img-input-${project.id}`;

                return (
                  <article
                    key={project.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Project Image Slot or Clean "Project Image Coming Soon" Placeholder */}
                      <div
                        className={`aspect-[16/10] w-full relative overflow-hidden border-b ${
                          isDark
                            ? 'bg-[#090E1A] border-slate-800/80'
                            : 'bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        {currentImg ? (
                          <img
                            src={currentImg}
                            alt={`${project.title} — ${project.badge}`}
                            referrerPolicy="no-referrer"
                            onError={() => handleRemoveProjectImage(project.id)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                            <span
                              className={`font-mono text-xs mb-1.5 ${
                                isDark ? 'text-blue-400/90' : 'text-blue-600'
                              }`}
                            >
                              0{index + 1} · {project.badge}
                            </span>
                            <p
                              className={`font-display text-sm font-semibold ${
                                isDark ? 'text-slate-200' : 'text-slate-700'
                              }`}
                            >
                              Project Image Coming Soon
                            </p>
                            <p
                              className={`text-[11px] mt-1 max-w-[24ch] ${
                                isDark ? 'text-slate-500' : 'text-slate-500'
                              }`}
                            >
                              Upload your real academic screenshot or prototype photo below
                            </p>
                          </div>
                        )}
                      </div>

                      {/* [2] PROJECT IMAGE MANAGEMENT BAR ON EVERY CARD */}
                      <div
                        className={`px-4 py-2.5 border-b flex flex-wrap items-center gap-2 text-xs ${
                          isDark
                            ? 'bg-slate-950/60 border-slate-800/80'
                            : 'bg-slate-50 border-slate-200/80'
                        }`}
                      >
                        <input
                          id={fileInputId}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProjectImageUpload(project.id, e)}
                          className="hidden"
                        />

                        {!currentImg ? (
                          <label
                            htmlFor={fileInputId}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                              isDark
                                ? 'bg-blue-600/15 text-blue-400 hover:bg-blue-600/25'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            <ImagePlus className="w-3.5 h-3.5" />
                            <span>Add Project Image</span>
                          </label>
                        ) : (
                          <>
                            <label
                              htmlFor={fileInputId}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                                isDark
                                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                              }`}
                            >
                              <Upload className="w-3 h-3" />
                              <span>Change Image</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveProjectImage(project.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                                isDark
                                  ? 'text-rose-400 hover:bg-rose-950/40'
                                  : 'text-rose-600 hover:bg-rose-50'
                              }`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove Image</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-3">
                        {/* Unboxed 1-line text kicker for Academic Project / Concept label */}
                        <div
                          className={`text-xs font-mono ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        >
                          {project.badge}
                        </div>

                        <h3
                          className={`font-display text-xl font-bold ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {project.title}
                        </h3>

                        <p
                          className={`text-sm leading-relaxed ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Unboxed topics + View Details button */}
                    <div className="px-6 pb-6 pt-2 space-y-4">
                      <div
                        className={`text-xs font-mono pt-3 border-t ${
                          isDark
                            ? 'border-slate-800/80 text-slate-400'
                            : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        {project.topics.join(' · ')}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80 text-white hover:bg-blue-600 hover:border-blue-600'
                              : 'border-slate-300 bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                          }`}
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                              isDark
                                ? 'border-slate-800 bg-slate-900 text-blue-400 hover:bg-slate-800 hover:text-blue-300'
                                : 'border-slate-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAcademicProject(project.id)}
                            title="Delete this academic project"
                            className={`inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                              isDark
                                ? 'border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50'
                                : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            EDUCATION & CREDENTIALS SECTION
            =================================================================== */}
        <section
          id="education"
          className={`py-20 border-b ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Education Timeline / Card */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-blue-500">05 · Academic Background</div>
                  <h2
                    className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Education
                  </h2>
                </div>

                <div
                  className={`rounded-2xl border p-6 sm:p-8 space-y-4 ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/90'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                      Currently Studying
                    </span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      Undergraduate Degree
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      BSc IT – Cloud Computing
                    </h3>
                    <p
                      className={`text-base font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      LBEF College (Lord Buddha Education Foundation)
                    </p>
                  </div>

                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Pursuing a Bachelor of Science in Information Technology with a specialization
                    in Cloud Computing. Coursework encompasses cloud architectures, networking
                    fundamentals, cybersecurity awareness, web application development, and
                    collaborative academic project concepts.
                  </p>

                  <div
                    className={`pt-4 border-t text-xs font-mono ${
                      isDark
                        ? 'border-slate-800/80 text-slate-400'
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    Cloud Computing · Cisco Networking · Cyber Security · Web Development
                  </div>
                </div>
              </div>

              {/* [6] CERTIFICATES & CREDENTIALS SECTION */}
              <div id="credentials" className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-blue-500">06 · Verified Badges</div>
                  <h2
                    className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Certificates & Credentials
                  </h2>
                </div>

                <div
                  className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/90'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <p
                      className={`text-base font-semibold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Professional certificates and verified credentials will be added here.
                    </p>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Certificates & verified credentials will be added here as they are earned. You
                      can visit my official Credly profile below to check for newly issued digital
                      badges.
                    </p>
                  </div>

                  {/* If future certificates are added in `EARNED_CERTIFICATES`, display them cleanly */}
                  {allCertificates.length > 0 && (
                    <ul
                      className={`divide-y border-t border-b text-sm ${
                        isDark
                          ? 'divide-slate-800 border-slate-800'
                          : 'divide-slate-200 border-slate-200'
                      }`}
                    >
                      {allCertificates.map((cert) => (
                        <li key={cert.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{cert.title}</p>
                            <p className="text-xs text-slate-400">
                              {cert.issuer} · {cert.issueDate}
                            </p>
                          </div>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-blue-500 hover:underline whitespace-nowrap"
                            >
                              Verify →
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {/* [5] CREDLY PROFILE BUTTON */}
                    <a
                      href={SOCIAL_LINKS.credlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>View Credly Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            RESUME / CV SECTION
            =================================================================== */}
        <section
          id="resume"
          className={`py-16 border-b ${
            isDark ? 'border-slate-800/50' : 'border-slate-200/80'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div
              className={`rounded-2xl border p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 ${
                isDark
                  ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-950/30 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-2 max-w-xl">
                <div className="text-xs font-mono text-blue-500">07 · Curriculum Vitae</div>
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Interested in my background?
                </h2>
                <p
                  className={`text-sm sm:text-base ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Download my CV to learn more about my education, skills and academic work.
                </p>
                {customCvName && (
                  <p className="text-xs font-mono text-blue-400 pt-1">
                    Active custom CV file: {customCvName}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerCvDownload(editableCvData, customCvDataUrl, customCvName)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCvEditorOpen(true)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'border-blue-500/40 bg-blue-600/15 text-blue-300 hover:bg-blue-600/25'
                      : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit CV Online</span>
                </button>

                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
                      : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <span>Contact Me</span>
                </a>

                {/* [3] Optional Upload / Replace CV PDF button for easy management */}
                <input
                  ref={cvFileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cvFileInputRef.current?.click()}
                  title="Replace placeholder CV PDF with your own PDF file"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Replace CV PDF</span>
                </button>

                {customCvDataUrl && (
                  <button
                    type="button"
                    onClick={handleResetCv}
                    className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer px-2"
                  >
                    Reset CV
                  </button>
                )}
              </div>
            </div>

            {/* Interactive ATS-Friendly A4 College Student CV Sheet */}
            <div className="mt-8">
              <A4CvSheet
                cvData={editableCvData}
                onUpdatePhoto={(dataUrl) => {
                  const updated = {
                    ...normalizeCvData(editableCvData),
                    profilePhotoDataUrl: dataUrl,
                  };
                  handleSaveEditableCv(updated);
                }}
                onTogglePhotoShape={() => {
                  const current = normalizeCvData(editableCvData);
                  const updated: EditableCvData = {
                    ...current,
                    photoShape: current.photoShape === 'circle' ? 'rounded-square' : 'circle',
                  };
                  handleSaveEditableCv(updated);
                }}
                interactivePhotoControls={true}
              />
            </div>
          </div>
        </section>

        {/* ===================================================================
            CONTACT SECTION (Contact Form + Verified Phone, LinkedIn, Credly)
            =================================================================== */}
        <section id="contact" className="py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Contact Info (No fake email address) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-blue-500">08 · Get in Touch</div>
                  <h2
                    className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Contact Me
                  </h2>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Feel free to reach out regarding academic collaboration, IT & Cloud Computing
                    discussions, or learning opportunities.
                  </p>
                </div>

                <div
                  className={`rounded-2xl border divide-y ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/90 divide-slate-800/80'
                      : 'bg-white border-slate-200 divide-slate-200/80 shadow-sm'
                  }`}
                >
                  {/* Email */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">Email</div>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className={`text-sm sm:text-base font-semibold font-mono mt-0.5 block truncate hover:text-blue-500 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-500">Phone</div>
                      <a
                        href={`tel:${PERSONAL_INFO.phone}`}
                        className={`text-base font-semibold font-mono tabular-nums mt-0.5 inline-block hover:text-blue-500 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {PERSONAL_INFO.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">LinkedIn</div>
                      <a
                        href={SOCIAL_LINKS.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium mt-0.5 block truncate hover:text-blue-500 transition-colors ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {SOCIAL_LINKS.linkedinDisplay}
                      </a>
                    </div>
                    <a
                      href={SOCIAL_LINKS.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open LinkedIn Profile"
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Credly Profile */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">Credly Profile</div>
                      <a
                        href={SOCIAL_LINKS.credlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium mt-0.5 block truncate hover:text-blue-500 transition-colors ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {SOCIAL_LINKS.credlyDisplay}
                      </a>
                    </div>
                    <a
                      href={SOCIAL_LINKS.credlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Credly Profile"
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Facebook */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">Facebook</div>
                      <a
                        href={SOCIAL_LINKS.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium mt-0.5 block truncate hover:text-blue-500 transition-colors ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {SOCIAL_LINKS.facebookDisplay}
                      </a>
                    </div>
                    <a
                      href={SOCIAL_LINKS.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Facebook Profile"
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Instagram */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">Instagram</div>
                      <a
                        href={SOCIAL_LINKS.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium mt-0.5 block truncate hover:text-blue-500 transition-colors ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {SOCIAL_LINKS.instagramDisplay}
                      </a>
                    </div>
                    <a
                      href={SOCIAL_LINKS.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Instagram Profile"
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800/90'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <h3
                    className={`font-display text-lg font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Send a Message
                  </h3>

                  {contactStatus === 'submitted' && (
                    <div
                      className={`p-4 rounded-xl border text-sm flex items-start justify-between gap-3 ${
                        isDark
                          ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">Thank you! Your message has been saved.</p>
                        <p className="text-xs opacity-85 mt-0.5">
                          You can also connect directly with Upendra via Phone (
                          {PERSONAL_INFO.phone}) or LinkedIn.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContactStatus('idle')}
                        className="text-xs underline shrink-0"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-fullname"
                        className={`block text-xs font-medium ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-fullname"
                        type="text"
                        required
                        value={contactForm.fullName}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, fullName: e.target.value })
                        }
                        placeholder="Your full name"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                          isDark
                            ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className={`block text-xs font-medium ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                        placeholder="your.email@example.com"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                          isDark
                            ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className={`block text-xs font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, subject: e.target.value })
                      }
                      placeholder="Academic inquiry, project discussion, or networking"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                        isDark
                          ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className={`block text-xs font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      placeholder="Write your message here..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors resize-y ${
                        isDark
                          ? 'bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Send Message</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        fetchMessagesFromServer();
                        setIsInboxOpen(true);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        isDark
                          ? 'border-slate-700 bg-slate-800/90 text-blue-400 hover:bg-slate-800 hover:text-blue-300'
                          : 'border-slate-300 bg-slate-100 text-blue-700 hover:bg-slate-200'
                      }`}
                    >
                      <Inbox className="w-4 h-4" />
                      <span>
                        View Messages Inbox ({savedMessages.length}
                        {savedMessages.filter((m) => !m.read).length > 0
                          ? ` · ${savedMessages.filter((m) => !m.read).length} new`
                          : ''}
                        )
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer
        className={`border-t py-10 text-sm ${
          isDark
            ? 'bg-[#04070D] border-slate-800/80 text-slate-400'
            : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Upendra Bahadur Budha. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={SOCIAL_LINKS.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              LinkedIn
            </a>
            <a
              href={SOCIAL_LINKS.credlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Credly
            </a>
            <a
              href={SOCIAL_LINKS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Facebook
            </a>
            <a
              href={SOCIAL_LINKS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Instagram
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className={`font-medium transition-colors ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Email
            </a>
            <button
              type="button"
              onClick={() => {
                fetchMessagesFromServer();
                setIsInboxOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Inbox className="w-3.5 h-3.5 text-blue-500" />
              <span>Messages ({savedMessages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCvEditorOpen(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-500" />
              <span>Edit CV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Customization Guide</span>
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODAL: INTERACTIVE CV EDITOR & LIVE PREVIEW
          ===================================================================== */}
      <CvEditorModal
        isOpen={isCvEditorOpen}
        isDark={isDark}
        cvData={editableCvData}
        onClose={() => setIsCvEditorOpen(false)}
        onSaveCv={handleSaveEditableCv}
      />

      {/* =====================================================================
          MODAL: VISITOR MESSAGES INBOX
          ===================================================================== */}
      <MessagesInboxModal
        isOpen={isInboxOpen}
        isDark={isDark}
        messages={savedMessages}
        isLoading={isLoadingMessages}
        onClose={() => setIsInboxOpen(false)}
        onRefresh={fetchMessagesFromServer}
        onMarkRead={handleMarkMessageRead}
        onDelete={handleDeleteMessage}
        onNotify={showToast}
      />

      {/* =====================================================================
          MODAL: EDIT / DELETE ACADEMIC PROJECT
          ===================================================================== */}
      <EditProjectModal
        project={editingProject}
        isDark={isDark}
        onClose={() => setEditingProject(null)}
        onSaveProject={handleUpdateAcademicProject}
        onDeleteProject={handleDeleteAcademicProject}
      />

      {/* =====================================================================
          MODAL 1: ACADEMIC PROJECT DETAILS MODAL
          ===================================================================== */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
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
              <span className="text-xs font-mono text-blue-500">{selectedProject.badge}</span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {getProjectImage(selectedProject) ? (
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800/60">
                  <img
                    src={getProjectImage(selectedProject)}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`rounded-xl border p-6 text-center ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <p className="font-display text-sm font-semibold">Project Image Coming Soon</p>
                  <p className="text-xs mt-1">
                    Suggested file location: <code>{selectedProject.suggestedAssetPath}</code> or
                    use the “Add Project Image” button on the card.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h3 id="modal-project-title" className="font-display text-2xl font-bold">
                  {selectedProject.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedProject.detailedOverview}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono text-blue-500">
                  Academic Learning Objectives & Scope
                </h4>
                <ul
                  className={`space-y-2 text-sm list-disc pl-5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {selectedProject.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div
                className={`pt-4 border-t text-xs font-mono ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                Topics: {selectedProject.topics.join(' · ')}
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Note: This entry represents an academic project, concept, or coursework activity by
                Upendra Bahadur Budha and is not presented as a commercial product.
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    setEditingProject(proj);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAcademicProject(selectedProject.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600/15 text-rose-400 hover:bg-rose-600/25 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ADD ACADEMIC PROJECT MODAL
          ===================================================================== */}
      {isAddProjectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setIsAddProjectModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl ${
              isDark
                ? 'bg-[#0B101E] border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <h3 id="add-project-modal-title" className="font-display text-lg font-bold">
                Add Academic Project / Coursework
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAcademicProject} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  placeholder="e.g., Cloud Storage Lab Concept"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium">Academic Label *</label>
                  <select
                    value={newProjectForm.badge}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, badge: e.target.value })
                    }
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Academic Project / Concept">Academic Project / Concept</option>
                    <option value="Academic Project">Academic Project</option>
                    <option value="Coursework">Coursework</option>
                    <option value="Project Concept">Project Concept</option>
                    <option value="Academic Work">Academic Work</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">Category</label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        category: e.target.value as AcademicProject['category'],
                      })
                    }
                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Web & Concept">Web & Concept</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Hardware & IoT">Hardware & IoT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newProjectForm.shortDescription}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, shortDescription: e.target.value })
                  }
                  placeholder="Describe the academic goal or concept of this coursework..."
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium">
                  Technologies / Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={newProjectForm.topicsInput}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, topicsInput: e.target.value })
                  }
                  placeholder="e.g., Cloud Computing, Networking, HTML5"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  Save Academic Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: DEVELOPER & CODE CUSTOMIZATION GUIDE (7 STEPS)
          ===================================================================== */}
      {isGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={() => setIsGuideOpen(false)}
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
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <h3 id="guide-modal-title" className="font-display text-lg font-bold">
                Code & Content Customization Guide
              </h3>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                All portfolio data and comments are organized in{' '}
                <code className="font-mono text-blue-400">src/data/portfolioData.ts</code> (and
                mirrored in <code className="font-mono text-blue-400">public/portfolio/</code>):
              </p>

              <ol className="space-y-3 list-decimal pl-5">
                <li>
                  <strong>Change Profile Photo:</strong> Click{' '}
                  <em>“Change Profile Photo”</em> or <em>“Upload New Photo”</em> directly under your
                  hero portrait, or update <code className="font-mono">DEFAULT_PROFILE_IMAGE</code>{' '}
                  in <code className="font-mono">src/data/portfolioData.ts</code>.
                </li>
                <li>
                  <strong>Add Project Images:</strong> Click <em>“Add Project Image”</em> on any
                  academic project card to upload a real screenshot, or set the{' '}
                  <code className="font-mono">imageUrl</code> path in{' '}
                  <code className="font-mono">DEFAULT_ACADEMIC_PROJECTS</code>.
                </li>
                <li>
                  <strong>Add Your CV:</strong> Click <em>“Replace CV PDF”</em> in the Resume
                  section or place your PDF at{' '}
                  <code className="font-mono">public/assets/cv/Upendra-Bahadur-Budha-CV.pdf</code>.
                </li>
                <li>
                  <strong>Update LinkedIn:</strong> Edit{' '}
                  <code className="font-mono">SOCIAL_LINKS.linkedinUrl</code> in{' '}
                  <code className="font-mono">src/data/portfolioData.ts</code>.
                </li>
                <li>
                  <strong>Update Credly:</strong> Edit{' '}
                  <code className="font-mono">SOCIAL_LINKS.credlyUrl</code> in{' '}
                  <code className="font-mono">src/data/portfolioData.ts</code>.
                </li>
                <li>
                  <strong>Add Future Certificates:</strong> Add earned credentials to the{' '}
                  <code className="font-mono">EARNED_CERTIFICATES</code> array in{' '}
                  <code className="font-mono">src/data/portfolioData.ts</code>.
                </li>
                <li>
                  <strong>Add Future Projects:</strong> Click <em>“Add Project”</em> in the
                  Academic Projects section or append to{' '}
                  <code className="font-mono">DEFAULT_ACADEMIC_PROJECTS</code>.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
