import { useMemo } from "react";
import { motion } from "framer-motion";
import { mockCases, taxonomyColors, type Taxonomy } from "@/lib/mockData";
import { Network } from "lucide-react";

function useTaxonomyWeights() {
  return useMemo(() => {
    const counts = new Map<Taxonomy, number>();
    mockCases.forEach((c) => counts.set(c.topic, (counts.get(c.topic) || 0) + 1));
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(([, n]) => n), 1);
    return entries.map(([taxonomy, count], i) => ({
      taxonomy,
      count,
      weight: 0.55 + (count / max) * 0.45,
      angle: (i / entries.length) * 360 - 90,
    }));
  }, []);
}

export default function CaseClassificationVisual() {
  const nodes = useTaxonomyWeights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="surface-card overflow-hidden rounded-2xl"
    >
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-secondary/30 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Case classification</h3>
            <p className="text-xs text-muted-foreground">Dynamic view of how AI routes and weights each taxonomy</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-md px-4 py-8">
        <div
          className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/90 bg-gradient-to-br from-card/80 to-muted/40"
          aria-hidden
        />
        <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/25 bg-gradient-to-br from-primary/20 to-primary/5 text-center shadow-[0_12px_40px_-16px_hsl(var(--primary)/0.45)]">
          <span className="text-[11px] font-bold text-foreground">Quorum AI</span>
          <span className="text-[9px] font-medium text-muted-foreground">classifier</span>
        </div>

        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const radiusPct = 38;
          const x = 50 + Math.cos(rad) * radiusPct;
          const y = 50 + Math.sin(rad) * radiusPct;
          const style = taxonomyColors[node.taxonomy];
          const size = 5.2 + node.weight * 4;

          return (
            <motion.div
              key={node.taxonomy}
              className={`absolute z-20 flex flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center shadow-lg ${style.bg} ${style.border}`}
              style={{
                width: `${size}rem`,
                minHeight: `${size * 0.55}rem`,
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.07 }}
            >
              <span className={`text-[10px] font-bold leading-tight sm:text-xs ${style.text}`}>{node.taxonomy}</span>
              <span className="mt-1 text-[9px] font-semibold text-foreground/80">{node.count} cases</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
