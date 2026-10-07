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

export interface AcademicProject {
  id: string;
  title: string;
  badge: string; // e.g., "Academic Project / Concept", "Coursework", etc.
  category: 'Web & Concept' | 'Cloud & Systems' | 'Hardware & IoT';
  shortDescription: string;
  detailedOverview: string;
  learningObjectives: string[];
  topics: string[];
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
}

/**
 * [1] CHANGE PROFILE PHOTO:
 * By default, this uses your uploaded professional studio portrait.
 * To replace it permanently in code, place your new photo at `/public/assets/profile.jpg`
 * and change this path to `"/assets/profile.jpg"`.
 * You can also click "Change Profile Photo" / "Upload New Photo" directly on the website!
 */
export const DEFAULT_PROFILE_IMAGE = '/src/assets/images/upendra_profile_portrait_1791389933549.jpg';

/**
 * [3] ADD / UPDATE YOUR CV:
 * Place your actual CV PDF file inside `/public/assets/cv/Upendra-Bahadur-Budha-CV.pdf`.
 * The "Download CV" buttons across the website will automatically download this file.
 */
export const CV_FILE_PATH = '/assets/cv/Upendra-Bahadur-Budha-CV.pdf';
export const CV_DOWNLOAD_FILENAME = 'Upendra-Bahadur-Budha-CV.pdf';

/**
 * [4] UPDATE LINKEDIN & [5] UPDATE CREDLY:
 * Update your social and credential profile URLs here.
 */
export const SOCIAL_LINKS = {
  // [4] UPDATE LINKEDIN URL HERE:
  linkedinUrl: 'https://www.linkedin.com/in/upendra-budha-6b9240329',
  linkedinDisplay: 'www.linkedin.com/in/upendra-budha-6b9240329',

  // [5] UPDATE CREDLY URL HERE:
  credlyUrl: 'https://www.credly.com/users/upendra-bahadur-budha',
  credlyDisplay: 'credly.com/users/upendra-bahadur-budha',

  // FACEBOOK & INSTAGRAM URLS:
  facebookUrl: 'https://www.facebook.com/bu.d.ha.776337',
  facebookDisplay: 'facebook.com/bu.d.ha.776337',

  instagramUrl: 'https://www.instagram.com/s.u.g.a.m_10/',
  instagramDisplay: 'instagram.com/s.u.g.a.m_10',
};

export const PERSONAL_INFO = {
  name: 'Upendra Bahadur Budha',
  roleTitle: 'BSc IT – Cloud Computing Student',
  college: 'LBEF College',
  course: 'BSc IT – Cloud Computing',
  focus: 'IT & Technology',
  location: 'Nepal',
  phone: '9701269514',
  email: 'upendrabudha505@gmail.com',
  heroGreeting: 'Hi, I’m Upendra Bahadur Budha',
  heroIntro:
    'I’m an IT student passionate about Cloud Computing, Cisco Networking, Cyber Security, Web Development, Video Editing and Content Creation.',
  aboutText:
    'Hello! I’m Upendra Bahadur Budha, a BSc IT student studying Cloud Computing at LBEF College. I’m interested in technology, networking, cybersecurity, cloud computing, web development, video editing and content creation. I enjoy learning new technologies and improving my technical and creative skills through academic projects and practical learning.',
  academicNote:
    'These projects represent academic work, concepts, coursework and learning activities. They are not presented as completed commercial products.',
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
    // [2] ADD PROJECT IMAGE FOR NEPAL INVEST (e.g., '/assets/projects/nepal-invest.jpg'):
    imageUrl: '',
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
    // [2] ADD PROJECT IMAGE FOR CLOTHING MARKETPLACE (e.g., '/assets/projects/clothing-marketplace.jpg'):
    imageUrl: '',
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
    // [2] ADD PROJECT IMAGE FOR SMART HOME (e.g., '/assets/projects/smart-home.jpg'):
    imageUrl: '',
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
    // [2] ADD PROJECT IMAGE FOR EMERGENCY RESPONSE ROBOT (e.g., '/assets/projects/emergency-robot.jpg'):
    imageUrl: '',
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
    // [2] ADD PROJECT IMAGE FOR STUDENT EVENT WEBSITE (e.g., '/assets/projects/student-event.jpg'):
    imageUrl: '',
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
