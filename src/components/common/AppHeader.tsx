import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/lib/button-variants";
import { UserMenu } from "@/components/common/UserMenu";
import { cn } from "@/lib/utils";

export async function AppHeader({ variant }: { variant?: "marketing" | "app" }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-border/40 bg-card/30 supports-[backdrop-filter]:bg-card/20 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-muted-foreground hover:text-foreground text-lg tracking-tight transition-colors"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {variant === "app" && (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    Dreams
                  </Link>
                  <Link
                    href="/dashboard/new"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    Record
                  </Link>
                </>
              )}
              {variant !== "app" && (
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  My dreams
                </Link>
              )}
              <UserMenu email={user.email} />
            </>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
