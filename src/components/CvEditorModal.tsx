import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Eye,
  Edit3,
  Upload,
  Camera,
  Printer,
} from 'lucide-react';
import {
  EditableCvData,
  getDefaultCvData,
  normalizeCvData,
  triggerCvDownload,
} from '../utils/cvGenerator';
import { A4CvSheet } from './A4CvSheet';

interface CvEditorModalProps {
  isOpen: boolean;
  isDark: boolean;
  cvData: EditableCvData;
  onClose: () => void;
  onSaveCv: (updated: EditableCvData) => void;
}

export const CvEditorModal: React.FC<CvEditorModalProps> = ({
  isOpen,
  isDark,
  cvData,
  onClose,
  onSaveCv,
}) => {
  const [draft, setDraft] = useState<EditableCvData>(() => normalizeCvData(cvData));
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newSkillText, setNewSkillText] = useState('');
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(normalizeCvData(cvData));
    }
  }, [isOpen, cvData]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCv(draft);
    onClose();
  };

  const handleResetDefault = () => {
    const def = getDefaultCvData();
    setDraft(def);
    onSaveCv(def);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((prev) => ({ ...prev, profilePhotoDataUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addCoreSkill = () => {
    const trimmed = newSkillText.trim();
    if (!trimmed) return;
    setDraft({
      ...draft,
      technicalSkillsList: [...draft.technicalSkillsList, trimmed],
    });
    setNewSkillText('');
  };

  const removeCoreSkill = (index: number) => {
    setDraft({
      ...draft,
      technicalSkillsList: draft.technicalSkillsList.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setDraft({
      ...draft,
      education: [
        ...draft.education,
        {
          id: `edu-${Date.now()}`,
          institution: 'LBEF College',
          degree: 'Bachelor of Science in Information Technology (BSc IT)',
          status: 'Currently Studying',
          focus: 'Cloud Computing & Information Technology',
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setDraft({
      ...draft,
      education: draft.education.filter((e) => e.id !== id),
    });
  };

  const addSkillCategory = () => {
    setDraft({
      ...draft,
      skills: [
        ...draft.skills,
        {
          id: `skill-${Date.now()}`,
          category: 'Additional Skill Category',
          items: 'Skill 1, Skill 2',
        },
      ],
    });
  };

  const removeSkillCategory = (id: string) => {
    setDraft({
      ...draft,
      skills: draft.skills.filter((s) => s.id !== id),
    });
  };

  const addExperience = () => {
    setDraft({
      ...draft,
      experiences: [
        ...draft.experiences,
        {
          id: `exp-${Date.now()}`,
          title: 'Academic / Practical Learning Activity',
          subtitle: 'BSc IT Student | LBEF College',
          description:
            'Describe your academic coursework, lab practice, technical learning, or college activity.',
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setDraft({
      ...draft,
      experiences: draft.experiences.filter((ex) => ex.id !== id),
    });
  };

  const addCvProject = () => {
    setDraft({
      ...draft,
      projects: [
        ...draft.projects,
        {
          id: `cv-proj-${Date.now()}`,
          title: 'New Academic / IT Project',
          badge: 'Academic Project',
          description: 'Academic coursework or project concept description.',
        },
      ],
    });
  };

  const removeCvProject = (id: string) => {
    setDraft({
      ...draft,
      projects: draft.projects.filter((p) => p.id !== id),
    });
  };

  const addCompletedCert = () => {
    setDraft({
      ...draft,
      completedCertifications: [
        ...draft.completedCertifications,
        {
          id: `cert-${Date.now()}`,
          title: '',
          issuer: '',
          issueDate: '',
          credentialUrl: '',
        },
      ],
    });
  };

  const removeCompletedCert = (id: string) => {
    setDraft({
      ...draft,
      completedCertifications: draft.completedCertifications.filter((c) => c.id !== id),
    });
  };

  const addAdditionalSection = () => {
    setDraft({
      ...draft,
      additionalSections: [
        ...draft.additionalSections,
        {
          id: `custom-sec-${Date.now()}`,
          heading: 'Languages / Additional Information',
          content: 'English — Professional Working Proficiency\nNepali — Native Proficiency',
        },
      ],
    });
  };

  const removeAdditionalSection = (id: string) => {
    setDraft({
      ...draft,
      additionalSections: draft.additionalSections.filter((s) => s.id !== id),
    });
  };

  const handlePrintA4 = () => {
    onSaveCv(draft);
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const inputClass = `w-full px-3 py-2 text-xs sm:text-sm rounded-lg border outline-none transition-colors ${
    isDark
      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
  }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm print:static print:bg-white print:p-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl rounded-2xl border overflow-hidden shadow-2xl max-h-[94vh] flex flex-col print:max-h-none print:border-none print:shadow-none ${
          isDark
            ? 'bg-[#0B101E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header (Hidden on Print) */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 print:hidden ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div>
            <h3 id="cv-editor-title" className="font-display text-lg font-bold">
              ATS-Friendly College Student CV Editor & A4 Builder
            </h3>
            <p className="text-xs text-slate-400">
              Upload your top-right profile picture, edit all CV sections, or add custom sections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit CV & Additional Options</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live A4 CV Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close CV Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 print:p-0 print:overflow-visible">
          {activeTab === 'edit' ? (
            <form id="cv-edit-form" onSubmit={handleSave} className="space-y-6">
              {/* =============================================================
                  TOP-RIGHT CV PROFILE PICTURE UPLOAD SECTION
                  ============================================================= */}
              <div
                className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-mono text-blue-500">
                    Top-Right CV Profile Picture (Passport Style)
                  </div>
                  <h4 className="font-display text-sm sm:text-base font-bold">
                    Profile Picture on CV
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Displayed at the top-right corner of your A4 CV. If no photo is uploaded, a
                    clean “Add Profile Photo” placeholder is shown (no fake or generated faces).
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {draft.profilePhotoDataUrl
                          ? 'Change Profile Picture'
                          : 'Upload Profile Picture / Add Profile Photo'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          photoShape:
                            draft.photoShape === 'circle' ? 'rounded-square' : 'circle',
                        })
                      }
                      className={`px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Frame: {draft.photoShape === 'circle' ? 'Circular' : 'Rounded-Square'}
                    </button>

                    {draft.profilePhotoDataUrl && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, profilePhotoDataUrl: '' })}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-rose-600/15 text-rose-400 hover:bg-rose-600/25 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview of the Top-Right Photo Slot */}
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className={`shrink-0 overflow-hidden border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    draft.photoShape === 'circle'
                      ? 'w-24 h-24 rounded-full'
                      : 'w-24 h-28 rounded-xl'
                  } ${
                    draft.profilePhotoDataUrl
                      ? 'border-blue-500/60 bg-slate-950'
                      : 'border-dashed border-slate-600 bg-slate-950/50 hover:border-blue-500'
                  }`}
                >
                  {draft.profilePhotoDataUrl ? (
                    <img
                      src={draft.profilePhotoDataUrl}
                      alt="CV Profile Preview"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="p-2 flex flex-col items-center">
                      <Camera className="w-5 h-5 text-blue-400 mb-1" />
                      <span className="text-[10px] font-semibold leading-tight">
                        Add Profile Photo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* =============================================================
                  01 · PERSONAL INFORMATION
                  ============================================================= */}
              <div className="space-y-3 pt-2 border-t border-slate-800/60">
                <h4 className="text-xs font-mono text-blue-500">01 · Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={draft.fullName}
                      onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Education / Degree</label>
                    <input
                      type="text"
                      value={draft.educationHeadline}
                      onChange={(e) => setDraft({ ...draft, educationHeadline: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">College</label>
                    <input
                      type="text"
                      value={draft.college}
                      onChange={(e) => setDraft({ ...draft, college: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Current Status</label>
                    <input
                      type="text"
                      value={draft.currentStatus}
                      onChange={(e) => setDraft({ ...draft, currentStatus: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={draft.email || ''}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={draft.linkedinDisplay}
                      onChange={(e) => setDraft({ ...draft, linkedinDisplay: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Credly URL</label>
                    <input
                      type="text"
                      value={draft.credlyUrl}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          credlyUrl: e.target.value,
                          credlyDisplay: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={draft.location}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* =============================================================
                  02 · CAREER OBJECTIVE & PROFESSIONAL SUMMARY
                  ============================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono text-blue-500">02 · Career Objective</h4>
                  <textarea
                    rows={4}
                    value={draft.careerObjective}
                    onChange={(e) => setDraft({ ...draft, careerObjective: e.target.value })}
                    placeholder="Concise career objective for internships, trainee, part-time, or entry-level IT roles..."
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono text-blue-500">03 · Professional Summary</h4>
                  <textarea
                    rows={4}
                    value={draft.summary}
                    onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                    placeholder="Professional summary highlighting BSc IT skills, teamwork, problem solving, and communication..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* =============================================================
                  04 · EDUCATION
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-blue-500">04 · Education</h4>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>
                {draft.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className={`p-3.5 rounded-xl border space-y-2.5 ${
                      isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx] = { ...edu, degree: e.target.value };
                          setDraft({ ...draft, education: next });
                        }}
                        placeholder="Degree (e.g., Bachelor of Science in Information Technology (BSc IT))"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx] = { ...edu, institution: e.target.value };
                          setDraft({ ...draft, education: next });
                        }}
                        placeholder="College (e.g., LBEF College)"
                        className={inputClass}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={edu.status}
                          onChange={(e) => {
                            const next = [...draft.education];
                            next[idx] = { ...edu, status: e.target.value };
                            setDraft({ ...draft, education: next });
                          }}
                          placeholder="Status (e.g., Currently Studying)"
                          className={inputClass}
                        />
                        {draft.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={edu.focus}
                      onChange={(e) => {
                        const next = [...draft.education];
                        next[idx] = { ...edu, focus: e.target.value };
                        setDraft({ ...draft, education: next });
                      }}
                      placeholder="Key coursework / specialization"
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              {/* =============================================================
                  05 · TECHNICAL & PROFESSIONAL SKILLS
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-mono text-blue-500">
                    05 · Technical & Professional Skills (ATS Keywords)
                  </h4>
                  <button
                    type="button"
                    onClick={addSkillCategory}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill Category Row</span>
                  </button>
                </div>

                {/* Core Skills Tag List Editor */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2.5 ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-400">
                    Core Skills List (Cisco Networking, Cloud Computing, Cybersecurity
                    Fundamentals, Web Development, Basic Programming, Video Editing, Content
                    Creation, Problem Solving, Teamwork, Communication):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.technicalSkillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border ${
                          isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-200'
                            : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeCoreSkill(idx)}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          title="Delete skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCoreSkill();
                        }
                      }}
                      placeholder="Add another skill (e.g., Linux Fundamentals)..."
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addCoreSkill}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shrink-0 cursor-pointer"
                    >
                      + Add Skill
                    </button>
                  </div>
                </div>

                {/* Detailed Skill Category Rows */}
                <div className="space-y-2">
                  {draft.skills.map((sk, idx) => (
                    <div key={sk.id} className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={sk.category}
                        onChange={(e) => {
                          const next = [...draft.skills];
                          next[idx] = { ...sk, category: e.target.value };
                          setDraft({ ...draft, skills: next });
                        }}
                        placeholder="Category"
                        className={`${inputClass} sm:w-52 shrink-0`}
                      />
                      <input
                        type="text"
                        value={sk.items}
                        onChange={(e) => {
                          const next = [...draft.skills];
                          next[idx] = { ...sk, items: e.target.value };
                          setDraft({ ...draft, skills: next });
                        }}
                        placeholder="Skills in this group"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillCategory(sk.id)}
                        className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                        title="Delete skill category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* =============================================================
                  06 · EXPERIENCE (ACADEMIC, PRACTICAL, TECHNICAL & COLLEGE ACTIVITIES)
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-blue-500">
                    06 · Experience (Academic Projects, Practical Learning, Technical & College
                    Activities)
                  </h4>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience Item</span>
                  </button>
                </div>
                <div className="space-y-2.5">
                  {draft.experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[idx] = { ...exp, title: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          placeholder="Area (e.g., Academic Projects & Coursework)"
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={exp.subtitle}
                          onChange={(e) => {
                            const next = [...draft.experiences];
                            next[idx] = { ...exp, subtitle: e.target.value };
                            setDraft({ ...draft, experiences: next });
                          }}
                          placeholder="Context (e.g., LBEF College)"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                          title="Delete experience item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[idx] = { ...exp, description: e.target.value };
                          setDraft({ ...draft, experiences: next });
                        }}
                        placeholder="Description of practical learning or academic activity"
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* =============================================================
                  07 · ACADEMIC PROJECTS
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-blue-500">07 · Academic Projects</h4>
                  <button
                    type="button"
                    onClick={addCvProject}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project to CV</span>
                  </button>
                </div>
                <div className="space-y-2.5">
                  {draft.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[idx] = { ...proj, title: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="Project Title"
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={proj.badge}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[idx] = { ...proj, badge: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          placeholder="Academic Label"
                          className={`${inputClass} sm:w-56 shrink-0`}
                        />
                        <button
                          type="button"
                          onClick={() => removeCvProject(proj.id)}
                          className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                          title="Delete project from CV"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[idx] = { ...proj, description: e.target.value };
                          setDraft({ ...draft, projects: next });
                        }}
                        placeholder="Project description"
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* =============================================================
                  08 · CERTIFICATIONS & DIGITAL CREDENTIALS
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-blue-500">
                    08 · Certifications & Digital Credentials (Credly)
                  </h4>
                  <button
                    type="button"
                    onClick={addCompletedCert}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Completed Certification</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={draft.credentialsNote}
                  onChange={(e) => setDraft({ ...draft, credentialsNote: e.target.value })}
                  className={inputClass}
                />

                {draft.completedCertifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className={`p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-4 gap-2 items-center ${
                      isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => {
                        const next = [...draft.completedCertifications];
                        next[idx] = { ...cert, title: e.target.value };
                        setDraft({ ...draft, completedCertifications: next });
                      }}
                      placeholder="Certificate Name"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const next = [...draft.completedCertifications];
                        next[idx] = { ...cert, issuer: e.target.value };
                        setDraft({ ...draft, completedCertifications: next });
                      }}
                      placeholder="Issuer (e.g., Cisco)"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={cert.issueDate}
                      onChange={(e) => {
                        const next = [...draft.completedCertifications];
                        next[idx] = { ...cert, issueDate: e.target.value };
                        setDraft({ ...draft, completedCertifications: next });
                      }}
                      placeholder="Date Completed"
                      className={inputClass}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert.credentialUrl}
                        onChange={(e) => {
                          const next = [...draft.completedCertifications];
                          next[idx] = { ...cert, credentialUrl: e.target.value };
                          setDraft({ ...draft, completedCertifications: next });
                        }}
                        placeholder="Verification URL (Optional)"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeCompletedCert(cert.id)}
                        className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* =============================================================
                  09 · ADDITIONAL CUSTOM SECTIONS (Add / Edit / Delete Any Section)
                  ============================================================= */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-mono text-blue-500">
                      09 · Additional Custom CV Sections (Languages, Interests, References, etc.)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Add any extra sections you want on your CV and edit or delete them anytime.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addAdditionalSection}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Additional Section</span>
                  </button>
                </div>

                {draft.additionalSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-3.5 rounded-xl border space-y-2.5 ${
                      isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const next = [...draft.additionalSections];
                          next[idx] = { ...sec, heading: e.target.value };
                          setDraft({ ...draft, additionalSections: next });
                        }}
                        placeholder="Section Heading (e.g., Languages, Workshops, References)"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalSection(sec.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                        title="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={(e) => {
                        const next = [...draft.additionalSections];
                        next[idx] = { ...sec, content: e.target.value };
                        setDraft({ ...draft, additionalSections: next });
                      }}
                      placeholder="Enter bullet points (one per line)..."
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </form>
          ) : (
            /* Live A4 CV Preview with Interactive Top-Right Profile Photo Upload */
            <div className="bg-slate-200/70 dark:bg-slate-950/80 p-2 sm:p-6 rounded-xl print:p-0 print:bg-white">
              <A4CvSheet
                cvData={draft}
                onUpdatePhoto={(dataUrl) =>
                  setDraft((prev) => ({ ...prev, profilePhotoDataUrl: dataUrl }))
                }
                onTogglePhotoShape={() =>
                  setDraft((prev) => ({
                    ...prev,
                    photoShape: prev.photoShape === 'circle' ? 'rounded-square' : 'circle',
                  }))
                }
                interactivePhotoControls={true}
              />
            </div>
          )}
        </div>

        {/* Modal Footer (Hidden on Print) */}
        <div
          className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 print:hidden ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default CV</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintA4}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-blue-500" />
              <span>Print / Save A4 PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSaveCv(draft);
                triggerCvDownload(draft, null, null);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Save & Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSaveCv(draft);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save CV Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
