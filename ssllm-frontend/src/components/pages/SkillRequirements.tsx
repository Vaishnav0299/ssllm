"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  BarChart3,
  Plus
} from "lucide-react"
import { fetchSkills, createSkill } from "@/lib/api"
import { ChartContainer } from "@/components/ui/chart-container"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "Sales" },
  { id: "5", name: "HR" },
]

export function SkillRequirements() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [skills, setSkills] = useState<any[]>([])

  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("Programming")
  const [newSkillLevel, setNewSkillLevel] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await fetchSkills()
      // Map the backend data to extract the user's current level
      const mappedSkills = data.map((skill: any) => {
        const userSkill = skill.userSkills && skill.userSkills.length > 0 ? skill.userSkills[0] : null
        return {
          ...skill,
          level: userSkill ? userSkill.level : 0
        }
      })
      setSkills(mappedSkills)
    } catch (err) {
      console.error("Failed to load skills:", err)
    }
  }, [])

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    
    try {
      setIsSubmitting(true)
      await createSkill({
        name: newSkillName,
        category: newSkillCategory,
        requiredLevel: Number(newSkillLevel),
        active: true
      })
      
      // Reset form variables and close
      setNewSkillName("")
      setNewSkillCategory("Programming")
      setNewSkillLevel(1)
      setIsAddingSkill(false)
      
      // Refresh the skill list instantly
      await loadData()
    } catch (err) {
      console.error("Failed to create skill", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  const categories = useMemo(() => {
    const cats = new Set(skills.map((skill: any) => skill.category))
    return Array.from(cats)
  }, [skills])

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      if (selectedCategory !== "all" && skill.category !== selectedCategory) return false
      return true
    })
  }, [skills, selectedDepartment, selectedCategory])

  const skillGapData = useMemo(() => {
    return filteredSkills.map(skill => ({
      name: skill.name,
      current: skill.level,
      required: skill.requiredLevel,
      gap: Math.max(0, skill.requiredLevel - skill.level),
    }))
  }, [filteredSkills])

  const stats = useMemo(() => {
    const total = filteredSkills.length
    const mastered = filteredSkills.filter(s => s.level >= s.requiredLevel).length
    const inProgress = filteredSkills.filter(s => s.level < s.requiredLevel && s.level > 0).length
    const notStarted = filteredSkills.filter(s => s.level === 0).length
    
    return { total, mastered, inProgress, notStarted }
  }, [filteredSkills])

  const getSkillStatus = (skill: typeof skills[0]) => {
    if (skill.level >= skill.requiredLevel) return { status: "mastered", color: "success", icon: CheckCircle }
    if (skill.level === 0) return { status: "not-started", color: "secondary", icon: AlertCircle }
    return { status: "in-progress", color: "warning", icon: TrendingUp }
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
          <h1 className="text-3xl font-bold gradient-text">Skill Requirements</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress against required skills for your role
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsAddingSkill(!isAddingSkill)} className="gap-2" variant={isAddingSkill ? "secondary" : "default"}>
            <Plus className="h-4 w-4" />
            {isAddingSkill ? "Cancel Formatting" : "Add Skill"}
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            Set Goals
          </Button>
        </div>
      </div>

      {isAddingSkill && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New Skill Requirement</CardTitle>
            <CardDescription>Add a new company-wide skill from the backend that will be synced to all users.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Python, Agile..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingSkill(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Save to Backend"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Gap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
          <CardDescription>
            Comparison between your current skill level and required level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer height={400}>
            <BarChart data={skillGapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#82ca9d" name="Current Level" />
              <Bar dataKey="required" fill="#8884d8" name="Required Level" />
              <Bar dataKey="gap" fill="#ff7c7c" name="Skill Gap" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => {
          const statusInfo = getSkillStatus(skill)
          const progressPercentage = (skill.level / skill.requiredLevel) * 100
          
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass-effect hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant={statusInfo.color as any} className="gap-1">
                      <statusInfo.icon className="h-3 w-3" />
                      {statusInfo.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardDescription>{skill.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{skill.level}/{skill.requiredLevel}</span>
                    </div>
                    <Progress value={progressPercentage} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Gap: {Math.max(0, skill.requiredLevel - skill.level)} levels
                    </div>
                    <Button size="sm" variant="outline">
                      Improve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
