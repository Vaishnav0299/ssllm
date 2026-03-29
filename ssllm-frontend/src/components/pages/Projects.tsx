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
  FolderOpen,
  Plus,
  Filter,
  Calendar,
  User,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  ExternalLink,
  Code,
  FileText,
  Loader2
} from "lucide-react"
import { fetchProjects } from "@/lib/api"

export function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProjects()
      setProjects(data)
    } catch (err: any) {
      console.error("Failed to load projects:", err)
      setError(err.message || "Failed to load projects")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (selectedFilter !== "all" && project.status !== selectedFilter) return false
      if (selectedDifficulty !== "all" && project.difficulty !== selectedDifficulty) return false
      return true
    })
  }, [projects, selectedFilter, selectedDifficulty])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success"
      case "In Progress": return "warning"
      case "Not Started": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return CheckCircle
      case "In Progress": return Play
      case "Not Started": return Clock
      default: return Clock
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "success"
      case "Medium": return "warning"
      case "Hard": return "destructive"
      default: return "secondary"
    }
  }

  const stats = useMemo(() => {
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === "Completed").length,
      inProgress: projects.filter(p => p.status === "In Progress").length,
      notStarted: projects.filter(p => p.status === "Not Started").length,
    }
  }, [projects])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading projects...</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your project assignments and track progress
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const StatusIcon = getStatusIcon(project.status)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getStatusColor(project.status) as any} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {project.status}
                            </Badge>
                            <Badge variant={getDifficultyColor(project.difficulty) as any}>
                              {project.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {project.mentor || "No mentor"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Code className="h-3 w-3 mr-1" />
                          Start Working
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <Badge variant={getStatusColor(project.status) as any}>
                            {project.status}
                          </Badge>
                          <Badge variant={getDifficultyColor(project.difficulty) as any}>
                            {project.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {project.mentor || "No mentor"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            Progress: {project.progress}%
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Code className="h-3 w-3 mr-1" />
                          Work
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={project.progress} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>
                Submit your projects and get feedback from mentors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.filter(p => p.status === "In Progress" || p.status === "Completed").map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge variant={getStatusColor(project.status) as any}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">GitHub Repository</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://github.com/username/project"
                          className="flex-1 px-3 py-2 border rounded-md text-sm"
                          defaultValue={project.githubUrl || ""}
                        />
                        <Button size="sm" variant="outline">
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Live Demo</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://your-project-url.com"
                          className="flex-1 px-3 py-2 border rounded-md text-sm"
                        />
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Submission Notes</label>
                    <textarea
                      placeholder="Describe your project, challenges faced, and key features..."
                      className="w-full px-3 py-2 border rounded-md text-sm h-24 resize-none"
                    />
                  </div>

                  {project.feedback && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Mentor Feedback</span>
                      </div>
                      <p className="text-sm">{project.feedback}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      Submit Project
                    </Button>
                    <Button size="sm" variant="outline">
                      Save Draft
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
