import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SadHandballAnimation() {
  return (
    <div className="flex items-center justify-center">
      <DotLottieReact
        src="/sad_emotion.lottie"
        loop
        autoplay
        style={{ width: 500, height: 500 }}
      />
    </div>
  );
}
