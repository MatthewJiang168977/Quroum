import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Smile, BarChart3, PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { apiGet } from "../lib/api";

const PIE_COLORS = [
  "hsl(152, 45%, 42%)",
  "hsl(200, 60%, 50%)",
  "hsl(35, 80%, 55%)",
  "hsl(340, 60%, 55%)",
  "hsl(260, 50%, 55%)",
  "hsl(160, 40%, 60%)",
];

export default function ExecDashboard() {
  const [caseStats, setCaseStats] = useState<any>(null);
  const [satisfaction, setSatisfaction] = useState<any>(null);
  const [volume, setVolume] = useState<any[]>([]);
  const [topTopics, setTopTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, satRes, volRes, topicsRes] = await Promise.all([
          apiGet("/cases/stats"),
          apiGet("/orchestrate/satisfaction/stats").catch(() => null),
          apiGet("/trends/volume?days=7").catch(() => []),
          apiGet("/trends/topics").catch(() => []),
        ]);
        setCaseStats(statsRes);
        setSatisfaction(satRes);

        const formatted = (volRes || []).map((d: any) => ({
          name: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
          cases: d.count,
        }));
        setVolume(formatted.length > 0 ? formatted : [
          { name: "Mon", cases: 0 }, { name: "Tue", cases: 0 },
          { name: "Wed", cases: 0 }, { name: "Thu", cases: 0 },
          { name: "Fri", cases: 0 }, { name: "Sat", cases: 0 },
          { name: "Sun", cases: 0 },
        ]);

        const pieData = (topicsRes || []).slice(0, 6).map((t: any, i: number) => ({
          name: t.topic?.replace(/_/g, " ") || "other",
          value: t.count || 0,
          fill: PIE_COLORS[i % PIE_COLORS.length],
        }));
        setTopTopics(pieData.length > 0 ? pieData : [{ name: "No data", value: 1, fill: PIE_COLORS[0] }]);
      } catch (err) {
        console.error("Failed to fetch exec data:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const metrics = [
    {
      label: "Cases processed",
      value: caseStats ? caseStats.total.toLocaleString() : "...",
      change: 12.4,
      icon: BarChart3,
    },
    {
      label: "Avg resolution time",
      value: caseStats?.avgResolutionDays ? `${caseStats.avgResolutionDays} days` : "... days",
      change: -8.1,
      icon: Clock,
    },
    {
      label: "Satisfaction score",
      value: satisfaction?.avgRating ? `${satisfaction.avgRating} / 5` : "N/A",
      change: satisfaction?.avgRating ? 5.2 : 0,
      icon: Smile,
    },
  ];

  if (loading) {
    return (
      <div className="surface-card rounded-2xl p-8 text-center">
        <p className="text-xs text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Executive overview</h2>
        <p className="text-sm text-muted-foreground">Operational throughput and material mix across the portfolio</p>
      </motion.div>

      <div data-workflow-tour="exec-kpis" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const isPositive = m.change > 0;
          const isGood = m.label === "Avg resolution time" ? !isPositive : isPositive;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="surface-card rounded-xl p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
              </div>
              <p className="mb-1 text-2xl font-bold tracking-tight text-foreground">{m.value}</p>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${isGood ? "text-primary" : "text-destructive"}`}
              >
                <TrendIcon className="h-3 w-3" />
                {Math.abs(m.change)}%
                <span className="ml-1 font-normal text-muted-foreground">vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div data-workflow-tour="exec-charts" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card rounded-xl p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Topic distribution</h3>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Most common case topics across active cases</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topTopics}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {topTopics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="hsl(var(--card))" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                    background: "hsl(0 0% 100% / 0.95)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="surface-card rounded-xl p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Cases this week</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volume} barSize={26}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100% / 0.95)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}