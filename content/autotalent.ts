/**
 * AutoTalent case-study deck: slide copy, project facts, and the demo data the
 * live product slides run on. The product slides are a working copy of the
 * real AutoTalent app (AI Agent, Job Hub, Search Jobs, Resume Builder), so the
 * demo data is shaped like its tables: a profile, a base resume, saved jobs,
 * application kits, and the agent's chat with its document artifacts.
 *
 * Every person and company here is fictional. Inline `[[word]]` marks a
 * keyword the AI matched to the job; the screens render it as a highlight.
 */
import type { SlideCopy } from "./corvinn";

export type ScreenId = "agent" | "hub" | "search" | "resume";

export type Workplace = "Remote" | "Hybrid" | "On-site";

export type DemoJob = {
  id: string;
  title: string;
  company: string;
  /** Two letters for the company tile. */
  initials: string;
  /** Tile fill, a literal hex with white text clearing 4.5:1. */
  color: string;
  location: string;
  workplace: Workplace;
  type: "Full-time" | "Contract";
  level: "Associate" | "Mid-Senior Level" | "Director";
  postedDaysAgo: number;
  applicants: number;
  salary: string;
  summary: string;
  about: string;
  skills: string[];
};

export type KitItemId = "resume" | "coverLetter" | "followUp" | "interview";

export type AgentChipId = "tailor" | "cover" | "score" | "followup" | "translate";

export type ResumeRole = { role: string; company: string; dates: string; bullets: string[] };

export type ResumeDoc = {
  name: string;
  headline: string;
  contact: string;
  summaryLabel: string;
  summary: string;
  experienceLabel: string;
  experience: ResumeRole[];
  skillsLabel: string;
  skills: string[];
  educationLabel: string;
  education: string;
};

export type AgentScript = {
  id: AgentChipId;
  /** Chip label under the chat input. */
  label: string;
  icon: "FileText" | "FileSignature" | "Gauge" | "Mail" | "Languages";
  /** What the chip sends as the user's message. */
  prompt: string;
  /** Tool calls shown as badges while the agent works, like the real chat panel. */
  tools: string[];
  /** The agent's streamed answer. */
  reply: string;
  /** The artifact it opens on the right. */
  artifact: { title: string; type: string };
  /** A tailored resume also files an application kit on the Job Hub. */
  kitJobId?: string;
};

export const AUTOTALENT_OLIVE = "#5b6949";

