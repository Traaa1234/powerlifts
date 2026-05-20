import { cn } from "@/lib/utils";

const RANK_STYLES: Record<number, string> = {
  1: "bg-gold text-black border-gold",
  2: "bg-silver text-black border-silver",
  3: "bg-bronze text-white border-bronze",
};

export function RankBadge({ rank }: { rank: number }) {
  const style = RANK_STYLES[rank] ?? "bg-transparent text-foreground border-border";
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xl font-bold",
        style,
      )}
    >
      {rank}
    </div>
  );
}
