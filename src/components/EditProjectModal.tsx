import React, { useState, useEffect } from 'react';
import { X, Trash2, Check, Edit3 } from 'lucide-react';
import { AcademicProject } from '../data/portfolioData';

interface EditProjectModalProps {
  project: AcademicProject | null;
  isDark: boolean;
  onClose: () => void;
  onSaveProject: (updated: AcademicProject) => void;
  onDeleteProject: (projectId: string) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isDark,
  onClose,
  onSaveProject,
  onDeleteProject,
}) => {
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('Academic Project / Concept');
  const [category, setCategory] = useState<AcademicProject['category']>('Web & Concept');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedOverview, setDetailedOverview] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [topicsInput, setTopicsInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setBadge(project.badge);
      setCategory(project.category);
      setShortDescription(project.shortDescription);
      setDetailedOverview(project.detailedOverview);
      setObjectivesText(project.learningObjectives.join('\n'));
      setTopicsInput(project.topics.join(', '));
      setConfirmDelete(false);
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim()) return;

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const learningObjectives = objectivesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const updated: AcademicProject = {
      ...project,
      title: title.trim(),
      badge: badge.trim() || 'Academic Project / Concept',
      category,
      shortDescription: shortDescription.trim(),
      detailedOverview: detailedOverview.trim() || shortDescription.trim(),
      learningObjectives:
        learningObjectives.length > 0
          ? learningObjectives
          : ['Academic coursework and conceptual design learning'],
      topics: topics.length > 0 ? topics : ['Academic Project', 'Coursework'],
    };

    onSaveProject(updated);
    onClose();
  };

  const inputClass = `w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition-colors ${
    isDark
      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
  }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-2xl border overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
          isDark
            ? 'bg-[#0B101E] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-500" />
            <h3 id="edit-project-modal-title" className="font-display text-lg font-bold">
              Edit Academic Project
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close Edit Project Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="space-y-1">
            <label className="block text-xs font-medium">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium">Academic Label / Badge *</label>
              <input
                type="text"
                required
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Academic Project / Concept"
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AcademicProject['category'])}
                className={inputClass}
              >
                <option value="Web & Concept">Web & Concept</option>
                <option value="Cloud & Systems">Cloud & Systems</option>
                <option value="Hardware & IoT">Hardware & IoT</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">Short Description (Card Summary) *</label>
            <textarea
              rows={2}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Detailed Overview (Shown in View Details)
            </label>
            <textarea
              rows={3}
              value={detailedOverview}
              onChange={(e) => setDetailedOverview(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Learning Objectives (One bullet point per line)
            </label>
            <textarea
              rows={3}
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Technologies / Topics (Comma-separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Footer inside form with Delete Option & Save Option */}
          <div
            className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            {/* Delete Option inside Edit Modal */}
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600/15 text-rose-400 hover:bg-rose-600/25 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProject(project.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
