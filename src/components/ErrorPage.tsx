import { SadHandballAnimation } from "../animations/sadHandball";

interface ErrorPageProps {
  message?: string;
}

export function ErrorPage({ message }: ErrorPageProps) {
  return (
    <>
      <SadHandballAnimation />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-primary-foreground text-3xl">
          Something wrong happened. Please try again.
        </p>
        {message && (
          <p className="text-muted-foreground text-sm">{message}</p>
        )}
      </div>
    </>
  );
}
