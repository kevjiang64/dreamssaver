import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div>
        <ButtonLink />
        <h1 className="font-heading text-foreground mt-4 text-3xl font-normal">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Subscription and billing for Dreams Saver.
        </p>
      </div>
      {children}
    </div>
  );
}

function ButtonLink() {
  return (
    <Link
      href="/dashboard"
      className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
    >
      ← Back to dreams
    </Link>
  );
}
