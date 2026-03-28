import { motion } from "framer-motion";
import { FileInput, Users, ShieldCheck, BarChart3, Check, Sparkles } from "lucide-react";
import { Role } from "@/lib/mockData";

interface WorkflowStage {
  id: Role;
  label: string;
  icon: typeof FileInput;
  aiLabel: string;
}

const stages: WorkflowStage[] = [
  { id: "caseworker", label: "Case Worker", icon: FileInput, aiLabel: "Intake & Analysis" },
  { id: "manager", label: "Manager", icon: Users, aiLabel: "AI Assignment" },
  { id: "approver", label: "Approver", icon: ShieldCheck, aiLabel: "Outcome Prediction" },
  { id: "exec", label: "Executive", icon: BarChart3, aiLabel: "KPI & Oversight" },
];

const roleIndex: Record<Role, number> = {
  caseworker: 0,
  manager: 1,
  approver: 2,
  exec: 3,
};

export default function WorkflowProgress({ role }: { role: Role }) {
  const currentIndex = roleIndex[role];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl px-5 py-4 mb-6"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={13} className="text-primary" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">AI Workflow Pipeline</span>
      </div>

      <div className="flex items-center">
        {stages.map((stage, i) => {
          const isCurrent = i === currentIndex;
          const isCompleted = i < currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={isCurrent ? { repeat: Infinity, duration: 2.5 } : {}}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isCompleted
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check size={15} strokeWidth={2.5} /> : <stage.icon size={15} />}
                </motion.div>
                <span className={`text-[10px] font-medium mt-1.5 whitespace-nowrap ${
                  isCurrent ? "text-foreground" : isCompleted ? "text-primary" : "text-muted-foreground"
                }`}>
                  {stage.label}
                </span>
                <span className={`text-[9px] whitespace-nowrap ${
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground/60"
                }`}>
                  {stage.aiLabel}
                </span>
              </div>

              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-18px] rounded-full overflow-hidden bg-secondary">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
