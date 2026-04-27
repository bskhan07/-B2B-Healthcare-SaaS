import { useState, useMemo } from "react";
import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  ChevronRight,
  Filter,
  ArrowLeft,
  Edit,
  Trash2,
  Activity,
  Heart,
  Droplet,
  User as UserIcon,
  X
} from "lucide-react";
import { 
  PageLayout, 
  ResponsiveGrid, 
  ConfirmDialog,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Input
} from "@healthcare/ui";
import { cn } from "@healthcare/utils";
import { usePatientStore, Patient } from "@/stores/patient-store";
import { useDebounce } from "use-debounce";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

// ─── Main Page Component (Router) ─────────────────────
export default function PatientDetailsPage() {
  return (
    <Routes>
      <Route path="/" element={<PatientList />} />
      <Route path="/:id" element={<PatientDetail />} />
    </Routes>
  );
}

// ─── 1. Patient List View ─────────────────────────────
function PatientList() {
  const navigate = useNavigate();
  const { patients, deletePatient } = usePatientStore();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  // Filter Logic
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.phone.includes(debouncedSearch);
      
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [patients, debouncedSearch, statusFilter]);

  const handleEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPatientToEdit(null);
  };

  return (
    <PageLayout
      title="Patient Details"
      subtitle="View and manage comprehensive patient records and history."
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border mr-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("grid")} 
              className={cn("h-8 w-8 rounded-lg", viewMode === "grid" ? "bg-background text-primary shadow-sm hover:bg-background" : "text-muted-foreground")}
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("list")} 
              className={cn("h-8 w-8 rounded-lg", viewMode === "list" ? "bg-background text-primary shadow-sm hover:bg-background" : "text-muted-foreground")}
            >
              <List className="w-4.5 h-4.5" />
            </Button>
          </div>

          <div className="hidden sm:block min-w-[140px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Recovering">Recovering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Patient</span>
          </Button>
        </div>
      }
    >
      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary z-10 transition-colors" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name, ID or email..."
          className="pl-10"
        />
      </div>

      <div className="mt-4">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center p-8 bg-muted/20 border border-dashed border-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No patients found</p>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">Try adjusting your search filters to find what you're looking for.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ResponsiveGrid cols={3}>
                  {filteredPatients.map((p) => (
                    <PatientGridCard key={p.id} patient={p} onEdit={() => handleEdit(p)} onDelete={() => setPatientToDelete(p.id)} />
                  ))}
                </ResponsiveGrid>
              </motion.div>
            ) : (
              <PatientTable patients={filteredPatients} onEdit={handleEdit} onDelete={(id) => setPatientToDelete(id)} />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Add Modals & Dialogs */}
      <ConfirmDialog 
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={() => {
          if (patientToDelete) {
            deletePatient(patientToDelete);
            toast.success("Patient record deleted");
            setPatientToDelete(null);
          }
        }}
        variant="destructive"
        title="Delete Patient Record"
        description="Are you sure you want to delete this record? This action cannot be undone."
      />
      
      {isModalOpen && <PatientModal patient={patientToEdit} onClose={handleCloseModal} />}
    </PageLayout>
  );
}

// ─── 2. Patient Detail View ───────────────────────────
function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatient } = usePatientStore();
  const patient = getPatient(id!);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-xl font-bold">Patient Not Found</h2>
        <button onClick={() => navigate("/patients")} className="text-primary font-semibold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
      </div>
    );
  }

  return (
    <PageLayout
      title={patient.name}
      subtitle={`Patient ID: ${patient.id.toUpperCase()}`}
      onBack={() => navigate("/patients")}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} className="gap-2">
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button className="gap-2">
            <Calendar className="w-4 h-4" /> Schedule Appointment
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4 shadow-inner">
                {patient.avatar}
              </div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <StatusBadge status={patient.status} />
              
              <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Age</p>
                  <p className="font-semibold">{patient.age} Years</p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Gender</p>
                  <p className="font-semibold">{patient.gender}</p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Blood Group</p>
                  <p className="font-semibold text-destructive">{patient.bloodGroup || "Not Set"}</p>
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Last Visit</p>
                  <p className="font-semibold">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <UserIcon className="w-4.5 h-4.5 text-primary" /> Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Phone className="w-4 h-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{patient.phone}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Mail className="w-4 h-4 text-muted-foreground" /></div>
                <div className="overflow-hidden"><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium truncate">{patient.email}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Tabs / Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Heart Rate", value: "72 bpm", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
              { label: "Blood Pressure", value: "120/80", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Glucose", value: "95 mg/dL", icon: Droplet, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Medical Records Mock */}
          <div className="bg-card border border-border rounded-3xl p-8 h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 border border-dashed border-border">
              <Activity className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Clinical Timeline & History</h4>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm leading-relaxed">
              Detailed observation logs, diagnosis history, and medical prescription charts will be displayed here in a visual timeline.
            </p>
          </div>
        </div>
      </div>
      {isEditModalOpen && <PatientModal patient={patient} onClose={() => setIsEditModalOpen(false)} />}
    </PageLayout>
  );
}

