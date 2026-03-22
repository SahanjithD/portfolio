"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Server, Shield, Brain, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Draftly",
    description:
      "Open-source blogging application built with React, Node.js, Express, and MongoDB. Includes Dockerized workflows and a Jenkins CI/CD pipeline deploying to AWS EC2.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Docker", "Jenkins", "AWS EC2"],
    icon: Cloud,
    github: "https://github.com/SahanjithD/Draftly",
    live: null,
    status: "Production",
  },
  {
    title: "CrowdSense",
    description:
      "Community-driven full-stack platform for real-time public-space feedback with a Next.js frontend, Express backend, JWT auth, and PostgreSQL/Supabase integration.",
    tags: ["Next.js", "Express", "PostgreSQL", "Supabase", "JWT", "Tailwind CSS"],
    icon: Shield,
    github: "https://github.com/SahanjithD/crowdsense",
    live: null,
    status: "Active",
  },
  {
    title: "E-Channeling App",
    description:
      "Full-stack E-Channeling platform for doctor search and appointment booking, combining a React web app, Express/Prisma API, and a WPF desktop client.",
    tags: ["React", "Express", "Prisma", "SQLite", ".NET WPF", "Full Stack"],
    icon: Server,
    github: "https://github.com/SahanjithD/E-Channeling-App",
    live: null,
    status: "Open Source",
  },
  {
    title: "AdaptiveBP",
    description:
      "Modular monolith platform for dynamic form generation and application provisioning, built with Spring Boot 3.3, Angular 17, and MongoDB Atlas.",
    tags: ["Spring Boot", "Angular", "MongoDB", "JWT", "Java", "TypeScript"],
    icon: Brain,
    github: "https://github.com/simpleTrex/formGenarator-MrChand",
    live: null,
    status: "Collaboration",
  },
];

const statusColors: Record<string, string> = {
  Production: "bg-green-500/20 text-green-400 border-green-500/30",
  Active: "bg-primary/20 text-primary border-primary/30",
  "Open Source": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Collaboration: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function Projects() {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary font-mono">{">"}</span> Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <project.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${statusColors[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        <span className="sr-only">GitHub repository</span>
                      </a>
                    </Button>
                    {project.live && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <a href={project.live} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          <span className="sr-only">Live demo</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-1 bg-secondary/50 text-muted-foreground rounded-md border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <a href="https://github.com/SahanjithD" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
