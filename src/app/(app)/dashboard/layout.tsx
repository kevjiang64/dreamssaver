import { PendingDreamSync } from "@/components/dashboard/PendingDreamSync";

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PendingDreamSync />
      {children}
    </>
  );
}
