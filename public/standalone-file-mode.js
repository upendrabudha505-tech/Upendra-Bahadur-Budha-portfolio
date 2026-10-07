/**
 * ============================================================================
 * UPENDRA BAHADUR BUDHA — OFFLINE / FILE:// PROTOCOL STANDALONE ENGINE
 * ============================================================================
 * Automatically activates ONLY when the user opens `index.html` directly from
 * their computer folders via `file:///C:/.../index.html` without running a
 * Node.js / Vite server.
 * ============================================================================
 */
(function () {
  if (window.location.protocol !== 'file:') return;

  // Inject fallback self-contained CSS so the site looks great even before/without CDN
  const style = document.createElement('style');
  style.textContent = `
    :root {
      color-scheme: dark;
    }
    body {
      margin: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #060911;
      color: #f1f5f9;
      line-height: 1.6;
    }
    body.light-mode {
      background-color: #f8fafc;
      color: #0f172a;
      color-scheme: light;
    }
    .font-display {
      font-family: 'Syne', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    @keyframes floatProfile {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    .animate-float-profile {
      animation: floatProfile 6s ease-in-out infinite;
    }
    @media print {
      body * { visibility: hidden; }
      #printable-a4-cv, #printable-a4-cv * { visibility: visible; }
      #printable-a4-cv {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        box-shadow: none !important;
        border: none !important;
      }
      .no-print { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  const STORAGE = {
    PROFILE_IMG: 'upendra_portfolio_profile_img_v1',
    PROJECT_IMGS: 'upendra_portfolio_project_imgs_v1',
    PROJECTS: 'upendra_portfolio_all_projects_v2',
    CV_JSON: 'upendra_portfolio_editable_cv_json_v1',
    MESSAGES: 'upendra_portfolio_messages_v1',
    VIDEO_URL: 'upendra_portfolio_short_video_url_v1',
  };

  const DEFAULT_PROJECTS = [
    {
      id: 'nepal-invest',
      title: 'Nepal Invest',
      badge: 'Academic Project / Concept',
      category: 'Web & Concept',
      shortDescription:
        'A conceptual investment and IPO management platform created as part of academic/project work.',
      detailedOverview:
        'Nepal Invest is an academic project concept designed to explore how retail investors in Nepal could track IPO applications, portfolio allocations, and market education in a unified user interface.',
      topics: ['System Concept', 'UI/UX Planning', 'Information Architecture', 'Academic Coursework'],
    },
    {
      id: 'clothing-marketplace',
      title: 'Clothing Marketplace',
      badge: 'Academic Project / Website Concept',
      category: 'Web & Concept',
      shortDescription:
        'A conceptual online clothing marketplace exploring modern e-commerce and social-commerce features.',
      detailedOverview:
        'This academic website concept investigates how traditional online apparel catalogs can integrate social-commerce discovery features such as curated lookbooks and community style boards.',
      topics: ['E-Commerce Concept', 'Social Commerce UI', 'Responsive Grid', 'Web Design'],
    },
    {
      id: 'smart-home',
      title: 'Smart Home',
      badge: 'Academic Project',
      category: 'Cloud & Systems',
      shortDescription:
        'An academic project focused on smart-home technology, automation, and design thinking.',
      detailedOverview:
        'An academic coursework project examining how connected household sensors, automated routines, and centralized control interfaces work together.',
      topics: ['Smart Home Concept', 'Automation Logic', 'Design Thinking', 'Networked Devices'],
    },
    {
      id: 'emergency-response-robot',
      title: 'Emergency Response Robot',
      badge: 'Academic Project / Robotics Concept',
      category: 'Hardware & IoT',
      shortDescription:
        'A robotics concept for emergency-response scenarios involving sensors, camera, communication and robotic movement.',
      detailedOverview:
        'An academic robotics concept exploring how an unmanned ground vehicle equipped with environmental sensors, a live camera feed, and wireless communication modules could assist responders.',
      topics: ['Robotics Concept', 'Sensor Systems', 'Camera Telemetry', 'Wireless Communication'],
    },
    {
      id: 'student-event-website',
      title: 'Student Event Website',
      badge: 'Academic Web Development Project',
      category: 'Web & Concept',
      shortDescription:
        'A student-event website concept created for learning web design, UI design and client-side scripting.',
      detailedOverview:
        'A web development coursework project focused on building an informational portal for college student events, schedules, and registration forms using HTML5, CSS3, and JavaScript.',
      topics: ['HTML5', 'CSS3', 'JavaScript', 'UI Design'],
    },
  ];

  const DEFAULT_CV = {
    fullName: 'Upendra Bahadur Budha',
    educationHeadline: 'Bachelor of Science in Information Technology (BSc IT)',
    college: 'LBEF College',
    currentStatus: 'Undergraduate / College Student',
    phone: '9701269514',
    email: 'upendrabudha505@gmail.com',
    location: 'Nepal',
    linkedinDisplay: 'www.linkedin.com/in/upendra-budha-6b9240329',
    credlyUrl: 'https://www.credly.com/users/upendra-bahadur-budha',
    profilePhotoDataUrl: '',
    photoShape: 'rounded-square',
    careerObjective:
      'Motivated Bachelor of Science in Information Technology (BSc IT) student at LBEF College seeking an internship, trainee, part-time, or entry-level opportunity in IT, Cisco Networking, Cloud Computing, Cybersecurity, and Web Development.',
    summary:
      'Enthusiastic and dedicated BSc IT undergraduate student at LBEF College specializing in Cloud Computing, with strong academic and practical interests in Cisco Networking, Cybersecurity, Web Development, Video Editing, and Content Creation. Known for a proactive willingness to learn, analytical problem-solving, effective teamwork, and clear communication.',
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
    ],
    additionalSections: [],
  };

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  let projects = loadJson(STORAGE.PROJECTS, DEFAULT_PROJECTS);
  let projectImgs = loadJson(STORAGE.PROJECT_IMGS, {});
  let cvData = { ...DEFAULT_CV, ...loadJson(STORAGE.CV_JSON, {}) };
  let messages = loadJson(STORAGE.MESSAGES, []);
  let customProfile = localStorage.getItem(STORAGE.PROFILE_IMG) || '';
  let shortVideoData = localStorage.getItem(STORAGE.VIDEO_URL) || '';

  const defaultPortraitPath = './public/assets/profile.jpg';
  const fallbackPortraitPath = './src/assets/images/upendra_profile_portrait_1791389933549.jpg';

  function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;

    const activePortrait = customProfile || defaultPortraitPath;

    root.innerHTML = `
      <div class="min-h-screen bg-[#060911] text-slate-100">
        <!-- Sticky Top Bar -->
        <header class="sticky top-0 z-40 backdrop-blur-md bg-[#060911]/90 border-b border-slate-800/80 no-print">
          <div class="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
            <a href="#home" class="font-display text-base sm:text-lg font-bold text-white hover:text-blue-400">
              Upendra Bahadur Budha
            </a>
            <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#home" class="hover:text-white">Home</a>
              <a href="#short-video" class="hover:text-white">Intro Video</a>
              <a href="#about" class="hover:text-white">About</a>
              <a href="#skills" class="hover:text-white">Skills</a>
              <a href="#academic-work" class="hover:text-white">Academic Work</a>
              <a href="#resume" class="hover:text-white">CV</a>
              <a href="#contact" class="hover:text-white">Contact</a>
            </nav>
            <div class="flex items-center gap-2.5">
              <a href="#resume" class="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500">
                View / Edit A4 CV
              </a>
            </div>
          </div>
        </header>

        <main class="max-w-[1200px] mx-auto px-6">
          <!-- HERO SECTION -->
          <section id="home" class="py-14 md:py-20 border-b border-slate-800/50 no-print">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div class="lg:col-span-7 space-y-5">
                <div class="text-xs font-mono text-blue-400">
                  BSc IT – Cloud Computing · LBEF College · Nepal
                </div>
                <h1 class="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  Hi, I’m Upendra Bahadur Budha
                </h1>
                <p class="text-lg sm:text-xl font-medium text-slate-300">
                  BSc IT – Cloud Computing Student · <span class="text-blue-400">LBEF College</span>
                </p>
                <p class="text-base text-slate-300 max-w-2xl leading-relaxed">
                  I’m an IT student passionate about Cloud Computing, Cisco Networking, Cyber Security, Web Development, Video Editing and Content Creation.
                </p>
                <div class="pt-2 flex flex-wrap items-center gap-3">
                  <a href="#academic-work" class="px-5 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500">
                    View Academic Work
                  </a>
                  <button id="btn-print-cv-hero" type="button" class="px-5 py-3 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
                    Download / Print CV
                  </button>
                  <a href="#resume" class="px-4 py-3 text-sm font-semibold rounded-lg border border-slate-800 bg-slate-900/60 text-blue-400 hover:bg-slate-800">
                    Edit CV
                  </a>
                  <a href="#contact" class="px-5 py-3 text-sm font-semibold rounded-lg border border-slate-800 text-slate-300 hover:text-white">
                    Contact Me
                  </a>
                </div>
                <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-5 text-sm text-slate-300">
                  <span class="text-xs font-mono text-slate-500">Profiles:</span>
                  <a href="https://www.linkedin.com/in/upendra-budha-6b9240329" target="_blank" rel="noopener" class="hover:text-blue-400">LinkedIn ↗</a>
                  <a href="https://www.credly.com/users/upendra-bahadur-budha" target="_blank" rel="noopener" class="hover:text-blue-400">Credly ↗</a>
                  <a href="https://www.facebook.com/bu.d.ha.776337" target="_blank" rel="noopener" class="hover:text-blue-400">Facebook ↗</a>
                  <a href="https://www.instagram.com/s.u.g.a.m_10/" target="_blank" rel="noopener" class="hover:text-blue-400">Instagram ↗</a>
                  <a href="mailto:upendrabudha505@gmail.com" class="hover:text-blue-400">upendrabudha505@gmail.com</a>
                </div>
              </div>

              <!-- Profile Portrait -->
              <div class="lg:col-span-5 flex flex-col items-center lg:items-end">
                <div class="w-full max-w-[350px]">
                  <div class="animate-float-profile rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                    <div class="aspect-[3/4] w-full relative overflow-hidden bg-slate-900">
                      <img
                        id="hero-profile-img"
                        src="${activePortrait}"
                        onerror="this.onerror=null; this.src='${fallbackPortraitPath}';"
                        alt="Upendra Bahadur Budha"
                        class="w-full h-full object-cover object-top"
                      />
                      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-12">
                        <p class="font-display text-base font-bold text-white">Upendra Bahadur Budha</p>
                        <p class="text-xs text-slate-300">BSc IT – Cloud Computing · LBEF College</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-2">
                    <input id="file-hero-photo" type="file" accept="image/*" class="hidden" />
                    <button id="btn-change-hero-photo" type="button" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer">
                      Change Profile Photo
                    </button>
                    <button id="btn-reset-hero-photo" type="button" class="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SHORT VIDEO SECTION -->
          <section id="short-video" class="py-14 border-b border-slate-800/50 no-print">
            <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div class="text-xs font-mono text-blue-400">01 · Short Video Introduction</div>
                  <h2 class="font-display text-2xl font-bold text-white mt-1">Short Intro & Creative Showcase Video</h2>
                </div>
                <div class="flex items-center gap-2">
                  <input id="file-short-video" type="file" accept="video/*" class="hidden" />
                  <button id="btn-upload-video" type="button" class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                    Upload Short Video
                  </button>
                  ${
                    shortVideoData
                      ? `<button id="btn-remove-video" type="button" class="px-3 py-2 text-xs font-medium rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 cursor-pointer">Remove Video</button>`
                      : ''
                  }
                </div>
              </div>
              ${
                shortVideoData
                  ? `<video src="${shortVideoData}" controls class="w-full max-h-[420px] rounded-xl bg-black border border-slate-800"></video>`
                  : `<div id="video-drop-zone" class="aspect-[16/7] rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-blue-500/60">
                      <p class="font-display text-base font-semibold text-slate-200">Short Video Coming Soon — Click to Upload Video</p>
                      <p class="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV directly in your browser</p>
                    </div>`
              }
            </div>
          </section>

          <!-- ABOUT SECTION -->
          <section id="about" class="py-16 border-b border-slate-800/50 no-print">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div class="lg:col-span-7 space-y-4">
                <div class="text-xs font-mono text-blue-400">02 · Introduction</div>
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">About Me</h2>
                <p class="text-slate-300 leading-relaxed">
                  Hello! I’m Upendra Bahadur Budha, a BSc IT student studying Cloud Computing at LBEF College. I’m interested in technology, networking, cybersecurity, cloud computing, web development, video editing and content creation. I enjoy learning new technologies and improving my technical and creative skills through academic projects and practical learning.
                </p>
              </div>
              <div class="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 class="font-display text-lg font-bold text-white pb-3 border-b border-slate-800">Student Profile Overview</h3>
                <dl class="divide-y divide-slate-800 text-sm">
                  <div class="py-3 flex justify-between"><dt class="text-slate-400">Name</dt><dd class="font-semibold text-white">Upendra Bahadur Budha</dd></div>
                  <div class="py-3 flex justify-between"><dt class="text-slate-400">Education</dt><dd class="font-semibold text-white">BSc IT – Cloud Computing</dd></div>
                  <div class="py-3 flex justify-between"><dt class="text-slate-400">College</dt><dd class="font-semibold text-white">LBEF College</dd></div>
                  <div class="py-3 flex justify-between"><dt class="text-slate-400">Focus</dt><dd class="font-semibold text-white">IT & Technology</dd></div>
                  <div class="py-3 flex justify-between"><dt class="text-slate-400">Location</dt><dd class="font-semibold text-white">Nepal</dd></div>
                </dl>
              </div>
            </div>
          </section>

          <!-- SKILLS & AREAS OF INTEREST -->
          <section id="skills" class="py-16 border-b border-slate-800/50 no-print space-y-8">
            <div>
              <div class="text-xs font-mono text-blue-400">03 · Technical & Creative</div>
              <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Areas of Interest & Skills</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${[
                ['01 · Networking', 'Cisco Networking', 'Networking Fundamentals, Routing & Switching, Topologies (Developing)'],
                ['02 · Security', 'Cyber Security', 'Cyber Security Fundamentals, Security Awareness (Learning)'],
                ['03 · Cloud', 'Cloud Computing', 'Cloud Computing, Cloud Technology Fundamentals (Developing)'],
                ['04 · Web', 'Web Development', 'HTML, CSS, JavaScript, Responsive UI Design (Developing)'],
                ['05 · Media', 'Video Editing', 'Timeline Editing, Visual Pacing, Post-Production (Developing)'],
                ['06 · Digital', 'Content Creation', 'Content Planning, Digital Storytelling, Presentation (Developing)'],
              ]
                .map(
                  ([tag, title, desc]) => `
                <div class="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 space-y-2">
                  <div class="text-xs font-mono text-blue-400">${tag}</div>
                  <h3 class="font-display text-lg font-bold text-white">${title}</h3>
                  <p class="text-sm text-slate-300">${desc}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>

          <!-- ACADEMIC PROJECTS & CONCEPTS -->
          <section id="academic-work" class="py-16 border-b border-slate-800/50 no-print space-y-6">
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div class="text-xs font-mono text-blue-400">04 · Coursework & Concept Explorations</div>
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Academic Projects & Concepts</h2>
                <p class="text-sm text-slate-400 mt-1">
                  These projects represent academic work, concepts, coursework and learning activities. They are not presented as completed commercial products.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button id="btn-add-project" type="button" class="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                  + Add Project
                </button>
                <button id="btn-restore-projects" type="button" class="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer">
                  Restore Defaults
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${projects
                .map((p, idx) => {
                  const img = projectImgs[p.id] || '';
                  return `
                  <article class="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div class="aspect-[16/10] w-full bg-[#090E1A] border-b border-slate-800 flex items-center justify-center overflow-hidden">
                        ${
                          img
                            ? `<img src="${img}" alt="${p.title}" class="w-full h-full object-cover" />`
                            : `<div class="p-6 text-center">
                                <span class="text-xs font-mono text-blue-400">0${idx + 1} · ${p.badge}</span>
                                <p class="font-display text-sm font-semibold text-slate-200 mt-1">Project Image Coming Soon</p>
                              </div>`
                        }
                      </div>
                      <div class="px-4 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2 text-xs">
                        <label class="text-blue-400 hover:underline cursor-pointer font-medium">
                          <input type="file" accept="image/*" data-proj-img="${p.id}" class="hidden file-proj-img" />
                          ${img ? 'Change Image' : '+ Add Project Image'}
                        </label>
                        ${
                          img
                            ? `<button type="button" data-remove-img="${p.id}" class="text-rose-400 hover:underline cursor-pointer">Remove Image</button>`
                            : ''
                        }
                      </div>
                      <div class="p-6 space-y-2">
                        <div class="text-xs font-mono text-blue-400">${p.badge}</div>
                        <h3 class="font-display text-xl font-bold text-white">${p.title}</h3>
                        <p class="text-sm text-slate-300">${p.shortDescription}</p>
                      </div>
                    </div>
                    <div class="px-6 pb-6 pt-2 space-y-3">
                      <div class="text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                        ${(p.topics || []).join(' · ')}
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <button type="button" data-edit-proj="${p.id}" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-blue-300 hover:bg-slate-700 cursor-pointer">
                          Edit
                        </button>
                        <button type="button" data-del-proj="${p.id}" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-950/50 border border-rose-900/50 text-rose-300 hover:bg-rose-900/60 cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>`;
                })
                .join('')}
            </div>
          </section>

          <!-- ATS-FRIENDLY A4 CV SECTION WITH TOP-RIGHT PROFILE PHOTO & EDITOR -->
          <section id="resume" class="py-16 border-b border-slate-800/50 space-y-8">
            <div class="flex flex-wrap items-center justify-between gap-4 no-print">
              <div>
                <div class="text-xs font-mono text-blue-400">07 · ATS-Friendly College Student CV</div>
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1">Curriculum Vitae (A4 Preview & Live Editor)</h2>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <button id="btn-toggle-cv-edit" type="button" class="px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                  Edit CV & Additional Sections
                </button>
                <button id="btn-print-a4" type="button" class="px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">
                  Print / Save A4 PDF
                </button>
              </div>
            </div>

            <!-- Inline CV Editor Drawer (Hidden until toggled) -->
            <div id="cv-inline-editor" class="hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 no-print">
              <h3 class="font-display text-lg font-bold text-white">Edit CV Fields & Add Additional Sections</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input id="cv-in-name" type="text" value="${cvData.fullName}" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Education</label>
                  <input id="cv-in-edu" type="text" value="${cvData.educationHeadline}" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Phone</label>
                  <input id="cv-in-phone" type="text" value="${cvData.phone}" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Career Objective</label>
                  <textarea id="cv-in-obj" rows="3" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white">${cvData.careerObjective}</textarea>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 mb-1">Professional Summary</label>
                  <textarea id="cv-in-sum" rows="3" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white">${cvData.summary}</textarea>
                </div>
              </div>
              <div>
                <label class="block text-xs text-slate-400 mb-1">Technical Skills (comma-separated)</label>
                <input id="cv-in-skills" type="text" value="${(cvData.technicalSkillsList || []).join(', ')}" class="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white" />
              </div>
              <div class="flex items-center justify-between pt-2">
                <button id="btn-add-custom-cv-sec" type="button" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 cursor-pointer">
                  + Add Additional CV Section
                </button>
                <button id="btn-save-cv-inline" type="button" class="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                  Save CV Changes
                </button>
              </div>
            </div>

            <!-- PRINTABLE A4 CV SHEET -->
            <div id="printable-a4-cv" class="w-full max-w-[210mm] mx-auto bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl p-6 sm:p-10 font-sans">
              <div class="flex flex-col-reverse sm:flex-row items-start justify-between gap-6 pb-5 border-b-2 border-slate-900">
                <div class="space-y-1.5 flex-1">
                  <h1 class="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-950">${cvData.fullName}</h1>
                  <p class="text-sm sm:text-base font-semibold text-blue-800">${cvData.educationHeadline}</p>
                  <p class="text-xs sm:text-sm font-medium text-slate-700">${cvData.college} · ${cvData.currentStatus}</p>
                  <div class="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700">
                    <div><strong>Phone:</strong> ${cvData.phone}</div>
                    <div><strong>Email:</strong> ${cvData.email}</div>
                    <div><strong>LinkedIn:</strong> ${cvData.linkedinDisplay}</div>
                    <div><strong>Location:</strong> ${cvData.location}</div>
                  </div>
                </div>

                <!-- Top-Right Profile Photo Slot -->
                <div class="flex flex-col items-center sm:items-end shrink-0">
                  <input id="file-cv-photo" type="file" accept="image/*" class="hidden" />
                  <div id="cv-photo-box" class="w-28 h-32 ${
                    cvData.photoShape === 'circle' ? 'rounded-full w-28 h-28' : 'rounded-xl'
                  } overflow-hidden border-2 ${
                    cvData.profilePhotoDataUrl
                      ? 'border-slate-300 bg-slate-100'
                      : 'border-dashed border-slate-400 bg-slate-50'
                  } flex flex-col items-center justify-center text-center cursor-pointer">
                    ${
                      cvData.profilePhotoDataUrl
                        ? `<img src="${cvData.profilePhotoDataUrl}" alt="Profile Photo" class="w-full h-full object-cover object-top" />`
                        : `<div class="p-2">
                            <p class="text-[11px] font-semibold text-slate-700">Add Profile Photo</p>
                            <p class="text-[9.5px] text-slate-500 mt-0.5 no-print">Upload Picture</p>
                          </div>`
                    }
                  </div>
                  <div class="mt-2 flex items-center gap-1.5 no-print">
                    <button id="btn-upload-cv-photo" type="button" class="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                      ${cvData.profilePhotoDataUrl ? 'Change Photo' : 'Upload Profile Picture'}
                    </button>
                    ${
                      cvData.profilePhotoDataUrl
                        ? `<button id="btn-remove-cv-photo" type="button" class="px-2 py-1 text-[11px] text-rose-600 hover:underline cursor-pointer">Remove</button>`
                        : ''
                    }
                  </div>
                </div>
              </div>

              <div class="mt-5 space-y-4 text-xs sm:text-[13px] text-slate-800">
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Career Objective</h2>
                  <p>${cvData.careerObjective}</p>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Professional Summary</h2>
                  <p>${cvData.summary}</p>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Education</h2>
                  <div class="flex justify-between items-baseline">
                    <div>
                      <p class="font-bold text-slate-950">${cvData.educationHeadline}</p>
                      <p class="text-slate-700">${cvData.college}</p>
                    </div>
                    <span class="font-semibold text-blue-800">Currently Studying</span>
                  </div>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2">Technical Skills</h2>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    ${(cvData.technicalSkillsList || [])
                      .map((s) => `<div class="font-medium text-slate-800">• ${s}</div>`)
                      .join('')}
                  </div>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Experience — Academic, Practical & Technical Learning</h2>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Academic Projects:</strong> Planned, designed, and documented conceptual IT, web, smart-home, and networking projects as part of BSc IT coursework.</li>
                    <li><strong>Practical Learning:</strong> Hands-on practice with Cisco networking topologies, cloud computing concepts, cybersecurity awareness, and responsive web development.</li>
                    <li><strong>Technical & Creative Experience:</strong> Built HTML/CSS/JavaScript web prototypes and edited structured digital video content.</li>
                    <li><strong>College Activities:</strong> Participated in collaborative group coursework, technical presentations, and peer problem-solving at LBEF College.</li>
                  </ul>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Academic Projects</h2>
                  <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Web Development Projects:</strong> Student Event Website, Clothing Marketplace Concept, and Nepal Invest Concept.</li>
                    <li><strong>Smart Home Project:</strong> Academic project focused on smart-home automation technology and design thinking.</li>
                    <li><strong>Networking Projects:</strong> Cisco networking topologies, IP addressing, routing and switching lab work.</li>
                    <li><strong>Emergency Response Robot Concept:</strong> Robotics concept involving sensors, camera telemetry, and wireless communication.</li>
                  </ul>
                </section>
                <section>
                  <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">Certifications & Digital Credentials</h2>
                  <p>Completed IT-related certifications and verified digital credentials are available via Credly: <a href="${cvData.credlyUrl}" target="_blank" class="text-blue-700 underline">${cvData.credlyUrl}</a></p>
                </section>
                ${(cvData.additionalSections || [])
                  .map(
                    (sec) => `
                  <section>
                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-1.5">${sec.heading}</h2>
                    <p class="whitespace-pre-line">${sec.content}</p>
                  </section>`
                  )
                  .join('')}
              </div>
            </div>
          </section>

          <!-- CONTACT SECTION -->
          <section id="contact" class="py-16 no-print">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div class="lg:col-span-5 space-y-4">
                <div class="text-xs font-mono text-blue-400">08 · Get in Touch</div>
                <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">Contact Me</h2>
                <div class="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800 text-sm">
                  <div class="p-4"><strong>Email:</strong> <a href="mailto:upendrabudha505@gmail.com" class="text-blue-400">upendrabudha505@gmail.com</a></div>
                  <div class="p-4"><strong>Phone:</strong> <a href="tel:9701269514" class="text-blue-400">9701269514</a></div>
                  <div class="p-4"><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/upendra-budha-6b9240329" target="_blank" class="text-blue-400">linkedin.com/in/upendra-budha-6b9240329</a></div>
                  <div class="p-4"><strong>Credly:</strong> <a href="https://www.credly.com/users/upendra-bahadur-budha" target="_blank" class="text-blue-400">credly.com/users/upendra-bahadur-budha</a></div>
                  <div class="p-4"><strong>Facebook:</strong> <a href="https://www.facebook.com/bu.d.ha.776337" target="_blank" class="text-blue-400">facebook.com/bu.d.ha.776337</a></div>
                  <div class="p-4"><strong>Instagram:</strong> <a href="https://www.instagram.com/s.u.g.a.m_10/" target="_blank" class="text-blue-400">instagram.com/s.u.g.a.m_10</a></div>
                </div>
              </div>
              <div class="lg:col-span-7">
                <form id="offline-contact-form" class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                  <h3 class="font-display text-lg font-bold text-white">Send a Message</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input id="msg-name" type="text" required placeholder="Full Name *" class="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" />
                    <input id="msg-email" type="email" required placeholder="Email *" class="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  </div>
                  <input id="msg-subject" type="text" required placeholder="Subject *" class="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  <textarea id="msg-body" rows="4" required placeholder="Message *" class="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white"></textarea>
                  <div class="flex items-center justify-between gap-4">
                    <button type="submit" class="px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
                      Send Message
                    </button>
                    <span class="text-xs font-mono text-slate-400">Saved Messages: ${messages.length}</span>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    `;

    // Wire up interactive handlers
    const btnChangeHero = document.getElementById('btn-change-hero-photo');
    const fileHeroPhoto = document.getElementById('file-hero-photo');
    if (btnChangeHero && fileHeroPhoto) {
      btnChangeHero.onclick = () => fileHeroPhoto.click();
      fileHeroPhoto.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          customProfile = r.result;
          try {
            localStorage.setItem(STORAGE.PROFILE_IMG, customProfile);
          } catch {}
          renderApp();
        };
        r.readAsDataURL(f);
      };
    }

    const btnResetHero = document.getElementById('btn-reset-hero-photo');
    if (btnResetHero) {
      btnResetHero.onclick = () => {
        customProfile = '';
        localStorage.removeItem(STORAGE.PROFILE_IMG);
        renderApp();
      };
    }

    // Video upload
    const btnUploadVideo = document.getElementById('btn-upload-video');
    const dropZone = document.getElementById('video-drop-zone');
    const fileVideo = document.getElementById('file-short-video');
    if (fileVideo) {
      if (btnUploadVideo) btnUploadVideo.onclick = () => fileVideo.click();
      if (dropZone) dropZone.onclick = () => fileVideo.click();
      fileVideo.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        shortVideoData = url;
        renderApp();
      };
    }
    const btnRemoveVideo = document.getElementById('btn-remove-video');
    if (btnRemoveVideo) {
      btnRemoveVideo.onclick = () => {
        shortVideoData = '';
        localStorage.removeItem(STORAGE.VIDEO_URL);
        renderApp();
      };
    }

    // Project image upload, edit, delete, add, restore
    document.querySelectorAll('.file-proj-img').forEach((input) => {
      input.onchange = (e) => {
        const id = input.getAttribute('data-proj-img');
        const f = e.target.files && e.target.files[0];
        if (!f || !id) return;
        const r = new FileReader();
        r.onload = () => {
          projectImgs[id] = r.result;
          saveJson(STORAGE.PROJECT_IMGS, projectImgs);
          renderApp();
        };
        r.readAsDataURL(f);
      };
    });

    document.querySelectorAll('[data-remove-img]').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-remove-img');
        delete projectImgs[id];
        saveJson(STORAGE.PROJECT_IMGS, projectImgs);
        renderApp();
      };
    });

    document.querySelectorAll('[data-del-proj]').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-del-proj');
        projects = projects.filter((p) => p.id !== id);
        saveJson(STORAGE.PROJECTS, projects);
        renderApp();
      };
    });

    document.querySelectorAll('[data-edit-proj]').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-edit-proj');
        const target = projects.find((p) => p.id === id);
        if (!target) return;
        const newTitle = prompt('Edit Project Title:', target.title);
        if (newTitle === null) return;
        const newDesc = prompt('Edit Project Description:', target.shortDescription);
        if (newDesc !== null) {
          target.title = newTitle.trim() || target.title;
          target.shortDescription = newDesc.trim() || target.shortDescription;
          saveJson(STORAGE.PROJECTS, projects);
          renderApp();
        }
      };
    });

    const btnAddProj = document.getElementById('btn-add-project');
    if (btnAddProj) {
      btnAddProj.onclick = () => {
        const title = prompt('Enter New Academic Project Title:');
        if (!title) return;
        const desc = prompt('Enter Short Description:') || 'Academic coursework project.';
        projects.push({
          id: 'custom-' + Date.now(),
          title,
          badge: 'Academic Project / Concept',
          category: 'Web & Concept',
          shortDescription: desc,
          topics: ['Academic Project', 'Coursework'],
        });
        saveJson(STORAGE.PROJECTS, projects);
        renderApp();
      };
    }

    const btnRestoreProj = document.getElementById('btn-restore-projects');
    if (btnRestoreProj) {
      btnRestoreProj.onclick = () => {
        projects = [...DEFAULT_PROJECTS];
        saveJson(STORAGE.PROJECTS, projects);
        renderApp();
      };
    }

    // CV Top-Right Photo Upload
    const fileCvPhoto = document.getElementById('file-cv-photo');
    const cvPhotoBox = document.getElementById('cv-photo-box');
    const btnUploadCvPhoto = document.getElementById('btn-upload-cv-photo');
    if (fileCvPhoto) {
      if (cvPhotoBox) cvPhotoBox.onclick = () => fileCvPhoto.click();
      if (btnUploadCvPhoto) btnUploadCvPhoto.onclick = () => fileCvPhoto.click();
      fileCvPhoto.onchange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          cvData.profilePhotoDataUrl = r.result;
          saveJson(STORAGE.CV_JSON, cvData);
          renderApp();
        };
        r.readAsDataURL(f);
      };
    }

    const btnRemoveCvPhoto = document.getElementById('btn-remove-cv-photo');
    if (btnRemoveCvPhoto) {
      btnRemoveCvPhoto.onclick = () => {
        cvData.profilePhotoDataUrl = '';
        saveJson(STORAGE.CV_JSON, cvData);
        renderApp();
      };
    }

    // Toggle inline CV editor
    const btnToggleCvEdit = document.getElementById('btn-toggle-cv-edit');
    const cvInlineEditor = document.getElementById('cv-inline-editor');
    if (btnToggleCvEdit && cvInlineEditor) {
      btnToggleCvEdit.onclick = () => {
        cvInlineEditor.classList.toggle('hidden');
      };
    }

    const btnSaveCvInline = document.getElementById('btn-save-cv-inline');
    if (btnSaveCvInline) {
      btnSaveCvInline.onclick = () => {
        cvData.fullName = document.getElementById('cv-in-name').value || cvData.fullName;
        cvData.educationHeadline =
          document.getElementById('cv-in-edu').value || cvData.educationHeadline;
        cvData.phone = document.getElementById('cv-in-phone').value || cvData.phone;
        cvData.careerObjective =
          document.getElementById('cv-in-obj').value || cvData.careerObjective;
        cvData.summary = document.getElementById('cv-in-sum').value || cvData.summary;
        cvData.technicalSkillsList = document
          .getElementById('cv-in-skills')
          .value.split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        saveJson(STORAGE.CV_JSON, cvData);
        renderApp();
      };
    }

    const btnAddCustomCvSec = document.getElementById('btn-add-custom-cv-sec');
    if (btnAddCustomCvSec) {
      btnAddCustomCvSec.onclick = () => {
        const heading = prompt('Enter New CV Section Heading (e.g., Languages, Workshops):');
        if (!heading) return;
        const content = prompt('Enter section details:') || '';
        cvData.additionalSections = cvData.additionalSections || [];
        cvData.additionalSections.push({ id: 'sec-' + Date.now(), heading, content });
        saveJson(STORAGE.CV_JSON, cvData);
        renderApp();
      };
    }

    // Print CV buttons
    const btnPrintA4 = document.getElementById('btn-print-a4');
    const btnPrintHero = document.getElementById('btn-print-cv-hero');
    if (btnPrintA4) btnPrintA4.onclick = () => window.print();
    if (btnPrintHero) btnPrintHero.onclick = () => window.print();

    // Contact form
    const contactForm = document.getElementById('offline-contact-form');
    if (contactForm) {
      contactForm.onsubmit = (e) => {
        e.preventDefault();
        messages.unshift({
          id: 'msg-' + Date.now(),
          fullName: document.getElementById('msg-name').value,
          email: document.getElementById('msg-email').value,
          subject: document.getElementById('msg-subject').value,
          message: document.getElementById('msg-body').value,
          submittedAt: new Date().toLocaleString(),
        });
        saveJson(STORAGE.MESSAGES, messages);
        renderApp();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
})();
