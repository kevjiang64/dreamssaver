"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PENDING_DREAM_STORAGE_KEY } from "@/lib/pending-dream";

export function LandingFirstDream() {
  const [text, setText] = useState("");
  const router = useRouter();

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.message("Describe your dream—even a few lines is enough to begin.");
      return;
    }
    try {
      localStorage.setItem(
        PENDING_DREAM_STORAGE_KEY,
        JSON.stringify({ description: trimmed }),
      );
    } catch {
      toast.error("Could not save your draft locally. Check browser storage.");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your dream here… colors, people, feelings, anything you remember."
        className="border-border/60 bg-card/90 min-h-[180px] resize-y text-base leading-relaxed shadow-inner sm:min-h-[220px]"
        aria-label="Your dream"
      />
      <Button
        type="button"
        size="lg"
        className="w-full sm:w-auto"
        onClick={submit}
      >
        Submit first dream &amp; sign up
      </Button>
    </div>
  );
}
