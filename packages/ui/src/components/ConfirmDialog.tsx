import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, AlertTriangle, Info, HelpCircle } from "lucide-react";
import { cn } from "@healthcare/utils";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive" | "warning" | "info";
  isLoading?: boolean;
}

const variants = {
  primary: {
    icon: HelpCircle,
    iconClass: "bg-primary/10 text-primary",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
  },
  destructive: {
    icon: AlertCircle,
    iconClass: "bg-destructive/10 text-destructive",
    buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-warning/10 text-warning",
    buttonClass: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-warning/20",
  },
  info: {
    icon: Info,
    iconClass: "bg-blue-500/10 text-blue-500",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20",
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  // Prevent scrolling when modal is open removed to satisfy user request for visible scrollbars

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border/50 shadow-glass-strong"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5", config.iconClass)}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-body text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/50 transition-all active:scale-[0.98]"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 h-11 rounded-xl shadow-md",
                    "text-sm font-semibold transition-all active:scale-[0.98]",
                    "flex items-center justify-center gap-2",
                    config.buttonClass,
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  ) : (
                    confirmLabel
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
