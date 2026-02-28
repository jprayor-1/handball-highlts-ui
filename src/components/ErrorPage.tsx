import { SadHandballAnimation } from "../animations/sadHandball";

export function ErrorPage() {
  return (
    <>
      <SadHandballAnimation />
      <div className="flex items-center justify-center text-primary-foreground text-3xl">
        Something wrong happened. Please try again.{" "}
      </div>
    </>
  );
}
