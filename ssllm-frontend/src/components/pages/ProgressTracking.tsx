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
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  BarChart3,
  Activity,
  CheckCircle,
  Loader2,
  Star,
  Users
} from "lucide-react"
import { fetchUsers, fetchSkills, fetchProjects, fetchAnalytics, fetchCertificates, fetchLectures } from "@/lib/api"
import { ChartContainer } from "@/components/ui/chart-container"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function ProgressTracking() {
  const [selectedMetric, setSelectedMetric] = useState("skills")
  const [loading, setLoading] = useState(true)

  // Live data from backend
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  const loadData = useCallback(async () => {
    try {
      const [usersData, skillsData, projectsData, certsData, lecturesData, analyticsData] = await Promise.all([
        fetchUsers(),
        fetchSkills(),
        fetchProjects(),
        fetchCertificates(),
        fetchLectures(),
        fetchAnalytics(),
      ])

      setUsers(usersData)
      if (usersData.length > 0 && !selectedUserId) {
        setSelectedUserId(usersData[0].id)
        setUser(usersData[0])
      }

      // Map skills with user levels
      const mapped = skillsData.map((skill: any) => {
        const us = skill.userSkills && skill.userSkills.length > 0 ? skill.userSkills[0] : null
        return { ...skill, level: us ? us.level : 0 }
      })
      setSkills(mapped)
      setProjects(projectsData)
      setCertificates(certsData)
      setLectures(lecturesData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error("Failed to load progress data:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedUserId])

  useEffect(() => { loadData() }, [loadData])

  // When user changes, update skills for that user
  useEffect(() => {
    if (selectedUserId && users.length > 0) {
      const found = users.find((u: any) => u.id === selectedUserId)
      if (found) setUser(found)
    }
  }, [selectedUserId, users])

  // Computed data from real backend data
  const masteredSkills = useMemo(() => skills.filter(s => s.level >= s.requiredLevel), [skills])
  const inProgressSkills = useMemo(() => skills.filter(s => s.level < s.requiredLevel && s.level > 0), [skills])
  const notStartedSkills = useMemo(() => skills.filter(s => s.level === 0), [skills])

  const completionRate = useMemo(() => {
    return skills.length > 0 ? (masteredSkills.length / skills.length) * 100 : 0
  }, [skills, masteredSkills])

  const completedProjects = useMemo(() => projects.filter(p => p.status === "Completed"), [projects])
  const activeProjects = useMemo(() => projects.filter(p => p.status === "In Progress"), [projects])

  // Build chart data from analytics (real backend data)
  const skillProgressChartData = useMemo(() => {
    if (analytics?.skillProgress) return analytics.skillProgress.map((d: any) => ({ month: d.month, value: d.completed }))
    return []
  }, [analytics])

  const learningHoursChartData = useMemo(() => {
    if (analytics?.learningHours) return analytics.learningHours
    return []
  }, [analytics])

  const skillDistributionData = useMemo(() => {
    // Group skills by category, count per category
    const categoryMap: Record<string, number> = {}
    skills.forEach(s => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + 1
    })
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [skills])

  const achievementData = useMemo(() => [
    { name: "Mastered", value: masteredSkills.length },
    { name: "In Progress", value: inProgressSkills.length },
    { name: "Not Started", value: notStartedSkills.length },
  ], [masteredSkills, inProgressSkills, notStartedSkills])

  const getMetricData = () => {
    switch (selectedMetric) {
      case "skills": return skillProgressChartData
      case "hours": return learningHoursChartData.map((d: any) => ({ month: d.day, value: d.hours }))
      default: return skillProgressChartData
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading progress data...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Progress Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your learning progress and achievements
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {users.length > 0 && (
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" className="gap-2" size="sm">
            <BarChart3 className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* User Summary Banner */}
      {user && (
        <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role} • {user.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.progress || 0}%</div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
                <Progress value={user.progress || 0} className="w-32" />
                <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-green-600" : ""}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Stats - All from real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skill Completion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {masteredSkills.length} of {skills.length} skills mastered
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects.length}/{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {activeProjects.length} in progress
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{certificates.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Credentials earned
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Completed</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user?.skillsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                All time total
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Trend</CardTitle>
                <CardDescription>Skill completion over time (from analytics)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {[
                    { value: "skills", label: "Skills" },
                    { value: "hours", label: "Hours" },
                  ].map((metric) => (
                    <Button
                      key={metric.value}
                      variant={selectedMetric === metric.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMetric(metric.value)}
                    >
                      {metric.label}
                    </Button>
                  ))}
                </div>
                <ChartContainer height={300}>
                  <AreaChart data={getMetricData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Hours</CardTitle>
                <CardDescription>Hours spent on learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <BarChart data={learningHoursChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#82ca9d" name="Hours" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SKILLS TAB */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress Details</CardTitle>
              <CardDescription>
                Detailed breakdown of {user?.name}'s skill development — {masteredSkills.length} mastered, {inProgressSkills.length} in progress, {notStartedSkills.length} not started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill: any) => {
                  const pct = skill.requiredLevel > 0 ? (skill.level / skill.requiredLevel) * 100 : 0
                  const isMastered = skill.level >= skill.requiredLevel
                  return (
                    <motion.div key={skill.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium">{skill.name}</h4>
                          <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                          {isMastered && (
                            <Badge variant="default" className="gap-1 bg-green-600 text-xs">
                              <CheckCircle className="h-3 w-3" /> Mastered
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level {skill.level}/{skill.requiredLevel} ({Math.min(pct, 100).toFixed(0)}%)
                        </div>
                      </div>
                      <Progress value={Math.min(pct, 100)} className={isMastered ? "[&>div]:bg-green-600" : ""} />
                    </motion.div>
                  )
                })}
                {skills.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No skills data available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
                <CardDescription>Breakdown of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Completed", count: completedProjects.length, color: "bg-green-500", textColor: "text-green-600" },
                    { label: "In Progress", count: activeProjects.length, color: "bg-blue-500", textColor: "text-blue-600" },
                    { label: "Not Started", count: projects.filter(p => p.status === "Not Started").length, color: "bg-gray-400", textColor: "text-gray-600" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className={`text-xl font-bold ${item.textColor}`}>{item.count}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <span className="font-medium">Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0} className="w-24" />
                      <span className="font-bold">{projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>{projects.length} total projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {projects.map((project: any) => (
                    <div key={project.id} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{project.description || "No description"}</p>
                        </div>
                        <Badge variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "secondary" : "outline"} className={project.status === "Completed" ? "bg-green-600" : ""}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.priority && <Badge variant="outline" className="text-xs">{project.priority}</Badge>}
                        {project.difficulty && <Badge variant="outline" className="text-xs">{project.difficulty}</Badge>}
                        {project.dueDate && <span className="text-xs text-muted-foreground">Due: {new Date(project.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-center text-muted-foreground py-8">No projects found.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Breakdown of skills by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <PieChart>
                    <Pie
                      data={achievementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }: any) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {achievementData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements Summary</CardTitle>
                <CardDescription>{user?.name}'s accomplishments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <div className="font-medium">{masteredSkills.length} Skills Mastered</div>
                    <div className="text-sm text-muted-foreground">
                      {masteredSkills.length > 0 ? masteredSkills.map((s: any) => s.name).join(", ") : "Keep learning!"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-medium">{completedProjects.length} Projects Completed</div>
                    <div className="text-sm text-muted-foreground">
                      {completedProjects.length > 0 ? completedProjects.map((p: any) => p.title).join(", ") : "Start a project!"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-600 shrink-0" />
                  <div>
                    <div className="font-medium">{certificates.length} Certificates Earned</div>
                    <div className="text-sm text-muted-foreground">
                      {certificates.length > 0 ? certificates.map((c: any) => c.title).join(", ") : "Earn your first certificate!"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 shrink-0" />
                  <div>
                    <div className="font-medium">{skills.length} Total Skills Tracked</div>
                    <div className="text-sm text-muted-foreground">
                      Across {skillDistributionData.length} categories: {skillDistributionData.map(d => d.name).join(", ")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Skills by Category</CardTitle>
              <CardDescription>Distribution of skills across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={250}>
                <BarChart data={skillDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Skills" radius={[4, 4, 0, 0]}>
                    {skillDistributionData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
