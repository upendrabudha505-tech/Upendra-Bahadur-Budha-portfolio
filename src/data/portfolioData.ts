/**
 * ============================================================================
 * UPENDRA BAHADUR BUDHA — PORTFOLIO CONFIGURATION & DATA
 * ============================================================================
 * This file contains all personal details, social links, skills, academic
 * projects, education, and credentials in one clean, beginner-friendly place.
 *
 * QUICK CUSTOMIZATION GUIDE:
 * [1] CHANGE PROFILE PHOTO   -> See `DEFAULT_PROFILE_IMAGE` below (or use the "Change Profile Photo" button on the site)
 * [2] ADD PROJECT IMAGES     -> See `ACADEMIC_PROJECTS` (`imageUrl` field) below (or use "Add Project Image" on each card)
 * [3] ADD / UPDATE CV        -> Place your PDF in `/public/assets/cv/Upendra-Bahadur-Budha-CV.pdf` and see `CV_FILE_PATH` below
 * [4] UPDATE LINKEDIN        -> See `SOCIAL_LINKS.linkedin` below
 * [5] UPDATE CREDLY          -> See `SOCIAL_LINKS.credly` below
 * [6] ADD FUTURE CERTIFICATES-> See `EARNED_CERTIFICATES` array below
 * [7] ADD FUTURE PROJECTS    -> See `ACADEMIC_PROJECTS` array below
 * ============================================================================
 */

import defaultProfilePhotoAsset from '../assets/images/profile.jpg';
import nepalInvestImgAsset from '../assets/images/projects/nepal-invest.jpg';
import clothingMarketplaceImgAsset from '../assets/images/projects/clothing-marketplace.jpg';
import smartHomeImgAsset from '../assets/images/projects/smart-home.jpg';
import emergencyRobotImgAsset from '../assets/images/projects/emergency-robot.jpg';
import studentEventImgAsset from '../assets/images/projects/student-event.jpg';
import defaultShowcaseVideoAsset from '../assets/video/upendra-showcase.mp4';

export interface AcademicProject {
  id: string;
  title: string;
  badge: string; // e.g., "Academic Project / Concept", "Coursework", etc.
  category: 'Web & Concept' | 'Cloud & Systems' | 'Hardware & IoT';
  shortDescription: string;
  detailedOverview: string;
  learningObjectives: string[];
  topics: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  /**
   * [2] ADD PROJECT IMAGES:
   * Leave `imageUrl` as `""` to show the clean "Project Image Coming Soon" placeholder.
   * When you have a real screenshot or photo of your coursework, place it in
   * `/public/assets/projects/` and set the path here (e.g., "/assets/projects/nepal-invest.jpg"),
   * OR simply click "Add Project Image" directly on the project card in the browser!
   */
  imageUrl: string;
  suggestedAssetPath: string;
}

export interface SkillItem {
  name: string;
  status: 'Learning' | 'Developing' | 'Interested';
}

export interface SkillGroup {
  id: string;
  category: string;
  summary: string;
  skills: SkillItem[];
}

export interface InterestArea {
  index: string;
  title: string;
  category: string;
  description: string;
  keyTopics: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: 'Cloud Computing' | 'Networking' | 'Cybersecurity' | 'Web Development';
  readTime: string;
  date: string;
  isSamplePlaceholder: boolean;
  summary: string;
  content: string[];
  tags: string[];
}

/**
 * [1] CHANGE PROFILE PHOTO:
 * By default, this uses your uploaded professional studio portrait.
 * To replace it permanently in code, place your new photo at `/public/assets/profile.jpg`
 * and change this path to `"/assets/profile.jpg"`.
 * You can also click "Change Profile Photo" / "Upload New Photo" directly on the website!
 */
export const DEFAULT_PROFILE_IMAGE = defaultProfilePhotoAsset || './assets/profile.jpg';
export const DEFAULT_SHOWCASE_VIDEO_ASSET =
  defaultShowcaseVideoAsset || './assets/video/upendra-showcase.mp4';

export const DEFAULT_PROJECT_IMAGES_BY_ID: Record<string, string> = {
  'nepal-invest': nepalInvestImgAsset,
  'clothing-marketplace': clothingMarketplaceImgAsset,
  'smart-home': smartHomeImgAsset,
  'emergency-response-robot': emergencyRobotImgAsset,
  'student-event-website': studentEventImgAsset,
};

