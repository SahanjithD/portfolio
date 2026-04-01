"use client"

import { useState, useEffect, useCallback } from "react"
import { Terminal, ChevronRight } from "lucide-react"

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  about        - Learn about me",
    "  skills       - View my technical skills",
    "  projects     - See my projects",
    "  competitions - View competitions & hackathons",
    "  contact      - Get in touch",
    "  clear        - Clear terminal",
  ],
  about: [
    "Dasun Deshaja",
    "3rd Year Undergraduate - Faculty of Engineering, University of Ruhuna",
    "Following BScEng (Hons) in Computer Engineering",
  ],
  skills: [
    "Networking: Wireshark, Ryu, OpenFlow, OVS, Nmap, Mininet",
    "DevOps: Docker, Jenkins, Terraform, Ansible, Nginx, AWS EC2",
    "AI/ML: Python, MediaPipe, Scikit-learn, Pandas, NumPy, OpenCV",
    "Web: React, Next.js, Node.js, Express, MongoDB, PostgreSQL",
  ],
  projects: [
    "┌─ Featured Projects ──────────────────────────────┐",
    "│  01  Draftly        — Blog platform with CI/CD   │",
    "│  02  CrowdSense     — Real-time feedback app     │",
    "│  03  E-Channeling   — Doctor appointment system   │",
    "│  04  AdaptiveBP     — Dynamic form generator     │",
    "│  05  SecureRemote   — AES-encrypted remote shell │",
    "│  06  FitTrack       — Flutter fitness tracker    │",
    "└──────────────────────────────────────────────────┘",
  ],
  competitions: [
    "┌─ Competitions & Hackathons ──────────────────────┐",
    "│  01  SLAIC AI Hackathon     — Finalist           │",
    "│  02  Red Cypher 2.0         — Top 10             │",
    "│  03  Code Night 2025        — 1st Runner-Up      │",
    "│  04  CyberRush (CTF)        — 5th Place          │",
    "│  05  CodeX                  — 10th Place         │",
    "│  06  IEEEXtreme 18.0        — 20th in Sri Lanka  │",
    "│  07  Algoxplore 1.0         — 9th Place · Finals │",
    "│  08  Red Cypher 1.0         — 1st Runner-Up      │",
    "│  09  Insurgex 1.0           — 10th Place         │",
    "└──────────────────────────────────────────────────┘",
  ],
  contact: [
    "Email: ddsahanjith@gmail.com",
    "GitHub: github.com/SahanjithD",
    "LinkedIn: linkedin.com/in/dasundeshaja",
  ],
}

const ROLES = [
  "3rd Year Computer Engineering Undergraduate",
  "DevOps and Networking Enthusiast",
  "AI/ML Learner",
  "University of Ruhuna",
]

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayedRole, setDisplayedRole] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([])
  const [showCursor, setShowCursor] = useState(true)

  // Typing animation for roles
  useEffect(() => {
    const role = ROLES[currentRole]
    
    if (isTyping) {
      if (displayedRole.length < role.length) {
        const timeout = setTimeout(() => {
          setDisplayedRole(role.slice(0, displayedRole.length + 1))
        }, 80)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayedRole.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedRole(displayedRole.slice(0, -1))
        }, 40)
        return () => clearTimeout(timeout)
      } else {
        setCurrentRole((prev) => (prev + 1) % ROLES.length)
        setIsTyping(true)
      }
    }
  }, [displayedRole, isTyping, currentRole])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    
    if (trimmedCmd === "clear") {
      setHistory([])
      return
    }

    const output = COMMANDS[trimmedCmd] || [`Command not found: ${cmd}`, "Type 'help' for available commands"]
    setHistory((prev) => [...prev, { command: cmd, output }])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input)
      setInput("")
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Top-right availability badge aligned with header container (scrolls with the page). */}
      <div className="absolute top-20 right-0 w-full z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
            <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 backdrop-blur-xl bg-green-500/10 border border-green-500/30 rounded-xl shadow-[0_0_60px_rgba(34,197,94,0.12)]">
            <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
            </div>
              <span className="text-sm text-green-400 font-medium">
              Available for Full time opportunities
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Title area */}
        <div className="mb-8 text-center md:text-left">
          <p className="text-primary font-mono text-sm mb-2 tracking-wider">{"// WELCOME TO MY TERMINAL"}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-foreground">Hello, I&apos;m </span>
            <span className="text-primary">Dasun Deshaja</span>
          </h1>
          <div className="h-8 md:h-10 flex items-center justify-center md:justify-start">
            <span className="text-xl md:text-2xl text-muted-foreground font-mono">
              {displayedRole}
              <span className={`ml-0.5 ${showCursor ? "opacity-100" : "opacity-0"}`}>|</span>
            </span>
          </div>
        </div>

        {/* Interactive Terminal */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
                  <Terminal className="w-3 h-3" />
                  portfolio@devops:~
                </span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {/* Welcome message */}
              <div className="mb-4">
                <p className="text-primary">Welcome to my interactive portfolio terminal!</p>
                <p className="text-muted-foreground">Type &apos;help&apos; to see available commands.</p>
              </div>

              {/* Command history */}
              {history.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{item.command}</span>
                  </div>
                  {item.output.map((line, lineIndex) => (
                    <p key={lineIndex} className="ml-6 text-muted-foreground">{line}</p>
                  ))}
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                  placeholder="Type a command..."
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
          {["about", "projects", "skills", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/50 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              ./{section}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
