import { useState, useEffect } from "react";
import {
  Bell,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, useThemeStore } from "@/stores";
import { motion } from "framer-motion";
import { notificationService } from "@/lib/notifications";

interface TopBarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export default function TopBar({ sidebarCollapsed, onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useThemeStore();
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 w-full",
        "bg-background/80 backdrop-blur-xl transition-all duration-300",
        scrolled ? "border-b border-border/80 shadow-sm" : "border-b border-border/50",
        "flex items-center justify-between px-6 md:px-8",
        // Desktop positioning: account for sidebar
        sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[260px]",
        // Mobile positioning: full width
        "pl-0"
      )}
    >
      {/* ─── Left: Menu ────────────────── */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* ─── Right: Actions ─────────────────────────── */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted/50 transition-colors duration-200"
          )}
        >
          {theme === "dark" ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </motion.button>

        {/* Notifications */}
        <button
          onClick={async () => {
            await notificationService.showLocalNotification(
              "System Update",
              "Service workers are now active and ready to deliver real-time updates."
            );
          }}
          className={cn(
            "relative w-9 h-9 rounded-lg flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted/50 transition-colors duration-200"
          )}
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-background md:ring-background/80" />
        </button>
      </div>
    </header>
  );
}
