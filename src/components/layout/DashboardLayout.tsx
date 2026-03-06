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
  const { currentUser } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentUser.role === "Admin";

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PB</span>
        </div>
        <span className="font-semibold text-lg">Growth Playbook</span>
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
              <item.icon className="h-5 w-5" />
              {item.label}
              {currentPage === item.path && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </button>
          ))}

          {isAdmin && (
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
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full bg-gray-200"
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
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r fixed h-full">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">{children}</div>
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2">
            <span>👋 Need help? Hire a Growth Supervisor for your team</span>
          </button>
        </div>
      </main>
    </div>
  );
}
