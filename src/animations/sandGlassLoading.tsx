import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SandGlassLoading() {
  return (
    <div className="flex items-center justify-center">
      <DotLottieReact
        src="/Sandy-Loading.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}