export const autotalentDeck = {
  appName: "AutoTalent",
  user: { first: "Alex", name: "Alex Morgan", email: "alex.morgan@example.com", initials: "AM" },
  logo: { src: "/ingested/autotalent/logo-white.png", alt: "AutoTalent logo, a circuit brain mark" },

  slides: {
    cover: { id: "cover", title: "AutoTalent", summary: "The project at a glance", thumb: "/ingested/autotalent/slides/cover.jpg" },
    overview: { id: "overview", title: "Overview", summary: "What it is, who it is for, and the stack", thumb: "/ingested/autotalent/slides/overview.jpg" },
    agent: {
      id: "agent",
      title: "AI Agent",
      summary: "A career agent that knows your profile and writes the documents",
      hint: "Tap a quick action under the chat. The agent writes it and opens the document on the right.",
      thumb: "/ingested/autotalent/slides/agent.jpg",
      duration: 22000,
    },
    hub: {
      id: "hub",
      title: "Job Hub",
      summary: "Onboarding checklist and every application kit in one place",
      hint: "Hit New Application Kit and pick a saved job. Watch all four documents get written.",
      thumb: "/ingested/autotalent/slides/hub.jpg",
      duration: 16000,
    },
    search: {
      id: "search",
      title: "Search Jobs",
      summary: "Search public listings, save the good ones, tailor in one click",
      hint: "Run a search, save a job, then hit Tailor to file a kit for it.",
      thumb: "/ingested/autotalent/slides/search.jpg",
      duration: 16000,
    },
    resume: {
      id: "resume",
      title: "Resume Builder",
      summary: "ATS score with fixes you can apply, across seven CV templates",
      hint: "Apply the fixes and watch the score climb. Then try another template.",
      thumb: "/ingested/autotalent/slides/resume.jpg",
      duration: 16000,
    },
    campaign: { id: "campaign", title: "Launch campaign", summary: "The social launch kit, in the product's own voice", thumb: "/ingested/autotalent/slides/campaign.jpg" },
    platform: { id: "platform", title: "The rest of the platform", summary: "Translation, interview prep, billing, models and more", thumb: "/ingested/autotalent/slides/platform.jpg" },
    closing: { id: "closing", title: "Start a project", summary: "Want an AI product like this built", thumb: "/ingested/autotalent/slides/closing.jpg" },
  } satisfies Record<string, SlideCopy & { duration?: number }>,

  overview: {
    eyebrow: "Overview",
    title: "Job searching shouldn't be a second full-time job",
    body: "Most people send one resume to fifty jobs and hear nothing back. AutoTalent turns one profile into a tailored resume, cover letter, follow-up email and interview prep for each job, written from the person's real experience. A career agent that remembers them does the rest.",
    facts: [
      { label: "What it is", value: "An AI job search assistant, from profile to application kit to interview" },
      { label: "Who it's for", value: "New grads, career switchers and working professionals" },
      { label: "Our role", value: "Built by Growtk: product, design and engineering" },
      { label: "Status", value: "Live at autotalent.co, free during early access" },
    ],
    stackLabel: "Tech stack",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui and Radix",
      "next-intl (EN, SV, AR)",
      "Supabase",
      "Edge Functions",
      "Vercel AI SDK",
      "OpenAI",
      "Bring your own model",
      "Stripe",
      "Resend",
      "TipTap",
    ],
    video: {
      src: "/ingested/autotalent/promo.mp4",
      poster: "/ingested/autotalent/promo-poster.jpg",
      label: "AutoTalent promo: one resume tailored to the job, its score rising, then cover letters and applications",
      caption: "The 10 second launch promo",
      play: "Play the promo",
      pause: "Pause the promo",
    },
    /** Floating chips around the video, real product copy. */
    chips: ["Tailored resume", "Cover letter", "Follow-up email", "Interview prep"],
  },

  /** Shown when someone clicks a screen or action this demo doesn't include. */
  walkthrough: {
    eyebrow: "In the full product",
    title: "{feature} is part of the full AutoTalent build",
    body: "This demo covers the screens a job seeker uses most. The live app has the rest, free while it is in early access.",
    points: ["Every screen, on your own profile", "The agent, with your real resumes and saved jobs", "Exports to PDF and DOCX"],
    primary: { label: "Talk to us about a build like this", href: "/contact" },
    secondary: "Keep exploring the demo",
  },

  nav: {
    jobHub: "Job Hub",
    aiAgent: "AI Agent",
    resumeBuilder: "Resume Builder",
    coverLetter: "Cover Letter",
    emailToHr: "Email to HR",
    interviews: "Job Interviews",
    searchJobs: "Search Jobs",
    savedJobs: "Saved Jobs",
    smartApply: "Smart Apply",
    soon: "Soon",
    usage: "Usage",
    billing: "Billing",
    signOut: "Sign out",
    earlyAccess: "Early access",
  },

  /* ------------------------------------------------------------- AI Agent */
  agent: {
    title: "AI Agent",
    status: "Knows your profile, 2 resumes and 3 saved jobs",
    empty: { title: "How can I help you?", subtitle: "Your AI career assistant for resumes, cover letters, job search and more" },
    placeholder: "Ask me anything about your job search...",
    clear: "Clear",
    send: "Send",
    attach: "Attach a resume",
    attachFeature: "Uploading a resume file",
    chat: "Chat",
    document: "Document",
    working: "Working on it",
    clickToOpen: "Click to open",
    fallback:
      "In this demo I answer the quick actions below. In the live app I answer anything about your job search, using your profile, resumes and saved jobs.",
    artifact: {
      emptyTitle: "Artifact preview",
      emptyBody: "Documents the agent writes open here, ready to edit and download.",
      generating: "Writing the document",
      download: "Download PDF",
      downloadedTitle: "PDF ready",
      downloadedBody: "In the live app this saves the file to your device.",
      templates: "Template",
      version: "v1",
    },
    scripts: [
      {
        id: "tailor",
        label: "Tailor resume",
        icon: "FileText",
        prompt: "Tailor my resume for the Senior Product Manager role at Fernway I saved.",
        tools: ["Reading your profile", "Reading the saved job", "Tailoring your resume"],
        reply:
          "Done. I matched your resume to the Fernway posting. I moved your scheduling and onboarding work to the top, used their words for it (roadmapping, stakeholder management, B2B SaaS) and kept every line true to your experience. I filed it as an application kit on your Job Hub too.",
        artifact: { title: "Alex Morgan, Senior PM at Fernway", type: "Resume" },
        kitJobId: "j1",
      },
      {
        id: "cover",
        label: "Cover letter",
        icon: "FileSignature",
        prompt: "Write a cover letter for the Fernway role.",
        tools: ["Reading your tailored resume", "Writing the cover letter"],
        reply: "Here is a one page cover letter. It opens with the onboarding project, since that is the first thing their posting asks for, and closes with a clear next step.",
        artifact: { title: "Cover letter, Fernway", type: "Cover letter" },
      },
      {
        id: "score",
        label: "Score resume",
        icon: "Gauge",
        prompt: "Score my base resume against the Fernway job.",
        tools: ["Reading your base resume", "Checking it against the job"],
        reply: "Your base resume scores 58 for this job. Three fixes get it into the 90s: add the job's own keywords, lead your bullets with outcomes, and cut the summary to two lines.",
        artifact: { title: "Resume score, Fernway", type: "Score" },
      },
      {
        id: "followup",
        label: "Follow-up email",
        icon: "Mail",
        prompt: "Draft a follow-up email after my interview with Fernway on Tuesday.",
        tools: ["Reading the saved job", "Drafting the email"],
        reply: "Here is a short follow-up you can send today. It thanks Jordan by name, points back to one thing you discussed, and asks about next steps.",
        artifact: { title: "Follow-up email, Fernway", type: "Email" },
      },
      {
        id: "translate",
        label: "Translate",
        icon: "Languages",
        prompt: "Translate my resume to Arabic for the Dubai role.",
        tools: ["Reading your resume", "Translating to Arabic"],
        reply: "Translated to Arabic. The layout is mirrored right to left, and your company names, tools and dates are kept as they are.",
        artifact: { title: "Resume, Arabic", type: "Translation" },
      },
    ] satisfies AgentScript[],

    /** The documents each quick action opens. */
    docs: {
      letter: {
        to: "Hiring team, Fernway",
        greeting: "Dear Fernway hiring team,",
        paragraphs: [
          "Your posting asks for a product manager who can take onboarding from a drop off point to a reason people stay. At Tallgrass Labs I led exactly that: a [[self-serve onboarding]] rebuild for a B2B scheduling tool, from discovery calls to launch.",
          "I work in short loops with design and engineering, keep [[stakeholders]] close with a written roadmap, and judge features by what customers do after launch, not by the ship date.",
          "I would love to show you how I would approach Fernway's next onboarding release. I am free for a call any day next week.",
        ],
        signoff: "Kind regards,",
      },
      email: {
        toLabel: "To",
        subjectLabel: "Subject",
        to: "jordan.reyes@fernway.example",
        subject: "Thank you for Tuesday's interview",
        paragraphs: [
          "Hi Jordan,",
          "Thank you again for your time on Tuesday. I enjoyed hearing about the team's plans for the [[onboarding roadmap]], and it made me even more excited about the role.",
          "Is there anything else I can share to help with next steps?",
          "Best,\nAlex",
        ],
      },
      score: {
        ringLabel: "ATS",
        before: 58,
        after: 93,
        beforeLabel: "Base resume",
        afterLabel: "After fixes",
        checks: [
          { label: "Keywords from the job", value: 41 },
          { label: "Impact and outcomes", value: 63 },
          { label: "Formatting for ATS", value: 88 },
          { label: "Length and focus", value: 52 },
        ],
        fixesLabel: "Top fixes",
        fixes: ["Add roadmapping, stakeholder management and B2B SaaS", "Start each bullet with what changed", "Trim the summary to two lines"],
      },
      arabic: {
        name: "أليكس مورغان",
        headline: "مدير منتجات أول",
        contact: "alex.morgan@example.com",
        summaryLabel: "الملخص",
        summary: "مدير منتجات بخبرة ست سنوات في منتجات البرمجيات كخدمة للشركات، يقود فرق التصميم والهندسة من الفكرة إلى الإطلاق.",
        experienceLabel: "الخبرة",
        experience: [
          {
            role: "مدير منتجات",
            company: "Tallgrass Labs",
            dates: "2022 - الآن",
            bullets: ["قاد إعادة بناء تجربة التسجيل الذاتي لأداة جدولة للشركات.", "وضع خارطة طريق ربع سنوية مكتوبة يتابعها فريق المبيعات والدعم."],
          },
          {
            role: "محلل منتجات",
            company: "Quillstone",
            dates: "2019 - 2022",
            bullets: ["أطلق لوحة تقارير يستخدمها فريق العمليات كل يوم."],
          },
        ],
        skillsLabel: "المهارات",
        skills: ["خرائط الطريق", "أبحاث المستخدمين", "SQL", "Figma"],
        educationLabel: "التعليم",
        education: "بكالوريوس نظم المعلومات",
      } satisfies ResumeDoc,
    },
  },

  /** The tailored resume the agent writes for Fernway. */
  tailoredResume: {
    name: "Alex Morgan",
    headline: "Senior Product Manager",
    contact: "alex.morgan@example.com  ·  Remote",
    summaryLabel: "Summary",
    summary: "Product manager with six years in [[B2B SaaS]]. Leads design and engineering from discovery to launch, with a written [[roadmap]] everyone can follow.",
    experienceLabel: "Experience",
    experience: [
      {
        role: "Product Manager",
        company: "Tallgrass Labs",
        dates: "2022 to now",
        bullets: [
          "Led the [[self-serve onboarding]] rebuild for a B2B scheduling tool, from discovery calls to launch.",
          "Runs a quarterly [[roadmapping]] process with sales, support and engineering.",
          "Ships in two week loops with design, judged by what customers do after launch.",
        ],
      },
      {
        role: "Product Analyst",
        company: "Quillstone",
        dates: "2019 to 2022",
        bullets: ["Built the reporting dashboard the operations team opens every morning.", "Ran [[A/B tests]] on pricing pages with marketing."],
      },
    ],
    skillsLabel: "Skills",
    skills: ["Roadmapping", "Stakeholder management", "User research", "SQL", "A/B testing", "Figma"],
    educationLabel: "Education",
    education: "BSc Information Systems",
  } satisfies ResumeDoc,

  /** The seven real CV templates, with their accent and secondary colors. */
  templates: [
    { id: "CV1", name: "Dark Blue Sidebar", accent: "#2b3a4e", secondary: "#3d7c8c" },
    { id: "CV2", name: "Dark Red Sidebar", accent: "#7b2d2d", secondary: "#c0392b" },
    { id: "CV3", name: "Orange Accent", accent: "#e8722a", secondary: "#f0a500" },
    { id: "CV4", name: "Navy and White", accent: "#1a2b5e", secondary: "#3a5ea8" },
    { id: "CV5", name: "Layered Strip", accent: "#2d3748", secondary: "#4a9085" },
    { id: "CV6", name: "Dark Slate Sidebar", accent: "#2d3748", secondary: "#718096" },
    { id: "CV7", name: "Slate Header", accent: "#374151", secondary: "#6b7280" },
  ],

  /* -------------------------------------------------------------- Job Hub */
  hub: {
    greeting: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
    subtitle: "Your job hub: every application, ready to send",
    checklist: {
      title: "Get started",
      subtitle: "Three steps from profile to a complete application kit",
      progress: "{done} of 3",
      completed: "Completed",
      steps: [
        { title: "Complete your profile", body: "Paste your LinkedIn profile or resume text and the AI fills in your experience, education and skills.", done: "Review profile" },
        { title: "Your base resume", body: "Generated from your profile as soon as it has experience.", done: "Open base resume" },
        { title: "Create your AI application kit", body: "Pick a real job and get a tailored resume, cover letter, follow-up email and interview questions.", cta: "Pick a job and tailor", done: "Open application kit" },
      ],
    },
    kits: {
      title: "Application Kits",
      newKit: "New Application Kit",
      kitDescription: "Resume, cover letter, follow-up and interview prep",
      empty: "No application kits yet. Create one to get started.",
      created: "Created",
      justNow: "just now",
      items: { resume: "Resume", coverLetter: "Cover letter", followUp: "Follow-up", interview: "Interview prep" } satisfies Record<KitItemId, string>,
      status: { queued: "Waiting", writing: "Writing…", ready: "Open" },
      readyToast: "Your application kit is ready",
      startedToast: "Creating your kit",
    },
    picker: {
      title: "Pick a job to tailor for",
      body: "Your saved jobs. AutoTalent writes the whole kit from your real experience.",
      saved: "Saved",
      hasKit: "Kit made",
      close: "Close",
      empty: "No saved jobs left. Save one on Search Jobs.",
    },
  },

  /* ----------------------------------------------------------- Search Jobs */
  search: {
    badge: "Public listings",
    title: "Search Jobs",
    subtitle: "Search, save and tailor smarter, without leaving your job hub.",
    keywords: "Product manager",
    location: "Remote",
    keywordsPlaceholder: "Job title, keywords, company...",
    locationPlaceholder: "City, state, or country",
    button: "Search",
    filters: {
      workplace: { label: "Workplace Type", options: ["Remote", "Hybrid", "On-site"] },
      level: { label: "Experience Level", options: ["Associate", "Mid-Senior Level", "Director"] },
      special: { label: "Special Filters", options: ["Under 10 Applicants"] },
    },
    stages: ["Connecting to job boards", "Scanning job listings", "Retrieving job details", "Processing results"],
    ready: { title: "Start your search", body: "Enter keywords and a location to find open roles from public job listings." },
    results: "{n} results",
    noResults: "No jobs match those filters. Clear one and try again.",
    save: "Save job",
    saved: "Saved",
    tailor: "Tailor",
    applyNow: "Apply Now",
    posted: { today: "Today", days: "{n}d ago" },
    applicants: "{n} applicants",
    description: "Description",
    aboutCompany: "About {company}",
    skills: "Skills they ask for",
    tailorToast: "Kit started for {company}",
    savedToast: "Saved to your jobs",
  },

  jobs: [
    {
      id: "j1",
      title: "Senior Product Manager",
      company: "Fernway",
      initials: "FW",
      color: "#3f6b4f",
      location: "Remote, Europe",
      workplace: "Remote",
      type: "Full-time",
      level: "Mid-Senior Level",
      postedDaysAgo: 1,
      applicants: 8,
      salary: "€85k to €100k",
      summary: "Own self-serve onboarding for a B2B scheduling product. Work with design, engineering and sales on a written quarterly roadmap.",
      about: "Fernway makes scheduling software for field teams of 5 to 500 people.",
      skills: ["Roadmapping", "Stakeholder management", "B2B SaaS", "Onboarding"],
    },
    {
      id: "j2",
      title: "Product Manager, Payments",
      company: "Juniper Pay",
      initials: "JP",
      color: "#4b4f9c",
      location: "Lisbon",
      workplace: "Hybrid",
      type: "Full-time",
      level: "Mid-Senior Level",
      postedDaysAgo: 0,
      applicants: 23,
      salary: "€70k to €82k",
      summary: "Lead checkout and payouts for small online stores, from research to rollout.",
      about: "Juniper Pay runs payments for independent shops.",
      skills: ["Payments", "SQL", "Experimentation"],
    },
    {
      id: "j3",
      title: "Product Owner",
      company: "Harbor Analytics",
      initials: "HA",
      color: "#9a3b2e",
      location: "Remote",
      workplace: "Remote",
      type: "Contract",
      level: "Associate",
      postedDaysAgo: 3,
      applicants: 6,
      salary: "€450 a day",
      summary: "Six month contract to run the backlog for a reporting product used by finance teams.",
      about: "Harbor Analytics builds reporting tools for finance teams.",
      skills: ["Backlog", "Scrum", "Reporting"],
    },
    {
      id: "j4",
      title: "Product Manager, Growth",
      company: "Pinecrest",
      initials: "PC",
      color: "#22616b",
      location: "Dubai",
      workplace: "On-site",
      type: "Full-time",
      level: "Mid-Senior Level",
      postedDaysAgo: 2,
      applicants: 31,
      salary: "AED 32k a month",
      summary: "Own activation and retention for a logistics app across the Gulf.",
      about: "Pinecrest moves parcels for online stores across the Gulf.",
      skills: ["Growth", "Arabic a plus", "Analytics"],
    },
    {
      id: "j5",
      title: "Associate Product Manager",
      company: "Orbitly",
      initials: "OR",
      color: "#7a4a8c",
      location: "Stockholm",
      workplace: "Hybrid",
      type: "Full-time",
      level: "Associate",
      postedDaysAgo: 5,
      applicants: 9,
      salary: "SEK 48k a month",
      summary: "Join a small team building travel planning tools. Great first PM role.",
      about: "Orbitly builds trip planning apps for small groups.",
      skills: ["User research", "Figma", "Swedish a plus"],
    },
    {
      id: "j6",
      title: "Director of Product",
      company: "Lumen and Co",
      initials: "LC",
      color: "#6b5a1e",
      location: "Remote",
      workplace: "Remote",
      type: "Full-time",
      level: "Director",
      postedDaysAgo: 4,
      applicants: 17,
      salary: "€130k to €150k",
      summary: "Lead three product teams for a learning platform used by schools.",
      about: "Lumen and Co makes learning software for secondary schools.",
      skills: ["Leadership", "Strategy", "Hiring"],
    },
  ] satisfies DemoJob[],

  /** Jobs Alex already saved when the demo opens. */
  savedJobIds: ["j1", "j3", "j5"],

  /* -------------------------------------------------------- Resume Builder */
  resume: {
    title: "Resume Builder",
    docName: "Base resume, Product Manager",
    scoreTitle: "Resume score",
    scoreFor: "Scored against Senior Product Manager at Fernway",
    base: 58,
    checksLabel: "Breakdown",
    fixesLabel: "Improvements",
    apply: "Apply",
    applied: "Applied",
    applyAll: "Apply all fixes",
    reset: "Reset",
    download: "Download",
    downloadToast: "Exports to PDF and DOCX in the live app",
    templatesLabel: "CV template",
    scoreLabel: "ATS score",
    checks: [
      { label: "Keywords", base: 41 },
      { label: "Impact", base: 60 },
      { label: "Formatting", base: 88 },
      { label: "Length", base: 52 },
    ],
    /** Each fix rewrites one part of the resume and raises the score. */
    fixes: [
      {
        id: "keywords",
        title: "Use the job's own words",
        body: "Add roadmapping, stakeholder management and B2B SaaS where they are true.",
        gain: 14,
        check: 0,
        checkGain: 46,
      },
      {
        id: "impact",
        title: "Lead with what changed",
        body: "Start bullets with the outcome, not the task.",
        gain: 12,
        check: 1,
        checkGain: 30,
      },
      {
        id: "summary",
        title: "Trim the summary",
        body: "Two lines a recruiter reads in five seconds.",
        gain: 9,
        check: 3,
        checkGain: 38,
      },
    ],
    /** The base resume, and what each fix changes. */
    doc: {
      name: "Alex Morgan",
      headline: "Product Manager",
      contact: "alex.morgan@example.com  ·  Remote",
      summary: {
        before: "Hard working product person who is passionate about building great products and working with many different teams to deliver value to users and the business in fast paced environments.",
        after: "Product manager with six years in [[B2B SaaS]]. Leads design and engineering from discovery to launch.",
      },
      roles: [
        {
          role: "Product Manager",
          company: "Tallgrass Labs",
          dates: "2022 to now",
          bullets: [
            { before: "Responsible for the onboarding project.", impact: "Rebuilt self-serve onboarding, so new teams set up without a sales call.", keywords: "Rebuilt [[self-serve onboarding]] for a [[B2B SaaS]] tool, so new teams set up without a sales call." },
            { before: "Worked with sales and engineering on planning.", impact: "Set a quarterly plan that sales and engineering both follow.", keywords: "Set a quarterly [[roadmap]] with sales and engineering, through regular [[stakeholder management]]." },
          ],
        },
        {
          role: "Product Analyst",
          company: "Quillstone",
          dates: "2019 to 2022",
          bullets: [{ before: "Made dashboards for the operations team.", impact: "Built the dashboard operations opens every morning.", keywords: "Built the dashboard operations opens every morning." }],
        },
      ],
      skills: { before: ["Teamwork", "Communication", "SQL", "Figma"], after: ["Roadmapping", "Stakeholder management", "SQL", "Figma"] },
    },
  },

  /* ------------------------------------------------------ Launch campaign */
  campaign: {
    eyebrow: "Launch campaign",
    title: "A launch kit that sounds like the product",
    body: "Alongside the app we made its social launch: posts for LinkedIn, Instagram and X, each built on one real pain point and one feature that fixes it, plus a 10 second promo.",
    points: ["Problem first, feature second", "Real product screens, not stock photos", "One palette: black, lime and the olive app"],
    hint: "Tap a post to bring it forward.",
    prev: "Previous post",
    next: "Next post",
    posts: [
      { src: "/ingested/autotalent/posts/01-launch-early-access.jpg", tag: "Launch", alt: "Launch post: Job searching shouldn't be a second full-time job. Free during early access." },
      { src: "/ingested/autotalent/posts/03-super-agent-spotlight.jpg", tag: "AI Super Agent", alt: "Agent post: Most AI forgets you. Our career agent doesn't." },
      { src: "/ingested/autotalent/posts/04-before-after-resume-score.jpg", tag: "Before and after", alt: "Resume score post: same experience, different resume, scored against the role." },
      { src: "/ingested/autotalent/posts/02-pain-point-one-resume.jpg", tag: "Pain point", alt: "Pain point post: same resume, fifty jobs, nobody calls back." },
      { src: "/ingested/autotalent/posts/12-follow-up-emails.jpg", tag: "Follow-up emails", alt: "Follow-up post: applied, interviewed, then silence. A follow-up email drafted in seconds." },
      { src: "/ingested/autotalent/posts/13-resume-translation.jpg", tag: "Resume translator", alt: "Translation post: one resume in English, Swedish and Arabic with the layout kept intact." },
      { src: "/ingested/autotalent/posts/11-pricing-free-start.jpg", tag: "Pricing", alt: "Pricing post: Free, Pro and Lifetime plans, all free during early access." },
    ],
  },

  /* -------------------------------------------------------------- Platform */
  platform: {
    eyebrow: "Also in the box",
    title: "Everything else a job search needs",
    body: "The slides showed the screens people live in. Around them sit the modules that finish the job.",
    featured: {
      icon: "Languages",
      title: "Three languages, one of them right to left",
      body: "The whole app and every resume work in English, Swedish and Arabic. Arabic flips the layout, not just the words.",
      sample: [
        { code: "EN", dir: "ltr", label: "English", line: "Your next application, written from your real experience." },
        { code: "SV", dir: "ltr", label: "Svenska", line: "Din nästa ansökan, skriven utifrån din verkliga erfarenhet." },
        { code: "AR", dir: "rtl", label: "العربية", line: "طلبك القادم، مكتوب من خبرتك الحقيقية." },
      ],
    },
    modules: [
      { icon: "FileText", title: "Resume editor", body: "Rich text editing, seven CV templates and export to PDF or DOCX." },
      { icon: "FileSignature", title: "Cover letters", body: "One per job, written from the tailored resume." },
      { icon: "Mail", title: "Email to HR", body: "Follow-up and thank you emails after each stage." },
      { icon: "Briefcase", title: "Interview prep", body: "Questions for the exact job, with AI feedback on each answer." },
      { icon: "Cpu", title: "Bring your own model", body: "OpenAI by default. Anthropic, Gemini, Groq, DeepSeek or OpenRouter with your own key." },
      { icon: "CreditCard", title: "Billing", body: "Free, Pro at $19 a month, or Lifetime at $149, through Stripe. Free for everyone in early access." },
      { icon: "Wand2", title: "Onboarding wizard", body: "Import a LinkedIn profile or resume, get a base resume, pick a job, get a kit." },
      { icon: "BarChart3", title: "Usage", body: "Resumes, kits and agent messages per plan, in one place." },
      { icon: "Rocket", title: "Smart Apply", body: "Applying to matched jobs for you. Coming soon, marked as such in the app." },
    ],
  },

  closing: {
    eyebrow: "Your turn",
    title: "Want an AI product like this built",
    body: "We design and build AI products end to end, with the same care for the screens people use every day.",
    primary: { label: "Start a project", href: "/contact" },
    secondary: { label: "Back to all work", href: "/#work" },
  },
};

export type AutotalentDeck = typeof autotalentDeck;
