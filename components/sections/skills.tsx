"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { type IconType } from "react-icons";
import {
  SiAnsible,
  SiCisco,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiDotnet,
  SiExpress,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGoogle,
  SiGooglecolab,
  SiHtml5,
  SiJenkins,
  SiJupyter,
    SiOpenjdk,
  SiKotlin,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiScikitlearn,
  SiTailwindcss,
  SiTerraform,
  SiWireshark,
} from "react-icons/si";

type Tech = {
  name: string;
  icon?: IconType;
  fallback?: string;
};

type Category = {
  name: string;
  subtitle: string;
  tools: Tech[];
};

type ToolWithCategories = Tech & { categories: string[] };

const categories: Category[] = [
  {
    name: "Networking",
    subtitle: "SDN.NETOPS",
    tools: [
      { name: "Wireshark", icon: SiWireshark },
      { name: "Ryu", fallback: "Ryu" },
      { name: "OpenFlow", fallback: "OF" },
      { name: "OVS", fallback: "OVS" },
      { name: "Nmap", fallback: "Nmap" },
      { name: "Mininet", fallback: "Mini" },
      { name: "Cisco Packet Tracer", icon: SiCisco },
    ],
  },
  {
    name: "Cloud & DevOps",
    subtitle: "INFRA.OPS",
    tools: [
      { name: "Docker", icon: SiDocker },
      { name: "Jenkins", icon: SiJenkins },
      { name: "Terraform", icon: SiTerraform },
      { name: "Ansible", icon: SiAnsible },
      { name: "Nginx", icon: SiNginx },
      { name: "AWS EC2", fallback: "AWS" },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    name: "AI / ML",
    subtitle: "DATA.ML",
    tools: [
      { name: "Python", icon: SiPython },
      { name: "ADK", icon: SiGoogle },
      { name: "MediaPipe", icon: SiGoogle },
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "Pandas", icon: SiPandas },
      { name: "NumPy", icon: SiNumpy },
      { name: "Matplotlib", fallback: "MPL" },
      { name: "Seaborn", fallback: "SEA" },
      { name: "OpenCV", icon: SiOpencv },
      { name: "Jupyter Notebook", icon: SiJupyter },
      { name: "Google Colab", icon: SiGooglecolab },
    ],
  },
  {
    name: "Web & Backend",
    subtitle: "WEB.API",
    tools: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Postman", icon: SiPostman },
    ],
  },
  {
    name: "Languages & Platforms",
    subtitle: "CORE.ENG",
    tools: [
      { name: ".NET (WPF)", icon: SiDotnet },
      { name: "Flutter", icon: SiFlutter },
      { name: "Kotlin", icon: SiKotlin },
      { name: "Java", icon: SiOpenjdk },
      { name: "C++", icon: SiCplusplus },
      { name: "C", fallback: "C" },
      { name: "Linux", icon: SiLinux },
    ],
  },
];

const allTools: ToolWithCategories[] = (() => {
  const map = new Map<string, ToolWithCategories>();

  for (const category of categories) {
    for (const tool of category.tools) {
      const existing = map.get(tool.name);
      if (!existing) {
        map.set(tool.name, { ...tool, categories: [category.name] });
        continue;
      }
      if (!existing.categories.includes(category.name)) {
        existing.categories.push(category.name);
      }
    }
  }

  return Array.from(map.values());
})();

function TechIcon({ tool, dimmed, focused }: { tool: ToolWithCategories; dimmed: boolean; focused: boolean }) {
  const Icon = tool.icon;

  return (
    <motion.div whileHover={{ scale: 1.06 }} className="group relative" style={{ opacity: dimmed ? 0.35 : 1 }}>
      <div
        className={`relative w-12 h-12 rounded-xl border backdrop-blur-sm flex items-center justify-center transition-all duration-300 overflow-hidden ${
          dimmed
            ? "bg-card/30 border-border/30"
            : focused
            ? "bg-card/80 border-primary/60 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
            : "bg-card/60 border-border/40 group-hover:border-primary/50 group-hover:bg-card/80"
        }`}
      >
        {!dimmed && (
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(34,211,238,0)",
                "0 0 0 3px rgba(34,211,238,0.08)",
                "0 0 0 0 rgba(34,211,238,0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-xl"
          />
        )}

        {Icon ? (
          <Icon className={`w-6 h-6 ${focused ? "text-primary" : "text-foreground"}`} />
        ) : (
          <span className={`text-[10px] font-mono font-semibold ${focused ? "text-primary" : "text-foreground/80"}`}>
            {tool.fallback ?? "?"}
          </span>
        )}
      </div>

      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-card/95 border border-border/50 rounded text-[9px] font-mono text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap backdrop-blur-sm shadow-lg z-50 pointer-events-none">
        {tool.name}
      </div>
    </motion.div>
  );
}

function CategoryFilterCard({
  category,
  isActive,
  onHover,
}: {
  category: Category;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      whileHover={{ y: -2 }}
      className={`px-4 py-2 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left ${
        isActive
          ? "bg-card/70 border-primary/40 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
          : "bg-card/30 border-border/30 hover:border-primary/20 hover:bg-card/40"
      }`}
    >
      <div className="text-sm font-semibold text-foreground">{category.name}</div>
      <div className={`text-[10px] font-mono tracking-widest ${isActive ? "text-primary/70" : "text-muted-foreground/50"}`}>
        {category.subtitle}
      </div>
    </motion.button>
  );
}

export function Skills() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono text-primary/70 mb-2 tracking-widest uppercase">Technical Stack</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary font-mono">{">"}</span> Tech Arsenal
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </motion.div>

        <div className="relative rounded-3xl border border-border/30 bg-card/20 backdrop-blur-xl p-6 md:p-10 overflow-hidden shadow-[0_0_80px_rgba(56,189,248,0.06)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />

          <div className="relative">
            <div
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {categories.map((category) => (
                <CategoryFilterCard
                  key={category.name}
                  category={category}
                  isActive={hoveredCategory === category.name}
                  onHover={() => setHoveredCategory(category.name)}
                />
              ))}
            </div>

            <div className="mx-auto w-full max-w-5xl">
              <div
                className="grid gap-2 md:gap-3 place-items-center"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))" }}
              >
                {allTools.map((tool) => (
                  <TechIcon
                    key={tool.name}
                    tool={tool}
                    dimmed={hoveredCategory ? !tool.categories.includes(hoveredCategory) : false}
                    focused={hoveredCategory ? tool.categories.includes(hoveredCategory) : false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
