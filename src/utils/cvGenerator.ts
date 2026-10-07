/**
 * ============================================================================
 * ATS-FRIENDLY A4 CV GENERATOR, PRINT & PDF DOWNLOAD UTILITY
 * ============================================================================
 * Supports:
 * 1. Full ATS-friendly college student CV structure for Upendra Bahadur Budha
 * 2. Top-right profile picture (Passport-style rounded-square or circular frame)
 *    with a clean "Add Profile Photo" placeholder by default (no invented face)
 * 3. Career Objective, Professional Summary, Education, Technical Skills,
 *    Academic & Practical Experience, Academic Projects, Certifications & Credly,
 *    and Additional Custom Sections
 * 4. 1-2 Page A4 PDF generation & Print-ready A4 layout
 * ============================================================================
 */

import {
  DEFAULT_PROFILE_IMAGE,
  PERSONAL_INFO,
  SOCIAL_LINKS,
  CV_DOWNLOAD_FILENAME,
} from '../data/portfolioData';

export interface EditableCvEducation {
  id: string;
  institution: string;
  degree: string;
  status: string;
  focus: string;
}

export interface EditableCvSkillLine {
  id: string;
  category: string;
  items: string;
}

export interface EditableCvProject {
  id: string;
  title: string;
  badge: string;
  description: string;
}

export interface EditableCvExperience {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface EditableCvCertification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
}

export interface EditableCvCustomSection {
  id: string;
  heading: string;
  content: string; // multi-line bullet points (one per line)
}

export interface EditableCvData {
  fullName: string;
  educationHeadline: string;
  roleTitle: string;
  college: string;
  currentStatus: string;
  location: string;
  phone: string;
  email: string;
  linkedinDisplay: string;
  linkedinUrl: string;
  credlyDisplay: string;
  credlyUrl: string;
  /**
   * Top-right CV profile photo (Data URL).
   * Empty string "" by default so the CV displays a clean "Add Profile Photo"
   * placeholder until Upendra uploads a passport-style photo.
   */
  profilePhotoDataUrl: string;
  photoShape: 'rounded-square' | 'circle';
  careerObjective: string;
  summary: string;
  education: EditableCvEducation[];
  technicalSkillsList: string[];
  skills: EditableCvSkillLine[];
  experiences: EditableCvExperience[];
  projects: EditableCvProject[];
  credentialsNote: string;
  completedCertifications: EditableCvCertification[];
  additionalSections: EditableCvCustomSection[];
}

