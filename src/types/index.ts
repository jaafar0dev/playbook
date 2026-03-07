// User Types
export type UserRole = 'Founder' | 'Marketing' | 'Sales' | 'Finance' | 'Operations' | 'Product' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  referralCode: string;
  referredBy?: string;
  whatsappNumber?: string; // <-- Must be here
  enableWhatsappReminders?: boolean; // <-- Must be here
  teamId?: string;
  walletBalance: number;
  createdAt: string;
  avatar?: string;
}

export interface Training { // <-- Must be here
  title: string;
  provider: string;
  duration: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  instructions: string[];
  resources: Resource[];
  trainings?: Training[]; // <-- Must be here
  estimatedTime: number;
  assignedRole: UserRole;
  phase: string;
  week: number;
  programId: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
}

// Roadmap Types
export interface Program {
  id: string;
  title: string;
  description: string;
  phases: Phase[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  weekStart: number;
  weekEnd: number;
  weeks: Week[];
}

export interface Week {
  id: string;
  number: number;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  instructions: string[];
  resources: Resource[];
  vendors?: Vendor[]; // Allow outsourcing
  estimatedTime: number; // in hours
  assignedRole: UserRole;
  phase: string;
  week: number;
  programId: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'template' | 'tool' | 'pdf';
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contactUrl: string;
}
// Task Submission Types
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  teamId?: string;
  fileUrl?: string;
  linkUrl?: string;
  notes?: string;
  status: SubmissionStatus;
  adminFeedback?: string;
  createdAt: string;
  reviewedAt?: string;
}

// Time Tracking Types
export interface TimeLog {
  id: string;
  userId: string;
  clockIn: string;
  clockOut?: string;
  hours: number;
  createdAt: string;
}

// Referral Types
export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  rewardAmount: number;
  createdAt: string;
}

// Chat Types
export interface Message {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt: string;
}

// Wallet Types
export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'referral' | 'withdrawal' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  tasksCompleted: number;
  tasksPending: number;
  hoursLogged: number;
  referralEarnings: number;
  roadmapProgress: number;
}

// Navigation Types
export interface NavItem {
  label: string;
  icon: string;
  path: string;
  adminOnly?: boolean;
}

// Form Types
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  referralCode: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface TaskSubmissionForm {
  file?: File;
  linkUrl?: string;
  notes?: string;
}
