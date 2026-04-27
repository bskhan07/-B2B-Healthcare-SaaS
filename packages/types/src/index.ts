// ─── Common API Types ──────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ─── User & Auth Types ────────────────────────────────

export type UserRole =
  | "super_admin"
  | "org_admin"
  | "doctor"
  | "nurse"
  | "front_desk"
  | "billing_staff"
  | "read_only";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Organization Types ───────────────────────────────

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  type: "hospital" | "clinic" | "laboratory" | "pharmacy" | "other";
  address: Address;
  phone: string;
  email: string;
  website?: string;
  subscription: SubscriptionPlan;
  settings: OrgSettings;
  createdAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type SubscriptionPlan = "starter" | "professional" | "enterprise";

export interface OrgSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  locale: string;
}

// ─── Patient Types ────────────────────────────────────

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  email?: string;
  phone: string;
  address: Address;
  emergencyContact?: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
  allergies: string[];
  status: "active" | "inactive" | "deceased";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expiryDate: string;
}

// ─── Appointment Types ────────────────────────────────

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType =
  | "consultation"
  | "follow_up"
  | "emergency"
  | "routine_checkup"
  | "lab_test"
  | "procedure";

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: User;
  type: AppointmentType;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  notes?: string;
  reason: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Billing Types ────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled" | "refunded";
export type ClaimStatus = "submitted" | "in_review" | "approved" | "denied" | "appealed";
export type PaymentMethod = "cash" | "card" | "insurance" | "bank_transfer" | "upi";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patient?: Patient;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  code?: string; // CPT/procedure code
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Claim {
  id: string;
  claimNumber: string;
  patientId: string;
  invoiceId: string;
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  submittedDate: string;
  processedDate?: string;
  denialReason?: string;
  createdAt: string;
}

// ─── Notification Types ───────────────────────────────

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationCategory =
  | "appointment"
  | "billing"
  | "patient"
  | "system"
  | "message";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── Dashboard Types ──────────────────────────────────

export interface KpiData {
  label: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  trend: "up" | "down" | "neutral";
  format: "number" | "currency" | "percentage";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

// ─── Event Bus Types ──────────────────────────────────

export type EventPayload = Record<string, unknown>;

export interface BusEvent<T = EventPayload> {
  type: string;
  payload: T;
  source: string;
  timestamp: number;
}

// ─── Table & Filter Types ─────────────────────────────

export interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "in";
  value: string | number | string[] | number[];
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
}
