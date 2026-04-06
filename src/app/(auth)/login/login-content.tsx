"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginContent() {
  const search = useSearchParams();
  const next = search.get("next") ?? "/dashboard";
  const error = search.get("error");

  async function signInGoogle() {
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <Card className="border-border/60 bg-card/90 w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with Google to open your dream journal.
        </CardDescription>
        {error === "auth" && (
          <p className="text-destructive pt-2 text-sm">
            Sign-in did not complete. Please try again.
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button type="button" size="lg" className="w-full" onClick={signInGoogle}>
          Continue with Google
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
