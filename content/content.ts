export const meta = {
  name: 'Akhil Sai Guruju',
  role: 'Senior Technical Analyst at Gainsight',
  title: 'Senior Technical Analyst · Gainsight',
  thesis: 'I resolve complex Gainsight issues with SQL, REST APIs and root-cause analysis — and build Claude agents that get there faster.',
  location: 'Hyderabad, India',
  timeZone: 'Asia/Kolkata',
  email: 'gurujuakhilsai@gmail.com',
  phone: '+91 96297 78269',
  linkedin: 'https://www.linkedin.com/in/akhil-sai-guruju-9b7382102',
  available: true,
}

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const about = {
  // Segments marked `em` are set in the italic serif.
  statement: [
    { text: 'Nine years keeping complex systems working for ' },
    { text: 'the people who depend on them.', em: true },
    { text: ' Four at Bank of America on L3 production support for claims and fraud applications; five at Gainsight resolving enterprise customer issues with SQL, REST APIs and root-cause analysis. Lately I add AI to that toolkit — Claude agents, connected through MCP, that gather context and surface probable causes faster — and bring the same rigour to ' },
    { text: 'design', em: true },
    { text: ', taking websites from first sketch to production.' },
  ],
  facts: [
    { label: 'Now', value: 'Senior Technical Analyst, Gainsight' },
    { label: 'Before', value: 'Senior Software Engineer, Bank of America' },
    { label: 'Certified', value: 'Gainsight Administrator, Level 3' },
    { label: 'Studied', value: 'B.Tech, ECE — VIT, 2013–2017' },
    { label: 'Based in', value: 'Hyderabad, India' },
    { label: 'Off hours', value: 'Gaming, photography, cooking, drones' },
  ],
  tools: [
    'Gainsight', 'SQL', 'REST APIs', 'Postman', 'Python', 'Alteryx Trifacta',
    'Jira', 'Zendesk', 'Claude', 'MCP', 'Claude Code', 'React.js', 'GSAP',
  ],
}

export const work = {
  noctua: {
    id: 'noctua',
    title: 'Noctua Consulting',
    kicker: 'Website design & development',
    period: 'Aug — Oct 2026',
    year: '2026',
    url: 'https://www.noctuaconsulting.co.in/',
    urlLabel: 'noctuaconsulting.co.in',
    // Drop a screenshot of the live site at /public/work/noctua-cover.jpg and set this to '/work/noctua-cover.jpg'
    cover: null as string | null,
    recording: {
      webm: '/work/noctua-linkedin.webm',
      poster: '/work/noctua-linkedin-poster.jpg',
      width: 694,
      height: 650,
      caption: 'Project record on LinkedIn, with the 13 skills it lists.',
    },
    summary:
      "Designed and built the Noctua Consulting website from scratch — a premium, modern experience that matches the company's positioning across strategy, growth, technology, AI automation and creative services.",
    ownership:
      'I owned it end to end: visual direction, information architecture, UX/UI, responsive layouts, animation, front-end build and refinement.',
    facts: [
      { label: 'Role', value: 'End-to-end design & build' },
      { label: 'Scope', value: 'Visual direction · IA · UX/UI · Motion · Front-end' },
      { label: 'Timeline', value: 'Aug — Oct 2026' },
      { label: 'AI tools', value: 'Claude Opus / Sonnet · Gemini / Nano Banana' },
    ],
    highlights: [
      'A bespoke visual system and editorial-style interface for the Noctua brand',
      'A clear journey through proposition, services, methodology, differentiation and conversion points',
      'Custom interactive sections, animations, transitions and micro-interactions',
      'Responsive layouts tuned for desktop and mobile',
      'Component-based design for consistency, scalability and maintainability',
      'Close attention to typography, spacing, composition, hierarchy and performance',
    ],
    workflow: [
      'Claude Opus / Sonnet for development help, problem-solving and iteration',
      'Google Gemini / Nano Banana for selected visual concepts and creative assets',
      'Vibe-coding loops to prototype UI concepts and interactions quickly',
      'AI-assisted ideation, prototyping, debugging and design refinement',
    ],
    closing:
      'A design-led project pairing modern front-end development with AI-assisted workflows to take a website from concept to production.',
    skills: [
      'Web Design', 'User Experience (UX)', 'Web Development', 'Motion Design',
      'Claude Code', 'Nano Banana', 'Vibe Coding', 'HTML5', 'CSS',
      'JavaScript', 'React.js', 'GSAP', 'Anime.js',
    ],
  },
  gainsight: {
    id: 'gainsight',
    title: 'Gainsight product support',
    kicker: 'Support engineering · Gainsight',
    period: 'Oct 2021 — present',
    year: '2021—',
    summary:
      "Five years as the analyst enterprise customers reach when Gainsight doesn't behave the way they expect. I take complex technical and application issues from first report to root cause — querying the data with SQL, tracing behaviour through REST APIs and logs, tuning slow rules and reports, and turning confirmed defects into clear, reproducible bug reports for engineering.",
    areas: [
      { name: 'Rules Engine', note: 'Failed or skipped rule actions, slow and timing-out runs' },
      { name: 'Journey Orchestrator', note: 'Programs not triggering, entry criteria and participant issues' },
      { name: 'C360 & Health Scores', note: 'Scores not updating, measure weights, missing data' },
      { name: 'Cockpit', note: 'CTAs, playbooks and task automation' },
      { name: 'Integrations & APIs', note: 'Salesforce sync, connectors and REST API behaviour' },
      { name: 'Admin & configuration', note: 'Objects, permissions and tenant settings' },
    ],
    process: [
      { step: 'Reproduce', text: "Recreate the issue in the customer's context and pin down its scope." },
      { step: 'Query', text: 'Inspect the underlying data with SQL — volumes, nulls, joins, slow queries.' },
      { step: 'Trace', text: 'Follow requests through REST APIs and logs to find where behaviour diverges.' },
      { step: 'Resolve', text: 'Fix the configuration, tune performance, or file a reproducible bug.' },
    ],
    bridge: 'The Claude agents below automate the query and trace steps, so I start each complex ticket with context already gathered.',
  },
  agents: {
    id: 'agents',
    title: 'Claude triage agents',
    kicker: 'AI automation · Gainsight',
    period: 'Ongoing',
    year: 'Now',
    summary:
      'Claude-powered agents connected through MCP to Gainsight APIs, REST endpoints and log stores. They pull live tenant state, error logs and configuration history in a single reasoning pass, and propose a probable root cause before an engineer starts digging.',
    outcomes: [
      { value: '7+', label: 'MCP tool integrations connecting Claude to internal data sources' },
      { value: 'Cause first', label: 'Probable root causes surfaced before human review on complex tickets' },
      { value: 'Team-wide', label: 'Prompt-engineering playbooks adopted for AI-assisted escalations' },
      { value: 'CSAT', label: 'Kept above target by pairing automation with clear, human communication' },
    ],
  },
}

