"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  ExternalLink,
  Mic,
  Monitor,
  MessageSquare,
  Star,
  Loader2,
  AlertCircle
} from "lucide-react"
import { fetchLectures } from "@/lib/api"

export function LiveLectures() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [lectures, setLectures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchLectures()
      setLectures(data)
    } catch (err: any) {
      console.error("Failed to load lectures:", err)
      setError(err.message || "Failed to load lectures")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredLectures = useMemo(() => {
    if (selectedFilter === "all") return lectures
    return lectures.filter(l => l.status === selectedFilter)
  }, [lectures, selectedFilter])

  const liveCount = useMemo(() => lectures.filter(l => l.status === "live").length, [lectures])
  const upcomingCount = useMemo(() => lectures.filter(l => l.status === "upcoming").length, [lectures])
  const completedCount = useMemo(() => lectures.filter(l => l.status === "completed").length, [lectures])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "destructive"
      case "upcoming": return "secondary"
      case "completed": return "success"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live": return Video
      case "upcoming": return Calendar
      case "completed": return Star
      default: return Calendar
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lectures...</p>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Live Lectures</h1>
          <p className="text-muted-foreground mt-1">
            Join live learning sessions and access recorded content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" size="sm">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="gap-2" size="sm" onClick={loadData}>
            <Video className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lectures</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lectures.length}</div>
              <p className="text-xs text-muted-foreground">All sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Now</CardTitle>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{liveCount}</div>
              <p className="text-xs text-muted-foreground">Join now</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Star className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Recordings available</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Single Filter Controls (no duplicates) */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Lectures", count: lectures.length },
          { value: "live", label: "Live Now", count: liveCount },
          { value: "upcoming", label: "Upcoming", count: upcomingCount },
          { value: "completed", label: "Completed", count: completedCount },
        ].map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
            className="gap-1.5"
          >
            {filter.label}
            <Badge variant={selectedFilter === filter.value ? "secondary" : "outline"} className="ml-1 text-xs h-5 px-1.5">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Lectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredLectures.map((lecture: any, index: number) => {
          const StatusIcon = getStatusIcon(lecture.status)
          
          return (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`glass-effect hover:shadow-lg transition-all duration-300 h-full flex flex-col ${lecture.status === "live" ? "border-red-200 dark:border-red-800" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusColor(lecture.status) as any} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
                    </Badge>
                    {lecture.status === "live" && (
                      <Badge variant="outline" className="animate-pulse text-xs">
                        <div className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{lecture.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {lecture.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mt-auto">
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {lecture.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(lecture.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(lecture.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" /> Screen
                    </div>
                    <div className="flex items-center gap-1">
                      <Mic className="h-3 w-3" /> Audio
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Q&A
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {lecture.status === "live" && (
                      <Button className="flex-1 gap-2" size="sm">
                        <Play className="h-4 w-4" />
                        Join Now
                      </Button>
                    )}
                    {lecture.status === "upcoming" && (
                      <>
                        <Button variant="outline" className="flex-1 gap-2" size="sm">
                          <Calendar className="h-4 w-4" />
                          Set Reminder
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {lecture.status === "completed" && (
                      <>
                        <Button className="flex-1 gap-2" size="sm">
                          <Play className="h-4 w-4" />
                          Watch Recording
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredLectures.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-lg">No lectures found</h3>
            <p className="text-sm text-muted-foreground">No {selectedFilter !== "all" ? selectedFilter : ""} lectures available right now.</p>
            {selectedFilter !== "all" && (
              <Button variant="outline" className="mt-4" onClick={() => setSelectedFilter("all")}>View All Lectures</Button>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
