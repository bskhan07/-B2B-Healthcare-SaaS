import { motion } from "framer-motion";
import {
  Users,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  UserPlus,
  CalendarPlus,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notificationService } from "@/lib/notifications";
import { useState, useEffect } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } },
};

// Mock KPI data
const kpiCards = [
  {
    id: "total-patients",
    title: "Total Patients",
    value: "12,847",
    change: "+12.5%",
    trend: "up" as const,
    period: "vs last month",
    icon: Users,
    gradient: "from-primary to-primary-700",
    bgGlow: "bg-primary/10",
  },
  {
    id: "appointments-today",
    title: "Appointments Today",
    value: "48",
    change: "+8.2%",
    trend: "up" as const,
    period: "vs last week",
    icon: CalendarDays,
    gradient: "from-success to-success-700",
    bgGlow: "bg-success/10",
  },
  {
    id: "revenue",
    title: "Revenue (MTD)",
    value: "$284,500",
    change: "+23.1%",
    trend: "up" as const,
    period: "vs last month",
    icon: DollarSign,
    gradient: "from-accent to-accent-700",
    bgGlow: "bg-accent/10",
  },
  {
    id: "pending-claims",
    title: "Pending Claims",
    value: "23",
    change: "-5.4%",
    trend: "down" as const,
    period: "vs last week",
    icon: FileText,
    gradient: "from-warning to-warning-700",
    bgGlow: "bg-warning/10",
  },
];

// Mock upcoming appointments
const upcomingAppointments = [
  {
    id: "1",
    patientName: "James Wilson",
    type: "Consultation",
    time: "09:00 AM",
    status: "confirmed",
    avatar: "JW",
  },
  {
    id: "2",
    patientName: "Emily Parker",
    type: "Follow Up",
    time: "09:30 AM",
    status: "confirmed",
    avatar: "EP",
  },
  {
    id: "3",
    patientName: "Michael Brown",
    type: "Lab Test",
    time: "10:00 AM",
    status: "scheduled",
    avatar: "MB",
  },
  {
    id: "4",
    patientName: "Sarah Miller",
    type: "Routine Checkup",
    time: "10:30 AM",
    status: "confirmed",
    avatar: "SM",
  },
  {
    id: "5",
    patientName: "David Lee",
    type: "Emergency",
    time: "11:00 AM",
    status: "in_progress",
    avatar: "DL",
  },
];

// Mock recent activity
const recentActivity = [
  {
    id: "1",
    action: "New patient registered",
    detail: "Olivia Thompson",
    time: "5 min ago",
    icon: UserPlus,
    color: "text-emerald-500",
  },
  {
    id: "2",
    action: "Appointment booked",
    detail: "Dr. Chen with Michael Brown",
    time: "12 min ago",
    icon: CalendarPlus,
    color: "text-blue-500",
  },
  {
    id: "3",
    action: "Invoice paid",
    detail: "#INV-2847 — $1,250.00",
    time: "25 min ago",
    icon: DollarSign,
    color: "text-violet-500",
  },
  {
    id: "4",
    action: "Lab results ready",
    detail: "Blood panel for James Wilson",
    time: "42 min ago",
    icon: Activity,
    color: "text-amber-500",
  },
  {
    id: "5",
    action: "Claim submitted",
    detail: "#CLM-9821 — Blue Cross",
    time: "1 hr ago",
    icon: FileText,
    color: "text-cyan-500",
  },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_progress: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function DashboardPage() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  // Poll for permission changes (e.g., if user unblocks in settings)
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof Notification !== "undefined" && Notification.permission !== notificationPermission) {
        setNotificationPermission(Notification.permission);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notificationPermission]);

  const handleEnableNotifications = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      notificationService.showLocalNotification(
        "Notifications Enabled",
        "You will now receive important updates about your practice."
      );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ─── Notification Onboarding ──────────────────── */}
      {notificationPermission !== "granted" && (
        <motion.div
          variants={itemVariants}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 sm:p-6",
            notificationPermission === "denied" 
              ? "bg-red-500/10 border-red-500/20" 
              : "bg-primary/10 border-primary/20"
          )}
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                notificationPermission === "denied" ? "bg-red-500 shadow-red-500/20" : "bg-primary shadow-primary/20"
              )}>
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {notificationPermission === "denied" ? "Action Required: Notifications Blocked" : "Stay Updated!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {notificationPermission === "denied" 
                    ? "Notifications are blocked by your browser. Click the lock icon (🔒) or settings icon in your browser's address bar next to the URL to allow notifications again."
                    : "Enable browser notifications to receive real-time alerts for new patients, upcoming appointments, and critical lab results."}
                </p>
              </div>
            </div>
            {notificationPermission !== "denied" && (
              <button
                onClick={handleEnableNotifications}
                className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-md"
              >
                Enable Notifications
              </button>
            )}
          </div>
          {/* Background decoration */}
          <div className={cn(
            "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20",
            notificationPermission === "denied" ? "bg-red-500" : "bg-primary"
          )} />
        </motion.div>
      )}
      {/* ─── Page Header ──────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-1 font-bold text-foreground">
            Good Morning, Dr. Sarah 👋
          </h1>
          <p className="text-body-lg text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your practice today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Today: {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </motion.div>

      {/* ─── KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <motion.div
            key={kpi.id}
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
              "relative overflow-hidden rounded-xl",
              "bg-card border border-border/50",
              "p-5 cursor-pointer",
              "shadow-elevation-1 hover:shadow-elevation-3",
              "transition-shadow duration-300"
            )}
          >
            {/* Background glow */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30",
                kpi.bgGlow
              )}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-caption text-muted-foreground font-medium uppercase tracking-wide">
                  {kpi.title}
                </p>
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br shadow-sm",
                    kpi.gradient
                  )}
                >
                  <kpi.icon className="w-4.5 h-4.5 text-white" />
                </div>
              </div>

              <p className="text-display font-bold text-foreground tracking-tight">
                {kpi.value}
              </p>

              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-caption font-semibold",
                    kpi.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                  )}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {kpi.change}
                </span>
                <span className="text-caption text-muted-foreground">
                  {kpi.period}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Content Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-2 rounded-xl bg-card border border-border/50 shadow-elevation-1"
        >
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h2 className="text-heading-4 font-semibold text-foreground">
                Upcoming Appointments
              </h2>
              <p className="text-caption text-muted-foreground mt-0.5">
                Today&apos;s schedule overview
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption font-medium text-primary hover:bg-primary/5 transition-colors">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border/50">
            {upcomingAppointments.map((appt, idx) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {appt.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {appt.patientName}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {appt.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {appt.time}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                      statusColors[appt.status]
                    )}
                  >
                    {appt.status.replace("_", " ")}
                  </span>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-card border border-border/50 shadow-elevation-1"
        >
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h2 className="text-heading-4 font-semibold text-foreground">
                Recent Activity
              </h2>
              <p className="text-caption text-muted-foreground mt-0.5">
                Latest updates
              </p>
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-1">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    "bg-muted/80"
                  )}
                >
                  <activity.icon className={cn("w-4 h-4", activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-caption text-muted-foreground truncate">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Quick Stats Bar ──────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Avg. Wait Time", value: "14 min", icon: Clock, color: "text-blue-500" },
          { label: "Patient Satisfaction", value: "94.2%", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Claim Approval Rate", value: "87.5%", icon: Activity, color: "text-violet-500" },
          { label: "Revenue Growth", value: "+18.3%", icon: TrendingUp, color: "text-amber-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-elevation-1"
          >
            <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <p className="text-heading-4 font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-caption text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