export function getDefaultCvData(): EditableCvData {
  return {
    fullName: 'Upendra Bahadur Budha',
    educationHeadline: 'Bachelor of Science in Information Technology (BSc IT)',
    roleTitle: 'BSc IT – Cloud Computing Student',
    college: 'LBEF College',
    currentStatus: 'Undergraduate / College Student',
    location: 'Kathmandu, Nepal',
    phone: '9701269514',
    email: PERSONAL_INFO.email || 'upendrabudha505@gmail.com',
    linkedinDisplay: 'www.linkedin.com/in/upendra-budha-6b9240329',
    linkedinUrl: 'http://www.linkedin.com/in/upendra-budha-6b9240329',
    credlyDisplay: 'https://www.credly.com/users/upendra-bahadur-budha',
    credlyUrl: SOCIAL_LINKS.credlyUrl || 'https://www.credly.com/users/upendra-bahadur-budha',
    profilePhotoDataUrl: DEFAULT_PROFILE_IMAGE,
    photoShape: 'rounded-square',
    careerObjective:
      'To become a successful entrepreneur by combining my knowledge of Information Technology with creativity, innovation, and problem-solving skills. As a BSc IT student specializing in Cloud Computing, I aim to gain practical experience, develop strong technical and business skills, and create innovative technology-driven solutions that can solve real-world problems and generate meaningful opportunities.',
    summary:
      'Enthusiastic and dedicated BSc IT undergraduate student at LBEF College specializing in Cloud Computing, with strong academic and practical interests in Cisco Networking, Cybersecurity, Web Development, Video Editing, and Content Creation. Known for a proactive willingness to learn, analytical problem-solving, effective teamwork, and clear communication across technical coursework and digital projects.',
    education: [
      {
        id: 'edu-1',
        institution: 'LBEF College',
        degree: 'Bachelor of Science in Information Technology (BSc IT)',
        status: 'Currently Studying',
        focus:
          'Specialization: Cloud Computing | Core Areas: Cisco Networking, Cybersecurity Fundamentals, Web Development, Basic Programming',
      },
    ],
    technicalSkillsList: [
      'Cisco Networking',
      'Cloud Computing',
      'Cybersecurity Fundamentals',
      'Web Development',
      'Basic Programming',
      'Video Editing',
      'Content Creation',
      'Problem Solving',
      'Teamwork',
      'Communication',
      'basic linux',
    ],
    skills: [
      {
        id: 'skill-net-cloud',
        category: 'Networking & Cloud',
        items: 'Cisco Networking, Cloud Computing, Network Topologies, Routing & Switching Concepts',
      },
      {
        id: 'skill-sec-dev',
        category: 'Security & Development',
        items: 'Cybersecurity Fundamentals, Web Development (HTML, CSS, JavaScript), Basic Programming',
      },
      {
        id: 'skill-creative-soft',
        category: 'Media & Professional Skills',
        items: 'Video Editing, Content Creation, Problem Solving, Teamwork, Communication',
      },
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'Academic Projects & Coursework',
        subtitle: 'Undergraduate BSc IT Student | LBEF College',
        description:
          'Planned, designed, and documented academic IT projects across web development, smart-home automation concepts, and network architectures as part of BSc IT coursework.',
      },
      {
        id: 'exp-2',
        title: 'Practical Learning & Technical Lab Practice',
        subtitle: 'Networking, Cloud Computing & Cybersecurity Labs',
        description:
          'Hands-on academic practice with Cisco networking simulations, IP addressing and subnetting, cloud computing service models, and foundational cybersecurity hygiene.',
      },
      {
        id: 'exp-3',
        title: 'Technical & Digital Media Experience',
        subtitle: 'Web Prototyping, Video Editing & Content Creation',
        description:
          'Developed responsive client-side web interfaces and created structured digital video content, combining technical execution with clear visual presentation.',
      },
      {
        id: 'exp-4',
        title: 'College Activities & Collaborative Learning',
        subtitle: 'Student Academic Activities | LBEF College',
        description:
          'Actively engaged in group coursework, technical peer discussions, collaborative problem-solving sessions, and academic project presentations.',
      },
    ],
    projects: [
      {
        id: 'proj-web',
        title: 'Web Development Projects (Student Event Website, Clothing Marketplace & Nepal Invest)',
        badge: 'Academic Coursework & Web Concepts',
        description:
          'Designed and prototyped responsive web interfaces including a student-event portal, an online clothing marketplace concept, and a conceptual IPO/investment management platform using HTML, CSS, JavaScript, and modern UI design.',
      },
      {
        id: 'proj-smarthome',
        title: 'Smart Home Project',
        badge: 'Academic Project',
        description:
          'Academic project focused on smart-home automation technology, connected sensor workflows, network connectivity, and user-centric design thinking.',
      },
      {
        id: 'proj-networking',
        title: 'Networking Projects & Topology Labs',
        badge: 'Academic Lab Work',
        description:
          'Academic networking exercises exploring Cisco routing and switching fundamentals, LAN/WAN network design, IP addressing, and secure communication principles.',
      },
      {
        id: 'proj-robotics',
        title: 'Emergency Response Robot & Relevant IT Concepts',
        badge: 'Academic Project / Concept',
        description:
          'Conceptualized an emergency-response robotics and IT system integrating sensors, camera telemetry, wireless communication, and movement control.',
      },
    ],
    credentialsNote:
      'Completed IT-related certifications and verified digital credentials are listed below as they are earned. Verify digital badges via Credly.',
    completedCertifications: [],
    additionalSections: [
      {
        id: 'custom-sec-1791398025884',
        heading: 'Languages / Additional Information',
        content: 'English — Professional Working Proficiency\nNepali — Native Proficiency',
      },
    ],
  };
}

export function normalizeCvData(raw?: Partial<EditableCvData> | null): EditableCvData {
  const def = getDefaultCvData();
  if (!raw) return def;
  const rawPhoto = raw.profilePhotoDataUrl?.trim() || '';
  const resolvedPhoto =
    !rawPhoto ||
    rawPhoto === './assets/profile.jpg' ||
    rawPhoto === '/assets/profile.jpg' ||
    rawPhoto === './public/assets/profile.jpg'
      ? def.profilePhotoDataUrl
      : rawPhoto;

  return {
    ...def,
    ...raw,
    profilePhotoDataUrl: resolvedPhoto,
    education: Array.isArray(raw.education) && raw.education.length > 0 ? raw.education : def.education,
    technicalSkillsList:
      Array.isArray(raw.technicalSkillsList) && raw.technicalSkillsList.length > 0
        ? raw.technicalSkillsList
        : def.technicalSkillsList,
    skills: Array.isArray(raw.skills) && raw.skills.length > 0 ? raw.skills : def.skills,
    experiences:
      Array.isArray(raw.experiences) && raw.experiences.length > 0
        ? raw.experiences
        : def.experiences,
    projects: Array.isArray(raw.projects) && raw.projects.length > 0 ? raw.projects : def.projects,
    completedCertifications: Array.isArray(raw.completedCertifications)
      ? raw.completedCertifications
      : [],
    additionalSections:
      Array.isArray(raw.additionalSections) && raw.additionalSections.length > 0
        ? raw.additionalSections
        : def.additionalSections,
  };
}

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E]/g, ' ');
}

