import { useState, useMemo } from "react";
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
import WorkflowProgress from "@/components/WorkflowProgress";
import ManagerAssignment from "@/components/ManagerAssignment";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Index() {
  const [role, setRole] = useState<Role>("caseworker");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);

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

  const roleHeading: Record<Role, { title: string; subtitle: string }> = {
    caseworker: { title: "My Cases", subtitle: "Your assigned cases — intake, analyze & work" },
    manager: { title: "Team Assignment", subtitle: "AI-powered caseworker assignment & oversight" },
    approver: { title: "Review & Predict", subtitle: "AI outcome predictions — approve or escalate" },
    exec: { title: "Executive Overview", subtitle: "KPI dashboard & strategic oversight" },
  };

  return (
    <div className="min-h-screen">
      <TopBar role={role} onRoleChange={setRole} onNewCase={() => setIntakeOpen(true)} />

      <main className="max-w-7xl mx-auto px-5 py-6 sm:px-6">
        {/* Unified Workflow Progress Bar */}
        <WorkflowProgress role={role} />

        <motion.div
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h2 className="text-lg font-semibold text-foreground">{roleHeading[role].title}</h2>
          <p className="text-sm text-muted-foreground">{roleHeading[role].subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content — unique per role */}
          <div>
            {role === "caseworker" && (
              <motion.div key="cw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <AIWorkbench />
                <div className="grid grid-cols-1 gap-4 max-w-3xl">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                  {filteredCases.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-sm text-muted-foreground">No cases assigned to you.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {role === "manager" && (
              <motion.div key="mgr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ManagerAssignment />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                </div>
              </motion.div>
            )}

            {role === "approver" && (
              <motion.div key="apr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <OutcomePrediction />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCases.map((c, i) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} index={i} />
                  ))}
                  {filteredCases.length === 0 && (
                    <div className="col-span-2 text-center py-16">
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

          {/* Sidebar */}
          <div className="space-y-4">
            <TaskList role={role} />
            <CaseCalendar />
          </div>
        </div>
      </main>

      <CaseDetail
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onAction={handleAction}
      />
      <IntakeModal isOpen={intakeOpen} onClose={() => setIntakeOpen(false)} />
    </div>
  );
}
