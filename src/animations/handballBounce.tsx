import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function HandballBounceAnimation() {
  return (
    <div className="flex items-center justify-center">
      <DotLottieReact
        src="/handball-bounce.lottie"
        loop
        autoplay
        style={{ width: 500, height: 500 }}
      />
    </div>
  );
}
