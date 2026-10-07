import React, { useRef } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { EditableCvData, normalizeCvData } from '../utils/cvGenerator';

interface A4CvSheetProps {
  cvData: EditableCvData;
  onUpdatePhoto?: (dataUrl: string) => void;
  onTogglePhotoShape?: () => void;
  interactivePhotoControls?: boolean;
}

export const A4CvSheet: React.FC<A4CvSheetProps> = ({
  cvData: rawCvData,
  onUpdatePhoto,
  onTogglePhotoShape,
  interactivePhotoControls = true,
}) => {
  const cv = normalizeCvData(rawCvData);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdatePhoto) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdatePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      id="printable-a4-cv"
      className="w-full max-w-[210mm] mx-auto bg-white text-slate-900 rounded-xl border border-slate-200 shadow-lg p-6 sm:p-10 md:p-12 font-sans leading-relaxed print:shadow-none print:border-none print:p-0 print:max-w-none"
    >
      {/* =====================================================================
          CV HEADER: Left Personal Info + Top-Right Passport Profile Photo
          ===================================================================== */}
      <header className="flex flex-col-reverse sm:flex-row items-start justify-between gap-6 pb-5 border-b-2 border-slate-900">
        {/* Left: Name, Headline, Status & Contact Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase">
              {cv.fullName}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-800 mt-0.5">
              {cv.educationHeadline}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                <span>{cv.college}</span>
              </span>
              <span className="text-slate-400">·</span>
              <span>{cv.currentStatus}</span>
            </p>
          </div>

          {/* ATS-Friendly Contact Grid */}
          <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-semibold text-slate-900">Phone:</span>
              <a href={`tel:${cv.phone}`} className="hover:text-blue-700">
                {cv.phone}
              </a>
            </div>

            {cv.email && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-900">Email:</span>
                <a href={`mailto:${cv.email}`} className="truncate hover:text-blue-700">
                  {cv.email}
                </a>
              </div>
            )}

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-slate-900 shrink-0">LinkedIn:</span>
              <a
                href={
                  cv.linkedinDisplay.startsWith('http')
                    ? cv.linkedinDisplay
                    : `https://${cv.linkedinDisplay}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-700 hover:underline"
              >
                {cv.linkedinDisplay}
              </a>
            </div>

            {cv.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-900">Location:</span>
                <span>{cv.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Top-Right Corner: Professional Passport-Style Profile Picture Frame */}
        <div className="flex flex-col items-center sm:items-end shrink-0">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            className={`relative overflow-hidden border-2 transition-all ${
              cv.photoShape === 'circle'
                ? 'w-28 h-28 rounded-full'
                : 'w-28 h-32 rounded-xl'
            } ${
              cv.profilePhotoDataUrl
                ? 'border-slate-300 bg-slate-100 shadow-sm'
                : 'border-dashed border-slate-400 bg-slate-50 hover:border-blue-600 hover:bg-blue-50/40'
            }`}
          >
            {cv.profilePhotoDataUrl ? (
              <img
                src={cv.profilePhotoDataUrl}
                alt={`${cv.fullName} Profile Photo`}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <button
                type="button"
                onClick={() => interactivePhotoControls && photoInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer"
                title="Click to upload a passport-style profile photo"
              >
                <Camera className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Add Profile Photo
                </span>
                <span className="text-[9.5px] text-slate-500 mt-0.5 leading-tight print:hidden">
                  Upload Picture
                </span>
              </button>
            )}
          </div>

          {/* Interactive Upload / Change / Shape Controls below top-right frame (hidden when printing) */}
          {interactivePhotoControls && onUpdatePhoto && (
            <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5 print:hidden">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>
                  {cv.profilePhotoDataUrl ? 'Change Photo' : 'Upload Profile Picture'}
                </span>
              </button>

              {onTogglePhotoShape && (
                <button
                  type="button"
                  onClick={onTogglePhotoShape}
                  className="px-2 py-1 text-[10px] font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Switch between Rounded-Square and Circular frame"
                >
                  {cv.photoShape === 'circle' ? 'Rounded Frame' : 'Circle Frame'}
                </button>
              )}

              {cv.profilePhotoDataUrl && (
                <button
                  type="button"
                  onClick={() => onUpdatePhoto('')}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                  title="Remove profile photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =====================================================================
          CV BODY SECTIONS (ATS-Friendly Hierarchy)
          ===================================================================== */}
      <div className="mt-5 space-y-5 text-xs sm:text-[13px] text-slate-800">
        {/* 1. CAREER OBJECTIVE */}
        {cv.careerObjective.trim() && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
              Career Objective
            </h2>
            <p className="leading-relaxed text-slate-700">{cv.careerObjective}</p>
          </section>
        )}

        {/* 2. PROFESSIONAL SUMMARY */}
        {cv.summary.trim() && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="leading-relaxed text-slate-700">{cv.summary}</p>
          </section>
        )}

        {/* 3. EDUCATION */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
            Education
          </h2>
          <div className="space-y-3">
            {cv.education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">{edu.degree}</h3>
                  <p className="font-medium text-slate-800">{edu.institution}</p>
                  {edu.focus && <p className="text-xs text-slate-600 mt-0.5">{edu.focus}</p>}
                </div>
                <span className="text-xs font-semibold text-blue-800 shrink-0">{edu.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TECHNICAL & PROFESSIONAL SKILLS */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
            Technical Skills & Core Competencies
          </h2>

          {/* Core 10 ATS Skill Items */}
          {cv.technicalSkillsList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-1.5 mb-3">
              {cv.technicalSkillsList.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grouped Skill Breakdown */}
          {cv.skills.length > 0 && (
            <ul className="space-y-1 text-xs text-slate-700 pt-1.5 border-t border-slate-100">
              {cv.skills.map((s) => (
                <li key={s.id}>
                  <strong className="text-slate-900">{s.category}:</strong> {s.items}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 5. EXPERIENCE (Academic Projects, Practical Learning, Technical Experience, College Activities) */}
        {cv.experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
              Experience — Academic, Practical & Technical Learning
            </h2>
            <div className="space-y-3">
              {cv.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-slate-950">{exp.title}</h3>
                    <span className="text-xs font-medium text-slate-600">{exp.subtitle}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. ACADEMIC PROJECTS */}
        {cv.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
              Academic Projects
            </h2>
            <div className="space-y-2.5">
              {cv.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-slate-950">{proj.title}</h3>
                    <span className="text-[11px] font-mono text-blue-800">{proj.badge}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. CERTIFICATIONS & DIGITAL CREDENTIALS */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
            Certifications & Digital Credentials
          </h2>
          <p className="text-xs text-slate-700">{cv.credentialsNote}</p>

          {cv.completedCertifications.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-xs text-slate-800 list-disc pl-5">
              {cv.completedCertifications.map((cert) => (
                <li key={cert.id}>
                  <strong className="text-slate-950">{cert.title}</strong> — {cert.issuer} (
                  {cert.issueDate})
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-700 hover:underline"
                    >
                      Verify Credential
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-900">Verified Credly Profile:</span>
            <a
              href={cv.credlyUrl || 'https://www.credly.com/users/upendra-bahadur-budha'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium"
            >
              <span>{cv.credlyUrl || 'https://www.credly.com/users/upendra-bahadur-budha'}</span>
              <ExternalLink className="w-3 h-3 print:hidden" />
            </a>
          </div>
        </section>

        {/* 8. ADDITIONAL CUSTOM SECTIONS (Added by Student in CV Editor) */}
        {cv.additionalSections.map((sec) => {
          if (!sec.heading.trim()) return null;
          const lines = sec.content
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          return (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">
                {sec.heading}
              </h2>
              {lines.length <= 1 ? (
                <p className="text-xs text-slate-700 leading-relaxed">{sec.content}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  {lines.map((line, i) => (
                    <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
