// Single source of truth for everything the site says.
// House style: sentence case, plain verbs, no en or em dashes.

export const profile = {
  name: "Dasun Deshaja",
  githubUser: "SahanjithD",
  email: "ddsahanjith@gmail.com",
  github: "https://github.com/SahanjithD",
  linkedin: "https://www.linkedin.com/in/dasundeshaja/",
  university: "University of Ruhuna",
}

export const site = {
  description:
    "Computer engineering undergrad at the University of Ruhuna and software engineering intern on WSO2's Integration AI team.",
  intro:
    "Computer engineering undergrad at the University of Ruhuna. Into AI, DevOps, security and maths, and curious about how systems work under the hood. I build stuff.",
}

export const experience = {
  org: "WSO2",
  team: "Integration AI",
  role: "Software engineering intern",
  // First week shown with a marker on the contribution skyline.
  start: "2026-06-01",
  intro:
    "Since June 2026 I've been a software engineering intern on WSO2's Integration AI team. I build the parts of a RAG pipeline that connect WSO2 Integrator's Ballerina AI module to AWS.",
}

const repo = (name: string) => `https://github.com/ballerina-platform/module-ballerinax-${name}`

export type RagPackage = { name: string; iface: string; repo: string }

export type RagStage = {
  label: string
  line: string
  // "core" stages come from the ballerina/ai module itself, not my work.
  builtBy: "me" | "core"
  packages: RagPackage[]
}

export const ragStages: RagStage[] = [
  {
    label: "Load",
    line: "Reads documents straight from S3, pulling text out of PDF, Word, PowerPoint and Excel files in memory.",
    builtBy: "me",
    packages: [{ name: "ai.aws.s3", iface: "ai:DataLoader", repo: repo("ai.aws.s3") }],
  },
  {
    label: "Chunk",
    line: "Handled by the core ai module.",
    builtBy: "core",
    packages: [],
  },
  {
    label: "Embed",
    line: "Embedding providers for Amazon Titan and Cohere models on Bedrock.",
    builtBy: "me",
    packages: [{ name: "ai.aws.bedrock", iface: "ai:EmbeddingProvider", repo: repo("ai.aws.bedrock") }],
  },
  {
    label: "Store",
    line: "A vector store on Amazon S3 Vectors, and an OpenSearch store with sparse and hybrid search, now in review.",
    builtBy: "me",
    packages: [
      { name: "ai.aws.s3", iface: "ai:VectorStore", repo: repo("ai.aws.s3") },
      { name: "ai.aws.opensearch", iface: "ai:VectorStore", repo: repo("ai.aws.opensearch") },
    ],
  },
  {
    label: "Retrieve",
    line: "Managed and self-managed Bedrock knowledge bases.",
    builtBy: "me",
    packages: [{ name: "ai.aws.bedrock", iface: "ai:KnowledgeBase", repo: repo("ai.aws.bedrock") }],
  },
  {
    label: "Generate",
    line: "Model providers for Claude, Nova, Mistral and the other models Bedrock serves.",
    builtBy: "me",
    packages: [{ name: "ai.aws.bedrock", iface: "ai:ModelProvider", repo: repo("ai.aws.bedrock") }],
  },
]

// Only merged work; each line matches a merged PR title.
export const alsoShipped = [
  {
    text: "WSO2 Integrator docs for the AWS Bedrock, S3 Vectors and S3 data loader AI building blocks.",
    href: "https://github.com/wso2/docs-integrator/pull/764",
  },
  {
    text: "A docs guide to deploying, tracing and securing a Ballerina agent on Amazon Bedrock AgentCore.",
    href: "https://github.com/wso2/docs-integrator/pull/825",
  },
]

// Project tags are colour-coded; the same colour marks a tag wherever it appears.
export const tags = {
  ai: { label: "AI and security", color: "var(--cable-ai)" },
  security: { label: "Security", color: "var(--cable-security)" },
  ops: { label: "DevOps", color: "var(--cable-ops)" },
} as const

export type TagKey = keyof typeof tags

export type Project = {
  name: string
  tag: TagKey
  summary: string
  repo: string
  stack: string[]
  // Which figure leads the project (see components/project-visuals.tsx).
  visual: "malware" | "steganography" | "pipeline"
  caption?: string
  note?: string
  // Draws the system as lanes of steps, left to right (see components/pipeline.tsx).
  lanes?: { label: string; steps: string[] }[]
}

export const projectsIntro = "Academic projects from my degree, from machine learning and security to DevOps."

