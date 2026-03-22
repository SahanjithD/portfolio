"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm">
              <span className="text-primary">$</span> echo &quot;Built with passion&quot;
            </span>
          </div>

          <p className="text-sm text-muted-foreground font-mono">
            &copy; {currentYear} Dasun Deshaja. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Status: Operational</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
