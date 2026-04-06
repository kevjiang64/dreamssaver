import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-foreground text-2xl">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        This path drifts in empty sky. Return to your journal whenever you are ready.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Back home
      </Link>
    </div>
  );
}