/**
 * [3] ADD / UPDATE YOUR CV:
 * Place your actual CV PDF file inside `/public/assets/cv/Upendra-Bahadur-Budha-CV.pdf`.
 * The "Download CV" buttons across the website will automatically download this file.
 */
export const CV_FILE_PATH = '/assets/cv/Upendra-Bahadur-Budha-CV.pdf';
export const CV_DOWNLOAD_FILENAME = 'Upendra-Bahadur-Budha-CV.pdf';

/**
 * [4] UPDATE LINKEDIN, GITHUB & [5] UPDATE CREDLY:
 * Update your social and credential profile URLs here.
 */
export const SOCIAL_LINKS = {
  // GITHUB PROFILE URL:
  githubUrl: 'https://github.com/upendrabudha505-tech',
  githubDisplay: 'github.com/upendrabudha505-tech',
  githubUsername: 'upendrabudha505-tech',

  // [4] UPDATE LINKEDIN URL HERE:
  linkedinUrl: 'https://www.linkedin.com/in/upendra-budha-6b9240329',
  linkedinDisplay: 'www.linkedin.com/in/upendra-budha-6b9240329',

  // [5] UPDATE CREDLY URL HERE:
  credlyUrl: 'https://www.credly.com/users/upendra-bahadur-budha',
  credlyDisplay: 'credly.com/users/upendra-bahadur-budha',

  // FACEBOOK & INSTAGRAM URLS:
  facebookUrl: 'https://www.facebook.com/bu.d.ha.776337',
  facebookDisplay: 'facebook.com/bu.d.ha.776337',

  instagramUrl: 'https://www.instagram.com/upendrabudha505/',
  instagramDisplay: 'instagram.com/upendrabudha505',
};

export const PERSONAL_INFO = {
  name: 'Upendra Bahadur Budha',
  roleTitle: 'BSc IT Student | Cloud Computing Enthusiast | Aspiring Entrepreneur',
  college: 'LBEF College',
  course: 'BSc IT – Cloud Computing',
  focus: 'Cloud Computing, Networking & Entrepreneurship',
  location: 'Nepal',
  phone: '9701269514',
  email: 'upendrabudha505@gmail.com',
  heroGreeting: 'Hi, I’m Upendra Bahadur Budha',
  heroIntro:
    'I’m a BSc IT student specializing in Cloud Computing at LBEF College, Nepal—passionate about Cloud Computing, Cisco Networking, Cybersecurity, Web Development, Video Editing, and Content Creation, with a vision to grow as an IT professional and technology entrepreneur.',
  aboutText:
    'Hello! I’m Upendra Bahadur Budha, a BSc IT student specializing in Cloud Computing at LBEF College (Lord Buddha Education Foundation), Nepal. My core interests span Information Technology, Cloud Computing, Cisco Networking, Cybersecurity, Web Development, Video Editing, and Digital Content Creation. Through hands-on academic projects, laboratory exploration, and continuous self-learning, I am building both technical depth and creative communication skills—with the long-term goal of becoming a skilled IT professional and innovative technology entrepreneur.',
  academicNote:
    'These projects represent academic work, concepts, coursework and learning activities. They are not presented as completed commercial products.',
};

