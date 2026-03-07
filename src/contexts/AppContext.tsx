import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  User,
  Team,
  Program,
  TaskSubmission,
  TimeLog,
  Referral,
  Message,
  WalletTransaction,
  UserRole,
  Task,
  DashboardStats,
} from "@/types";
import {
  currentUser,
  mockUsers,
  mockTeams,
  mockPrograms,
  mockSubmissions,
  mockTimeLogs,
  mockReferrals,
  mockMessages,
  mockWalletTransactions,
  getTodaysTasks,
} from "@/data/mockData";

interface AppContextType {
  // User
  currentUser: User;
  users: User[];
  updateUser: (user: User) => void;

  // Teams
  teams: Team[];
  createTeam: (name: string) => void;
  inviteMember: (teamId: string, email: string, role: UserRole) => void;

  // Programs & Tasks
  programs: Program[];
  getTaskById: (taskId: string) => Task | undefined;

  // Submissions
  submissions: TaskSubmission[];
  submitTask: (
    submission: Omit<TaskSubmission, "id" | "createdAt" | "status">,
  ) => void;
  reviewSubmission: (
    submissionId: string,
    status: "approved" | "rejected",
    feedback?: string,
  ) => void;

  // Time Tracking
  timeLogs: TimeLog[];
  clockIn: () => void;
  clockOut: () => void;
  isClockedIn: boolean;
  currentTimeLog: TimeLog | null;
  getTodayHours: () => number;

  // Referrals
  referrals: Referral[];
  getReferralLink: () => string;

  // Messages
  messages: Message[];
  sendMessage: (teamId: string, message: string) => void;

  // Wallet
  walletTransactions: WalletTransaction[];
  getWalletBalance: () => number;

  // Dashboard
  getDashboardStats: () => DashboardStats;
  getTodaysTasks: () => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // User State
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [user, setUser] = useState<User>(currentUser);

  // Teams State
  const [teams, setTeams] = useState<Team[]>([...mockTeams]);

  // Programs State
  const [programs] = useState<Program[]>([...mockPrograms]);

  // Submissions State
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([
    ...mockSubmissions,
  ]);

  // Time Tracking State
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([...mockTimeLogs]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTimeLog, setCurrentTimeLog] = useState<TimeLog | null>(null);