export const projects: Project[] = [
  {
    name: "Draftly",
    tag: "ops",
    summary:
      "A MERN blogging app with its own delivery pipeline. Terraform provisions the AWS servers; a push to GitHub has Jenkins test, build and push Docker images, then Ansible deploys them over SSH with Docker Compose.",
    repo: "https://github.com/SahanjithD/Draftly",
    stack: ["React", "Express", "MongoDB", "Docker", "Jenkins", "Ansible", "Terraform", "AWS EC2"],
    visual: "pipeline",
    lanes: [
      { label: "Infra", steps: ["Terraform", "AWS EC2"] },
      { label: "Delivery", steps: ["GitHub push", "Jenkins", "Docker Hub", "Ansible", "Docker Compose"] },
      { label: "Request", steps: ["React on Nginx", "Express API", "MongoDB Atlas"] },
    ],
  },
  {
    name: "Keyed image steganography",
    tag: "security",
    summary:
      "Hides a message in an image's pixels using a secret key: a seeded PRNG decides which pixels and bit planes change, instead of writing them in order. I benchmarked it against sequential LSB across 3 image types and 3 payload sizes, measuring PSNR, histogram shift and RS steganalysis.",
    repo: "https://github.com/SahanjithD/prng-lsb-steganography",
    stack: ["Python", "NumPy", "OpenCV"],
    visual: "steganography",
    caption:
      "Pixels changed to hide the same message at 50% capacity. Sequential LSB fills the top of the image and leaves the rest untouched; the keyed version spreads its changes across the whole image. Both keep PSNR above 47 dB at every payload tested.",
  },
  {
    name: "Malware image classification",
    tag: "ai",
    summary:
      "Malware binaries turned into grayscale images and sorted into 25 families by a CNN I trained in PyTorch on the Malimg dataset (9,339 samples). Grad-CAM shows which regions of a binary drove each prediction.",
    repo: "https://github.com/SahanjithD/malware-image-classification-cnn",
    stack: ["PyTorch", "scikit-learn", "Matplotlib"],
    visual: "malware",
    caption:
      "One sample from four families, rendered straight from their bytes, and a Grad-CAM map of where the model looked to call a sample Yuner.A.",
    note: "Its weak spot: Autorun.K and Yuner.A produce near-identical images, so the model reads every Autorun.K sample as Yuner.A.",
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
      "Reached the final with Groceria, a smart shopping agent designed to improve decision-making and shopping efficiency.",
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
    summary: "Built a real-time event platform in eight hours.",
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
    summary: "A development challenge built around debugging, collaboration and contributing to real-world projects through Git workflows.",
    photos: ["CodeX1.jpeg", "CodeX2.jpeg", "CodeX3.jpeg", "CodeX4.jpeg", "CodeX5.jpeg"].map(photo),
  },
  {
    event: "IEEEXtreme 18.0",
    result: "20th in Sri Lanka",
    kind: "Coding contest",
    podium: false,
    summary: "Ranked 20th in Sri Lanka in a global 24-hour coding competition.",
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
    summary: "Second place in a competitive CTF, with hands-on experience in security problem solving.",
    photos: ["redcyper1.jpeg", "redcyper2.jpeg", "redcyper3.jpeg", "redcyper4.jpeg"].map(photo),
  },
  {
    event: "Insurgex 1.0",
    result: "10th",
    kind: "Hackathon",
    podium: false,
    summary: "My first hackathon, finishing tenth.",
    photos: ["Insurgex.jpeg", "insurgex1.jpeg", "insurgex2.jpeg"].map(photo),
  },
]

export const about = {
  intro: "Where I study, what I do outside class, and the tools I use every day.",
  bio: "I learn by building; hands-on projects are how most things actually stick for me. Outside coursework I compete in CTFs and hackathons and serve as treasurer of our IEEE Student Branch.",
}

export const education = {
  degree: "BScEng (Hons) Computer Engineering",
  school: "University of Ruhuna",
  year: 3,
  years: 4,
  gpa: "3.46",
}

export const roles = [
  { title: "Treasurer", org: "IEEE Student Branch, University of Ruhuna", monogram: "IEEE" },
]

// Only what the GitHub profile lists as my stack.
export const stack = [
  { group: "Languages", items: ["Ballerina", "Python", "Java", "TypeScript", "JavaScript"] },
  { group: "AI and cloud", items: ["AWS", "OpenSearch", "PyTorch"] },
  { group: "DevOps", items: ["Docker", "Jenkins", "GitHub Actions", "Linux", "Git"] },
]

export const contact = {
  intro: "Have a role, a project or a question? Email me or use the form, and I'll get back to you within a day.",
}
