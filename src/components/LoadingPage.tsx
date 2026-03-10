import { SandGlassLoading } from "../animations/sandGlassLoading";
import { RotatingAnimations } from "./RotatingAnimations";

interface Props {
  isProcessing: boolean;
  isUploading: boolean;
  email?: string;
}

export function LoadingPage({ isProcessing, isUploading, email }: Props) {
  if (isUploading) {
    return (
      <>
        <SandGlassLoading />
        <div className="flex items-center justify-center text-primary-foreground text-3xl">
          Uploading your video, Any .. minute .. now
        </div>
        <p className="mt-3 text-center text-sm text-amber-500 font-medium">
          Don&apos;t close this tab — your upload will be lost.
        </p>
      </>
    );
  } else if (isProcessing) {
    return (
      <>
        <div className="flex justify-center text-primary-foreground text-3xl">
          <RotatingAnimations />
        </div>
        {email ? (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We&apos;ll email{" "}
            <span className="text-foreground font-medium">{email}</span> when
            your highlights are ready.{" "}
            <span className="text-muted-foreground/70">
              Check your spam folder.
            </span>
            <br />
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-amber-500 font-medium">
            Don&apos;t close this tab — you won&apos;t receive an email without
            one.
          </p>
        )}
      </>
    );
  }
}
