import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 flex items-center justify-center">
        <Settings className="w-8 h-8 text-slate-500" />
      </div>
      <h1 className="text-heading-2 font-bold text-foreground">Settings & Admin</h1>
      <p className="text-body-lg text-muted-foreground text-center max-w-md">
        Organization configuration, user management, roles, permissions, and integrations.
      </p>
      <span className="px-3 py-1.5 rounded-full bg-slate-500/10 text-slate-600 text-caption font-semibold">
        MFE: Coming Soon
      </span>
    </motion.div>
  );
}
