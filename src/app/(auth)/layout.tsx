export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background via-muted/20 to-primary/5 flex min-h-[70vh] items-center justify-center bg-gradient-to-b px-4 py-16">
      {children}
    </div>
  );
}
