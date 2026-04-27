import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Filter,
  Download,
  Activity,
  Plus,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@healthcare/ui";

// Mock Data
const revenueData = [
  { month: "Jan", revenue: 45000, patients: 850 },
  { month: "Feb", revenue: 52000, patients: 920 },
  { month: "Mar", revenue: 48000, patients: 880 },
  { month: "Apr", revenue: 61000, patients: 1100 },
  { month: "May", revenue: 55000, patients: 980 },
  { month: "Jun", revenue: 67000, patients: 1250 },
  { month: "Jul", revenue: 75000, patients: 1400 },
];

const departmentData = [
  { name: "Cardiology", appointments: 420, load: 85 },
  { name: "Neurology", appointments: 310, load: 70 },
  { name: "Pediatrics", appointments: 580, load: 95 },
  { name: "Orthopedics", appointments: 290, load: 60 },
  { name: "General Medicine", appointments: 850, load: 90 },
];

const demographicData = [
  { name: "0-18", value: 15, color: "#BFDBFE" }, // primary-200
  { name: "19-40", value: 35, color: "#3B82F6" }, // primary-500
  { name: "41-60", value: 30, color: "#1D4ED8" }, // primary-700
  { name: "60+", value: 20, color: "#1E3A8A" }, // primary-900
];

const appointmentTrends = [
  { day: "Mon", expected: 45, actual: 48 },
  { day: "Tue", expected: 50, actual: 42 },
  { day: "Wed", expected: 48, actual: 55 },
  { day: "Thu", expected: 52, actual: 50 },
  { day: "Fri", expected: 60, actual: 64 },
  { day: "Sat", expected: 30, actual: 28 },
  { day: "Sun", expected: 20, actual: 22 },
];

const COLORS = demographicData.map(d => d.color);

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    const toastId = toast.loading("Preparing health insights report...");
    
    setTimeout(() => {
      // Generate CSV content
      const csvContent = [
        ["Month", "Revenue", "Patients"],
        ...revenueData.map(d => [d.month, d.revenue, d.patients])
      ].map(e => e.join(",")).join("\n");

      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `healthcare_analytics_${selectedRange.toLowerCase().replace(/ /g, "_")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast.dismiss(toastId);
    }, 2000);
  };

  const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 6 Months", "Last 1 Year", "All Time"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ─── Page Header ──────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-1 font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-body-lg text-muted-foreground mt-1">
            Real-time performance metrics and patient health insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm font-medium interactive">
                <Filter className="w-4 h-4" />
                {selectedRange}
              </button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-48">
              {timeRanges.map((range) => (
                <DropdownItem 
                  key={range} 
                  onClick={() => {
                    setSelectedRange(range);
                    toast.success(`Analytics updated for ${range}`);
                  }}
                  className="flex items-center justify-between"
                >
                  {range}
                  {selectedRange === range && <Check className="w-4 h-4 text-primary" />}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all shadow-elevation-2 shadow-primary/20",
              "hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            <Download className={cn("w-4 h-4", isExporting && "animate-bounce")} />
            {isExporting ? "Exporting..." : "Export Report"}
          </button>
        </div>
      </motion.div>

      {/* ─── KPI Cards ────────────────────────────────── */}
      <div key={selectedRange} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: selectedRange === "All Time" ? "$2,412,500" : "$412,500", trend: "+14.2%", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Patients", value: selectedRange === "All Time" ? "42,942" : "8,942", trend: "+3.1%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg. Visit Duration", value: "34m", trend: "-5.2%", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Satisfaction Rate", value: "96.4%", trend: "+1.5%", icon: Activity, color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border/50 shadow-elevation-1 card-hover"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", kpi.bg)}>
              <kpi.icon className={cn("w-6 h-6", kpi.color)} />
            </div>
            <div>
              <p className="text-caption font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-heading-2 font-bold text-foreground">{kpi.value}</h3>
                <span className={cn("text-caption font-semibold", kpi.trend.startsWith("+") ? "text-emerald-600" : "text-red-500")}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Main Charts ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Growth Chart */}
        <motion.div variants={itemVariants} className="glass dark:bg-card/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-heading-4 font-semibold text-foreground">Revenue Growth</h3>
              <p className="text-caption text-muted-foreground mt-0.5">Revenue and patient volume trend</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-md bg-muted text-[11px] font-semibold text-foreground">6 Months</button>
              <button className="px-3 py-1 rounded-md text-[11px] font-semibold text-muted-foreground hover:bg-muted/50">1 Year</button>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Appointment Density - Weekly */}
        <motion.div variants={itemVariants} className="glass dark:bg-card/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-heading-4 font-semibold text-foreground">Appointment Performance</h3>
              <p className="text-caption text-muted-foreground mt-0.5">Actual vs Predicted appointments</p>
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors">
              <TrendingUp className="w-4 h-4 text-primary" />
            </button>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="expected" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Workload Bar Chart */}
        <motion.div variants={itemVariants} className="glass dark:bg-card/40 rounded-2xl p-6">
          <h3 className="text-heading-4 font-semibold text-foreground mb-8">Departmental Distribution</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={120}
                  tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '12px',
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Bar 
                  dataKey="appointments" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 8, 8, 0]} 
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Patient Demographics Pie Chart */}
        <motion.div variants={itemVariants} className="glass dark:bg-card/40 rounded-2xl p-6">
          <h3 className="text-heading-4 font-semibold text-foreground mb-8">Patient Demographics</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[280px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {demographicData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.name} years</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Bottom Insights ──────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-elevation-4 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
            <Plus className="w-24 h-24" />
          </div>
          <h4 className="text-heading-4 font-bold mb-2">New Insights Available</h4>
          <p className="text-sm opacity-90 mb-4 whitespace-normal">
            Your patient retention has increased by 8% this month. Would you like to see the breakdown?
          </p>
          <button className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
            Analyze Report
          </button>
        </div>
        
        <div className="md:col-span-2 p-6 rounded-2xl bg-card border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Schedule Auto-Reports</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Get weekly analytics performance delivered straight to your email every Monday.
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto px-6 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
            Configure Reports
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
