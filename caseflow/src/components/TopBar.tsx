import { Plus, User } from "lucide-react";
import { Role } from "@/lib/mockData";
import { motion } from "framer-motion";

const roleLabels: Record<Role, string> = {
  caseworker: "Case Worker",
  manager: "Manager",
  approver: "Approver",
  exec: "Executive",
};

interface TopBarProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onNewCase: () => void;
}

export default function TopBar({ role, onRoleChange, onNewCase }: TopBarProps) {
  const roles: Role[] = ["caseworker", "manager", "approver", "exec"];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Quorum
        </h1>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          AI Workflows
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-secondary rounded-lg p-0.5 gap-0.5">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                role === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>

        <button
          onClick={onNewCase}
          className="ml-3 flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Case
        </button>

        <button className="ml-1 w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center">
          <User size={16} className="text-sage-600" />
        </button>
      </div>
    </motion.header>
  );
}