export const mcpNodes = [
  { id: 'gainsight', label: 'Gainsight APIs', x: 16, y: 20 },
  { id: 'rest', label: 'REST endpoints', x: 84, y: 20 },
  { id: 'logs', label: 'Log stores', x: 16, y: 80 },
  { id: 'crm', label: 'Slack / CRM', x: 84, y: 80 },
]

export const resolutionScenarios = [
  {
    ticket: '#4872',
    description: 'Salesforce sync failing on enterprise tenant',
    steps: [
      'Parsing Gainsight sync logs and tenant config',
      'Root cause: OAuth token expired at tenant scope',
      'Cross-referencing integration health timeline',
      'Fix: trigger re-auth flow, patch token refresh interval',
    ],
    resolvedAt: '00:23',
  },
  {
    ticket: '#5193',
    description: 'Journey Orchestrator not triggering email step',
    steps: [
      'Checking rules-engine conditions and participant filters',
      'Root cause: date field mismatch in entry criteria',
      'Validating against tenant field schema',
      'Fix: update date comparison to ISO 8601',
    ],
    resolvedAt: '00:19',
  },
  {
    ticket: '#5601',
    description: 'Health score not updating for 3 strategic accounts',
    steps: [
      'Querying health-score rule execution logs',
      'Root cause: measure weight exceeds threshold, rule skipped',
      'Checking scoring model version history',
      'Fix: rebalance measure weights, force recalculation',
    ],
    resolvedAt: '00:21',
  },
]

