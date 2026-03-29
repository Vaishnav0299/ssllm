// ============================================================
// api.ts — Frontend API client for SSLLM backend
// ============================================================

const API_BASE = "http://localhost:5000/api";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `API Error: ${res.status}`);
  }

  return res.json();
}

// ─── Users ────────────────────────────────────────────────────
export async function fetchUsers(params?: { department?: string; search?: string; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.department) searchParams.set("department", params.department);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiFetch<any[]>(`/users${qs ? `?${qs}` : ""}`);
}

export async function fetchUser(id: string) {
  return apiFetch<any>(`/users/${id}`);
}

export async function createUser(data: { name: string; email: string; role: string; department: string; status?: string }) {
  return apiFetch<any>("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function updateUser(id: string, data: any) {
  return apiFetch<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteUser(id: string) {
  return apiFetch<any>(`/users/${id}`, { method: "DELETE" });
}

// ─── Projects ─────────────────────────────────────────────────
export async function fetchProjects(params?: { status?: string; difficulty?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.difficulty) searchParams.set("difficulty", params.difficulty);
  const qs = searchParams.toString();
  return apiFetch<any[]>(`/projects${qs ? `?${qs}` : ""}`);
}

export async function fetchProject(id: string) {
  return apiFetch<any>(`/projects/${id}`);
}

export async function createProject(data: any) {
  return apiFetch<any>("/projects", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProject(id: string, data: any) {
  return apiFetch<any>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProject(id: string) {
  return apiFetch<any>(`/projects/${id}`, { method: "DELETE" });
}

// ─── Skills ───────────────────────────────────────────────────
export async function fetchSkills(params?: { category?: string; active?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.active !== undefined) searchParams.set("active", String(params.active));
  const qs = searchParams.toString();
  return apiFetch<any[]>(`/skills${qs ? `?${qs}` : ""}`);
}

export async function createSkill(data: { name: string; category: string; requiredLevel?: number; active?: boolean }) {
  return apiFetch<any>("/skills", { method: "POST", body: JSON.stringify(data) });
}

export async function updateSkill(id: string, data: any) {
  return apiFetch<any>(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteSkill(id: string) {
  return apiFetch<any>(`/skills/${id}`, { method: "DELETE" });
}

// ─── Lectures ─────────────────────────────────────────────────
export async function fetchLectures(params?: { status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiFetch<any[]>(`/lectures${qs ? `?${qs}` : ""}`);
}

export async function createLecture(data: any) {
  return apiFetch<any>("/lectures", { method: "POST", body: JSON.stringify(data) });
}

export async function updateLecture(id: string, data: any) {
  return apiFetch<any>(`/lectures/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteLecture(id: string) {
  return apiFetch<any>(`/lectures/${id}`, { method: "DELETE" });
}

// ─── Recommendations ─────────────────────────────────────────
export async function fetchRecommendations() {
  return apiFetch<any[]>("/recommendations");
}

export async function createRecommendation(data: any) {
  return apiFetch<any>("/recommendations", { method: "POST", body: JSON.stringify(data) });
}

export async function updateRecommendation(id: string, data: any) {
  return apiFetch<any>(`/recommendations/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteRecommendation(id: string) {
  return apiFetch<any>(`/recommendations/${id}`, { method: "DELETE" });
}

// ─── Certificates ─────────────────────────────────────────────
export async function fetchCertificates() {
  return apiFetch<any[]>("/certificates");
}

export async function createCertificate(data: any) {
  return apiFetch<any>("/certificates", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCertificate(id: string, data: any) {
  return apiFetch<any>(`/certificates/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCertificate(id: string) {
  return apiFetch<any>(`/certificates/${id}`, { method: "DELETE" });
}

// ─── Notifications ────────────────────────────────────────────
export async function fetchNotifications(params?: { userId?: string; unreadOnly?: boolean }) {
  const searchParams = new URLSearchParams();
  if (params?.userId) searchParams.set("userId", params.userId);
  if (params?.unreadOnly) searchParams.set("unreadOnly", "true");
  const qs = searchParams.toString();
  return apiFetch<any[]>(`/notifications${qs ? `?${qs}` : ""}`);
}

export async function markNotificationRead(id: string) {
  return apiFetch<any>(`/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsRead(userId?: string) {
  const qs = userId ? `?userId=${userId}` : "";
  return apiFetch<any>(`/notifications/read-all${qs}`, { method: "PUT" });
}

// ─── Analytics ────────────────────────────────────────────────
export async function fetchAnalytics() {
  return apiFetch<{
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
  }>("/analytics");
}

// ─── Chatbot ──────────────────────────────────────────────────
export async function sendChatMessage(message: string, history: any[] = []) {
  return apiFetch<{ text: string }>("/chatbot", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}

// ─── Health Check ─────────────────────────────────────────────
export async function checkHealth() {
  return apiFetch<{ status: string; timestamp: string }>("/health");
}
