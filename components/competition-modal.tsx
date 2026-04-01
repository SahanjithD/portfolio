"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Competition {
  id: number;
  title: string;
  achievement: string;
  description: string;
  images: string[];
  accent: string;
  badge: string;
}

interface CompetitionModalProps {
  competition: Competition | null;
  onClose: () => void;
}

export function CompetitionModal({
  competition,
  onClose,
}: CompetitionModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // Reset image index when competition changes
  useEffect(() => {
    setCurrentImage(0);
  }, [competition]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const nextImage = useCallback(() => {
    if (!competition) return;
    setCurrentImage((prev) => (prev + 1) % competition.images.length);
  }, [competition]);

  const prevImage = useCallback(() => {
    if (!competition) return;
    setCurrentImage(
      (prev) =>
        (prev - 1 + competition.images.length) % competition.images.length
    );
  }, [competition]);

  if (!competition) return null;

  return (
    <AnimatePresence>
      {competition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, type: "spring", damping: 25 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/70 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-black">
              {/* Images with crossfade */}
              {competition.images.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${competition.title} — photo ${i + 1}`}
                  fill
                  className={`object-cover object-center transition-opacity duration-500 ${
                    i === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={i === 0}
                />
              ))}

              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Navigation arrows (only if > 1 image) */}
              {competition.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/70 transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-black/70 transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {competition.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {competition.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentImage
                          ? "w-6 h-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          : "w-2 h-2 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`View photo ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-mono text-white/70">
                {currentImage + 1} / {competition.images.length}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8">
              {/* Achievement badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${competition.badge}`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {competition.achievement}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {competition.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {competition.description}
              </p>

              {/* Thumbnail strip for quick navigation */}
              {competition.images.length > 1 && (
                <div className="mt-6 pt-6 border-t border-border/30">
                  <p className="text-xs font-mono text-muted-foreground/60 mb-3 uppercase tracking-wider">
                    Gallery
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {competition.images.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setCurrentImage(i)}
                        className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          i === currentImage
                            ? "border-primary shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                            : "border-border/30 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
