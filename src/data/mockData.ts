import type { User, Team, Program, TaskSubmission, TimeLog, Referral, Message, WalletTransaction } from '@/types';

// Current logged in user (simulated)
export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@dogrowth.com',
  role: 'Founder',
  referralCode: 'DG07041200171',
  walletBalance: 150,
  createdAt: '2024-01-15T10:00:00Z',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

// Mock Users
export const mockUsers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@dogrowth.com',
    role: 'Marketing',
    referralCode: 'DG07041200172',
    referredBy: 'DG07041200171',
    teamId: 'team1',
    walletBalance: 75,
    createdAt: '2024-02-01T14:30:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '3',
    name: 'Mike Roberts',
    email: 'mike@dogrowth.com',
    role: 'Sales',
    referralCode: 'DG07041200173',
    referredBy: 'DG07041200171',
    teamId: 'team1',
    walletBalance: 50,
    createdAt: '2024-02-10T09:15:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    id: '4',
    name: 'Emily Watson',
    email: 'emily@dogrowth.com',
    role: 'Product',
    referralCode: 'DG07041200174',
    teamId: 'team1',
    walletBalance: 25,
    createdAt: '2024-02-20T16:45:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'StartupX Team',
    ownerId: '1',
    members: [
      { userId: '1', role: 'Founder', joinedAt: '2024-01-15T10:00:00Z' },
      { userId: '2', role: 'Marketing', joinedAt: '2024-02-01T14:30:00Z' },
      { userId: '3', role: 'Sales', joinedAt: '2024-02-10T09:15:00Z' },
      { userId: '4', role: 'Product', joinedAt: '2024-02-20T16:45:00Z' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// Mock Programs with Roadmap
export const mockPrograms: Program[] = [
  {
    id: 'prog1',
    title: 'Start Your Business',
    description: 'The complete roadmap to validate, launch, and scale your startup from idea to product-market fit.',
    phases: [
      {
        id: 'phase1',
        title: 'Phase 1 – Idea Validation',
        description: 'Validate your business idea through market research and customer discovery.',
        weekStart: 1,
        weekEnd: 2,
        weeks: [
          {
            id: 'week1',
            number: 1,
            title: 'Market Research & Customer Discovery',
            tasks: [
              {
                id: 'task1',
                title: 'Market Research',
                description: 'Conduct comprehensive market research to understand your target industry, market size, and trends.',
                whyItMatters: 'Understanding the market landscape helps you identify opportunities and avoid saturated markets.',
                instructions: [
                  'Identify your target market size using tools like Statista, IBISWorld, or industry reports',
                  'Analyze market trends over the past 3-5 years',
                  'Identify key market segments and their characteristics',
                  'Document your findings in a market research report',
                ],
                resources: [
                  { title: 'Market Research Guide', url: '#', type: 'article' },
                  { title: 'Market Sizing Template', url: '#', type: 'template' },
                ],
                estimatedTime: 4,
                assignedRole: 'Founder',
                phase: 'Phase 1 – Idea Validation',
                week: 1,
                programId: 'prog1',
              },
              {
                id: 'task2',
                title: 'Customer Interviews',
                description: 'Interview potential customers to validate your assumptions and understand their pain points.',
                whyItMatters: 'Direct customer feedback is the best way to validate your idea and refine your value proposition.',
                instructions: [
                  'Create a list of 20-30 potential customers to interview',
                  'Prepare interview questions focused on problems, not solutions',
                  'Conduct at least 10 customer interviews',
                  'Document insights and patterns from the interviews',
                ],
                resources: [
                  { title: 'Customer Interview Script', url: '#', type: 'template' },
                  { title: 'How to Conduct Customer Interviews', url: '#', type: 'video' },
                ],
                estimatedTime: 6,
                assignedRole: 'Founder',
                phase: 'Phase 1 – Idea Validation',
                week: 1,
                programId: 'prog1',
              },
              {
                id: 'task3',
                title: 'Competitor Analysis',
                description: 'Analyze your direct and indirect competitors to identify gaps and opportunities.',
                whyItMatters: 'Understanding competitors helps you differentiate and position your product effectively.',
                instructions: [
                  'Identify 5-7 direct competitors',
                  'Identify 3-5 indirect competitors',
                  'Analyze their pricing, features, and positioning',
                  'Create a competitive matrix',
                ],
                resources: [
                  { title: 'Competitor Analysis Template', url: '#', type: 'template' },
                  { title: 'Competitive Intelligence Tools', url: '#', type: 'tool' },
                ],
                estimatedTime: 3,
                assignedRole: 'Marketing',
                phase: 'Phase 1 – Idea Validation',
                week: 1,
                programId: 'prog1',
              },
            ],
          },
          {
            id: 'week2',
            number: 2,
            title: 'Value Proposition & Problem Validation',
            tasks: [
              {
                id: 'task4',
                title: 'Define Value Proposition',
                description: 'Craft a compelling value proposition that clearly communicates your unique value.',
                whyItMatters: 'A clear value proposition helps you communicate effectively with customers and investors.',
                instructions: [
                  'Identify the main problem you solve',
                  'Define your unique solution',
                  'Articulate the key benefits for customers',
                  'Create a value proposition canvas',
                ],
                resources: [
                  { title: 'Value Proposition Canvas', url: '#', type: 'template' },
                  { title: 'Value Proposition Examples', url: '#', type: 'article' },
                ],
                estimatedTime: 2,
                assignedRole: 'Founder',
                phase: 'Phase 1 – Idea Validation',
                week: 2,
                programId: 'prog1',
              },
              {
                id: 'task5',
                title: 'Problem Validation Survey',
                description: 'Create and distribute a survey to validate the problem you are solving.',
                whyItMatters: 'Quantitative validation helps you understand the scale of the problem.',
                instructions: [
                  'Design a 10-question survey about the problem',
                  'Distribute to at least 100 potential customers',
                  'Analyze survey results',
                  'Document key findings and insights',
                ],
                resources: [
                  { title: 'Survey Design Best Practices', url: '#', type: 'article' },
                  { title: 'Problem Validation Survey Template', url: '#', type: 'template' },
                ],
                estimatedTime: 4,
                assignedRole: 'Marketing',
                phase: 'Phase 1 – Idea Validation',
                week: 2,
                programId: 'prog1',
              },
            ],
          },
        ],
      },
      {
        id: 'phase2',
        title: 'Phase 2 – MVP Development',
        description: 'Build your minimum viable product with core features that solve the validated problem.',
        weekStart: 3,
        weekEnd: 6,
        weeks: [
          {
            id: 'week3',
            number: 3,
            title: 'Product Planning & Design',
            tasks: [
              {
                id: 'task6',
                title: 'Feature Prioritization',
                description: 'Prioritize features for your MVP using frameworks like MoSCoW or RICE.',
                whyItMatters: 'Focusing on essential features helps you launch faster and validate sooner.',
                instructions: [
                  'List all potential features',
                  'Apply MoSCoW prioritization',
                  'Identify must-have features for MVP',
                  'Create a product roadmap',
                ],
                resources: [
                  { title: 'Feature Prioritization Framework', url: '#', type: 'article' },
                  { title: 'Product Roadmap Template', url: '#', type: 'template' },
                ],
                estimatedTime: 3,
                assignedRole: 'Product',
                phase: 'Phase 2 – MVP Development',
                week: 3,
                programId: 'prog1',
              },
              {
                id: 'task7',
                title: 'Wireframing & Prototyping',
                description: 'Create wireframes and interactive prototypes of your MVP.',
                whyItMatters: 'Prototypes help you visualize and test your product before development.',
                instructions: [
                  'Create low-fidelity wireframes for all screens',
                  'Build an interactive prototype',
                  'Conduct usability testing with 5 users',
                  'Iterate based on feedback',
                ],
                resources: [
                  { title: 'Wireframing Best Practices', url: '#', type: 'article' },
                  { title: 'Figma Prototyping Tutorial', url: '#', type: 'video' },
                ],
                estimatedTime: 5,
                assignedRole: 'Product',
                phase: 'Phase 2 – MVP Development',
                week: 3,
                programId: 'prog1',
              },
            ],
          },
          {
            id: 'week4',
            number: 4,
            title: 'MVP Development Sprint',
            tasks: [
              {
                id: 'task8',
                title: 'Technical Architecture',
                description: 'Design the technical architecture for your MVP.',
                whyItMatters: 'Good architecture ensures your product can scale as you grow.',
                instructions: [
                  'Choose your tech stack',
                  'Design database schema',
                  'Set up development environment',
                  'Create API documentation',
                ],
                resources: [
                  { title: 'Tech Stack Selection Guide', url: '#', type: 'article' },
                  { title: 'Architecture Diagram Template', url: '#', type: 'template' },
                ],
                estimatedTime: 4,
                assignedRole: 'Product',
                phase: 'Phase 2 – MVP Development',
                week: 4,
                programId: 'prog1',
              },
            ],
          },
        ],
      },
      {
        id: 'phase3',
        title: 'Phase 3 – Launch & Growth',
        description: 'Launch your product and implement growth strategies to acquire customers.',
        weekStart: 7,
        weekEnd: 12,
        weeks: [
          {
            id: 'week7',
            number: 7,
            title: 'Go-to-Market Strategy',
            tasks: [
              {
                id: 'task9',
                title: 'Launch Strategy',
                description: 'Create a comprehensive launch strategy for your product.',
                whyItMatters: 'A well-planned launch maximizes your chances of early traction.',
                instructions: [
                  'Define your launch goals and KPIs',
                  'Identify launch channels and tactics',
                  'Create a launch timeline',
                  'Prepare launch assets and content',
                ],
                resources: [
                  { title: 'Product Launch Playbook', url: '#', type: 'article' },
                  { title: 'Launch Checklist Template', url: '#', type: 'template' },
                ],
                estimatedTime: 4,
                assignedRole: 'Marketing',
                phase: 'Phase 3 – Launch & Growth',
                week: 7,
                programId: 'prog1',
              },
              {
                id: 'task10',
                title: 'Pricing Strategy',
                description: 'Develop a pricing strategy that aligns with your value and market.',
                whyItMatters: 'Pricing directly impacts revenue and customer perception.',
                instructions: [
                  'Research competitor pricing',
                  'Choose a pricing model',
                  'Define pricing tiers',
                  'Test pricing with potential customers',
                ],
                resources: [
                  { title: 'Pricing Strategy Guide', url: '#', type: 'article' },
                  { title: 'Pricing Calculator', url: '#', type: 'tool' },
                ],
                estimatedTime: 3,
                assignedRole: 'Finance',
                phase: 'Phase 3 – Launch & Growth',
                week: 7,
                programId: 'prog1',
              },
            ],
          },
        ],
      },
    ],
  },
];

// Mock Task Submissions
export const mockSubmissions: TaskSubmission[] = [
  {
    id: 'sub1',
    taskId: 'task1',
    userId: '1',
    userName: 'Alex Johnson',
    teamId: 'team1',
    fileUrl: '#',
    notes: 'Completed market research report with detailed analysis of the SaaS market.',
    status: 'approved',
    adminFeedback: 'Great work! The analysis is thorough and well-structured.',
    createdAt: '2024-03-01T10:00:00Z',
    reviewedAt: '2024-03-02T14:30:00Z',
  },
  {
    id: 'sub2',
    taskId: 'task2',
    userId: '1',
    userName: 'Alex Johnson',
    teamId: 'team1',
    fileUrl: '#',
    notes: 'Conducted 12 customer interviews with detailed notes.',
    status: 'pending',
    createdAt: '2024-03-05T16:00:00Z',
  },
  {
    id: 'sub3',
    taskId: 'task3',
    userId: '2',
    userName: 'Sarah Chen',
    teamId: 'team1',
    linkUrl: 'https://docs.google.com/spreadsheets/d/example',
    notes: 'Competitor analysis matrix completed.',
    status: 'rejected',
    adminFeedback: 'Please include more detail on pricing comparison and feature analysis.',
    createdAt: '2024-03-03T11:00:00Z',
    reviewedAt: '2024-03-04T09:15:00Z',
  },
];

// Mock Time Logs
export const mockTimeLogs: TimeLog[] = [
  {
    id: 'time1',
    userId: '1',
    clockIn: '2024-03-06T09:00:00Z',
    clockOut: '2024-03-06T12:00:00Z',
    hours: 3,
    createdAt: '2024-03-06T09:00:00Z',
  },
  {
    id: 'time2',
    userId: '1',
    clockIn: '2024-03-06T13:00:00Z',
    clockOut: '2024-03-06T17:00:00Z',
    hours: 4,
    createdAt: '2024-03-06T13:00:00Z',
  },
  {
    id: 'time3',
    userId: '2',
    clockIn: '2024-03-06T10:00:00Z',
    clockOut: '2024-03-06T15:00:00Z',
    hours: 5,
    createdAt: '2024-03-06T10:00:00Z',
  },
];

// Mock Referrals
export const mockReferrals: Referral[] = [
  {
    id: 'ref1',
    referrerId: '1',
    referredUserId: '2',
    referredUserName: 'Sarah Chen',
    rewardAmount: 10,
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'ref2',
    referrerId: '1',
    referredUserId: '3',
    referredUserName: 'Mike Roberts',
    rewardAmount: 10,
    createdAt: '2024-02-10T09:15:00Z',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    teamId: 'team1',
    userId: '1',
    userName: 'Alex Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    message: 'Hey team! Let\'s kick off the market research tasks this week. Who\'s available to help?',
    createdAt: '2024-03-06T09:00:00Z',
  },
  {
    id: 'msg2',
    teamId: 'team1',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    message: 'I can take the competitor analysis task. I\'ve already started gathering some data.',
    createdAt: '2024-03-06T09:15:00Z',
  },
  {
    id: 'msg3',
    teamId: 'team1',
    userId: '3',
    userName: 'Mike Roberts',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    message: 'Great! I\'ll support with customer interviews. I have some contacts we can reach out to.',
    createdAt: '2024-03-06T09:30:00Z',
  },
  {
    id: 'msg4',
    teamId: 'team1',
    userId: '4',
    userName: 'Emily Watson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    message: 'I\'ll prepare the interview script and questions. Should have it ready by EOD.',
    createdAt: '2024-03-06T10:00:00Z',
  },
];

// Mock Wallet Transactions
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'wt1',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Sarah Chen',
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'wt2',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Mike Roberts',
    createdAt: '2024-02-10T09:15:00Z',
  },
  {
    id: 'wt3',
    userId: '1',
    type: 'bonus',
    amount: 50,
    description: 'Early adopter bonus',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'wt4',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Emily Watson',
    createdAt: '2024-02-20T16:45:00Z',
  },
  {
    id: 'wt5',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - David Kim',
    createdAt: '2024-02-28T11:20:00Z',
  },
  {
    id: 'wt6',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Lisa Park',
    createdAt: '2024-03-01T14:00:00Z',
  },
  {
    id: 'wt7',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - James Wilson',
    createdAt: '2024-03-03T09:30:00Z',
  },
  {
    id: 'wt8',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Anna Martinez',
    createdAt: '2024-03-05T16:00:00Z',
  },
  {
    id: 'wt9',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Tom Brown',
    createdAt: '2024-03-06T10:00:00Z',
  },
  {
    id: 'wt10',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Rachel Green',
    createdAt: '2024-03-06T11:30:00Z',
  },
  {
    id: 'wt11',
    userId: '1',
    type: 'referral',
    amount: 10,
    description: 'Referral reward - Chris Lee',
    createdAt: '2024-03-06T13:00:00Z',
  },
];

// Get today's tasks based on available time
export const getTodaysTasks = (userRole: string, availableHours: number) => {
  const allTasks = mockPrograms.flatMap(p => 
    p.phases.flatMap(ph => 
      ph.weeks.flatMap(w => w.tasks)
    )
  );
  
  const roleTasks = allTasks.filter(t => t.assignedRole === userRole);
  const pendingTasks = roleTasks.filter(t => 
    !mockSubmissions.some(s => s.taskId === t.id && s.status === 'approved')
  );
  
  // Simple scheduling algorithm
  let scheduledHours = 0;
  return pendingTasks.filter(task => {
    if (scheduledHours + task.estimatedTime <= availableHours) {
      scheduledHours += task.estimatedTime;
      return true;
    }
    return false;
  });
};