export const TRANSLATIONS = {
  en: {
    navHome: 'Home',
    navAbout: 'About',
    navSkills: 'Skills',
    navProjects: 'Projects',
    navTerminal: 'Terminal',
    navGithub: 'GitHub',
    navCredentials: 'Credentials',
    navBlog: 'Blog',
    navContact: 'Contact',
    heroViewProjects: 'View My Projects',
    heroContactMe: 'Contact Me',
    heroGreeting: 'Hi, I’m Upendra Bahadur Budha',
    heroRole: 'BSc IT Student | Cloud Computing Enthusiast | Aspiring Entrepreneur',
    aboutHeading: 'About Me',
    skillsHeading: 'Skills & Learning Domains',
    projectsHeading: 'Academic Projects & Concepts',
    terminalHeading: 'Interactive Developer Terminal',
    githubHeading: 'GitHub Activity & Repositories',
    educationHeading: 'Education',
    credentialsHeading: 'Certificates & Credentials',
    blogHeading: 'Tech Blog & Learning Notes',
    cvHeading: 'Curriculum Vitae',
    contactHeading: 'Contact Me',
  },
  ne: {
    navHome: 'गृहपृष्ठ',
    navAbout: 'मेरो बारेमा',
    navSkills: 'सीपहरू',
    navProjects: 'प्रोजेक्टहरू',
    navTerminal: 'टर्मिनल',
    navGithub: 'गिटहब',
    navCredentials: 'प्रमाणपत्र',
    navBlog: 'ब्लग',
    navContact: 'सम्पर्क',
    heroViewProjects: 'प्रोजेक्टहरू हेर्नुहोस्',
    heroContactMe: 'सम्पर्क गर्नुहोस्',
    heroGreeting: 'नमस्ते, म उपेन्द्र बहादुर बुढा',
    heroRole: 'BSc IT विद्यार्थी | क्लाउड कम्प्युटिङ उत्साही | भावी उद्यमी',
    aboutHeading: 'मेरो बारेमा (About Me)',
    skillsHeading: 'प्राविधिक र सिर्जनात्मक सीपहरू',
    projectsHeading: 'शैक्षिक प्रोजेक्ट र अवधारणाहरू',
    terminalHeading: 'इन्टरएक्टिभ डेभलपर टर्मिनल',
    githubHeading: 'गिटहब गतिविधि र रिपोजिटरीहरू',
    educationHeading: 'शिक्षा (Education)',
    credentialsHeading: 'प्रमाणपत्र र ब्याजहरू',
    blogHeading: 'प्रविधि ब्लग र सिकाइ नोटहरू',
    cvHeading: 'बायोडाटा (Curriculum Vitae)',
    contactHeading: 'सम्पर्क गर्नुहोस्',
  },
};

/**
 * SKILLS GROUPED BY DOMAIN
 * Note: Uses truthful learning status labels ("Learning", "Developing", "Interested")
 * instead of arbitrary or fake skill percentages.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'networking',
    category: 'Networking',
    summary: 'Routing concepts, switching fundamentals, network topologies, and protocol analysis.',
    skills: [
      { name: 'Cisco Networking', status: 'Developing' },
      { name: 'Networking Fundamentals', status: 'Developing' },
    ],
  },
  {
    id: 'cybersecurity',
    category: 'Cyber Security',
    summary: 'Foundational security hygiene, threat awareness, and safe network principles.',
    skills: [
      { name: 'Cyber Security Fundamentals', status: 'Learning' },
      { name: 'Security Awareness', status: 'Developing' },
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud',
    summary: 'Core degree track covering cloud service models, virtualization, and distributed infrastructure.',
    skills: [
      { name: 'Cloud Computing', status: 'Developing' },
      { name: 'Cloud Technology Fundamentals', status: 'Developing' },
    ],
  },
  {
    id: 'development',
    category: 'Development',
    summary: 'Semantic markup, responsive layouts, and interactive client-side scripting for modern browsers.',
    skills: [
      { name: 'Web Development', status: 'Developing' },
      { name: 'HTML', status: 'Developing' },
      { name: 'CSS', status: 'Developing' },
      { name: 'JavaScript', status: 'Learning' },
    ],
  },
  {
    id: 'creative',
    category: 'Creative',
    summary: 'Visual communication, video post-production, pacing, and digital media presentation.',
    skills: [
      { name: 'Video Editing', status: 'Developing' },
      { name: 'Content Creation', status: 'Developing' },
    ],
  },
];

/**
 * AREAS OF INTEREST & SKILLS (6 Core Areas)
 * Presented truthfully as academic interests and developing capabilities.
 */
