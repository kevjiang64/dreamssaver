import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamForm } from "@/components/dashboard/DreamForm";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default async function NewDreamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-2 -ml-2",
            )}
          >
            ← Back to dreams
          </Link>
          <h1 className="font-heading text-foreground text-3xl font-normal">
            Record a dream
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm">
            Move slowly. The details that feel fuzzy still matter.
          </p>
        </div>
      </div>
      <DreamForm />
    </div>
  );
}
