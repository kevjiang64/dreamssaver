import { AppHeader } from "@/components/common/AppHeader";
import { Footer } from "@/components/common/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader variant="marketing" />
      {children}
      <Footer />
    </>
  );
}
