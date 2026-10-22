// Single source of truth for everything the site says.

export const profile = {
  name: "Dasun Deshaja",
  email: "ddsahanjith@gmail.com",
  github: "https://github.com/SahanjithD",
  linkedin: "https://www.linkedin.com/in/dasundeshaja/",
  university: "University of Ruhuna",
  location: "Sri Lanka",
  status: "Open to full-time roles",
}

// Domains are colour-coded like patch cables. The same colour marks a
// domain wherever it appears: skill columns, project tags, the hero diagram.
export const domains = {
  net: { label: "Networking & security", color: "var(--cable-net)" },
  ops: { label: "Cloud & DevOps", color: "var(--cable-ops)" },
  ml: { label: "AI & ML", color: "var(--cable-ml)" },
  web: { label: "Web & backend", color: "var(--cable-web)" },
  core: { label: "Languages & platforms", color: "var(--cable-core)" },
} as const

export type DomainKey = keyof typeof domains

export const skills: Record<DomainKey, string[]> = {
  net: ["Wireshark", "Ryu", "OpenFlow", "Open vSwitch", "Mininet", "Nmap", "Cisco Packet Tracer"],
  ops: ["Docker", "Jenkins", "Terraform", "Ansible", "Nginx", "AWS EC2", "Git & GitHub"],
  ml: ["Python", "Google ADK", "MediaPipe", "scikit-learn", "pandas", "NumPy", "OpenCV", "Matplotlib", "Jupyter"],
  web: ["React", "Next.js", "Tailwind CSS", "Node.js", "Express", "MongoDB", "PostgreSQL", "Postman"],
  core: ["Java", "C", "C++", "Kotlin", "Flutter", ".NET (WPF)", "Linux"],
}

export type Project = {
  name: string
  summary: string
  domain: DomainKey
  repo: string
  // Each lane is one request path through the system, left to right.
  lanes: { label: string; steps: string[] }[]
  stack: string[]
}

