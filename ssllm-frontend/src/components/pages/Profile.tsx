"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Settings,
  Camera,
  Loader2,
  CheckCircle,
  Briefcase,
  Phone
} from "lucide-react"
import { fetchUsers, fetchSkills, fetchCertificates, updateUser } from "@/lib/api"

const inputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  })

  const loadData = useCallback(async () => {
    try {
      const [usersData, skillsData, certsData] = await Promise.all([
        fetchUsers(),
        fetchSkills(),
        fetchCertificates(),
      ])

      if (usersData.length > 0) {
        const u = usersData[0]
        setUser(u)
        setFormData({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "",
          department: u.department || "",
        })
      }

      // Map skills with user levels
      const mapped = skillsData.map((skill: any) => {
        const us = skill.userSkills && skill.userSkills.length > 0 ? skill.userSkills[0] : null
        return { ...skill, level: us ? us.level : 0 }
      })
      setSkills(mapped)
      setCertificates(certsData)
    } catch (err) {
      console.error("Failed to load profile data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    try {
      setIsSaving(true)
      const updated = await updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
      })
      setUser(updated)
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to save profile:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        department: user.department || "",
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No user data found.</p>
      </div>
    )
  }

  const userSkills = user.skills || []
  const masteredCount = skills.filter(s => s.level >= s.requiredLevel).length
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"

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
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and track your progress
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2" disabled={isSaving}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Profile updated successfully and saved to database!</span>
        </motion.div>
      )}

      {/* Profile Overview */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative mx-auto md:mx-0">
              <Avatar className="h-28 w-28">
                <AvatarImage src={user.avatar?.startsWith('http') ? user.avatar : undefined} alt={formData.name} />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {formData.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
              {/* Status badge below avatar */}
              <div className="mt-3 text-center">
                <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
                  {user.status || "Active"}
                </Badge>
              </div>
            </div>
            
            {/* Form / Display Fields */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={inputClasses}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formData.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={inputClasses}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className={inputClasses}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>{formData.role}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className={inputClasses}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10">
                      <Settings className="h-4 w-4 text-primary" />
                      <span>{formData.department}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <div className="flex items-center gap-2 h-10">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{joinDate}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Overall Progress</label>
                  <div className="flex items-center gap-2 h-10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user.progress || 0}%</span>
                    <Progress value={user.progress || 0} className="flex-1 max-w-[120px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
              <p className="text-xs text-muted-foreground">Tracked skills</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mastered</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{masteredCount}</div>
              <p className="text-xs text-muted-foreground">
                {skills.length > 0 ? Math.round((masteredCount / skills.length) * 100) : 0}% mastery
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{certificates.length}</div>
              <p className="text-xs text-muted-foreground">Earned total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{user.skillsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: any, index: number) => {
              const pct = skill.requiredLevel > 0 ? Math.round((skill.level / skill.requiredLevel) * 100) : 0
              const isMastered = skill.level >= skill.requiredLevel
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{skill.name}</h4>
                        <Badge variant={isMastered ? "default" : "outline"} className={isMastered ? "bg-green-600" : ""}>
                          {isMastered ? "Mastered" : skill.category}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Level {skill.level} / {skill.requiredLevel}</span>
                          <span className="font-medium">{Math.min(pct, 100)}%</span>
                        </div>
                        <Progress value={Math.min(pct, 100)} className={isMastered ? "[&>div]:bg-green-600" : ""} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
          {skills.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No skills data available.</p>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert: any) => (
              <motion.div key={cert.id} whileHover={{ scale: 1.01 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{cert.title}</h4>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>
                      <Badge variant={cert.status === "active" ? "default" : "secondary"} className={cert.status === "active" ? "bg-green-600" : ""}>
                        {cert.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      {cert.expiryDate && <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>}
                      {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {certificates.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No certificates earned yet.</p>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Started {skills.length} skills</p>
                    <p className="text-sm text-muted-foreground">Tracking skills across {new Set(skills.map((s: any) => s.category)).size} categories</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mastered {masteredCount} skills</p>
                    <p className="text-sm text-muted-foreground">Reached required proficiency level</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Earned {certificates.length} certificates</p>
                    <p className="text-sm text-muted-foreground">{certificates.filter((c: any) => c.status === "active").length} currently active</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Joined on {joinDate}</p>
                    <p className="text-sm text-muted-foreground">Member since {new Date(user.joinDate).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive learning reminders and updates</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium">Privacy Settings</h4>
                  <p className="text-sm text-muted-foreground">Control your profile visibility</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-muted-foreground">Download your learning data</p>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
