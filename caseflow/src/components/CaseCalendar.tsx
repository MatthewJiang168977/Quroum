import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { apiGet } from "../lib/api";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  caseId?: string;
  type: string;
}

const eventTypeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  deadline: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  hearing: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  inspection: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  meeting: { bg: "bg-sage-100", text: "text-sage-700", dot: "bg-sage-500" },
  case: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const defaultStyle = { bg: "bg-sage-100", text: "text-sage-700", dot: "bg-sage-500" };

export default function CaseCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await apiGet("/cases");
        const cases = res.cases || [];

        const generated: CalendarEvent[] = [];

        cases.forEach((c: any) => {
          // Deadlines become calendar events
          if (c.deadline) {
            generated.push({
              id: `deadline-${c._id}`,
              title: `Deadline: ${c.subject?.slice(0, 40)}`,
              date: format(new Date(c.deadline), "yyyy-MM-dd"),
              caseId: c.caseNumber || c._id?.slice(-6),
              type: c.isOverdue ? "deadline" : "review",
            });
          }

          // Case opened dates
          if (c.openedAt) {
            generated.push({
              id: `opened-${c._id}`,
              title: `Case opened: ${c.constituent}`,
              date: format(new Date(c.openedAt), "yyyy-MM-dd"),
              caseId: c.caseNumber || c._id?.slice(-6),
              type: "case",
            });
          }
        });

        setEvents(generated);
      } catch (err) {
        console.error("Failed to fetch calendar events:", err);
      }
    }
    fetchEvents();
  }, []);

  const eventDates = useMemo(() => {
    const dates = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const key = e.date;
      if (!dates.has(key)) dates.set(key, []);
      dates.get(key)!.push(e);
    });
    return dates;
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return eventDates.get(key) || [];
  }, [selectedDate, eventDates]);

  const hasEvents = (date: Date) => {
    return eventDates.has(format(date, "yyyy-MM-dd"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-3">Calendar</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className={cn("p-0 pointer-events-auto")}
        modifiers={{ hasEvent: (date) => hasEvents(date) }}
        modifiersClassNames={{ hasEvent: "font-bold text-primary" }}
      />
      <div className="mt-4 space-y-2">
        {selectedDate && (
          <p className="text-xs font-medium text-muted-foreground">
            {format(selectedDate, "EEEE, MMM d")}
          </p>
        )}
        {selectedEvents.length === 0 && selectedDate && (
          <p className="text-xs text-muted-foreground">No events</p>
        )}
        {selectedEvents.map((event) => {
          const style = eventTypeStyles[event.type] || defaultStyle;
          return (
            <div
              key={event.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg ${style.bg}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
              <div className="min-w-0">
                <p className={`text-xs font-medium ${style.text}`}>{event.title}</p>
                {event.caseId && (
                  <p className="text-xs text-muted-foreground">{event.caseId}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}