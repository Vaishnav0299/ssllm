"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award,
  Download,
  Share,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Star,
  TrendingUp,
  Target,
  BookOpen,
  Loader2,
  AlertCircle
} from "lucide-react"
import { fetchCertificates } from "@/lib/api"

export function Certifications() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCertificates()
      setCertificates(data)
    } catch (err: any) {
      console.error("Failed to load certificates:", err)
      setError(err.message || "Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])


  const availableCertifications = useMemo(() => {
    return [
      {
        id: "1",
        title: "React Development Professional",
        provider: "Tech Academy",
        description: "Master React development with hooks, context, and best practices",
        duration: "6 weeks",
        difficulty: "Intermediate",
        skills: ["React", "JavaScript", "HTML/CSS"],
        enrolled: false,
        progress: 0
      },
      {
        id: "2",
        title: "TypeScript Expert",
        provider: "Code Masters",
        description: "Advanced TypeScript concepts and type-safe development",
        duration: "8 weeks",
        difficulty: "Advanced",
        skills: ["TypeScript", "JavaScript", "Node.js"],
        enrolled: true,
        progress: 45
      },
      {
        id: "3",
        title: "Full-Stack Web Development",
        provider: "Dev School",
        description: "Complete full-stack development with modern technologies",
        duration: "12 weeks",
        difficulty: "Intermediate",
        skills: ["React", "Node.js", "Database"],
        enrolled: true,
        progress: 70
      }
    ]
  }, [])

  const achievements = useMemo(() => {
    return [
      {
        title: "Quick Learner",
        description: "Complete 3 certifications in 6 months",
        icon: TrendingUp,
        unlocked: true
      },
      {
        title: "Skill Master",
        description: "Achieve expert level in 5+ skills",
        icon: Star,
        unlocked: true
      },
      {
        title: "Perfect Attendance",
        description: "Complete all learning sessions without missing any",
        icon: Calendar,
        unlocked: false
      },
      {
        title: "Mentorship Excellence",
        description: "Help 5+ interns complete their projects",
        icon: Award,
        unlocked: false
      }
    ]
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading certifications...</p>
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
          <h1 className="text-3xl font-bold gradient-text">Certifications</h1>
          <p className="text-muted-foreground mt-1">
            Earn certifications and showcase your achievements
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download All
          </Button>
          <Button className="gap-2">
            <Award className="h-4 w-4" />
            Browse Certifications
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {availableCertifications.filter(c => c.enrolled && c.progress < 100).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {achievements.filter(a => a.unlocked).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">850</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList>
          <TabsTrigger value="earned">Earned Certificates</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                        <CardDescription>{cert.issuer}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </div>
                      {cert.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Credential ID</p>
                      <p className="text-xs text-muted-foreground font-mono">{cert.credentialId}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 gap-2">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Share className="h-3 w-3" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={cert.enrolled ? "warning" : "secondary"}>
                            {cert.enrolled ? "Enrolled" : "Available"}
                          </Badge>
                          <Badge variant="outline">{cert.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                        <CardDescription>{cert.provider}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{cert.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {cert.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {cert.skills.length} skills
                      </div>
                    </div>

                    {cert.enrolled && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {cert.enrolled ? (
                        <Button size="sm" className="flex-1">
                          Continue Learning
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          Enroll Now
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`glass-effect ${achievement.unlocked ? 'border-yellow-200 dark:border-yellow-800' : 'opacity-60'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          <Icon className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2">
                            {achievement.title}
                            {achievement.unlocked && (
                              <Badge variant="success" className="text-xs">Unlocked</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
