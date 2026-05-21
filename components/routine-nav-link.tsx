"use client";

import Link from "next/link";
import { useSelection } from "./selection-provider";

export function RoutineNavLink() {
  const { count } = useSelection();
  return (
    <Link href="/routine" className="hover:text-foreground inline-flex items-center gap-1.5">
      Routine
      {count > 0 && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
          {count}
        </span>
      )}
    </Link>
  );
}
