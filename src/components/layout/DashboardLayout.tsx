import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Map,
  Users,
  MessageSquare,
  Share2,
  Wallet,
  User,
  Shield,
  Menu,
  LogOut,
  ChevronRight,
  Clock,
  GraduationCap, // <-- IMPORT ADDED
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { label: "Roadmap & Tasks", icon: Map, path: "roadmap-tasks" },
  { label: "Team", icon: Users, path: "team" },
  { label: "Chat", icon: MessageSquare, path: "chat" },
  { label: "Referrals", icon: Share2, path: "referrals" },
  { label: "Wallet", icon: Wallet, path: "wallet" },
  { label: "Profile", icon: User, path: "profile" },
  { label: "Growth Academy", icon: GraduationCap, path: "growth-academy" }, // <-- MENU ITEM ADDED AT THE END
];

const adminNavItem = {
  label: "Admin Panel",
  icon: Shield,
  path: "admin",
  adminOnly: true,
};

export default function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: DashboardLayoutProps) {
  const { currentUser, isClockedIn, clockIn, clockOut } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentUser.role === "Admin";

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">GP</span>{" "}
          {/* Changed from PB to GP */}
        </div>
        <span className="font-semibold text-lg whitespace-nowrap">
          Growth Playbook
        </span>{" "}
        {/* Changed from Playbook to Growth Playbook */}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${item.path === "growth-academy" && currentPage !== "growth-academy" ? "text-amber-500" : ""}`}
              />
              {item.label}
              {currentPage === item.path && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  onNavigate(adminNavItem.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === adminNavItem.path
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Shield className="h-5 w-5" />
                {adminNavItem.label}
                {currentPage === adminNavItem.path && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {/* Time Tracker */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Time Tracker
            </span>
            {isClockedIn && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </div>
          <Button
            variant={isClockedIn ? "destructive" : "default"}
            size="sm"
            className="w-full"
            onClick={isClockedIn ? clockOut : clockIn}
          >
            <Clock className="h-4 w-4 mr-2" />
            {isClockedIn ? "Clock Out" : "Clock In"}
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full bg-gray-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r fixed h-full z-20">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
