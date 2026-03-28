import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Link2 } from "lucide-react";
import { apiGet } from "../lib/api";

interface TaskListProps {
  role: string;
}

const roleDescriptions: Record<string, string> = {
  caseworker: "Your fieldwork & follow-ups",
  manager: "Assignments & oversight",
  approver: "Approvals & sign-offs",
  exec: "Strategic actions",
};

interface Task {
  id: string;
  label: string;
  done: boolean;
  caseId?: string;
  caseNumber?: string;
  dueDate?: string;
}

export default function TaskList({ role }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const casesRes = await apiGet("/cases");
        const cases = casesRes.cases || [];

        // Generate tasks from real case data
        const generated: Task[] = [];

        cases.forEach((c: any) => {
          // Overdue cases become urgent tasks
          if (c.isOverdue) {
            generated.push({
              id: `overdue-${c._id}`,
              label: `OVERDUE: ${c.subject}`,
              done: false,
              caseId: c._id,
              caseNumber: c.caseNumber || c._id.slice(-6),
              dueDate: c.deadline,
            });
          }

          // Next steps become tasks
          if (c.nextSteps && c.status !== "resolved" && c.status !== "closed") {
            generated.push({
              id: `next-${c._id}`,
              label: c.nextSteps,
              done: false,
              caseId: c._id,
              caseNumber: c.caseNumber || c._id.slice(-6),
              dueDate: c.deadline,
            });
          }

          // Resolved cases are completed tasks
          if (c.status === "resolved" || c.status === "closed") {
            generated.push({
              id: `resolved-${c._id}`,
              label: `Case resolved: ${c.subject}`,
              done: true,
              caseId: c._id,
              caseNumber: c.caseNumber || c._id.slice(-6),
            });
          }
        });

        setTasks(generated);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
      setLoading(false);
    }
    fetchTasks();
  }, [role]);

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  if (loading) {
    return (
      <div className="glass rounded-xl p-5">
        <p className="text-xs text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Your Tasks</h3>
          <p className="text-xs text-muted-foreground">{roleDescriptions[role] || "Tasks & follow-ups"}</p>
        </div>
        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {pending.length} pending
        </span>
      </div>

      <div className="space-y-1.5">
        {pending.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer group"
            onClick={() => toggle(task.id)}
          >
            <Circle size={16} className="text-sage-400 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{task.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {task.caseNumber && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Link2 size={10} />
                    {task.caseNumber}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {completed.length > 0 && (
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-xs text-muted-foreground mb-1.5">{completed.length} completed</p>
            {completed.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 p-2 rounded-lg opacity-50 cursor-pointer"
                onClick={() => toggle(task.id)}
              >
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <p className="text-sm text-foreground line-through">{task.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}