  // Referrals State
  const [referrals] = useState<Referral[]>([...mockReferrals]);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);

  // Wallet State
  const [walletTransactions] = useState<WalletTransaction[]>([
    ...mockWalletTransactions,
  ]);

  // User Actions
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
  }, []);

  // Team Actions
  const createTeam = useCallback(
    (name: string) => {
      const newTeam: Team = {
        id: `team${Date.now()}`,
        name,
        ownerId: user.id,
        members: [
          {
            userId: user.id,
            role: user.role,
            joinedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setTeams((prev) => [...prev, newTeam]);
      setUser((prev) => ({ ...prev, teamId: newTeam.id }));
    },
    [user.id, user.role],
  );

  const inviteMember = useCallback(
    (teamId: string, email: string, role: UserRole) => {
      // In a real app, this would send an invitation email
      console.log(`Inviting ${email} to team ${teamId} as ${role}`);
    },
    [],
  );

  // Task Actions
  const getTaskById = useCallback(
    (taskId: string) => {
      for (const program of programs) {
        for (const phase of program.phases) {
          for (const week of phase.weeks) {
            const task = week.tasks.find((t) => t.id === taskId);
            if (task) return task;
          }
        }
      }
      return undefined;
    },
    [programs],
  );

  // Submission Actions
  const submitTask = useCallback(
    (submission: Omit<TaskSubmission, "id" | "createdAt" | "status">) => {
      const newSubmission: TaskSubmission = {
        ...submission,
        id: `sub${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setSubmissions((prev) => [...prev, newSubmission]);
    },
    [],
  );

  const reviewSubmission = useCallback(
    (
      submissionId: string,
      status: "approved" | "rejected",
      feedback?: string,
    ) => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                status,
                adminFeedback: feedback,
                reviewedAt: new Date().toISOString(),
              }
            : sub,
        ),
      );
    },
    [],
  );

  // Time Tracking Actions
  const clockIn = useCallback(() => {
    const newTimeLog: TimeLog = {
      id: `time${Date.now()}`,
      userId: user.id,
      clockIn: new Date().toISOString(),
      hours: 0,
      createdAt: new Date().toISOString(),
    };
    setCurrentTimeLog(newTimeLog);
    setIsClockedIn(true);
  }, [user.id]);

  const clockOut = useCallback(() => {
    if (currentTimeLog) {
      const clockOut = new Date();
      const clockIn = new Date(currentTimeLog.clockIn);
      const hours =
        Math.round(
          ((clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)) * 10,
        ) / 10;

      const completedTimeLog: TimeLog = {
        ...currentTimeLog,
        clockOut: clockOut.toISOString(),
        hours,
      };

      setTimeLogs((prev) => [...prev, completedTimeLog]);
      setCurrentTimeLog(null);
      setIsClockedIn(false);
    }
  }, [currentTimeLog]);

  const getTodayHours = useCallback(() => {
    const today = new Date().toDateString();
    return timeLogs
      .filter(
        (log) =>
          log.userId === user.id &&
          new Date(log.createdAt).toDateString() === today,
      )
      .reduce((acc, log) => acc + log.hours, 0);
  }, [timeLogs, user.id]);

  // Referral Actions
  // Referral Actions
  const getReferralLink = useCallback(() => {
    // Use whatsappNumber if available, otherwise fallback to the default referralCode
    const code = user.whatsappNumber || user.referralCode;
    // URL encode the phone number to handle '+' signs properly in the URL
    return `https://dogrowth.com/signup?ref=${encodeURIComponent(code)}`;
  }, [user.whatsappNumber, user.referralCode]);

  // Message Actions
  const sendMessage = useCallback(
    (teamId: string, message: string) => {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        teamId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    [user],
  );

  // Wallet Actions
  const getWalletBalance = useCallback(() => {
    return walletTransactions
      .filter((t) => t.userId === user.id)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [walletTransactions, user.id]);

  // Dashboard Actions
  const getDashboardStatsCallback = useCallback((): DashboardStats => {
    const userSubmissions = submissions.filter((s) => s.userId === user.id);
    const userTimeLogs = timeLogs.filter((t) => t.userId === user.id);
    const userReferrals = referrals.filter((r) => r.referrerId === user.id);

    return {
      tasksCompleted: userSubmissions.filter((s) => s.status === "approved")
        .length,
      tasksPending: userSubmissions.filter((s) => s.status === "pending")
        .length,
      hoursLogged: userTimeLogs.reduce((acc, log) => acc + log.hours, 0),
      referralEarnings: userReferrals.reduce(
        (acc, ref) => acc + ref.rewardAmount,
        0,
      ),
      roadmapProgress: 35,
    };
  }, [submissions, timeLogs, referrals, user.id]);

  const getTodaysTasksCallback = useCallback((): Task[] => {
    const availableHours = Math.max(8 - getTodayHours(), 0);
    return getTodaysTasks(user.role, availableHours);
  }, [getTodayHours, user.role]);

  const value: AppContextType = {
    currentUser: user,
    users,
    updateUser,
    teams,
    createTeam,
    inviteMember,
    programs,
    getTaskById,
    submissions,
    submitTask,
    reviewSubmission,
    timeLogs,
    clockIn,
    clockOut,
    isClockedIn,
    currentTimeLog,
    getTodayHours,
    referrals,
    getReferralLink,
    messages,
    sendMessage,
    walletTransactions,
    getWalletBalance,
    getDashboardStats: getDashboardStatsCallback,
    getTodaysTasks: getTodaysTasksCallback,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
