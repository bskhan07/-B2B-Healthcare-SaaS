import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/config/nav-config";
import { useAuthStore } from "@/stores";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
  onLogout,
}: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <>
      {/* ─── Mobile Overlay ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col",
          "bg-sidebar text-sidebar-foreground",
          "border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out",
          // Desktop width
          collapsed ? "lg:w-[68px]" : "lg:w-[260px]",
          // Mobile visibility and width
          mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ─── Logo Area ──────────────────────────────── */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <AnimatePresence mode="wait">
              {(!collapsed || mobileOpen) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-base font-bold text-sidebar-foreground tracking-tight">
                    HealthCare
                  </h1>
                  <p className="text-[10px] text-sidebar-foreground/50 -mt-0.5 font-medium tracking-wider uppercase">
                    SaaS Platform
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Navigation Groups ──────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navigationConfig.map((group) => (
            <div key={group.title}>
              <AnimatePresence mode="wait">
                {(!collapsed || mobileOpen) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-overline text-sidebar-foreground/40 uppercase tracking-widest px-3 mb-2"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => mobileOpen && onMobileClose()}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          "text-sm font-medium transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/70"
                        )}
                        title={collapsed && !mobileOpen ? item.label : undefined}
                      >
                        {/* Active indicator pill */}
                        <div
                          className={cn(
                            "absolute left-0 w-[3px] rounded-r-full transition-all duration-200",
                            isActive
                              ? "h-6 bg-primary"
                              : "h-0 bg-transparent"
                          )}
                        />

                        <item.icon
                          className={cn(
                            "flex-shrink-0 w-5 h-5 transition-colors duration-200",
                            isActive
                              ? "text-primary"
                              : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                          )}
                        />

                        <AnimatePresence mode="wait">
                          {(!collapsed || mobileOpen) && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Badge */}
                        {item.badge && (!collapsed || mobileOpen) && (
                          <span className="ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-[11px] font-semibold text-primary-foreground flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                        {item.badge && collapsed && !mobileOpen && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ─── User Section ───────────────────────────── */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg",
              "hover:bg-sidebar-accent transition-colors duration-200 cursor-pointer"
            )}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || "U"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {(!collapsed || mobileOpen) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.firstName || "Guest"}
                  </p>
                  <p className="text-[11px] text-sidebar-foreground/50 truncate">
                    {user?.email || "guest@demo.com"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {(!collapsed || mobileOpen) && (
              <ChevronsUpDown className="w-4 h-4 text-sidebar-foreground/30 flex-shrink-0" />
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={cn(
              "w-full flex items-center gap-3 p-2.5 rounded-lg",
              "text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-500/10",
              "transition-all duration-200 group"
            )}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {(!collapsed || mobileOpen) && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>

        {/* ─── Collapse Toggle (Desktop Only) ─────────── */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute top-20 -right-3 z-50 hidden lg:flex",
            "w-6 h-6 rounded-full",
            "bg-card border border-border shadow-elevation-2",
            "items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "transition-all duration-200 hover:shadow-elevation-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>
    </>
  );
}
