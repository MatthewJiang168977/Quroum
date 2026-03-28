import { CaseItem, taxonomyColors } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Zap, Circle, User, Sparkles, ArrowRight, CheckCircle, RotateCcw, Eye, ShieldAlert, TrendingUp, Target } from "lucide-react";

const priorityConfig = {
  high: { icon: Flame, label: "High", className: "text-priority-high" },
  medium: { icon: Zap, label: "Medium", className: "text-priority-medium" },
  low: { icon: Circle, label: "Low", className: "text-priority-low" },
};

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

interface CaseDetailProps {
  caseItem: CaseItem | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function CaseDetail({ caseItem, onClose, onAction }: CaseDetailProps) {
  if (!caseItem) return null;

  const priority = priorityConfig[caseItem.priority];
  const PriorityIcon = priority.icon;
  const taxStyle = taxonomyColors[caseItem.topic];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl glass z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-muted-foreground font-medium">{caseItem.id}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${taxStyle.bg} ${taxStyle.text} ${taxStyle.border}`}>
                  {caseItem.topic}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground leading-tight">{caseItem.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Outcome Prediction Banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-sage-100/80 border border-sage-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-primary" />
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">AI Outcome Prediction</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Predicted Exposure</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(caseItem.predictedExposure)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Settlement Range</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(caseItem.settlementRange[0])}–{formatCurrency(caseItem.settlementRange[1])}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Risk / Confidence</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    caseItem.riskScore > 80 ? "text-priority-high" : caseItem.riskScore > 40 ? "text-priority-medium" : "text-primary"
                  }`}>
                    {caseItem.riskScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-lg font-bold text-primary">{caseItem.outcomeConfidence}%</span>
                </div>
              </div>
            </div>
            {/* Exposure bar */}
            <div className="mt-3 h-2 bg-sage-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(caseItem.riskScore, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`h-full rounded-full ${
                  caseItem.riskScore > 80 ? "bg-priority-high" : caseItem.riskScore > 40 ? "bg-priority-medium" : "bg-primary"
                }`}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Case Summary */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Problem</h3>
                <p className="text-sm text-foreground leading-relaxed">{caseItem.problem}</p>
              </div>

              {caseItem.notes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Notes</h3>
                  <ul className="space-y-1.5">
                    {caseItem.notes.map((note, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-sage-400 mt-2 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assignee</h3>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sage-200 flex items-center justify-center">
                    <User size={14} className="text-sage-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{caseItem.assignee || "Unassigned"}</span>
                </div>
              </div>
            </div>

            {/* Right: AI Decisions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-primary" />
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">AI Analysis</h3>
              </div>

              <div className="bg-secondary/60 rounded-xl p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Priority</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${priority.className}`}>
                      <PriorityIcon size={12} />
                      {priority.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{caseItem.aiReason}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Recommended Assignee</p>
                  <p className="text-sm font-medium text-foreground">{caseItem.recommendedAssignee}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{caseItem.assigneeReason}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ArrowRight size={12} className="text-primary" />
                    <p className="text-xs font-semibold text-muted-foreground">Next Step</p>
                  </div>
                  <p className="text-sm text-foreground">{caseItem.nextStep}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => onAction("assign")}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <CheckCircle size={16} />
                  Assign
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAction("approve")}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors"
                  >
                    <Eye size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => onAction("review")}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Request Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
