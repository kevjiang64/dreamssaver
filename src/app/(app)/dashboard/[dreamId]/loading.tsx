import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DreamLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="bg-muted h-4 w-24 rounded" />
        <div className="bg-muted h-10 max-w-md rounded-lg" />
        <div className="bg-muted h-4 w-48 rounded" />
      </div>
      <Card>
        <CardHeader>
          <div className="bg-muted h-5 w-20 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-4/5 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}
