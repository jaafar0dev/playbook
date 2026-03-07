import { useState } from "react";
import { AppProvider } from "@/contexts/AppContext";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import Dashboard from "@/pages/dashboard/Dashboard";
import RoadmapTasksPage from "@/pages/dashboard/RoadmapTasksPage";
import TeamPage from "@/pages/dashboard/TeamPage";
import ChatPage from "@/pages/dashboard/ChatPage";
import ReferralsPage from "@/pages/dashboard/ReferralsPage";
import WalletPage from "@/pages/dashboard/WalletPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import GrowthAcademyPage from "@/pages/dashboard/GrowthAcademyPage"; // <-- IMPORT ADDED
import AdminPanel from "@/pages/admin/AdminPanel";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkHoursOnboarding from "@/components/onboarding/WorkHoursOnboarding";
import TeamOnboarding from "@/components/onboarding/TeamOnboarding";

// <-- ADDED 'growth-academy' to types
type Page =
  | "landing"
  | "login"
  | "signup"
  | "dashboard"
  | "roadmap-tasks"
  | "team"
  | "chat"
  | "referrals"
  | "wallet"
  | "profile"
  | "growth-academy"
  | "admin";
type OnboardingStep = "none" | "work-hours" | "team" | "complete";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("none");
  const [isNewSignup, setIsNewSignup] = useState(false);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setOnboardingStep("work-hours");
    setIsNewSignup(false);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setOnboardingStep("team");
    setIsNewSignup(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setOnboardingStep("none");
    navigateTo("landing");
  };

  const handleWorkHoursComplete = () => {
    setOnboardingStep("complete");
    setCurrentPage("dashboard");
  };

  const handleTeamOnboardingComplete = () => {
    setOnboardingStep("complete");
    setCurrentPage("dashboard");
  };

  const handleTeamOnboardingSkip = () => {
    setOnboardingStep("complete");
    setCurrentPage("dashboard");
  };

  // Show onboarding if needed
  if (isAuthenticated && onboardingStep !== "complete") {
    if (onboardingStep === "work-hours" && !isNewSignup) {
      return <WorkHoursOnboarding onComplete={handleWorkHoursComplete} />;
    }
    if (onboardingStep === "team" && isNewSignup) {
      return (
        <TeamOnboarding
          onComplete={handleTeamOnboardingComplete}
          onSkip={handleTeamOnboardingSkip}
        />
      );
    }
  }

  // Render the appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={navigateTo} />;
      case "login":
        return <LoginPage onNavigate={navigateTo} onLogin={handleLogin} />;
      case "signup":
        return <SignupPage onNavigate={navigateTo} onSignup={handleSignup} />;
      case "dashboard":
      case "roadmap-tasks":
      case "team":
      case "chat":
      case "referrals":
      case "wallet":
      case "profile":
      case "growth-academy": // <-- ADDED CASE
      case "admin":
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigateTo} onLogin={handleLogin} />;
        }
        return (
          <DashboardLayout
            currentPage={currentPage}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          >
            {currentPage === "dashboard" && (
              <Dashboard onNavigate={navigateTo} />
            )}
            {currentPage === "roadmap-tasks" && <RoadmapTasksPage />}
            {currentPage === "team" && <TeamPage />}
            {currentPage === "chat" && <ChatPage />}
            {currentPage === "referrals" && <ReferralsPage />}
            {currentPage === "wallet" && <WalletPage />}
            {currentPage === "profile" && <ProfilePage />}
            {currentPage === "growth-academy" && <GrowthAcademyPage />}{" "}
            {/* <-- ADDED ROUTE */}
            {currentPage === "admin" && <AdminPanel />}
          </DashboardLayout>
        );
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return <div className="min-h-screen bg-background">{renderPage()}</div>;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
