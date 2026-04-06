import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DreamRow } from "@/types/dream";
import { formatDreamDate, snippet } from "@/lib/format";

type Props = {
  dream: DreamRow;
  tags: string[];
  hasInsight: boolean;
};

export function DreamCard({ dream, tags, hasInsight }: Props) {
  const title = dream.title?.trim() || "Untitled dream";

  return (
    <Link href={`/dashboard/${dream.id}`} className="group block">
      <Card className="border-border/60 bg-card/80 hover:border-primary/25 h-full transition-all duration-300 hover:shadow-md">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-heading text-foreground text-lg leading-snug">
              {title}
            </p>
            {hasInsight && (
              <Sparkles
                className="text-primary h-4 w-4 shrink-0 opacity-70"
                aria-label="Has AI insight"
              />
            )}
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <time dateTime={dream.dream_date}>{formatDreamDate(dream.dream_date)}</time>
            <Badge variant="secondary" className="font-normal">
              {dream.mood_upon_waking}
            </Badge>
            {dream.is_lucid && (
              <Badge variant="outline" className="font-normal">
                Lucid
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {snippet(dream.description)}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="bg-muted/80 text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
