import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@healthcare/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  onBack?: () => void;
}

export function PageLayout({
  children,
  title,
  subtitle,
  actions,
  className,
  onBack,
}: PageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("space-y-6", className)}
    >
      {/* Header Section */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="mt-1 p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
            )}
            <div>
              {title && (
                <h1 className="text-heading-2 font-bold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-body-lg text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Grid component for responsive layouts.
 * Use this to ensure cards and sections stack correctly on mobile.
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = 3,
  className,
}: ResponsiveGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 md:gap-6", gridCols[cols], className)}>
      {children}
    </div>
  );
}
