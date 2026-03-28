import type { Role } from "@/lib/mockData";

/** Order used by Run workflow to step the UI through each agent lens */
export const WORKFLOW_ORDER: Role[] = ["caseworker", "manager", "approver", "exec"];

export const WORKFLOW_STEP_MS = 700;
