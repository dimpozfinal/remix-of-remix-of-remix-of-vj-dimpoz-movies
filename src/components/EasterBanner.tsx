import { useState, useEffect } from "react";

const loveQuotes = [
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.", author: "Unknown" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
  { text: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
  { text: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Nat King Cole" },
  { text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls.", author: "Maya Angelou" },
  { text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss" },
  { text: "I have found the one whom my soul loves.", author: "Song of Solomon 3:4" },
  { text: "Love bears all things, believes all things, hopes all things, endures all things.", author: "1 Corinthians 13:7" },
  { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
  { text: "The best love is the kind that awakens the soul.", author: "Nicholas Sparks" },
  { text: "Love does not consist of gazing at each other, but in looking outward together in the same direction.", author: "Antoine de Saint-Exupéry" },
  { text: "We loved with a love that was more than love.", author: "Edgar Allan Poe" },
  { text: "Life without love is like a tree without blossoms or fruit.", author: "Khalil Gibran" },
  { text: "Love is the whole thing. We are only pieces.", author: "Rumi" },
  { text: "When love is not madness, it is not love.", author: "Pedro Calderón de la Barca" },
  { text: "Love is a friendship set to music.", author: "Joseph Campbell" },
  { text: "There is no remedy for love but to love more.", author: "Henry David Thoreau" },
  { text: "Love is the beauty of the soul.", author: "Saint Augustine" },
  { text: "Two souls with but a single thought, two hearts that beat as one.", author: "John Keats" },
  { text: "If I know what love is, it is because of you.", author: "Hermann Hesse" },
  { text: "Love never fails.", author: "1 Corinthians 13:8" },
  { text: "So now faith, hope, and love abide, these three; but the greatest of these is love.", author: "1 Corinthians 13:13" },
  { text: "Above all, love each other deeply, because love covers over a multitude of sins.", author: "1 Peter 4:8" },
  { text: "Let all that you do be done in love.", author: "1 Corinthians 16:14" },
  { text: "And now these three remain: faith, hope and love. But the greatest of these is love.", author: "1 Corinthians 13:13" },
  { text: "Beloved, let us love one another, for love is from God.", author: "1 John 4:7" },
  { text: "Love is patient, love is kind. It does not envy, it does not boast.", author: "1 Corinthians 13:4" },
];

function getDailyQuote(): typeof loveQuotes[0] {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return loveQuotes[dayOfYear % loveQuotes.length];
}

export default function EasterBanner() {
  const [quote, setQuote] = useState(getDailyQuote);

  useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-semibold tracking-wider z-50 relative overflow-hidden love-glow rounded-lg my-2"
      style={{
        background: "linear-gradient(90deg, hsl(335 75% 58% / 0.12), hsl(315 55% 50% / 0.18), hsl(350 70% 60% / 0.12))",
        borderBottom: "1px solid hsl(335 70% 55% / 0.3)",
        color: "hsl(335 60% 72%)",
        letterSpacing: "0.08em",
      }}
    >
      <span className="relative z-10 flex flex-col items-center gap-0.5">
        <span className="text-[10px] opacity-60 uppercase tracking-widest">💖 Daily Love Quote</span>
        <span className="italic text-xs md:text-sm font-medium leading-relaxed">
          "{quote.text}"
        </span>
        <span className="text-[10px] opacity-70 font-semibold">— {quote.author}</span>
      </span>
    </div>
  );
}