export const AREAS_OF_INTEREST: InterestArea[] = [
  {
    index: '01',
    title: 'Cisco Networking',
    category: 'Infrastructure & Protocols',
    description:
      'Exploring enterprise network topologies, IP addressing, subnetting, routing and switching concepts through academic labs and simulation tools.',
    keyTopics: ['Network Topologies', 'Routing & Switching', 'IP Addressing'],
  },
  {
    index: '02',
    title: 'Cyber Security',
    category: 'Defense & Awareness',
    description:
      'Studying foundational cybersecurity principles, access control concepts, vulnerability awareness, and best practices for securing digital environments.',
    keyTopics: ['Security Fundamentals', 'Threat Awareness', 'Safe Computing'],
  },
  {
    index: '03',
    title: 'Cloud Computing',
    category: 'Core BSc IT Specialization',
    description:
      'Focusing on cloud computing architectures (IaaS, PaaS, SaaS), virtualization fundamentals, and scalable resource management as part of BSc IT coursework.',
    keyTopics: ['Cloud Service Models', 'Virtualization', 'Cloud Fundamentals'],
  },
  {
    index: '04',
    title: 'Web Development',
    category: 'Frontend & Web Design',
    description:
      'Building clean, responsive websites and academic web prototypes using semantic HTML5, modern CSS3 layouts, and client-side JavaScript.',
    keyTopics: ['HTML5 & CSS3', 'Responsive Layouts', 'JavaScript Scripting'],
  },
  {
    index: '05',
    title: 'Video Editing',
    category: 'Post-Production & Media',
    description:
      'Crafting structured video edits with attention to visual pacing, clean transitions, audio synchronization, and clear storytelling.',
    keyTopics: ['Timeline Editing', 'Visual Pacing', 'Audio/Visual Sync'],
  },
  {
    index: '06',
    title: 'Content Creation',
    category: 'Digital Storytelling',
    description:
      'Planning, scripting, and producing informative digital media content focused on technology, student learning, and creative presentation.',
    keyTopics: ['Content Planning', 'Visual Presentation', 'Digital Media'],
  },
];

/**
 * [7] ADD FUTURE PROJECTS & [2] ADD PROJECT IMAGES:
 * All listed items are strictly labeled as Academic Projects, Coursework, or Project Concepts.
 * To add a new academic project in code, copy one of the objects below and append it to the array.
 */
