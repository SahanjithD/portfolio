"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CompetitionModal } from "@/components/competition-modal";

const competitions = [
  {
    id: 1,
    title: "SLAIC AI Hackathon",
    achievement: "Finalist",
    description:
      "Finalist team in an AI-focused hackathon, where we built Groceria, a smart shopping agent designed to enhance user decision-making and shopping efficiency.",
    images: [
      "/assets/competition/slaic1.jpeg",
      "/assets/competition/slaic2.jpeg",
      "/assets/competition/slaic3.jpeg",
      "/assets/competition/slaic4.jpeg",
      "/assets/competition/slaic5.jpeg",
    ],
    accent: "from-cyan-500/60 to-blue-600/60",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    id: 2,
    title: "Red Cypher 2.0",
    achievement: "Top 10",
    description:
      "Reached Top 10 in a competitive CTF, solving real-world cybersecurity challenges while collaborating under pressure.",
    images: [
      "/assets/competition/redcyper2.0.jpg",
    ],
    accent: "from-red-500/60 to-orange-600/60",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  {
    id: 3,
    title: "Code Night 2025",
    achievement: "1st Runner-Up",
    description:
      "Built a real-time event platform in 8 hours and secured 1st Runner-Up through rapid development and strong teamwork.",
    images: [
      "/assets/competition/codenight1.jpg",
    ],
    accent: "from-amber-500/60 to-yellow-600/60",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: 4,
    title: "CyberRush (CTF)",
    achievement: "5th Place",
    description:
      "Competed in an intense CTF challenge, solving real-world cybersecurity problems and achieving 5th place through teamwork and analytical thinking.",
    images: [
      "/assets/competition/CyberRush1.jpeg",
      "/assets/competition/CyberRush2.jpeg",
      "/assets/competition/CyberRush3.jpeg",
      "/assets/competition/CyberRush4.jpeg",
    ],
    accent: "from-violet-500/60 to-purple-600/60",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    id: 5,
    title: "CodeX",
    achievement: "10th Place",
    description:
      "Secured 10th place in a competitive development challenge focused on debugging, collaboration, and contributing to real-world projects via Git workflows.",
    images: [
      "/assets/competition/CodeX1.jpeg",
      "/assets/competition/CodeX2.jpeg",
      "/assets/competition/CodeX3.jpeg",
      "/assets/competition/CodeX4.jpeg",
      "/assets/competition/CodeX5.jpeg",
    ],
    accent: "from-fuchsia-500/60 to-pink-600/60",
    badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  },
  {
    id: 6,
    title: "IEEEXtreme 18.0",
    achievement: "20th in Sri Lanka",
    description:
      "Ranked 20th in Sri Lanka in a global 24-hour coding competition focused on problem-solving and endurance.",
    images: [
      "/assets/competition/Xtreme18.0.jpeg",
      "/assets/competition/Xtreme18.02.jpeg",
    ],
    accent: "from-blue-500/60 to-indigo-600/60",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    id: 7,
    title: "Algoxplore 1.0",
    achievement: "9th Place · Finals",
    description:
      "Advanced to finals in an inter-university hackathon, finishing 9th after strong early-round performance (2nd in group stage).",
    images: [
      "/assets/competition/AlgoXplore.jpeg",
      "/assets/competition/AlgoXplore1.jpeg",
      "/assets/competition/AlgoXplore3.jpeg",
      "/assets/competition/AlgoXplore4.jpeg",
    ],
    accent: "from-emerald-500/60 to-teal-600/60",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: 8,
    title: "Red Cypher 1.0",
    achievement: "1st Runner-Up",
    description:
      "Secured 1st Runner-Up in a competitive CTF, gaining hands-on experience in cybersecurity problem solving.",
    images: [
      "/assets/competition/redcyper1.jpeg",
      "/assets/competition/redcyper2.jpeg",
      "/assets/competition/redcyper3.jpeg",
      "/assets/competition/redcyper4.jpeg",
    ],
    accent: "from-rose-500/60 to-pink-600/60",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    id: 9,
    title: "Insurgex 1.0",
    achievement: "10th Place",
    description:
      "First hackathon experience, finishing 10th and building the foundation for future competitive development.",
    images: [
      "/assets/competition/Insurgex.jpeg",
      "/assets/competition/insurgex1.jpeg",
      "/assets/competition/insurgex2.jpeg",
    ],
    accent: "from-sky-500/60 to-cyan-600/60",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
];

/** Cycles through images for a single card */
function CyclingImage({
  images,
  alt,
  isActive,
}: {
  images: string[];
  alt: string;
  isActive: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === imgIndex ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 30vw"
          priority={isActive && i === 0}
        />
      ))}
    </>
  );
}

export function Competitions() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedCompetition, setSelectedCompetition] = useState<typeof competitions[number] | null>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section id="competitions" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-primary/70 mb-2 tracking-widest uppercase">
            Battle Tested
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-primary font-mono">{">"}</span> Competitions
            & Hackathons
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              containScroll: false,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {competitions.map((comp, index) => {
                const isActive = index === current;

                return (
                  <CarouselItem
                    key={comp.id}
                    className="pl-3 md:pl-4 basis-[75%] sm:basis-[45%] md:basis-[33.333%] cursor-pointer"
                    onClick={() => setSelectedCompetition(comp)}
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.92,
                        opacity: isActive ? 1 : 0.55,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="h-full"
                    >
                      <div
                        className={`relative aspect-square w-full rounded-2xl overflow-hidden border transition-all duration-500 group ${
                          isActive
                            ? "border-primary/50 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                            : "border-border/30 shadow-lg"
                        }`}
                      >
                        {/* Cycling Background Images */}
                        <CyclingImage
                          images={comp.images}
                          alt={comp.title}
                          isActive={isActive}
                        />

                        {/* Multi-layer gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${comp.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                        />

                        {/* Glowing top accent line */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${comp.accent} opacity-0 transition-opacity duration-500 ${
                            isActive ? "opacity-100" : ""
                          }`}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                          {/* Achievement Badge */}
                          <div className="mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold border backdrop-blur-md ${comp.badge}`}
                            >
                              <Star className="w-3 h-3" />
                              {comp.achievement}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                            {comp.title}
                          </h3>

                          {/* Description - visible on active */}
                          <motion.p
                            animate={{
                              opacity: isActive ? 1 : 0,
                              y: isActive ? 0 : 10,
                            }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-xs md:text-sm text-gray-300/90 leading-relaxed line-clamp-3"
                          >
                            {comp.description}
                          </motion.p>
                        </div>

                        {/* Index number in background */}
                        <div className="absolute top-3 right-4 text-white/[0.04] text-6xl font-black font-mono select-none pointer-events-none">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Custom Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Prev */}
            <button
              onClick={scrollPrev}
              className="p-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`rounded-full transition-all duration-400 ${
                    i === current
                      ? "w-8 h-2 bg-primary shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      : "w-2 h-2 bg-border/60 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={scrollNext}
              className="p-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-xs font-mono text-muted-foreground/60">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <CompetitionModal
        competition={selectedCompetition}
        onClose={() => setSelectedCompetition(null)}
      />
    </section>
  );
}
