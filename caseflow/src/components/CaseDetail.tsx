import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Zap, Circle, User, Sparkles, ArrowRight, CheckCircle, RotateCcw, Eye, Target } from "lucide-react";
import { apiPatch } from "../lib/api";

const priorityConfig: Record<string, { icon: any; label: string; className: string }> = {
  critical: { icon: Flame, label: "Critical", className: "text-priority-high" },
  high: { icon: Flame, label: "High", className: "text-priority-high" },
  normal: { icon: Zap, label: "Medium", className: "text-priority-medium" },
  low: { icon: Circle, label: "Low", className: "text-priority-low" },
};

const topicColors: Record<string, { bg: string; text: string; border: string }> = {
  healthcare: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  immigration: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  veterans: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  tax: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  social_security: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  disaster_relief: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};
const defaultColor = { bg: "bg-sage-50", text: "text-sage-700", border: "border-sage-200" };

function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

interface CaseDetailProps {
  caseItem: any | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function CaseDetail({ caseItem, onClose, onAction }: CaseDetailProps) {
  if (!caseItem) return null;

  const priority = priorityConfig[caseItem.priority] || priorityConfig.normal;
  const PriorityIcon = priority.icon;
  const topic = caseItem.messageId?.aiTags?.topics?.[0] || caseItem.agency?.toLowerCase() || "other";
  const taxStyle = topicColors[topic] || defaultColor;

  // Extract AI data from notes
  const severityNote = caseItem.notes?.find((n: any) => n.author === "ai-severity-agent");
  const employeeNote = caseItem.notes?.find((n: any) => n.author === "ai-employee-agent");
  const systemNotes = caseItem.notes?.filter((n: any) => n.author === "system") || [];

  let riskScore = 50;
  if (severityNote) {
    const match = severityNote.text.match(/Severity:\s*(\d+)/);
    if (match) riskScore = parseInt(match[1]) * 10;
  } else {
    riskScore = caseItem.priority === "critical" ? 90 : caseItem.priority === "high" ? 70 : 40;
  }

  const exposure = Math.round(riskScore * 500);
  const settlementLow = Math.round(exposure * 0.4);
  const settlementHigh = Math.round(exposure * 0.8);
  const confidence = Math.max(60, 100 - Math.round(riskScore * 0.3));

  // Extract recommended assignee from employee note
  let recommendedAssignee = "Not yet analyzed";
  let assigneeReason = "Run AI analysis from the Manager view to get a recommendation.";
  if (employeeNote) {
    const nameMatch = employeeNote.text.match(/Recommended:\s*([^.]+)/);
    if (nameMatch) recommendedAssignee = nameMatch[1].trim();
    assigneeReason = employeeNote.text;
  }

  const handleAction = async (action: string) => {
    try {
      if (action === "approve") {
        await apiPatch(`/cases/${caseItem._id}/status`, { status: "resolved" });
      }
      onAction(action);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

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
                <p className="text-xs text-muted-foreground font-medium">{caseItem.caseNumber || caseItem._id?.slice(-6)}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${taxStyle.bg} ${taxStyle.text} ${taxStyle.border}`}>
                  {topic.replace(/_/g, " ")}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground leading-tight">{caseItem.subject}</h2>
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
                <p className="text-lg font-bold text-foreground">{formatCurrency(exposure)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Settlement Range</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(settlementLow)}–{formatCurrency(settlementHigh)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Risk / Confidence</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    riskScore > 80 ? "text-priority-high" : riskScore > 40 ? "text-priority-medium" : "text-primary"
                  }`}>
                    {riskScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-lg font-bold text-primary">{confidence}%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 bg-sage-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(riskScore, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`h-full rounded-full ${
                  riskScore > 80 ? "bg-priority-high" : riskScore > 40 ? "bg-priority-medium" : "bg-primary"
                }`}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Case Summary */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Constituent</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {caseItem.constituent} · {caseItem.agency} {caseItem.agencyReference ? `· ${caseItem.agencyReference}` : ""}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Case Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Opened: {new Date(caseItem.openedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}Days open: {caseItem.daysOpen}
                  {" · "}SLA: {caseItem.slaDays} days
                </p>
                {caseItem.isOverdue && (
                  <p className="text-sm font-semibold text-priority-high mt-1">⚠ OVERDUE</p>
                )}
              </div>

              {/* AI Agent Notes */}
              {caseItem.notes?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Agent Notes</h3>
                  <ul className="space-y-2">
                    {caseItem.notes.map((note: any, i: number) => (
                      <li key={i} className={`text-sm p-2 rounded-lg border-l-2 ${
                        note.author === "ai-severity-agent" ? "border-l-red-400 bg-red-50/50" :
                        note.author === "ai-employee-agent" ? "border-l-blue-400 bg-blue-50/50" :
                        note.author === "ai-meeting-agent" ? "border-l-emerald-400 bg-emerald-50/50" :
                        "border-l-sage-300 bg-secondary/40"
                      }`}>
                        <span className="text-xs font-semibold text-muted-foreground block mb-0.5">
                          {note.author === "ai-severity-agent" ? "Severity Agent" :
                           note.author === "ai-employee-agent" ? "Employee Matcher" :
                           note.author === "ai-meeting-agent" ? "Meeting Analyst" :
                           note.author === "system" ? "System" : note.author}
                        </span>
                        <span className="text-muted-foreground">{note.text}</span>
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
                  <span className="text-sm font-medium text-foreground">{caseItem.assignedTo?.name || "Unassigned"}</span>
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
                  <p className="text-xs text-muted-foreground">{severityNote?.text || "No severity analysis yet."}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Recommended Assignee</p>
                  <p className="text-sm font-medium text-foreground">{recommendedAssignee}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{assigneeReason}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ArrowRight size={12} className="text-primary" />
                    <p className="text-xs font-semibold text-muted-foreground">Next Steps</p>
                  </div>
                  <p className="text-sm text-foreground">{caseItem.nextSteps || "No next steps defined."}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleAction("assign")}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <CheckCircle size={16} />
                  Assign
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("approve")}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors"
                  >
                    <Eye size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction("review")}
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