export const DEFAULT_ACADEMIC_PROJECTS: AcademicProject[] = [
  {
    id: 'nepal-invest',
    title: 'Nepal Invest',
    badge: 'Academic Project / Concept',
    category: 'Web & Concept',
    shortDescription:
      'A conceptual investment and IPO management platform created as part of academic/project work.',
    detailedOverview:
      'Nepal Invest is an academic project concept designed to explore how retail investors in Nepal could track IPO applications, portfolio allocations, and market education in a unified user interface. Created strictly as academic coursework to practice system analysis, user interface planning, and information architecture.',
    learningObjectives: [
      'Understanding user workflows for IPO tracking and investment portfolio dashboards',
      'Practicing system requirement analysis and wireframe structuring for financial concepts',
      'Designing clear data tables and accessible interface layouts for coursework evaluation',
    ],
    topics: ['System Concept', 'UI/UX Planning', 'Information Architecture', 'Academic Coursework'],
    githubUrl: 'https://github.com/upendrabudha505-tech',
    // [2] ADD PROJECT IMAGE FOR NEPAL INVEST:
    imageUrl: nepalInvestImgAsset,
    suggestedAssetPath: 'assets/projects/nepal-invest.jpg',
  },
  {
    id: 'clothing-marketplace',
    title: 'Clothing Marketplace',
    badge: 'Academic Project / Website Concept',
    category: 'Web & Concept',
    shortDescription:
      'A conceptual online clothing marketplace exploring modern e-commerce and social-commerce features.',
    detailedOverview:
      'This academic website concept investigates how traditional online apparel catalogs can integrate social-commerce discovery features such as curated lookbooks and community style boards. Developed as a learning exercise in e-commerce user journeys and responsive layout design.',
    learningObjectives: [
      'Structuring multi-category product catalogs and filtering layouts',
      'Exploring social-commerce interaction patterns in an academic design setting',
      'Applying responsive grid principles for desktop and mobile viewports',
    ],
    topics: ['E-Commerce Concept', 'Social Commerce UI', 'Responsive Grid', 'Web Design'],
    githubUrl: 'https://github.com/upendrabudha505-tech',
    // [2] ADD PROJECT IMAGE FOR CLOTHING MARKETPLACE:
    imageUrl: clothingMarketplaceImgAsset,
    suggestedAssetPath: 'assets/projects/clothing-marketplace.jpg',
  },
  {
    id: 'smart-home',
    title: 'Smart Home',
    badge: 'Academic Project',
    category: 'Cloud & Systems',
    shortDescription:
      'An academic project focused on smart-home technology, automation, and design thinking.',
    detailedOverview:
      'An academic coursework project examining how connected household sensors, automated lighting/climate routines, and centralized control interfaces work together. The project emphasizes design thinking, network connectivity concepts, and user-centric automation scenarios.',
    learningObjectives: [
      'Applying design thinking methodology to everyday home automation problems',
      'Mapping communication flows between smart sensors, local gateways, and cloud dashboards',
      'Evaluating security and privacy considerations in connected home environments',
    ],
    topics: ['Smart Home Concept', 'Automation Logic', 'Design Thinking', 'Networked Devices'],
    githubUrl: 'https://github.com/upendrabudha505-tech',
    // [2] ADD PROJECT IMAGE FOR SMART HOME:
    imageUrl: smartHomeImgAsset,
    suggestedAssetPath: 'assets/projects/smart-home.jpg',
  },
  {
    id: 'emergency-response-robot',
    title: 'Emergency Response Robot',
    badge: 'Academic Project / Robotics Concept',
    category: 'Hardware & IoT',
    shortDescription:
      'A robotics concept for emergency-response scenarios involving sensors, camera, communication and robotic movement.',
    detailedOverview:
      'An academic robotics concept exploring how an unmanned ground vehicle equipped with environmental sensors, a live camera feed, and wireless communication modules could assist responders in hazardous inspection scenarios.',
    learningObjectives: [
      'Conceptualizing sensor integration for obstacle detection and environmental monitoring',
      'Studying remote camera telemetry and wireless control links for robotic movement',
      'Documenting hardware-software interaction diagrams for academic presentation',
    ],
    topics: ['Robotics Concept', 'Sensor Systems', 'Camera Telemetry', 'Wireless Communication'],
    githubUrl: 'https://github.com/upendrabudha505-tech',
    // [2] ADD PROJECT IMAGE FOR EMERGENCY RESPONSE ROBOT:
    imageUrl: emergencyRobotImgAsset,
    suggestedAssetPath: 'assets/projects/emergency-robot.jpg',
  },
  {
    id: 'student-event-website',
    title: 'Student Event Website',
    badge: 'Academic Web Development Project',
    category: 'Web & Concept',
    shortDescription:
      'A student-event website concept created for learning web design, UI design and client-side scripting.',
    detailedOverview:
      'A web development coursework project focused on building an informational portal for college student events, schedules, and registration forms. Created to practice foundational HTML5 semantics, CSS3 styling, and interactive client-side JavaScript validation.',
    learningObjectives: [
      'Writing clean semantic HTML5 markup for event schedules and speaker sections',
      'Styling responsive page layouts and typography using modern CSS3',
      'Implementing client-side form validation and interactive DOM updates with JavaScript',
    ],
    topics: ['HTML5', 'CSS3', 'JavaScript', 'UI Design'],
    githubUrl: 'https://github.com/upendrabudha505-tech',
    // [2] ADD PROJECT IMAGE FOR STUDENT EVENT WEBSITE:
    imageUrl: studentEventImgAsset,
    suggestedAssetPath: 'assets/projects/student-event.jpg',
  },
];

/**
 * [6] ADD FUTURE CERTIFICATES:
 * Do NOT add fake certificates. Leave this array empty until you earn verified credentials,
 * or add real certificates here once earned:
 * Example:
 * {
 *   id: 'cert-1',
 *   title: 'Your Earned Certificate Title',
 *   issuer: 'Issuing Organization',
 *   issueDate: 'Month Year',
 *   credentialUrl: 'https://www.credly.com/...'
 * }
 */
export const EARNED_CERTIFICATES: CertificateItem[] = [];

/**
 * [8] TECH BLOG & LEARNING NOTES (Sample Placeholders until full articles are published)
 */
