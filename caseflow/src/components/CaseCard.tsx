import { CaseItem, taxonomyColors } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Flame, Zap, Circle, User } from "lucide-react";

const priorityConfig = {
  high: { icon: Flame, label: "High", className: "text-priority-high bg-priority-high/10" },
  medium: { icon: Zap, label: "Medium", className: "text-priority-medium bg-priority-medium/10" },
  low: { icon: Circle, label: "Low", className: "text-priority-low bg-priority-low/10" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  "pending": { label: "Pending", className: "text-status-pending bg-status-pending/10" },
  "in-progress": { label: "In Progress", className: "text-status-progress bg-status-progress/10" },
  "needs-approval": { label: "Needs Approval", className: "text-status-approval bg-status-approval/10" },
  "resolved": { label: "Resolved", className: "text-status-resolved bg-status-resolved/10" },
};

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

interface CaseCardProps {
  caseItem: CaseItem;
  onClick: () => void;
  index: number;
}

export default function CaseCard({ caseItem, onClick, index }: CaseCardProps) {
  const priority = priorityConfig[caseItem.priority];
  const status = statusConfig[caseItem.status];
  const PriorityIcon = priority.icon;
  const taxStyle = taxonomyColors[caseItem.topic];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={onClick}
      className="glass rounded-xl p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-muted-foreground font-medium">{caseItem.id}</p>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${taxStyle.bg} ${taxStyle.text} ${taxStyle.border}`}>
              {caseItem.topic}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
            {caseItem.title}
          </h3>
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-3 ${priority.className}`}>
          <PriorityIcon size={12} />
          {priority.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{caseItem.problem}</p>

      {/* Exposure mini bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Exposure</span>
        <div className="flex-1 h-1.5 bg-sage-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              caseItem.riskScore > 80 ? "bg-priority-high" : caseItem.riskScore > 40 ? "bg-priority-medium" : "bg-primary"
            }`}
            style={{ width: `${Math.min(caseItem.riskScore, 100)}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-foreground">{formatCurrency(caseItem.predictedExposure)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-sage-200 flex items-center justify-center">
            <User size={12} className="text-sage-600" />
          </div>
          <span className="text-xs text-muted-foreground">
            {caseItem.assignee || "Unassigned"}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
    </motion.div>
  );
}
