import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

// Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "admin@gmail.com",
      password: "12345678",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        
        const firebaseUser = userCredential.user;
        
        // Map Firebase user to our application user type
        login(
          {
            id: firebaseUser.uid,
            email: firebaseUser.email || values.email,
            firstName: firebaseUser.displayName?.split(" ")[0] || "User",
            lastName: firebaseUser.displayName?.split(" ")[1] || "",
            role: "org_admin", // Default role for demo, should come from your backend/claims
            organizationId: "org-1",
            permissions: ["*"],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          await firebaseUser.getIdToken(),
          firebaseUser.refreshToken
        );
        toast.success("Welcome back, " + (firebaseUser.displayName || "User") + "!");
      } catch (error: any) {
        console.error("Login Error:", error);
        let message = "An error occurred during sign in.";
        
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          message = "Invalid email or password.";
        } else if (error.code === "auth/too-many-requests") {
          message = "Too many failed attempts. Please try again later.";
        } else if (error.code === "auth/invalid-credential") {
          message = "Invalid credentials. Please check your email and password.";
        }
        
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── Left Section: Brand & Visual ──────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="/healthcare_auth_hero.png" 
          alt="Healthcare tech" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-slate-900/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Stethoscope className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">HealthCare SaaS</span>
          </div>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white leading-tight"
            >
              The Next Generation of <br />
              <span className="text-primary-300">Healthcare Management.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-slate-300 leading-relaxed"
            >
              Streamline your clinical workflows, manage patients with ease, and focus on what matters most—delivering exceptional care.
            </motion.p>

            <div className="mt-10 space-y-4">
              {[
                "Enterprise-grade Security (HIPAA Compliant)",
                "Real-time Data Analytics",
                "Unified Patient Management"
              ].map((text, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={idx} 
                  className="flex items-center gap-3 text-slate-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-slate-400 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted by 500+ Healthcare Institutions Worldwide</span>
          </div>
        </div>
      </div>

      {/* ─── Right Section: Login Form ────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">
                Work Email
              </label>
              <div className="relative group">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors",
                  formik.touched.email && formik.errors.email ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
                )} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@hospital.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-xl outline-none transition-all duration-200",
                    "bg-muted/30 border",
                    formik.touched.email && formik.errors.email 
                      ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
                      : "border-border group-hover:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  )}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-[11px] text-destructive ml-1 font-medium">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <button type="button" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors",
                  formik.touched.password && formik.errors.password ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
                )} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={cn(
                    "w-full h-12 pl-11 pr-12 rounded-xl outline-none transition-all duration-200",
                    "bg-muted/30 border",
                    formik.touched.password && formik.errors.password 
                      ? "border-destructive focus:ring-destructive/20 focus:border-destructive" 
                      : "border-border group-hover:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[11px] text-destructive ml-1 font-medium">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={cn(
                "w-full h-12 rounded-xl",
                "bg-primary text-primary-foreground font-semibold text-sm",
                "flex items-center justify-center gap-2",
                "transition-all duration-200 active:scale-[0.98]",
                "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {formik.isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
              ) : (
                <>
                  Sign in to Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            By signing in, you agree to our{" "}
            <button className="hover:text-primary underline">Terms of Service</button> and{" "}
            <button className="hover:text-primary underline">Privacy Policy</button>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
