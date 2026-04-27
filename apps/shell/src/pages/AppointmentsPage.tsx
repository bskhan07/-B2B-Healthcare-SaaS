import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
        <CalendarDays className="w-8 h-8 text-emerald-500" />
      </div>
      <h1 className="text-heading-2 font-bold text-foreground">Appointments & Scheduling</h1>
      <p className="text-body-lg text-muted-foreground text-center max-w-md">
        Calendar view, scheduling workflows, and availability management module.
      </p>
      <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-caption font-semibold">
        MFE: Coming Soon
      </span>
    </motion.div>
  );
}
