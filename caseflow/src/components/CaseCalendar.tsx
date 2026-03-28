import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { calendarEvents, eventTypeStyles, CalendarEvent } from "@/lib/mockData";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CaseCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-28"));

  const eventDates = useMemo(() => {
    const dates = new Map<string, CalendarEvent[]>();
    calendarEvents.forEach((e) => {
      const key = e.date;
      if (!dates.has(key)) dates.set(key, []);
      dates.get(key)!.push(e);
    });
    return dates;
  }, []);

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
          const style = eventTypeStyles[event.type];
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
