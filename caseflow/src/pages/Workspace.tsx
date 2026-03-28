import { useState, useMemo, useCallback } from "react";
import { CaseItem, mockCases, Role } from "@/lib/mockData";
import TopBar from "@/components/TopBar";
import CaseCard from "@/components/CaseCard";
import CaseDetail from "@/components/CaseDetail";
import IntakeModal from "@/components/IntakeModal";
import ExecDashboard from "@/components/ExecDashboard";
import TaskList from "@/components/TaskList";
import CaseCalendar from "@/components/CaseCalendar";
import OutcomePrediction from "@/components/OutcomePrediction";
import AIWorkbench from "@/components/AIWorkbench";
import ManagerAssignment from "@/components/ManagerAssignment";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { WORKFLOW_ORDER, WORKFLOW_STEP_MS } from "@/lib/workflowSequence";

const AGENT_LABELS: Record<Role, string> = {
  caseworker: "Intake & triage agent",
  manager: "Assignment optimizer",
  approver: "Draft & compliance agent",
  exec: "Executive signals agent",
};

export default function Workspace() {
  const [role, setRole] = useState<Role>("exec");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [workflowRunning, setWorkflowRunning] = useState(false);

  const filteredCases = useMemo(() => {
    switch (role) {
      case "caseworker":
        return mockCases.filter((c) => c.assignee === "Sarah Chen");
      case "approver":
        return mockCases.filter((c) => c.status === "needs-approval");
      default:
        return mockCases;
    }
  }, [role]);

  const handleAction = (action: string) => {
    toast.success(`Action: ${action}`, {
      description: `Case ${selectedCase?.id} — ${action} completed.`,
    });
    setSelectedCase(null);
  };

  const runWorkflow = useCallback(() => {
    setWorkflowRunning(true);
    WORKFLOW_ORDER.forEach((r, i) => {
      window.setTimeout(() => {
        setRole(r);
        toast.message(`Synced: ${AGENT_LABELS[r]}`, {
          description: `Stage ${i + 1} of ${WORKFLOW_ORDER.length} — workspace switched to match this agent.`,
        });
        if (i === WORKFLOW_ORDER.length - 1) {
          setWorkflowRunning(false);
          toast.success("Workflow run complete", {
            description: "All agents synced — executive view is active.",
          });
        }
      }, WORKFLOW_STEP_MS * i);
    });
  }, []);

  const roleHeading: Record<Role, { title: string; subtitle: string }> = {
    caseworker: { title: "My cases", subtitle: "Your assigned cases — intake, analyze, and work" },
    manager: { title: "Team assignment", subtitle: "AI-powered caseworker assignment and oversight" },
    approver: { title: "Review and predict", subtitle: "AI outcome predictions — approve or escalate" },
    exec: { title: "Executive overview", subtitle: "KPI dashboard and strategic oversight" },
  };

  return (
    <div className="min-h-screen pb-16">
      <TopBar
        role={role}
        onRoleChange={setRole}
        onNewCase={() => setIntakeOpen(true)}
        onRunWorkflow={runWorkflow}
        workflowRunning={workflowRunning}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{roleHeading[role].title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-balance-safe">{roleHeading[role].subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {role === "caseworker" && (
              <motion.div key="cw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <AIWorkbench />
                <div className="grid max-w-3xl grid-cols-1 gap-4">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                  {filteredCases.length === 0 && (
                    <div className="py-16 text-center">
                      <p className="text-sm text-muted-foreground">No cases assigned to you.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {role === "manager" && (
              <motion.div key="mgr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ManagerAssignment />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                </div>
              </motion.div>
            )}

            {role === "approver" && (
              <motion.div key="apr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <OutcomePrediction />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                  {filteredCases.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                      <p className="text-sm text-muted-foreground">No cases awaiting approval.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {role === "exec" && (
              <motion.div key="exec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ExecDashboard />
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <TaskList role={role} />
            <CaseCalendar />
          </div>
        </div>
      </main>

      <CaseDetail caseItem={selectedCase} onClose={() => setSelectedCase(null)} onAction={handleAction} />
      <IntakeModal isOpen={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}
