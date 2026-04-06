import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LandingFirstDream } from "@/components/marketing/LandingFirstDream";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.85 0.08 280), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, oklch(0.9 0.05 40 / 0.35), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-primary mb-4 text-center text-sm font-medium tracking-wide uppercase">
          Morning ritual · Quiet reflection
        </p>
        <h1 className="font-heading text-foreground text-center text-4xl leading-tight font-normal sm:text-5xl">
          Catch your dreams before they fade
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed">
          {siteConfig.description} Record everything in one calm place, then
          invite Gemini to offer optional, non-definitive reflections—always
          yours to interpret.
        </p>

        <div className="border-border/50 bg-card/70 mt-14 rounded-2xl border p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <h2 className="font-heading mb-2 text-xl">Start with tonight&apos;s memory</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Write your dream below, then continue with Google to create your
            account. Your text is saved on this device until you sign in.
          </p>
          <LandingFirstDream />
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Already journaling with us?{" "}
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-primary h-auto min-h-0 p-0",
              )}
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="text-muted-foreground mt-16 grid gap-8 text-sm leading-relaxed sm:grid-cols-3">
          <div>
            <h3 className="text-foreground mb-2 font-medium">Unlimited entries</h3>
            <p>Free tier includes every dream you want to save. No caps on writing.</p>
          </div>
          <div>
            <h3 className="text-foreground mb-2 font-medium">5 free AI insights</h3>
            <p>
              Try Gemini-powered reflections, framed as possibilities—not
              predictions.
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-2 font-medium">Premium</h3>
            <p>Unlimited AI insights for $8/month when you are ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
