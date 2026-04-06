"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function DreamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border-border/50 bg-card/60 mx-auto max-w-md space-y-4 rounded-xl border p-8 text-center">
      <h2 className="font-heading text-xl">This dream could not be loaded</h2>
      <p className="text-muted-foreground text-sm">
        Something went wrong. You can try again or return to your list.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          Back to dreams
        </Link>
      </div>
    </div>
  );
}
