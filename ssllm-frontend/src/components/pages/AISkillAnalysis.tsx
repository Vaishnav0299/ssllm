"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BookOpen,
  Calendar,
  BarChart3
} from "lucide-react"
import { fetchUsers, fetchSkills } from "@/lib/api"
import { ChartContainer } from "@/components/ui/chart-container"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function AISkillAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months")
  const [user, setUser] = useState<any>({ name: "User", role: "Intern" })
  const [skills, setSkills] = useState<any[]>([])

  const loadData = useCallback(async () => {
    try {
      const [usersData, skillsData] = await Promise.all([
        fetchUsers(),
        fetchSkills(),
      ])
      if (usersData.length > 0) setUser(usersData[0])
      
      const mappedSkills = skillsData.map((skill: any) => {
        const userSkill = skill.userSkills && skill.userSkills.length > 0 ? skill.userSkills[0] : null
        return {
          ...skill,
          level: userSkill ? userSkill.level : 0
        }
      })
      setSkills(mappedSkills)
    } catch (err) {
      console.error("Failed to load skill analysis data:", err)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const skillAnalysis = useMemo(() => {
    const mastered = skills.filter(s => s.level >= s.requiredLevel)
    const inProgress = skills.filter(s => s.level < s.requiredLevel && s.level > 0)
    const missing = skills.filter(s => s.level === 0)
    const critical = skills.filter(s => s.requiredLevel - s.level >= 3)

    return {
      total: skills.length,
      mastered: mastered.length,
      inProgress: inProgress.length,
      missing: missing.length,
      critical: critical.length,
      completionRate: (mastered.length / skills.length) * 100
    }
  }, [skills])

  const radarData = useMemo(() => {
    return skills.map(skill => ({
      skill: skill.name,
      current: skill.level,
      required: skill.requiredLevel,
      fullMark: 5,
    }))
  }, [skills])

  const learningRoadmap = useMemo(() => {
    return skills
      .filter(s => s.level < s.requiredLevel)
      .sort((a, b) => (b.requiredLevel - b.level) - (a.requiredLevel - a.level))
      .slice(0, 6)
      .map(skill => ({
        name: skill.name,
        currentLevel: skill.level,
        targetLevel: skill.requiredLevel,
        priority: skill.requiredLevel - skill.level >= 3 ? "High" : skill.requiredLevel - skill.level >= 2 ? "Medium" : "Low",
        estimatedTime: `${(skill.requiredLevel - skill.level) * 2} weeks`,
        category: skill.category,
      }))
  }, [skills])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "warning"
      case "Low": return "secondary"
      default: return "secondary"
    }
  }

  const topGaps = useMemo(() => {
    return skills
      .filter(s => s.level < s.requiredLevel)
      .sort((a, b) => (b.requiredLevel - b.level) - (a.requiredLevel - a.level))
      .slice(0, 2)
      .map(s => s.name)
  }, [skills])

  const focusMessage = topGaps.length > 0 
    ? `Prioritize ${topGaps.join(" and ")} development - these are critical for your role and have the highest skill gaps.`
    : `Great job! You have no critical skill gaps. Focus on maintaining and expanding your expertise.`

  const courseRecommendation = topGaps.length > 0
    ? `Enroll in ${topGaps[0]} Advanced Course`
    : `Explore new advanced courses`

  const studyGroupRecommendation = topGaps.length > 1
    ? `Join ${topGaps[1]} Study Group`
    : topGaps.length === 1 
      ? `Join ${topGaps[0]} Study Group`
      : `Start a mentoring group`

  const practiceMessage = topGaps.length > 0
    ? `You learn best with hands-on projects. Consider starting a project focused on ${topGaps[0]} to apply your skills.`
    : `You learn best with hands-on projects. Consider mentoring others to reinforce your skills.`

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return AlertTriangle
      case "Medium": return TrendingUp
      case "Low": return Clock
      default: return Clock
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
            AI Skill Gap Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized insights and learning roadmap powered by AI
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed Report
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Generate Plan
          </Button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{user.name}</div>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{skillAnalysis.mastered}</div>
              <p className="text-sm text-muted-foreground">Skills Mastered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{skillAnalysis.inProgress}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{skillAnalysis.critical}</div>
              <p className="text-sm text-muted-foreground">Critical Gaps</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Skill Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Overview</CardTitle>
              <CardDescription>
                Visual representation of your current vs required skill levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Required Level"
                    dataKey="required"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{skillAnalysis.completionRate.toFixed(1)}%</div>
                <Progress value={skillAnalysis.completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{skillAnalysis.critical}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{skillAnalysis.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Skills being developed
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Not Started</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{skillAnalysis.missing}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  New skills to learn
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current vs Required Skills</CardTitle>
              <CardDescription>
                Detailed comparison of your skill levels against requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skills.map((skill) => {
                  const percentage = (skill.level / skill.requiredLevel) * 100
                  const gap = skill.requiredLevel - skill.level
                  
                  return (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{skill.name}</h4>
                          <Badge variant="outline">{skill.category}</Badge>
                          {gap > 0 && (
                            <Badge variant={gap >= 3 ? "destructive" : gap >= 2 ? "warning" : "secondary"}>
                              Gap: {gap}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {skill.level}/{skill.requiredLevel}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Current Level</span>
                            <span>{skill.level}</span>
                          </div>
                          <Progress value={(skill.level / 5) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Required Level</span>
                            <span>{skill.requiredLevel}</span>
                          </div>
                          <Progress value={(skill.requiredLevel / 5) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personalized Learning Roadmap
              </CardTitle>
              <CardDescription>
                AI-generated learning path based on your skill gaps and career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningRoadmap.map((item, index) => {
                  const PriorityIcon = getPriorityIcon(item.priority)
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant={getPriorityColor(item.priority) as any} className="gap-1">
                            <PriorityIcon className="h-3 w-3" />
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level {item.currentLevel} → {item.targetLevel} • {item.estimatedTime}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Start Learning
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>
                  Personalized recommendations based on your learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    🎯 Focus Area
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {focusMessage}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    📈 Learning Pattern
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {practiceMessage}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    ⏰ Time Management
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your peak learning hours are in the morning. Schedule important learning sessions between 9-11 AM.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Recommended next steps to close your skill gaps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Brain className="h-4 w-4" />
                  Start AI-Powered Learning Path
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <BookOpen className="h-4 w-4" />
                  {courseRecommendation}
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Target className="h-4 w-4" />
                  {studyGroupRecommendation}
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Calendar className="h-4 w-4" />
                  Schedule 1-on-1 Mentor Session
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <BarChart3 className="h-4 w-4" />
                  Download Progress Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