// ─── Sub-Components ───────────────────────────────────

function PatientGridCard({ patient, onEdit, onDelete }: { patient: Patient; onEdit: () => void; onDelete: () => void }) {
  const navigate = useNavigate();

  return (
    <motion.div 
      layout
      className="group bg-card border border-border rounded-2xl p-5 hover:shadow-glass-strong transition-all duration-300 relative"
    >
      <div className="absolute top-4 right-4">
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4.5 h-4.5" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="end" className="w-40">
            <DropdownItem onClick={() => navigate(`/patients/${patient.id}`)}>
              <Search className="w-4 h-4 mr-2" /> View Profile
            </DropdownItem>
            <DropdownItem onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" /> Edit Details
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete Record
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      <Link to={`/patients/${patient.id}`} className="block">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shadow-inner">
            {patient.avatar}
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{patient.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{patient.gender}, {patient.age} years</p>
          </div>
        </div>

        <div className="space-y-3 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-primary/60" /> <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary/60" /> <span className="truncate">{patient.email}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <StatusBadge status={patient.status} />
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            View <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function PatientTable({ patients, onEdit, onDelete }: { patients: Patient[]; onEdit: (p: Patient) => void; onDelete: (id: string) => void }) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground">Patient</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground">Status</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {patients.map((p) => (
            <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
              <td className="px-6 py-4">
                <Link to={`/patients/${p.id}`} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">{p.avatar}</div>
                  <div><p className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p><p className="text-xs text-muted-foreground">{p.gender}, {p.age} years</p></div>
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p className="text-foreground">{p.phone}</p><p>{p.email}</p>
                </div>
              </td>
              <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
              <td className="px-6 py-4 text-right">
                <Dropdown>
                  <DropdownTrigger asChild>
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownTrigger>
                  <DropdownContent align="end" className="w-40">
                    <DropdownItem onClick={() => navigate(`/patients/${p.id}`)}>
                      <Search className="w-4 h-4 mr-2" /> View Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => onEdit(p)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit Record
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem variant="destructive" onClick={() => onDelete(p.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Stable: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Critical: "bg-destructive/10 text-destructive border-destructive/20",
    Recovering: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border", styles[status as keyof typeof styles])}>{status}</span>;
}

// ─── 3. Patient Modal (Add/Edit) ──────────────────────
function PatientModal({ patient, onClose }: { patient?: Patient | null; onClose: () => void }) {
  const { addPatient, updatePatient } = usePatientStore();
  const isEditing = !!patient;
  
  const formik = useFormik({
    initialValues: {
      name: patient?.name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
      age: patient?.age || 25,
      gender: (patient?.gender || "Male") as "Male" | "Female" | "Other",
      status: (patient?.status || "Stable") as "Stable" | "Critical" | "Recovering",
      lastVisit: patient?.lastVisit || new Date().toISOString().split("T")[0]
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      age: Yup.number().positive().integer().required()
    }),
    onSubmit: (values) => {
      if (isEditing && patient) {
        updatePatient(patient.id, values);
        toast.success("Patient record updated!");
      } else {
        addPatient(values);
        toast.success("Patient added successfully!");
      }
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold">{isEditing ? "Edit Patient Details" : "Add New Patient"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-semibold">Full Name</label>
              <Input {...formik.getFieldProps('name')} placeholder="John Doe" />
              {formik.touched.name && formik.errors.name && <p className="text-xs text-destructive">{formik.errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Email</label>
              <Input {...formik.getFieldProps('email')} placeholder="john@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Phone</label>
              <Input {...formik.getFieldProps('phone')} placeholder="+1..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Age</label>
              <Input type="number" {...formik.getFieldProps('age')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Gender</label>
              <Select 
                value={formik.values.gender} 
                onValueChange={(val) => formik.setFieldValue('gender', val)}
              >
                <SelectTrigger className="w-full h-11 bg-muted/30 rounded-xl">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Status</label>
              <Select 
                value={formik.values.status} 
                onValueChange={(val) => formik.setFieldValue('status', val)}
              >
                <SelectTrigger className="w-full h-11 bg-muted/30 rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stable">Stable</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Recovering">Recovering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12">Cancel</Button>
            <Button type="submit" className="flex-1 h-12">
              {isEditing ? "Update Changes" : "Create Record"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
