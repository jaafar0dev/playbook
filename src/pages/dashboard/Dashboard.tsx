import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  Timer,
  Wallet,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { Task, DashboardStats } from "@/types";

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
  | "admin";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const {
    getDashboardStats,
    getTodaysTasks,
    getTodayHours,
    submissions,
    currentUser,
  } = useApp();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [todayHours, setTodayHours] = useState(0);

  useEffect(() => {
    setStats(getDashboardStats());
    setTodaysTasks(getTodaysTasks());
    setTodayHours(getTodayHours());
  }, [getDashboardStats, getTodaysTasks, getTodayHours]);

  if (!stats) return null;

  const getTaskStatus = (taskId: string) => {
    const submission = submissions.find((s) => s.taskId === taskId);
    if (!submission) return "not-started";
    return submission.status;
  };

  const statCards = [
    {
      title: "Tasks Completed",
      value: stats.tasksCompleted,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tasks Pending",
      value: stats.tasksPending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Hours Logged",
      value: `${stats.hoursLogged}h`,
      icon: Timer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Referral Earnings",
      value: `$${stats.referralEarnings}`,
      icon: Wallet,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500">
            Here's your progress and today's focus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Target className="h-3.5 w-3.5 mr-1" />
            {currentUser.role}
          </Badge>
          <Button size="sm" onClick={() => onNavigate("roadmap-tasks")}>
            View Roadmap
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Roadmap Progress
              </h2>
              <p className="text-sm text-gray-500">
                Start Your Business Program
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-blue-600">
                {stats.roadmapProgress}%
              </span>
            </div>
          </div>
          <Progress value={stats.roadmapProgress} className="h-3" />
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>Phase 1: Idea Validation</span>
            <span>3 of 12 weeks completed</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Tasks & Time Tracking */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Tasks</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Scheduled based on your {8 - todayHours}h available time
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("roadmap-tasks")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {todaysTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  All caught up!
                </h3>
                <p className="text-gray-500">No tasks scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map((task) => {
                  const status = getTaskStatus(task.id);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onNavigate("roadmap-tasks")}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          status === "approved"
                            ? "bg-green-100"
                            : status === "pending"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {status === "approved" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : status === "pending" ? (
                          <Clock className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Target className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {task.phase} • Week {task.week}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{task.estimatedTime}h</Badge>
                        {status === "not-started" && (
                          <Button size="sm" variant="ghost">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">4 team members</p>
                    <p className="text-xs text-gray-500">2 online now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">12 tasks completed</p>
                    <p className="text-xs text-gray-500">
                      This week by your team
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                size="sm"
                onClick={() => onNavigate("team")}
              >
                View Team
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => onNavigate("chat")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Team Chat
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => onNavigate("referrals")}
              >
                <Wallet className="h-4 w-4 mr-2" />
                View Referrals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
