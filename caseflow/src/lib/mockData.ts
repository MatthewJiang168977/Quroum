export type Priority = "high" | "medium" | "low";
export type Status = "pending" | "in-progress" | "needs-approval" | "resolved";
export type Role = "caseworker" | "manager" | "approver" | "exec";
export type Taxonomy = "Housing" | "Environmental" | "Benefits" | "Infrastructure" | "Compliance" | "Permits" | "Employment" | "Civil Rights";

export const taxonomyColors: Record<Taxonomy, { bg: string; text: string; border: string }> = {
  Housing: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Environmental: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Benefits: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Infrastructure: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  Compliance: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Permits: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Employment: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "Civil Rights": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

export interface CaseItem {
  id: string;
  title: string;
  priority: Priority;
  assignee: string | null;
  status: Status;
  topic: Taxonomy;
  problem: string;
  aiReason: string;
  recommendedAssignee: string;
  assigneeReason: string;
  nextStep: string;
  createdAt: string;
  notes: string[];
  predictedExposure: number;
  settlementRange: [number, number];
  outcomeConfidence: number;
  riskScore: number;
}

export interface RoleTask {
  id: string;
  label: string;
  done: boolean;
  caseId?: string;
  dueDate?: string;
}

export const roleTasks: Record<Role, RoleTask[]> = {
  caseworker: [
    { id: "t1", label: "Follow up on QR-1042 inspection", done: false, caseId: "QR-1042", dueDate: "2026-03-28" },
    { id: "t2", label: "Upload evidence for QR-1046", done: false, caseId: "QR-1046", dueDate: "2026-03-29" },
    { id: "t3", label: "Contact tenant association", done: true, caseId: "QR-1042" },
    { id: "t4", label: "Complete site visit notes", done: false, dueDate: "2026-03-30" },
  ],
  manager: [
    { id: "t5", label: "Review AI assignment for QR-1043", done: false, caseId: "QR-1043", dueDate: "2026-03-28" },
    { id: "t6", label: "Approve fast-track QR-1044", done: false, caseId: "QR-1044", dueDate: "2026-03-28" },
    { id: "t7", label: "Reassign unassigned high-priority cases", done: false, dueDate: "2026-03-28" },
    { id: "t8", label: "Weekly caseload review", done: true },
    { id: "t9", label: "Escalation report for housing violations", done: false, dueDate: "2026-03-29" },
  ],
  approver: [
    { id: "t10", label: "Review Rodriguez family benefits", done: false, caseId: "QR-1044", dueDate: "2026-03-28" },
    { id: "t11", label: "Sign off on inspection results", done: false, dueDate: "2026-03-29" },
    { id: "t12", label: "Verify compliance documentation", done: true },
  ],
  exec: [
    { id: "t13", label: "Review monthly KPI report", done: false, dueDate: "2026-03-30" },
    { id: "t14", label: "Approve budget for Q2 hiring", done: false, dueDate: "2026-04-01" },
    { id: "t15", label: "Sign off on policy update", done: true },
  ],
};

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  caseId?: string;
  type: "deadline" | "hearing" | "inspection" | "review" | "meeting";
}

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Emergency inspection — 14th St", date: "2026-03-28", caseId: "QR-1042", type: "inspection" },
  { id: "e2", title: "Benefits review deadline", date: "2026-03-28", caseId: "QR-1044", type: "deadline" },
  { id: "e3", title: "Noise complaint hearing", date: "2026-03-29", caseId: "QR-1043", type: "hearing" },
  { id: "e4", title: "ADA site assessment", date: "2026-03-29", caseId: "QR-1046", type: "inspection" },
  { id: "e5", title: "Weekly team standup", date: "2026-03-30", type: "meeting" },
  { id: "e6", title: "Permit follow-up", date: "2026-03-31", caseId: "QR-1047", type: "review" },
  { id: "e7", title: "Housing violation review", date: "2026-04-01", caseId: "QR-1042", type: "review" },
  { id: "e8", title: "Quarterly case audit", date: "2026-04-03", type: "meeting" },
];

export const eventTypeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  deadline: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  hearing: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  inspection: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  meeting: { bg: "bg-sage-100", text: "text-sage-700", dot: "bg-sage-500" },
};