export const projects: Project[] = [
  {
    name: "Draftly",
    summary:
      "An open-source blogging platform with its own delivery pipeline: Jenkins builds the Dockerized app and deploys it to AWS EC2.",
    domain: "ops",
    repo: "https://github.com/SahanjithD/Draftly",
    lanes: [
      { label: "Request", steps: ["React", "Express API", "MongoDB"] },
      { label: "Delivery", steps: ["GitHub push", "Jenkins", "Docker image", "AWS EC2"] },
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Docker", "Jenkins", "AWS EC2"],
  },
  {
    name: "Secure Remote Access Tool",
    summary:
      "A safer alternative to Telnet. Commands travel AES-encrypted over TCP to a multi-threaded Java server that runs them and streams results back.",
    domain: "net",
    repo: "https://github.com/SahanjithD/secure_remote_access_tool",
    lanes: [{ label: "Session", steps: ["Client", "AES over TCP", "Thread pool", "Shell"] }],
    stack: ["Java", "AES", "Sockets", "Multithreading"],
  },
  {
    name: "CrowdSense",
    summary:
      "A community platform for real-time feedback on public spaces, with a JWT-secured Express API on PostgreSQL and Supabase.",
    domain: "web",
    repo: "https://github.com/SahanjithD/crowdsense",
    lanes: [{ label: "Request", steps: ["Next.js", "Express + JWT", "PostgreSQL"] }],
    stack: ["Next.js", "Express", "PostgreSQL", "Supabase", "Tailwind CSS"],
  },
  {
    name: "E-Channeling",
    summary:
      "Search for doctors and book appointments from the web or a Windows desktop app. Both clients share one Express and Prisma API.",
    domain: "web",
    repo: "https://github.com/SahanjithD/E-Channeling-App",
    lanes: [
      { label: "Web", steps: ["React", "Express + Prisma", "SQLite"] },
      { label: "Desktop", steps: ["WPF client", "Express + Prisma"] },
    ],
    stack: ["React", "Express", "Prisma", "SQLite", ".NET WPF"],
  },
  {
    name: "AdaptiveBP",
    summary:
      "A modular monolith that generates forms dynamically and provisions applications from them.",
    domain: "web",
    repo: "https://github.com/simpleTrex/formGenarator-MrChand",
    lanes: [{ label: "Request", steps: ["Angular 17", "Spring Boot 3.3", "MongoDB Atlas"] }],
    stack: ["Spring Boot", "Angular", "MongoDB", "JWT", "Java", "TypeScript"],
  },
  {
    name: "FitTrack",
    summary:
      "A Flutter fitness tracker for workouts, nutrition and progress stats, with Firebase handling sign-in, data sync and photo uploads.",
    domain: "core",
    repo: "https://github.com/SahanjithD/fitness-tracker",
    lanes: [{ label: "Data", steps: ["Flutter", "Firebase Auth", "Firestore", "Cloud Storage"] }],
    stack: ["Flutter", "Dart", "Firebase"],
  },
]

export type Competition = {
  event: string
  result: string
  kind: "CTF" | "Hackathon" | "Coding contest" | "Dev challenge"
  // Top-three finishes get extra emphasis in the results table.
  podium: boolean
  summary: string
  photos: string[]
}

const photo = (file: string) => `/assets/competition/${file}`

export const competitions: Competition[] = [
  {
    event: "SLAIC AI Hackathon",
    result: "Finalist",
    kind: "Hackathon",
    podium: false,
    summary:
      "Built Groceria, a shopping agent that compares options and helps people decide faster, and reached the final round.",
    photos: ["slaic1.jpeg", "slaic2.jpeg", "slaic3.jpeg", "slaic4.jpeg", "slaic5.jpeg"].map(photo),
  },
  {
    event: "Red Cypher 2.0",
    result: "Top 10",
    kind: "CTF",
    podium: false,
    summary: "Reached the top ten solving real-world security challenges as a team, under time pressure.",
    photos: ["redcyper2.0.jpg"].map(photo),
  },
  {
    event: "Code Night 2025",
    result: "1st runner-up",
    kind: "Hackathon",
    podium: true,
    summary: "Shipped a working real-time event platform in eight hours.",
    photos: ["codenight1.jpg"].map(photo),
  },
  {
    event: "CyberRush",
    result: "5th",
    kind: "CTF",
    podium: false,
    summary: "Placed fifth in a capture-the-flag built around real-world security problems.",
    photos: ["CyberRush1.jpeg", "CyberRush2.jpeg", "CyberRush3.jpeg", "CyberRush4.jpeg"].map(photo),
  },
  {
    event: "CodeX",
    result: "10th",
    kind: "Dev challenge",
    podium: false,
    summary: "Debugged and extended real open-source projects under time pressure using Git pull-request workflows.",
    photos: ["CodeX1.jpeg", "CodeX2.jpeg", "CodeX3.jpeg", "CodeX4.jpeg", "CodeX5.jpeg"].map(photo),
  },
  {
    event: "IEEEXtreme 18.0",
    result: "20th in Sri Lanka",
    kind: "Coding contest",
    podium: false,
    summary: "A 24-hour global algorithm contest. Ranked 20th among Sri Lankan teams.",
    photos: ["Xtreme18.0.jpeg", "Xtreme18.02.jpeg"].map(photo),
  },
  {
    event: "AlgoXplore 1.0",
    result: "9th in finals",
    kind: "Hackathon",
    podium: false,
    summary: "Won second place in the group stage, then finished ninth in the inter-university final.",
    photos: ["AlgoXplore.jpeg", "AlgoXplore1.jpeg", "AlgoXplore3.jpeg", "AlgoXplore4.jpeg"].map(photo),
  },
  {
    event: "Red Cypher 1.0",
    result: "1st runner-up",
    kind: "CTF",
    podium: true,
    summary: "Second place overall, and my first real taste of hands-on security work.",
    photos: ["redcyper1.jpeg", "redcyper2.jpeg", "redcyper3.jpeg", "redcyper4.jpeg"].map(photo),
  },
  {
    event: "Insurgex 1.0",
    result: "10th",
    kind: "Hackathon",
    podium: false,
    summary: "My first hackathon. Finished tenth and learned how to ship under a deadline.",
    photos: ["Insurgex.jpeg", "insurgex1.jpeg", "insurgex2.jpeg"].map(photo),
  },
]

export const education = {
  degree: "BScEng (Hons) Computer Engineering",
  school: "Faculty of Engineering, University of Ruhuna",
  detail: "Third year, GPA 3.46",
}

export const roles = [
  { title: "Treasurer", org: "IEEE Student Branch, University of Ruhuna" },
  { title: "National Executive", org: "G17" },
]
