/**
 * Application-wide constants
 */

export const APP_NAME = "HealthCareSaaS";
export const APP_VERSION = "1.0.0";

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy hh:mm a",
  ISO: "yyyy-MM-dd",
  TIME: "hh:mm a",
} as const;

export const STATUS_COLORS = {
  // Appointment statuses
  scheduled: "info",
  confirmed: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive",
  no_show: "muted",

  // Invoice statuses
  draft: "muted",
  sent: "info",
  paid: "success",
  overdue: "destructive",
  refunded: "warning",

  // Claim statuses
  submitted: "info",
  in_review: "warning",
  approved: "success",
  denied: "destructive",
  appealed: "warning",

  // Patient statuses
  active: "success",
  inactive: "muted",
  deceased: "destructive",
} as const;

export const USER_ROLES_DISPLAY: Record<string, string> = {
  super_admin: "Super Admin",
  org_admin: "Organization Admin",
  doctor: "Doctor",
  nurse: "Nurse",
  front_desk: "Front Desk",
  billing_staff: "Billing Staff",
  read_only: "Read Only",
};

export const APPOINTMENT_TYPES_DISPLAY: Record<string, string> = {
  consultation: "Consultation",
  follow_up: "Follow Up",
  emergency: "Emergency",
  routine_checkup: "Routine Checkup",
  lab_test: "Lab Test",
  procedure: "Procedure",
};

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;
