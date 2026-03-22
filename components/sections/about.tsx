"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Cloud, Brain, Server, Network } from "lucide-react";

const interests = [
  {
    icon: Server,
    title: "DevOps",
    description: "CI/CD pipelines, infrastructure automation, and deployment strategies",
  },
  {
    icon: Terminal,
    title: "Software Engineering",
    description: "Software engineering, full-stack development, and maintainable system design",
  },
  {
    icon: Network,
    title: "Networking",
    description: "Network architecture, protocols, and system administration",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Security analysis, penetration testing, and threat mitigation",
  },
  {
    icon: Brain,
    title: "AI/ML",
    description: "Machine learning models and intelligent automation systems",
  },
  {
    icon: Cloud,
    title: "Cloud",
    description: "AWS, Azure, GCP infrastructure and serverless architectures",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary font-mono">{">"}</span> About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 shadow-xl shadow-primary/5">
              <p className="text-muted-foreground leading-relaxed text-lg">
                I&apos;m Dasun Deshaja, a 3rd Year Undergraduate at the Faculty of Engineering,
                University of Ruhuna, currently following BScEng (Hons) in Computer Engineering.
                I enjoy building practical solutions across networking, DevOps, and software engineering.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                My technical interests cover SDN and network tooling, cloud and automation workflows,
                as well as AI/ML development with Python. I like combining strong fundamentals with
                hands-on implementation, from infrastructure to full-stack applications.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-primary font-mono text-sm">EOF</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="group backdrop-blur-xl bg-card/30 border border-border/50 rounded-xl p-5 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <interest.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-foreground mb-1">{interest.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {interest.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