function wrapTextToLines(text: string, maxChars = 92): string[] {
  const words = text.trim().split(/\s+/);
  const result: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      result.push(current);
      current = word;
    }
  }
  if (current) {
    result.push(current);
  }
  return result.length > 0 ? result : [''];
}

interface PdfLineItem {
  text: string;
  size: number;
  bold?: boolean;
  gapBefore?: number;
}

/**
 * Generates an ATS-friendly 1-2 page A4 PDF Blob from `EditableCvData`.
 */
export function buildCvPdfBlob(rawCvData: EditableCvData): Blob {
  const cvData = normalizeCvData(rawCvData);

  const lines: PdfLineItem[] = [
    {
      text: (cvData.fullName || 'UPENDRA BAHADUR BUDHA').toUpperCase(),
      size: 16,
      bold: true,
      gapBefore: 0,
    },
    {
      text: `${cvData.educationHeadline} | ${cvData.college}`,
      size: 10.5,
      bold: true,
      gapBefore: 14,
    },
    {
      text: `Current Status: ${cvData.currentStatus}  |  Location: ${cvData.location}`,
      size: 9.5,
      gapBefore: 13,
    },
    {
      text: `Phone: ${cvData.phone}  |  Email: ${cvData.email}`,
      size: 9.5,
      gapBefore: 12,
    },
    {
      text: `LinkedIn: ${cvData.linkedinDisplay}`,
      size: 9.5,
      gapBefore: 12,
    },
    {
      text: `Credly: ${cvData.credlyUrl || cvData.credlyDisplay}`,
      size: 9.5,
      gapBefore: 12,
    },
    {
      text: '------------------------------------------------------------------------------------------------------',
      size: 8.5,
      gapBefore: 12,
    },
  ];

  // Career Objective
  if (cvData.careerObjective.trim()) {
    lines.push({ text: 'CAREER OBJECTIVE', size: 10.5, bold: true, gapBefore: 14 });
    wrapTextToLines(cvData.careerObjective, 94).forEach((lineText, idx) => {
      lines.push({ text: lineText, size: 9.5, gapBefore: idx === 0 ? 13 : 12 });
    });
  }

  // Professional Summary
  if (cvData.summary.trim()) {
    lines.push({ text: 'PROFESSIONAL SUMMARY', size: 10.5, bold: true, gapBefore: 15 });
    wrapTextToLines(cvData.summary, 94).forEach((lineText, idx) => {
      lines.push({ text: lineText, size: 9.5, gapBefore: idx === 0 ? 13 : 12 });
    });
  }

  // Education
  lines.push({ text: 'EDUCATION', size: 10.5, bold: true, gapBefore: 15 });
  cvData.education.forEach((edu) => {
    lines.push({
      text: `${edu.degree} - ${edu.institution} (${edu.status})`,
      size: 9.5,
      bold: true,
      gapBefore: 13,
    });
    if (edu.focus) {
      wrapTextToLines(edu.focus, 94).forEach((fLine) => {
        lines.push({ text: fLine, size: 9, gapBefore: 12 });
      });
    }
  });

  // Technical & Core Skills
  lines.push({ text: 'TECHNICAL & PROFESSIONAL SKILLS', size: 10.5, bold: true, gapBefore: 15 });
  if (cvData.technicalSkillsList.length > 0) {
    const coreSkillsLine = `Core Competencies: ${cvData.technicalSkillsList.join('  |  ')}`;
    wrapTextToLines(coreSkillsLine, 94).forEach((sLine, idx) => {
      lines.push({ text: sLine, size: 9.5, gapBefore: idx === 0 ? 13 : 12 });
    });
  }
  cvData.skills.forEach((skillRow) => {
    wrapTextToLines(`- ${skillRow.category}: ${skillRow.items}`, 94).forEach((sLine, idx) => {
      lines.push({ text: sLine, size: 9, gapBefore: idx === 0 ? 12 : 11.5 });
    });
  });

  // Experience (Academic Projects, Practical Learning, Technical Experience, College Activities)
  if (cvData.experiences.length > 0) {
    lines.push({
      text: 'ACADEMIC & PRACTICAL EXPERIENCE (UNDERGRADUATE)',
      size: 10.5,
      bold: true,
      gapBefore: 15,
    });
    cvData.experiences.forEach((exp) => {
      lines.push({
        text: `${exp.title} — ${exp.subtitle}`,
        size: 9.5,
        bold: true,
        gapBefore: 13,
      });
      wrapTextToLines(exp.description, 94).forEach((eLine) => {
        lines.push({ text: eLine, size: 9, gapBefore: 11.5 });
      });
    });
  }

  // Academic Projects
  lines.push({
    text: 'ACADEMIC PROJECTS & COURSEWORK',
    size: 10.5,
    bold: true,
    gapBefore: 15,
  });
  cvData.projects.forEach((proj) => {
    lines.push({
      text: `${proj.title} [${proj.badge}]`,
      size: 9.5,
      bold: true,
      gapBefore: 13,
    });
    wrapTextToLines(proj.description, 94).forEach((dLine) => {
      lines.push({ text: dLine, size: 9, gapBefore: 11.5 });
    });
  });

  // Certifications & Digital Credentials
  lines.push({
    text: 'CERTIFICATIONS & DIGITAL CREDENTIALS',
    size: 10.5,
    bold: true,
    gapBefore: 15,
  });
  wrapTextToLines(cvData.credentialsNote, 94).forEach((cLine, idx) => {
    lines.push({ text: cLine, size: 9, gapBefore: idx === 0 ? 13 : 11.5 });
  });
  lines.push({
    text: `Credly Profile: ${cvData.credlyUrl || SOCIAL_LINKS.credlyUrl}`,
    size: 9,
    bold: true,
    gapBefore: 12,
  });
  cvData.completedCertifications.forEach((cert) => {
    lines.push({
      text: `- ${cert.title} | ${cert.issuer} (${cert.issueDate})${
        cert.credentialUrl ? ` - ${cert.credentialUrl}` : ''
      }`,
      size: 9,
      gapBefore: 12,
    });
  });

  // Additional Custom Sections
  cvData.additionalSections.forEach((sec) => {
    if (!sec.heading.trim()) return;
    lines.push({
      text: sec.heading.trim().toUpperCase(),
      size: 10.5,
      bold: true,
      gapBefore: 15,
    });
    sec.content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((bullet, bIdx) => {
        wrapTextToLines(bullet.startsWith('-') ? bullet : `- ${bullet}`, 94).forEach(
          (wLine, wIdx) => {
            lines.push({
              text: wLine,
              size: 9,
              gapBefore: bIdx === 0 && wIdx === 0 ? 13 : 11.5,
            });
          }
        );
      });
  });

  // Paginate lines across 1 or 2 A4 pages (height 842pt, top 796pt, bottom 46pt)
  const pagesCommands: string[][] = [];
  let currentCommands: string[] = ['BT'];
  let y = 796;

  lines.forEach((line, idx) => {
    const gap = idx === 0 ? 0 : line.gapBefore ?? 12;
    if (y - gap < 48) {
      currentCommands.push('ET');
      pagesCommands.push(currentCommands);
      currentCommands = ['BT'];
      y = 796;
    } else if (idx > 0) {
      y -= gap;
    }
    const fontKey = line.bold ? '/F2' : '/F1';
    currentCommands.push(`${fontKey} ${line.size} Tf`);
    currentCommands.push(`1 0 0 1 45 ${y} Tm`);
    currentCommands.push(`(${escapePdfText(line.text)}) Tj`);
  });
  currentCommands.push('ET');
  pagesCommands.push(currentCommands);

  // Build valid multi-page PDF objects
  // Object 1: Catalog
  // Object 2: Pages
  // Object 3: Font Helvetica
  // Object 4: Font Helvetica-Bold
  // Subsequent pairs: Page object + Content stream object
  const objects: string[] = [];
  const pageObjNums: number[] = [];

  const totalPages = pagesCommands.length;
  for (let p = 0; p < totalPages; p++) {
    pageObjNums.push(5 + p * 2);
  }

  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums
      .map((n) => `${n} 0 R`)
      .join(' ')}] /Count ${totalPages} >>\nendobj\n`
  );
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  for (let p = 0; p < totalPages; p++) {
    const pageObjId = 5 + p * 2;
    const contentObjId = pageObjId + 1;
    const stream = pagesCommands[p].join('\n');
    objects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentObjId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>\nendobj\n`
    );
    objects.push(
      `${contentObjId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
    );
  }

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    const offsetStr = String(offsets[i]).padStart(10, '0');
    pdf += `${offsetStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function triggerCvDownload(
  cvData: EditableCvData,
  customCvDataUrl: string | null,
  customCvFileName?: string | null
): void {
  const link = document.createElement('a');
  if (customCvDataUrl) {
    link.href = customCvDataUrl;
    link.download = customCvFileName || CV_DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const blob = buildCvPdfBlob(cvData);
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = CV_DOWNLOAD_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
