import { motion } from "framer-motion";
import { Flame, Zap, Circle, User } from "lucide-react";

const priorityConfig: Record<string, { icon: any; label: string; className: string }> = {
  critical: { icon: Flame, label: "Critical", className: "text-priority-high bg-priority-high/10" },
  high: { icon: Flame, label: "High", className: "text-priority-high bg-priority-high/10" },
  normal: { icon: Zap, label: "Medium", className: "text-priority-medium bg-priority-medium/10" },
  low: { icon: Circle, label: "Low", className: "text-priority-low bg-priority-low/10" },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Pending", className: "text-status-pending bg-status-pending/10" },
  in_progress: { label: "In Progress", className: "text-status-progress bg-status-progress/10" },
  awaiting_agency: { label: "Awaiting Agency", className: "text-status-approval bg-status-approval/10" },
  awaiting_constituent: { label: "Awaiting Response", className: "text-status-approval bg-status-approval/10" },
  resolved: { label: "Resolved", className: "text-status-resolved bg-status-resolved/10" },
  closed: { label: "Closed", className: "text-status-resolved bg-status-resolved/10" },
};

const topicColors: Record<string, { bg: string; text: string; border: string }> = {
  healthcare: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  immigration: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  veterans: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  tax: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  social_security: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  disaster_relief: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  infrastructure: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
};

const defaultColor = { bg: "bg-sage-50", text: "text-sage-700", border: "border-sage-200" };

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

interface CaseCardProps {
  caseItem: any;
  onClick: () => void;
  index: number;
}

export default function CaseCard({ caseItem, onClick, index }: CaseCardProps) {
  const priority = priorityConfig[caseItem.priority] || priorityConfig.normal;
  const status = statusConfig[caseItem.status] || { label: caseItem.status, className: "text-muted-foreground bg-secondary" };
  const PriorityIcon = priority.icon;

  // Get topic from message data or agency
  const topic = caseItem.messageId?.aiTags?.topics?.[0] || caseItem.agency?.toLowerCase() || "other";
  const taxStyle = topicColors[topic] || defaultColor;

  // Derive risk score from severity notes or priority
  let riskScore = 50;
  const severityNote = caseItem.notes?.find((n: any) => n.author === "ai-severity-agent");
  if (severityNote) {
    const match = severityNote.text.match(/Severity:\s*(\d+)/);
    if (match) riskScore = parseInt(match[1]) * 10;
  } else {
    riskScore = caseItem.priority === "critical" ? 90 : caseItem.priority === "high" ? 70 : caseItem.priority === "normal" ? 40 : 20;
  }

  const exposure = Math.round(riskScore * 500 * (1 + Math.random() * 0.3));

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
            <p className="text-xs text-muted-foreground font-medium">{caseItem.caseNumber || caseItem._id?.slice(-6)}</p>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${taxStyle.bg} ${taxStyle.text} ${taxStyle.border}`}>
              {topic.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
            {caseItem.subject}
          </h3>
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-3 ${priority.className}`}>
          <PriorityIcon size={12} />
          {priority.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {caseItem.constituent} · {caseItem.agency} {caseItem.agencyReference ? `· ${caseItem.agencyReference}` : ""}
      </p>

      {/* Exposure mini bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Exposure</span>
        <div className="flex-1 h-1.5 bg-sage-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              riskScore > 80 ? "bg-priority-high" : riskScore > 40 ? "bg-priority-medium" : "bg-primary"
            }`}
            style={{ width: `${Math.min(riskScore, 100)}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-foreground">{formatCurrency(exposure)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-sage-200 flex items-center justify-center">
            <User size={12} className="text-sage-600" />
          </div>
          <span className="text-xs text-muted-foreground">
            {caseItem.assignedTo?.name || "Unassigned"}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
    </motion.div>
  );
}