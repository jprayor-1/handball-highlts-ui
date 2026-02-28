import { SandGlassLoading } from "../animations/sandGlassLoading";
import { RotatingAnimations } from "./RotatingAnimations";

interface Props {
  isProcessing: boolean;
  isUploading: boolean;
}

export function LoadingPage({ isProcessing, isUploading }: Props) {
  if (isUploading) {
    return (
      <>
        <SandGlassLoading />
        <div className="flex items-center justify-center text-primary-foreground text-3xl">
          Uploading your video, Any .. minute .. now
        </div>
      </>
    );
  } else if (isProcessing) {
    return (
      <>
        <div className="flex justify-center text-primary-foreground text-3xl">
          <RotatingAnimations />
        </div>
      </>
    );
  }
}
