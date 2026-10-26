import Link from "next/link";

import type { ExplorationEntry } from "@/lib/animals/exploration";

type ExplorationCardProps = Readonly<{
  entry: ExplorationEntry;
  href: string;
}>;

export function ExplorationCard({ entry, href }: ExplorationCardProps) {
  return (
    <Link className="exploration-card" href={href}>
      <span className="exploration-card-label">{entry.label}</span>
      <span className="exploration-card-count">
        {entry.count} {entry.count === 1 ? "species" : "species"}
      </span>
      <span className="exploration-card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
