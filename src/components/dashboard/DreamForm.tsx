"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDreamAction,
  type DreamActionState,
} from "@/app/actions/dreams";
import { MOODS, type Mood } from "@/lib/constants";

const initial: DreamActionState | undefined = undefined;

export function DreamForm() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood>("Neutral");
  const [lucid, setLucid] = useState(false);
  const [state, formAction, pending] = useActionState(
    createDreamAction,
    initial,
  );

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.dreamId) {
      toast.success("Dream saved.");
      router.push(`/dashboard/${state.dreamId}`);
    }
  }, [state, router]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-8">
      <input type="hidden" name="mood_upon_waking" value={mood} readOnly />
      <input
        type="hidden"
        name="is_lucid"
        value={lucid ? "on" : "off"}
        readOnly
      />

      <div className="space-y-2">
        <Label htmlFor="dream_date">Date</Label>
        <Input
          id="dream_date"
          name="dream_date"
          type="date"
          defaultValue={today}
          required
          className="bg-card/80 max-w-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          name="title"
          placeholder="Short label for this dream"
          maxLength={255}
          className="bg-card/80"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Dream</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="What did you dream? Take your time."
          className="border-border/60 bg-card/90 min-h-[200px] text-base leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <Label>Mood upon waking</Label>
        <Select value={mood} onValueChange={(v) => setMood(v as Mood)}>
          <SelectTrigger className="bg-card/80 max-w-xs">
            <SelectValue placeholder="How did you feel?" />
          </SelectTrigger>
          <SelectContent>
            {MOODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_lucid"
          checked={lucid}
          onCheckedChange={(c) => setLucid(c === true)}
        />
        <Label htmlFor="is_lucid" className="font-normal">
          This was a lucid dream
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="flying, water, school — comma separated"
          className="bg-card/80"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save dream"}
        </Button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
