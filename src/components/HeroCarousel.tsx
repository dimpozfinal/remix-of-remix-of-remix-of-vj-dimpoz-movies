import { useEffect, useState, useCallback } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const TRANSITIONS = [
  "fade",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "flip",
] as const;

type TransitionType = (typeof TRANSITIONS)[number];

function getRandomTransition(): TransitionType {
  return TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
}

function getTransitionStyle(transition: TransitionType, isActive: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  if (isActive) {
    return { ...base, opacity: 1, transform: "translateX(0) scale(1) rotateY(0deg)" };
  }

  switch (transition) {
    case "fade":
      return { ...base, opacity: 0, transform: "scale(1)" };
    case "slide-left":
      return { ...base, opacity: 0, transform: "translateX(-100%)" };
    case "slide-right":
      return { ...base, opacity: 0, transform: "translateX(100%)" };
    case "zoom-in":
      return { ...base, opacity: 0, transform: "scale(1.3)" };
    case "zoom-out":
      return { ...base, opacity: 0, transform: "scale(0.7)" };
    case "flip":
      return { ...base, opacity: 0, transform: "rotateY(90deg)" };
    default:
      return { ...base, opacity: 0 };
  }
}

export default function HeroCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState<TransitionType>("fade");

  useEffect(() => {
    const carouselRef = ref(database, "carousel");
    const unsubscribe = onValue(carouselRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setItems(
          Object.entries(data).map(([id, value]: [string, any]) => ({
            id,
            ...value,
          }))
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const advance = useCallback(() => {
    setTransition(getRandomTransition());
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [items.length, advance]);

  if (items.length === 0) return null;

  const goTo = (dir: number) => {
    setTransition(getRandomTransition());
    setCurrentIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <div
      className="relative w-full mb-3 rounded-lg overflow-hidden group max-w-full"
      style={{ aspectRatio: "16/9", minHeight: 140, maxHeight: "40vh", perspective: "1000px" }}
    >
      {items.map((item, i) => (
        <div key={item.id} style={getTransitionStyle(transition, i === currentIndex)}>
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {i === currentIndex && (
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
              <h2 className="text-base md:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="text-xs md:text-sm text-white/80 mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {item.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {items.length > 1 && (
        <>
          <button
            onClick={() => goTo(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-3 flex gap-1.5 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setTransition(getRandomTransition());
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-white w-5" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
