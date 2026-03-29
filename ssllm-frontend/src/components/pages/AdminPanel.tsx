"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  BookOpen,
  Target,
  Award,
  Calendar,
  BarChart3,
  UserPlus,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
  X
} from "lucide-react"
import {
  fetchUsers,
  fetchProjects,
  fetchSkills,
  fetchAnalytics,
  createUser,
  deleteUser,
  createProject,
  deleteProject,
  createSkill,
  deleteSkill,
  updateUser,
  updateProject,
  updateSkill,
} from "@/lib/api"

const inputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Data states
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0, activeUsers: 0,
    totalProjects: 0, completedProjects: 0,
    totalSkills: 0, activeSkills: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Edit states
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [editingSkill, setEditingSkill] = useState<any>(null)

  // New User form
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", department: "Engineering", status: "Active" })
  // New Project form
  const [newProject, setNewProject] = useState({ title: "", description: "", status: "Not Started", priority: "Medium", difficulty: "Intermediate", dueDate: "" })
  // New Skill form
  const [newSkill, setNewSkill] = useState({ name: "", category: "Programming", requiredLevel: 1 })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [usersData, projectsData, skillsData, analyticsData] = await Promise.all([
        fetchUsers(), fetchProjects(), fetchSkills(), fetchAnalytics(),
      ])
      setUsers(usersData)
      setProjects(projectsData)
      setSkills(skillsData)
      setStats(analyticsData.stats)
    } catch (err: any) {
      console.error("Failed to load admin data:", err)
      setError(err.message || "Failed to load data from server")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedDepartment !== "all" && user.department !== selectedDepartment) return false
      return true
    })
  }, [users, searchQuery, selectedDepartment])

  // --- CRUD Handlers ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await createUser(newUser)
      setNewUser({ name: "", email: "", role: "", department: "Engineering", status: "Active" })
      setShowAddUser(false)
      await loadData()
      showSuccess("User created successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setIsSubmitting(true)
      await updateUser(editingUser.id, { name: editingUser.name, email: editingUser.email, role: editingUser.role, department: editingUser.department, status: editingUser.status })
      setEditingUser(null)
      await loadData()
      showSuccess("User updated successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try { await deleteUser(id); setUsers(prev => prev.filter(u => u.id !== id)); showSuccess("User deleted.") }
    catch (err: any) { alert(err.message) }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await createProject(newProject)
      setNewProject({ title: "", description: "", status: "Not Started", priority: "Medium", difficulty: "Intermediate", dueDate: "" })
      setShowAddProject(false)
      await loadData()
      showSuccess("Project created successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    try {
      setIsSubmitting(true)
      await updateProject(editingProject.id, { title: editingProject.title, description: editingProject.description, status: editingProject.status, priority: editingProject.priority })
      setEditingProject(null)
      await loadData()
      showSuccess("Project updated successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return
    try { await deleteProject(id); setProjects(prev => prev.filter(p => p.id !== id)); showSuccess("Project deleted.") }
    catch (err: any) { alert(err.message) }
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await createSkill({ ...newSkill, active: true })
      setNewSkill({ name: "", category: "Programming", requiredLevel: 1 })
      setShowAddSkill(false)
      await loadData()
      showSuccess("Skill created successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSkill) return
    try {
      setIsSubmitting(true)
      await updateSkill(editingSkill.id, { name: editingSkill.name, category: editingSkill.category, requiredLevel: editingSkill.requiredLevel, active: editingSkill.active })
      setEditingSkill(null)
      await loadData()
      showSuccess("Skill updated successfully!")
    } catch (err: any) { alert(err.message) }
    finally { setIsSubmitting(false) }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return
    try { await deleteSkill(id); setSkills(prev => prev.filter(s => s.id !== id)); showSuccess("Skill deleted.") }
    catch (err: any) { alert(err.message) }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success"; case "Completed": return "success"
      case "In Progress": return "warning"; case "Inactive": case "Not Started": return "secondary"
      default: return "secondary"
    }
  }
  const getPriorityColor = (p: string) => { return p === "High" ? "destructive" : p === "Medium" ? "warning" : "secondary" }

  if (loading) {
    return (<div className="flex items-center justify-center min-h-[400px]"><div className="flex flex-col items-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="text-muted-foreground">Loading admin data...</p></div></div>)
  }
  if (error) {
    return (<div className="flex items-center justify-center min-h-[400px]"><Card className="max-w-md"><CardContent className="flex flex-col items-center gap-4 pt-6"><AlertCircle className="h-12 w-12 text-red-500" /><p className="text-center text-muted-foreground">{error}</p><Button onClick={loadData}>Retry</Button></CardContent></Card></div>)
  }

  const departments = [...new Set(users.map((u: any) => u.department).filter(Boolean))]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage users, projects, and system settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" size="sm">
            <BarChart3 className="h-4 w-4" /> Analytics
          </Button>
          <Button className="gap-2" size="sm" onClick={loadData}>
            <Settings className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
          <CheckCircle className="h-5 w-5" /><span className="font-medium">{successMsg}</span>
        </motion.div>
      )}

      {/* Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "" },
          { label: "Active Users", value: stats.activeUsers, icon: TrendingUp, color: "text-green-600" },
          { label: "Total Projects", value: stats.totalProjects, icon: FileText, color: "" },
          { label: "Completed", value: stats.completedProjects, icon: Award, color: "text-blue-600" },
          { label: "Total Skills", value: stats.totalSkills, icon: BookOpen, color: "" },
          { label: "Active Skills", value: stats.activeSkills, icon: Target, color: "text-purple-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ===== USERS TAB ===== */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Management ({users.length})</CardTitle>
                <Button className="gap-2" onClick={() => { setShowAddUser(!showAddUser); setEditingUser(null) }}>
                  {showAddUser ? <><X className="h-4 w-4" /> Cancel</> : <><UserPlus className="h-4 w-4" /> Add User</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add User Form */}
              {showAddUser && (
                <form onSubmit={handleCreateUser} className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-4">
                  <h4 className="font-medium">Create New User</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input required placeholder="Full Name" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className={inputClasses} />
                    <input required type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className={inputClasses} />
                    <input required placeholder="Role" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className={inputClasses} />
                    <Select value={newUser.department} onValueChange={v => setNewUser(p => ({ ...p, department: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newUser.status} onValueChange={v => setNewUser(p => ({ ...p, status: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create User"}</Button>
                  </div>
                </form>
              )}

              {/* Edit User Form */}
              {editingUser && (
                <form onSubmit={handleUpdateUser} className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 rounded-lg space-y-4">
                  <h4 className="font-medium">Edit User: {editingUser.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input required placeholder="Full Name" value={editingUser.name} onChange={e => setEditingUser((p: any) => ({ ...p, name: e.target.value }))} className={inputClasses} />
                    <input required type="email" placeholder="Email" value={editingUser.email} onChange={e => setEditingUser((p: any) => ({ ...p, email: e.target.value }))} className={inputClasses} />
                    <input required placeholder="Role" value={editingUser.role} onChange={e => setEditingUser((p: any) => ({ ...p, role: e.target.value }))} className={inputClasses} />
                    <Select value={editingUser.department} onValueChange={v => setEditingUser((p: any) => ({ ...p, department: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={editingUser.status} onValueChange={v => setEditingUser((p: any) => ({ ...p, status: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              )}

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="Search users by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`${inputClasses} pl-10`} />
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {filteredUsers.map((user: any) => (
                  <motion.div key={user.id} layout className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                        {user.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{user.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          <Badge variant="outline" className="text-xs">{user.department}</Badge>
                          <Badge variant={getStatusColor(user.status) as any} className="text-xs">{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-sm text-muted-foreground">
                        <span>Progress: {user.progress}%</span>
                        <Progress value={user.progress} className="w-20 mt-1" />
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => { setEditingUser({ ...user }); setShowAddUser(false) }}><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredUsers.length === 0 && <p className="text-center text-muted-foreground py-8">No users found matching your filters.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== PROJECTS TAB ===== */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Project Management ({projects.length})</CardTitle>
                <Button className="gap-2" onClick={() => { setShowAddProject(!showAddProject); setEditingProject(null) }}>
                  {showAddProject ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Create Project</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddProject && (
                <form onSubmit={handleCreateProject} className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-4">
                  <h4 className="font-medium">Create New Project</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input required placeholder="Project Title" value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} className={inputClasses} />
                    <input placeholder="Description" value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} className={inputClasses} />
                    <input type="date" required value={newProject.dueDate} onChange={e => setNewProject(p => ({ ...p, dueDate: e.target.value }))} className={inputClasses} />
                    <Select value={newProject.status} onValueChange={v => setNewProject(p => ({ ...p, status: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newProject.priority} onValueChange={v => setNewProject(p => ({ ...p, priority: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newProject.difficulty} onValueChange={v => setNewProject(p => ({ ...p, difficulty: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddProject(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Project"}</Button>
                  </div>
                </form>
              )}

              {editingProject && (
                <form onSubmit={handleUpdateProject} className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 rounded-lg space-y-4">
                  <h4 className="font-medium">Edit Project: {editingProject.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input required placeholder="Title" value={editingProject.title} onChange={e => setEditingProject((p: any) => ({ ...p, title: e.target.value }))} className={inputClasses} />
                    <input placeholder="Description" value={editingProject.description || ""} onChange={e => setEditingProject((p: any) => ({ ...p, description: e.target.value }))} className={inputClasses} />
                    <Select value={editingProject.status} onValueChange={v => setEditingProject((p: any) => ({ ...p, status: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={editingProject.priority} onValueChange={v => setEditingProject((p: any) => ({ ...p, priority: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {projects.map((project: any) => (
                  <motion.div key={project.id} layout className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{project.description || "No description"}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <Badge variant={getStatusColor(project.status) as any}>{project.status}</Badge>
                        <Badge variant={getPriorityColor(project.priority) as any}>{project.priority}</Badge>
                        {project.difficulty && <Badge variant="outline">{project.difficulty}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => { setEditingProject({ ...project }); setShowAddProject(false) }}><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {projects.length === 0 && <p className="text-center text-muted-foreground py-8">No projects found.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SKILLS TAB ===== */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Skill Management ({skills.length})</CardTitle>
                <Button className="gap-2" onClick={() => { setShowAddSkill(!showAddSkill); setEditingSkill(null) }}>
                  {showAddSkill ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Skill</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddSkill && (
                <form onSubmit={handleCreateSkill} className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-4">
                  <h4 className="font-medium">Create New Skill</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input required placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill(p => ({ ...p, name: e.target.value }))} className={inputClasses} />
                    <Select value={newSkill.category} onValueChange={v => setNewSkill(p => ({ ...p, category: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="number" min="1" max="10" required placeholder="Required Level" value={newSkill.requiredLevel} onChange={e => setNewSkill(p => ({ ...p, requiredLevel: Number(e.target.value) }))} className={inputClasses} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddSkill(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Skill"}</Button>
                  </div>
                </form>
              )}

              {editingSkill && (
                <form onSubmit={handleUpdateSkill} className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 rounded-lg space-y-4">
                  <h4 className="font-medium">Edit Skill: {editingSkill.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input required placeholder="Skill Name" value={editingSkill.name} onChange={e => setEditingSkill((p: any) => ({ ...p, name: e.target.value }))} className={inputClasses} />
                    <Select value={editingSkill.category} onValueChange={v => setEditingSkill((p: any) => ({ ...p, category: v }))}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="number" min="1" max="10" required value={editingSkill.requiredLevel} onChange={e => setEditingSkill((p: any) => ({ ...p, requiredLevel: Number(e.target.value) }))} className={inputClasses} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingSkill(null)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill: any) => (
                  <motion.div key={skill.id} layout>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-muted-foreground">{skill.category}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingSkill({ ...skill }); setShowAddSkill(false) }}><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Level {skill.requiredLevel}</Badge>
                          <Badge variant={skill.active ? "default" : "secondary"} className={skill.active ? "bg-green-600" : ""}>
                            {skill.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {skill.userSkills && (
                          <p className="text-xs text-muted-foreground mt-2">{skill.userSkills.length} user(s) enrolled</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {skills.length === 0 && <p className="text-center text-muted-foreground py-8">No skills found.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Track user activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Total Users</span><span className="font-bold">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Active Users</span><span className="font-bold text-green-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0} className="w-20" />
                      <span className="font-bold">{stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Active Skills</span><span className="font-bold">{stats.activeSkills}/{stats.totalSkills}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span>System Status</span><Badge variant="default" className="bg-green-600">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>API Server</span><Badge variant="default" className="bg-green-600">Port 5000</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Database</span><Badge variant="default" className="bg-green-600">PostgreSQL</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Total Records</span><span className="font-bold">{stats.totalUsers + stats.totalProjects + stats.totalSkills}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