export const DEFAULT_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'cloud-service-models-iaas-paas-saas',
    title: 'Understanding Cloud Service Models: IaaS, PaaS, and SaaS in BSc IT Coursework',
    category: 'Cloud Computing',
    readTime: '4 min read',
    date: 'Sample Learning Note',
    isSamplePlaceholder: true,
    summary:
      'A structured study note exploring how Infrastructure, Platform, and Software as a Service models divide operational responsibility between cloud providers and developers.',
    content: [
      'As part of my BSc IT specialization in Cloud Computing at LBEF College, one of the foundational frameworks we study is the shared responsibility model across IaaS, PaaS, and SaaS.',
      'Infrastructure as a Service (IaaS) provides virtualized compute, storage, and networking resources on demand—ideal for learning virtual machine provisioning, subnetting, and custom firewall configurations.',
      'Platform as a Service (PaaS) abstracts the underlying operating system and runtime environment so developers can focus directly on deploying web applications and APIs without manually patching servers.',
      'Note: This entry is a sample learning note placeholder demonstrating the Tech Blog layout until full articles are published.',
    ],
    tags: ['Cloud Computing', 'IaaS / PaaS / SaaS', 'Virtualization', 'BSc IT Notes'],
  },
  {
    id: 'cisco-networking-subnetting-vlans',
    title: 'Cisco Networking Fundamentals: IPv4 Subnetting & VLAN Segmentation Labs',
    category: 'Networking',
    readTime: '5 min read',
    date: 'Sample Learning Note',
    isSamplePlaceholder: true,
    summary:
      'Key takeaways from academic networking simulations covering switch port security, VLAN trunking, and efficient IPv4 address planning.',
    content: [
      'Designing reliable enterprise networks begins with logical segmentation. Through academic networking labs, I have been exploring how Virtual Local Area Networks (VLANs) isolate broadcast domains and improve both performance and security.',
      'Combined with Variable Length Subnet Masking (VLSM), network engineers can allocate IPv4 address blocks efficiently across departments while routing inter-VLAN traffic through a Layer 3 switch or router-on-a-stick topology.',
      'Note: This entry is a sample learning note placeholder demonstrating the Tech Blog layout until full articles are published.',
    ],
    tags: ['Cisco Networking', 'Subnetting', 'VLANs', 'Routing & Switching'],
  },
  {
    id: 'cybersecurity-hygiene-zero-trust-basics',
    title: 'Foundational Cybersecurity Principles for Aspiring Cloud & Network Engineers',
    category: 'Cybersecurity',
    readTime: '4 min read',
    date: 'Sample Learning Note',
    isSamplePlaceholder: true,
    summary:
      'Exploring least-privilege access control, multi-factor authentication, and network defense-in-depth practices during university lab work.',
    content: [
      'Modern cloud and campus networks require security awareness at every layer. Studying cybersecurity fundamentals alongside cloud computing highlights why identity and access management (IAM) is the first line of defense.',
      'Applying least-privilege permissions, encrypting data in transit and at rest, and auditing network access logs help prevent common misconfigurations before they become vulnerabilities.',
      'Note: This entry is a sample learning note placeholder demonstrating the Tech Blog layout until full articles are published.',
    ],
    tags: ['Cybersecurity', 'Access Control', 'Network Defense', 'Cloud Security'],
  },
  {
    id: 'responsive-web-development-clean-ui',
    title: 'Building Responsive Academic Web Prototypes with Semantic HTML5, CSS3 & JavaScript',
    category: 'Web Development',
    readTime: '3 min read',
    date: 'Sample Learning Note',
    isSamplePlaceholder: true,
    summary:
      'How clean semantic markup, accessible typography, and mobile-first layouts improve student web development projects.',
    content: [
      'Whether designing a conceptual platform like Nepal Invest or a Student Event Website, starting with semantic HTML5 elements ensures screen-reader accessibility and clean document structure.',
      'Pairing modern CSS grid/flexbox layouts with modular client-side JavaScript enables fast, responsive interfaces that work seamlessly across desktop monitors, tablets, and mobile phones.',
      'Note: This entry is a sample learning note placeholder demonstrating the Tech Blog layout until full articles are published.',
    ],
    tags: ['Web Development', 'HTML5 & CSS3', 'JavaScript', 'UI/UX Design'],
  },
];

