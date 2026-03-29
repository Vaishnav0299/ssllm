"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award,
  Play,
  Clock,
  Users,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { fetchUsers, fetchSkills, fetchProjects, fetchLectures, fetchAnalytics } from "@/lib/api"
import { ChartContainer } from "@/components/ui/chart-container"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function Dashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setError(null)

      const [usersData, skillsData, projectsData, lecturesData, analyticsData] = await Promise.all([
        fetchUsers(),
        fetchSkills(),
        fetchProjects(),
        fetchLectures(),
        fetchAnalytics(),
      ])

      // Use current user, or default to Vaishnav Gaware, or fallback to first user
      setUsers(usersData)
      setUser((prev: any) => {
        if (prev) {
          return usersData.find((u: any) => u.id === prev.id) || usersData[0] || null
        }
        // Default to Vaishnav Gaware
        const vaishnav = usersData.find((u: any) => u.name?.toLowerCase().includes("vaishnav"))
        return vaishnav || usersData[0] || null
      })
      
      setSkills(skillsData)
      setProjects(projectsData)
      setLectures(lecturesData)
      setAnalytics(analyticsData)
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err)
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    // Poll every 10 seconds to keep data dynamic
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-center text-muted-foreground">{error}</p>
            <Button onClick={loadData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeProjects = projects.filter(p => p.status === "In Progress" && p.assignedTo === user?.name)
  const completedProjects = projects.filter(p => p.status === "Completed" && p.assignedTo === user?.name)
  const upcomingLectures = lectures.filter(l => l.status === "upcoming" || l.status === "live")
  
  // Calculate skill stats from user skills
  const userSkills = user?.skills || []
  const completedSkills = userSkills.filter((us: any) => us.level >= (us.skill?.requiredLevel || 99)).length
  const totalSkills = userSkills.length || skills.length

  const skillProgressData = analytics?.skillProgress || []
  const learningHoursData = analytics?.learningHours || []
  const skillDistributionData = analytics?.skillDistribution || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {user?.role} at {user?.department}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {users.length > 0 && (
            <Select value={user?.id || ""} onValueChange={(id) => setUser(users.find(u => u.id === id))}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" className="gap-2 flex-1 sm:flex-initial" size="sm">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="gap-2 flex-1 sm:flex-initial" size="sm">
            <Play className="h-4 w-4" />
            Quick Start
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSkills}/{totalSkills}</div>
              <Progress value={totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0}% completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedProjects.length} completed total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {learningHoursData.reduce((sum: number, d: any) => sum + d.hours, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.skillsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Skills completed
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skill Progress Over Time
            </CardTitle>
            <CardDescription>
              Your skill completion progress for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer height={300}>
              <LineChart data={skillProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Weekly Learning Hours
            </CardTitle>
            <CardDescription>
              Your learning activity this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer height={300}>
              <BarChart data={learningHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Live Lectures</CardTitle>
            <CardDescription>
              Don't miss these learning opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLectures.slice(0, 3).map((lecture) => (
              <div key={lecture.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm sm:text-base truncate">{lecture.title}</h4>
                  <p className="text-sm text-muted-foreground">{lecture.instructor}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant={lecture.status === "live" ? "destructive" : "secondary"}>
                      {lecture.status === "live" ? "LIVE NOW" : "Upcoming"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(lecture.date).toLocaleDateString()} • {new Date(lecture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                {lecture.status === "live" && (
                  <Button size="sm" className="gap-1">
                    <Play className="h-3 w-3" />
                    Join
                  </Button>
                )}
              </div>
            ))}
            {upcomingLectures.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No upcoming lectures</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Your current project assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{project.title}</h4>
                  <Badge variant="outline">{project.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No active projects</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Skills — Personal Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {user?.name ? `${user.name}'s Skills` : "My Skills"}
          </CardTitle>
          <CardDescription>
            {completedSkills} of {totalSkills} skills mastered • Overall progress: {user?.progress || 0}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userSkills.length > 0 ? userSkills
              .sort((a: any, b: any) => {
                const aPct = a.skill ? (a.level / a.skill.requiredLevel) * 100 : 0
                const bPct = b.skill ? (b.level / b.skill.requiredLevel) * 100 : 0
                return bPct - aPct
              })
              .map((us: any) => {
                const pct = us.skill ? Math.min((us.level / us.skill.requiredLevel) * 100, 100) : 0
                const isMastered = us.level >= (us.skill?.requiredLevel || 99)
                return (
                  <div key={us.id} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-sm">{us.skill?.name || "Unknown"}</span>
                        <Badge variant="outline" className="text-xs">{us.skill?.category}</Badge>
                        {isMastered && (
                          <Badge variant="default" className="gap-1 bg-green-600 text-xs">
                            <CheckCircle className="h-3 w-3" /> Mastered
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Level {us.level}/{us.skill?.requiredLevel || "?"} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={pct} className={isMastered ? "[&>div]:bg-green-600" : ""} />
                  </div>
                )
              }) : (
              <p className="text-center text-muted-foreground py-6">No skills assigned yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skill Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
          <CardDescription>
            Breakdown of skills by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer height={300}>
            <PieChart>
              <Pie
                data={skillDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, category }: any) => `${name || category} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="category"
              >
                {skillDistributionData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
