"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "work",
    title: "National Executive",
    organization: "G17",
    period: "Present",
    description:
      "Contributing to strategic initiatives, planning events, and supporting student-led community programs.",
    highlights: ["Leadership", "Coordination", "Teamwork"],
  },
  {
    type: "work",
    title: "Treasurer",
    organization: "IEEE Student Branch",
    period: "Present",
    description:
      "Managing branch finances, budget allocations, and transparent reporting for technical and student activities.",
    highlights: ["Financial Planning", "Budget Management", "Reporting"],
  },
  {
    type: "education",
    title: "Computer Engineering Undergraduate",
    organization: "University of Ruhuna",
    period: "Current",
    description:
      "3rd Year Undergraduate at the Faculty of Engineering following BScEng (Hons) in Computer Engineering.",
    highlights: ["GPA: 3.46", "3rd Year", "Computer Engineering"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary font-mono">{">"}</span> Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-transparent md:-translate-x-px" />

          {experiences.map((exp, index) => (
            <motion.div
              key={`${exp.title}-${exp.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-6">
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30" />
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
              </div>

              {/* Content card */}
              <div
                className={`flex-1 ml-16 md:ml-0 ${
                  index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                }`}
              >
                <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
                  <div
                    className={`flex items-center gap-3 mb-3 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 order-first md:order-none">
                      {exp.type === "work" ? (
                        <Briefcase className="w-4 h-4 text-primary" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-mono text-primary">{exp.period}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{exp.organization}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div
                    className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}
                  >
                    {exp.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
