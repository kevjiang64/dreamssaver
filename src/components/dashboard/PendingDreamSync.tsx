"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createDreamAction } from "@/app/actions/dreams";
import { PENDING_DREAM_STORAGE_KEY } from "@/lib/pending-dream";

export function PendingDreamSync() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    const raw = localStorage.getItem(PENDING_DREAM_STORAGE_KEY);
    if (!raw) return;
    ran.current = true;

    void (async () => {
      try {
        const parsed = JSON.parse(raw) as { description?: string };
        const description = parsed.description?.trim();
        if (!description) {
          localStorage.removeItem(PENDING_DREAM_STORAGE_KEY);
          return;
        }
        const fd = new FormData();
        fd.set("description", description);
        fd.set("dream_date", new Date().toISOString().slice(0, 10));
        fd.set("mood_upon_waking", "Neutral");
        fd.set("is_lucid", "false");
        const res = await createDreamAction(undefined, fd);
        localStorage.removeItem(PENDING_DREAM_STORAGE_KEY);
        if (res.dreamId) router.refresh();
      } catch {
        localStorage.removeItem(PENDING_DREAM_STORAGE_KEY);
      }
    })();
  }, [router]);

  return null;
}
