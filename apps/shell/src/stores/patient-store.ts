import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  status: "Stable" | "Critical" | "Recovering";
  lastVisit: string;
  bloodGroup?: string;
  address?: string;
  medicalHistory?: string[];
  avatar: string;
}

interface PatientStore {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "avatar">) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

const DEFAULT_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Alexander Thompson",
    age: 42,
    gender: "Male",
    email: "alex.t@example.com",
    phone: "+1 (555) 123-4567",
    status: "Stable",
    lastVisit: "2024-04-20",
    bloodGroup: "O+",
    avatar: "AT"
  },
  {
    id: "2",
    name: "Sarah Montgomery",
    age: 31,
    gender: "Female",
    email: "sarah.m@example.com",
    phone: "+1 (555) 987-6543",
    status: "Critical",
    lastVisit: "2024-04-25",
    bloodGroup: "A-",
    avatar: "SM"
  },
  {
    id: "3",
    name: "Michael Chen",
    age: 58,
    gender: "Male",
    email: "m.chen@example.com",
    phone: "+1 (555) 456-7890",
    status: "Stable",
    lastVisit: "2024-04-18",
    bloodGroup: "B+",
    avatar: "MC"
  }
];

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: DEFAULT_PATIENTS,
      addPatient: (data) => {
        const newPatient: Patient = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          avatar: data.name.split(" ").map(n => n[0]).join("").toUpperCase()
        };
        set((state) => ({ patients: [newPatient, ...state.patients] }));
      },
      updatePatient: (id, data) => {
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p))
        }));
      },
      deletePatient: (id) => {
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id)
        }));
      },
      getPatient: (id) => {
        return get().patients.find((p) => p.id === id);
      }
    }),
    {
      name: "healthcare-patients"
    }
  )
);
