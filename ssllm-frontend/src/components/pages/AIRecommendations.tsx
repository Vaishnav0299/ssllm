"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Brain,
  BookOpen,
  Video,
  Target,
  Clock,
  Star,
  TrendingUp,
  Lightbulb,
  Play,
  ExternalLink,
  Filter,
  Zap,
  Award,
  Users,
  CheckCircle,
  Loader2,
  AlertCircle as AlertCircleIcon
} from "lucide-react"
import { fetchRecommendations, fetchSkills } from "@/lib/api"

export function AIRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [recsData, skillsData] = await Promise.all([
        fetchRecommendations(),
        fetchSkills(),
      ])
      setRecommendations(recsData)
      
      const mappedSkills = skillsData.map((skill: any) => {
        const userSkill = skill.userSkills && skill.userSkills.length > 0 ? skill.userSkills[0] : null
        return {
          ...skill,
          level: userSkill ? userSkill.level : 0
        }
      })
      setSkills(mappedSkills)
    } catch (err) {
      console.error("Failed to load recommendations:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      if (selectedCategory !== "all" && rec.type !== selectedCategory) return false
      if (selectedPriority !== "all" && rec.priority !== selectedPriority) return false
      return true
    })
  }, [selectedCategory, selectedPriority])

  const personalizedInsights = useMemo(() => {
    return [
      {
        title: "Focus on React Development",
        description: "Based on your current skill gaps and career goals, React development should be your top priority this month.",
        action: "Start Learning Path",
        priority: "High"
      },
      {
        title: "Improve TypeScript Skills",
        description: "Your TypeScript level is below the required threshold. Consider taking an advanced course.",
        action: "View Courses",
        priority: "High"
      },
      {
        title: "Join Study Groups",
        description: "Collaborative learning shows 40% better retention. Join relevant study groups.",
        action: "Find Groups",
        priority: "Medium"
      },
      {
        title: "Practice with Projects",
        description: "Apply your skills through hands-on projects for better understanding.",
        action: "Browse Projects",
        priority: "Medium"
      }
    ]
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "warning"
      case "Low": return "secondary"
      default: return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course": return BookOpen
      case "video": return Video
      case "training": return Users
      default: return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course": return "blue"
      case "video": return "green"
      case "training": return "purple"
      default: return "secondary"
    }
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
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized learning suggestions powered by AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Customize
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="glass-effect bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your learning patterns and skill gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant={getPriorityColor(insight.priority) as any}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <Button size="sm" variant="outline">
                  {insight.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Content */}
      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="skill-based">Skill-Based</TabsTrigger>
          <TabsTrigger value="career-path">Career Path</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec, index) => {
              const TypeIcon = getTypeIcon(rec.type)
              
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-${getTypeColor(rec.type)}-100 dark:bg-${getTypeColor(rec.type)}-900`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {rec.type}
                          </Badge> 
                        </div>
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {rec.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {rec.difficulty}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {rec.tags?.map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-3 w-3 mr-1" />
                          Start
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

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Advanced React Patterns",
                provider: "Tech Academy",
                learners: "2.5k",
                rating: 4.8,
                trend: "up"
              },
              {
                title: "TypeScript Mastery",
                provider: "Code Masters",
                learners: "1.8k",
                rating: 4.9,
                trend: "up"
              },
              {
                title: "System Design Fundamentals",
                provider: "Architect Pro",
                learners: "3.2k",
                rating: 4.7,
                trend: "stable"
              },
              {
                title: "Full-Stack Development",
                provider: "Dev School",
                learners: "2.1k",
                rating: 4.6,
                trend: "up"
              }
            ].map((trending, index) => (
              <Card key={index} className="glass-effect">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{trending.rating}</span>
                    </div>
                  </div>
                  <CardTitle>{trending.title}</CardTitle>
                  <CardDescription>{trending.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {trending.learners} learners this month
                    </div>
                    <Button size="sm">View Course</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skill-based" className="space-y-4">
          <div className="space-y-6">
            {skills.filter(s => s.level < s.requiredLevel).slice(0, 3).map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {skill.name}
                      </CardTitle>
                      <CardDescription>
                        Current Level: {skill.level} → Required: {skill.requiredLevel}
                      </CardDescription>
                    </div>
                    <Badge variant="warning">
                      Gap: {skill.requiredLevel - skill.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Recommended Course</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Complete {skill.name} Masterclass
                      </p>
                      <Button size="sm" variant="outline">Enroll</Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Practice Project</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Build a {skill.name} application
                      </p>
                      <Button size="sm" variant="outline">Start</Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Study Group</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Join {skill.name} learning community
                      </p>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="career-path" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Career Development Path
              </CardTitle>
              <CardDescription>
                Recommended learning path to achieve your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    phase: "Foundation",
                    skills: ["JavaScript", "HTML/CSS", "Git"],
                    duration: "2-3 months",
                    completed: true
                  },
                  {
                    phase: "Intermediate",
                    skills: ["React", "TypeScript", "Node.js"],
                    duration: "3-4 months",
                    completed: false
                  },
                  {
                    phase: "Advanced",
                    skills: ["System Design", "DevOps", "Cloud Architecture"],
                    duration: "4-6 months",
                    completed: false
                  }
                ].map((phase, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {phase.completed ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{phase.phase}</h4>
                      <p className="text-sm text-muted-foreground">
                        {phase.skills.join(" • ")} • {phase.duration}
                      </p>
                    </div>
                    <Button size="sm" variant={phase.completed ? "secondary" : "default"}>
                      {phase.completed ? "Completed" : "Start Phase"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
