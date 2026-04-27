import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function MessagingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-cyan-500" />
      </div>
      <h1 className="text-heading-2 font-bold text-foreground">Messaging & Notifications</h1>
      <p className="text-body-lg text-muted-foreground text-center max-w-md">
        In-app messaging, notification center, and real-time communication module.
      </p>
      <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 text-caption font-semibold">
        MFE: Coming Soon
      </span>
    </motion.div>
  );
}
