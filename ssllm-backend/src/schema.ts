// ============================================================
// schema.ts — TypeScript type definitions matching the Prisma models
// These types can be shared between frontend and backend
// ============================================================

// ─── Department ──────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string | null;
  status: string;
  joinDate: Date;
  progress: number;
  skillsCompleted: number;
  lastActive: Date;
  skills?: UserSkill[];
  notifications?: Notification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  avatar?: string;
  status?: string;
  progress?: number;
  skillsCompleted?: number;
}

// ─── Skill ───────────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  category: string;
  requiredLevel: number;
  active: boolean;
  userSkills?: UserSkill[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  requiredLevel?: number;
  active?: boolean;
}

export interface UpdateSkillInput {
  name?: string;
  category?: string;
  requiredLevel?: number;
  active?: boolean;
}

// ─── UserSkill (join table) ──────────────────────────────────
export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  level: number;
  user?: User;
  skill?: Skill;
}

// ─── Project ─────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  status: string;
  progress: number;
  dueDate: Date;
  mentor: string | null;
  assignedTo: string | null;
  priority: string;
  githubUrl: string | null;
  submission: string | null;
  feedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  difficulty?: string;
  status?: string;
  progress?: number;
  dueDate: string;
  mentor?: string;
  assignedTo?: string;
  priority?: string;
  githubUrl?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  difficulty?: string;
  status?: string;
  progress?: number;
  dueDate?: string;
  mentor?: string;
  assignedTo?: string;
  priority?: string;
  githubUrl?: string;
  submission?: string;
  feedback?: string;
}

// ─── Lecture ─────────────────────────────────────────────────
export interface Lecture {
  id: string;
  title: string;
  instructor: string;
  date: Date;
  duration: number;
  description: string;
  status: string;
  joinUrl: string | null;
  recordingUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLectureInput {
  title: string;
  instructor: string;
  date: string;
  duration: number;
  description: string;
  status?: string;
  joinUrl?: string;
  recordingUrl?: string;
}

// ─── Recommendation ─────────────────────────────────────────
export interface Recommendation {
  id: string;
  title: string;
  type: string;
  provider: string;
  duration: string;
  difficulty: string;
  tags: string[];
  priority: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecommendationInput {
  title: string;
  type: string;
  provider: string;
  duration: string;
  difficulty: string;
  tags: string[];
  priority?: string;
  description: string;
}

// ─── Certificate ─────────────────────────────────────────────
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date | null;
  credentialId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCertificateInput {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  status?: string;
}

// ─── Notification ────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId: string | null;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  type?: string;
  userId?: string;
}

// ─── Analytics ───────────────────────────────────────────────
export interface AnalyticsEntry {
  id: string;
  category: string;
  key: string;
  value: number;
  createdAt: Date;
}

export interface AnalyticsResponse {
  skillProgress: { month: string; completed: number }[];
  learningHours: { day: string; hours: number }[];
  skillDistribution: { category: string; value: number }[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    completedProjects: number;
    totalSkills: number;
    activeSkills: number;
  };
}

// ─── API Response Types ──────────────────────────────────────
export interface ApiError {
  error: string;
}

export interface ApiSuccess {
  message: string;
}
