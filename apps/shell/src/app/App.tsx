import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "@/features/navigation/Sidebar";
import TopBar from "@/features/navigation/TopBar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { ConfirmDialog } from "@healthcare/ui";
import { Toaster } from "sonner";

// Lazy-loaded pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const PatientDetailsPage = lazy(() => import("@/pages/PatientDetailsPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Global App Loader (for initial auth check)
function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-bounce shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-primary animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    setLoading 
  } = useAuthStore();

  // Handle Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const token = await firebaseUser.getIdToken();
        login(
          {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            firstName: firebaseUser.displayName?.split(" ")[0] || "User",
            lastName: firebaseUser.displayName?.split(" ")[1] || "",
            role: "org_admin",
            organizationId: "org-1",
            permissions: ["*"],
            isActive: true,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          },
          token,
          firebaseUser.refreshToken
        );
      } else {
        // User is signed out
        logout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [login, logout, setLoading]);

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMobileClose={() => setMobileSidebarOpen(false)}
          onLogout={() => setShowLogoutConfirm(true)}
        />

        {/* Top Bar */}
        <TopBar 
          sidebarCollapsed={sidebarCollapsed} 
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Main Content */}
        <main
          className={cn(
            "pt-16 min-h-screen transition-all duration-300",
            // Desktop padding based on sidebar state
            sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[260px]",
            // Mobile padding is always 0 as sidebar is an overlay
            "pl-0"
          )}
        >
          <div className="page-container">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/patients/*" element={<PatientDetailsPage />} />
                <Route path="/analytics/*" element={<AnalyticsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>

        {/* Logout Confirmation */}
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            auth.signOut().then(() => logout());
          }}
          variant="destructive"
          title="Sign Out"
          description="Are you sure you want to sign out of your account? Any unsaved changes will be lost."
          confirmLabel="Sign Out"
        />
      </div>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