export const mockCases: CaseItem[] = [
  {
    id: "QR-1042",
    title: "Housing Code Violation — 14th St Complex",
    priority: "high",
    assignee: "Sarah Chen",
    status: "in-progress",
    topic: "Housing",
    problem: "Tenant reports persistent mold and water damage in units 3A-3F. Building inspection overdue by 90 days.",
    aiReason: "Urgent housing violation affecting 6 units. Health risk escalation likely within 2 weeks.",
    recommendedAssignee: "Sarah Chen",
    assigneeReason: "12 similar cases resolved. Currently available. Highest success rate in housing violations.",
    nextStep: "Schedule emergency inspection + notify building management",
    createdAt: "2026-03-27",
    notes: ["Tenant association filed formal complaint", "Previous violation on record from 2025"],
    predictedExposure: 285000,
    settlementRange: [120000, 210000],
    outcomeConfidence: 87,
    riskScore: 92,
  },
  {
    id: "QR-1043",
    title: "Noise Complaint — Industrial Zone B",
    priority: "medium",
    assignee: null,
    status: "pending",
    topic: "Environmental",
    problem: "Multiple residents report excessive noise from construction site operating outside permitted hours.",
    aiReason: "Repeated violation. 3rd complaint this month. Regulatory action threshold reached.",
    recommendedAssignee: "Marcus Webb",
    assigneeReason: "Environmental specialist. Handled 8 similar industrial noise cases.",
    nextStep: "Assign + issue warning notice",
    createdAt: "2026-03-28",
    notes: [],
    predictedExposure: 45000,
    settlementRange: [15000, 30000],
    outcomeConfidence: 72,
    riskScore: 54,
  },
  {
    id: "QR-1044",
    title: "Benefits Application — Rodriguez Family",
    priority: "medium",
    assignee: "Priya Patel",
    status: "needs-approval",
    topic: "Benefits",
    problem: "Family of 5 applying for emergency housing assistance. Income verification completed.",
    aiReason: "Meets all eligibility criteria. Fast-track eligible due to minor children.",
    recommendedAssignee: "Priya Patel",
    assigneeReason: "Benefits specialist. Currently managing similar caseload.",
    nextStep: "Manager approval required for fast-track processing",
    createdAt: "2026-03-26",
    notes: ["Income docs verified", "School enrollment confirmed for 3 children"],
    predictedExposure: 18000,
    settlementRange: [12000, 18000],
    outcomeConfidence: 94,
    riskScore: 22,
  },
  {
    id: "QR-1045",
    title: "Street Light Outage — Oak Ave",
    priority: "low",
    assignee: "James Torres",
    status: "in-progress",
    topic: "Infrastructure",
    problem: "Cluster of 4 street lights non-functional on Oak Avenue between 5th and 8th Street.",
    aiReason: "Standard maintenance request. No safety incidents reported yet.",
    recommendedAssignee: "James Torres",
    assigneeReason: "Infrastructure team lead. Area falls in assigned zone.",
    nextStep: "Dispatch maintenance crew",
    createdAt: "2026-03-25",
    notes: ["Work order created"],
    predictedExposure: 8500,
    settlementRange: [3000, 6000],
    outcomeConfidence: 91,
    riskScore: 12,
  },
  {
    id: "QR-1046",
    title: "Accessibility Complaint — City Hall Annex",
    priority: "high",
    assignee: null,
    status: "pending",
    topic: "Compliance",
    problem: "Wheelchair ramp at south entrance non-compliant with ADA standards. Visitor reported injury.",
    aiReason: "ADA violation with injury report. Legal liability risk. Immediate remediation required.",
    recommendedAssignee: "Sarah Chen",
    assigneeReason: "Compliance certified. Fastest response time for ADA cases.",
    nextStep: "Assign + arrange emergency site assessment",
    createdAt: "2026-03-28",
    notes: ["Incident report filed", "Photo evidence uploaded"],
    predictedExposure: 520000,
    settlementRange: [180000, 380000],
    outcomeConfidence: 78,
    riskScore: 96,
  },
  {
    id: "QR-1047",
    title: "Permit Delay — Community Garden Project",
    priority: "low",
    assignee: "Marcus Webb",
    status: "in-progress",
    topic: "Permits",
    problem: "Community garden permit application pending for 45 days. Standard processing time is 21 days.",
    aiReason: "Overdue but low urgency. No dependencies or escalation triggers.",
    recommendedAssignee: "Marcus Webb",
    assigneeReason: "Currently assigned. Has context on the application.",
    nextStep: "Follow up with permits office",
    createdAt: "2026-03-20",
    notes: ["Applicant notified of delay"],
    predictedExposure: 2500,
    settlementRange: [0, 1500],
    outcomeConfidence: 96,
    riskScore: 5,
  },
];

export const execMetrics = {
  casesProcessed: { value: 1247, change: 12.4 },
  avgResolutionTime: { value: 3.2, unit: "days", change: -8.1 },
  satisfactionScore: { value: 4.6, max: 5, change: 5.2 },
};

export const chartData = {
  weekly: [
    { name: "Mon", cases: 32 },
    { name: "Tue", cases: 45 },
    { name: "Wed", cases: 28 },
    { name: "Thu", cases: 51 },
    { name: "Fri", cases: 39 },
    { name: "Sat", cases: 12 },
    { name: "Sun", cases: 8 },
  ],
};