// Mirrors the LinkedIn Experience section: one entry per company, roles newest first.
export const experience = [
  {
    company: 'Gainsight',
    type: 'Full-time',
    tenure: '5 yrs 1 mo',
    location: 'Hyderabad, Telangana, India',
    year: '2021',
    roles: [
      { title: 'Senior Technical Analyst', period: 'May 2026 — Present', duration: '6 mos' },
      { title: 'Technical Analyst', period: 'Oct 2021 — May 2026', duration: '4 yrs 8 mos' },
    ],
    skills: ['Artificial Intelligence (AI)', 'Technical Support'],
    bullets: [
      'Resolve complex technical and application inquiries from enterprise customers across Rules Engine, Journey Orchestrator, C360, Cockpit, health scores and integrations',
      'Write SQL queries and tune performance to diagnose data issues and speed up slow rules and reports',
      'Run technical analysis and root-cause investigations, working through REST APIs and logs to separate configuration problems from product defects',
      'Identify product bugs and hand engineering clear, reproducible reports with the evidence attached',
      'Built Claude-powered triage agents via MCP, with 7+ tool integrations into Gainsight APIs, REST endpoints and log stores, so probable causes surface before human review',
      'Authored prompt-engineering playbooks adopted team-wide, and kept CSAT above target by pairing automation with clear customer communication',
    ],
  },
  {
    company: 'Bank of America',
    type: 'Full-time',
    tenure: '4 yrs 2 mos',
    location: 'Hyderabad, Telangana, India',
    year: '2017',
    roles: [
      { title: 'Senior Software Engineer', period: 'Oct 2020 — Oct 2021', duration: '1 yr 1 mo' },
      { title: 'Software Engineer', period: 'Sep 2017 — Oct 2020', duration: '3 yrs 2 mos' },
    ],
    skills: ['Data Analysis', 'Microsoft Excel'],
    bullets: [
      'Provided L3 production support for applications handling claims and credit-card fraud, owning incidents from triage to fix',
      'Scheduled, monitored and troubleshot batch and cron jobs running on JVMs, including NDM file transfers orchestrated through Autosys',
      'Managed API memory and monitored data traffic to keep high-volume services stable',
      'Automated repetitive operational work with Python, VBA and shell scripts, cutting manual effort for the team',
    ],
  },
]

export const skills = [
  {
    group: 'Gainsight & CS',
    items: [
      'Gainsight NXT', 'Gainsight Admin L3', 'Rules Engine', 'Journey Orchestrator', 'C360',
      'Cockpit', 'Health Scoring', 'Integrations & Connectors',
    ],
  },
  {
    group: 'Support Engineering',
    items: [
      'Root Cause Analysis', 'Performance Tuning', 'Bug Triage', 'L3 Production Support', 'Incident Response',
      'Batch & Cron Jobs', 'Autosys', 'SLA Management', 'Escalation Frameworks', 'SRE Fundamentals',
      'REST APIs', 'JSON', 'Postman', 'Jira', 'Zendesk',
    ],
  },
  {
    group: 'Data & Code',
    items: [
      'SQL', 'PL/SQL', 'Python (Pandas, NumPy, TensorFlow)', 'Alteryx Trifacta', 'VBA',
      'Shell Scripting', 'Unix', 'Java', 'BIQL', 'Looker', 'Excel / Sheets', 'Git',
    ],
  },
  {
    group: 'AI & Automation',
    items: [
      'Claude / Anthropic API', 'Claude Code', 'MCP (Model Context Protocol)', 'AI Agents',
      'Prompt Engineering', 'RAG Pipelines', 'Vibe Coding', 'Gemini / Nano Banana',
      'Gainsight Staircase AI', 'NotebookLM', 'Julius AI',
    ],
  },
  {
    group: 'Design & Front-end',
    isNew: true,
    items: [
      'Web Design', 'User Experience (UX)', 'Motion Design', 'Web Development',
      'HTML5', 'CSS', 'JavaScript', 'React.js', 'GSAP', 'Anime.js',
    ],
  },
]

export const certifications = [
  { name: 'Gainsight Administrator', level: 'Level 3', year: '2023', issuer: 'Gainsight' },
  { name: 'Site Reliability Engineer', level: 'In progress', year: '2021 —', issuer: '' },
]

export const courses = [
  { name: 'Data Analysis', issuer: 'Alteryx Trifacta', year: '2018 — 2019' },
  { name: 'Project Management', issuer: 'Vellore Institute of Technology', year: '2016 — 2017' },
]

export const education = {
  degree: 'B.Tech, Electronics & Communication Engineering',
  institution: 'Vellore Institute of Technology, Hyderabad',
  cgpa: '7.6',
  year: '2013 — 2017',
}

export const contact = {
  heading: ["Let's build", 'something'],
  headingEm: 'intelligent.',
  subtext: 'Open to technical support, support engineering, automation and customer success roles — and to design-led website projects.',
  reply: 'I usually reply within a few hours.',
  marquee: ['Gainsight support engineering', 'Root-cause analysis', 'SQL & REST APIs', 'Claude + MCP agents', 'Design-led web builds'],
}
