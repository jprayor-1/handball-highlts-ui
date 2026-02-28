import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const animations = [
  "/handball-bounce.lottie",
  "/dancing_lady_guitar.lottie",
  "/cute_bear.lottie",
  "/Tenor.lottie",
  "/Karam.lottie",
];

const messages = [
  "Analyzing your handball game",
  "Got an electric volley",
  "Woot woot, what a rally",
  "Dang, can't believe that happened",
  "OH SNAP!",
];

export function RotatingAnimations() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const rotate = () => {
      timeout = setTimeout(() => {
        setFade(false);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % animations.length);
          setFade(true);
          rotate(); // schedule next cycle
        }, 300);
      }, 6500);
    };

    rotate();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-background">
      <div
        className={`transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <DotLottieReact
          key={index}
          src={animations[index]}
          loop
          autoplay
          style={{ width: 400, height: 400 }}
        />
      </div>

      <p
        className={`text-primary-foreground text-3xl mt-4 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages[index]}
      </p>
    </div>
  );
}
