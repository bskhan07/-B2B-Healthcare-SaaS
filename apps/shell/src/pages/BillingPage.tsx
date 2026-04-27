import { motion } from "framer-motion";
import { Receipt } from "lucide-react";

export default function BillingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
        <Receipt className="w-8 h-8 text-violet-500" />
      </div>
      <h1 className="text-heading-2 font-bold text-foreground">Billing & Claims</h1>
      <p className="text-body-lg text-muted-foreground text-center max-w-md">
        Invoice management, insurance claims tracking, and payment processing module.
      </p>
      <span className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 text-caption font-semibold">
        MFE: Coming Soon
      </span>
    </motion.div>
  );
}
