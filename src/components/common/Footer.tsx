import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-border/40 text-muted-foreground mt-auto border-t py-10 text-center text-sm">
      <p>
        © {new Date().getFullYear()} {siteConfig.name} — your dreams stay private.
      </p>
    </footer>
  );
}
