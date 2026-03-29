import prisma from "./db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.userSkill.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.analyticsEntry.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log("  ✅ Cleaned existing data");

  // ─── Departments ──────────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.create({ data: { name: "Engineering" } }),
    prisma.department.create({ data: { name: "Design" } }),
    prisma.department.create({ data: { name: "Marketing" } }),
    prisma.department.create({ data: { name: "Sales" } }),
    prisma.department.create({ data: { name: "HR" } }),
    prisma.department.create({ data: { name: "Analytics" } }),
  ]);
  console.log(`  ✅ Created ${departments.length} departments`);

  // ─── Users ────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: "alex.johnson@company.com",
        role: "Software Engineer Intern",
        department: "Engineering",
        avatar: null,
        status: "Active",
        joinDate: new Date("2024-01-15"),
        progress: 65,
        skillsCompleted: 8,
        lastActive: new Date("2024-03-27"),
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "UX Designer Intern",
        department: "Design",
        status: "Active",
        joinDate: new Date("2024-02-01"),
        progress: 78,
        skillsCompleted: 12,
        lastActive: new Date("2024-03-26"),
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Data Analyst Intern",
        department: "Analytics",
        status: "Inactive",
        joinDate: new Date("2024-01-20"),
        progress: 45,
        skillsCompleted: 5,
        lastActive: new Date("2024-03-15"),
      },
    }),
  ]);
  console.log(`  ✅ Created ${users.length} users`);

  // ─── Skills ───────────────────────────────────────────────
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: "JavaScript", category: "Programming", requiredLevel: 5, active: true } }),
    prisma.skill.create({ data: { name: "React", category: "Programming", requiredLevel: 4, active: true } }),
    prisma.skill.create({ data: { name: "TypeScript", category: "Programming", requiredLevel: 4, active: true } }),
    prisma.skill.create({ data: { name: "Node.js", category: "Programming", requiredLevel: 3, active: true } }),
    prisma.skill.create({ data: { name: "Python", category: "Programming", requiredLevel: 3, active: false } }),
    prisma.skill.create({ data: { name: "UI/UX Design", category: "Design", requiredLevel: 3, active: true } }),
    prisma.skill.create({ data: { name: "Communication", category: "Soft Skills", requiredLevel: 4, active: true } }),
    prisma.skill.create({ data: { name: "Team Leadership", category: "Soft Skills", requiredLevel: 3, active: true } }),
    prisma.skill.create({ data: { name: "Project Management", category: "Management", requiredLevel: 3, active: true } }),
    prisma.skill.create({ data: { name: "Data Analysis", category: "Analytics", requiredLevel: 4, active: true } }),
  ]);
  console.log(`  ✅ Created ${skills.length} skills`);

  // ─── User Skills (linking users to skills with levels) ────
  const userSkills = await Promise.all([
    // Alex Johnson's skills
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[0].id, level: 4 } }), // JavaScript
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[1].id, level: 3 } }), // React
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[2].id, level: 3 } }), // TypeScript
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[3].id, level: 2 } }), // Node.js
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[4].id, level: 4 } }), // Python
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[5].id, level: 2 } }), // UI/UX
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[6].id, level: 4 } }), // Communication
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[7].id, level: 2 } }), // Team Leadership
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[8].id, level: 2 } }), // Project Management
    prisma.userSkill.create({ data: { userId: users[0].id, skillId: skills[9].id, level: 3 } }), // Data Analysis
  ]);
  console.log(`  ✅ Created ${userSkills.length} user-skill links`);

  // ─── Projects ─────────────────────────────────────────────
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: "E-commerce Platform",
        description: "Build a full-stack e-commerce platform with React and Node.js",
        difficulty: "Medium",
        status: "In Progress",
        progress: 65,
        dueDate: new Date("2024-04-15"),
        mentor: "Sarah Chen",
        assignedTo: "Alex Johnson",
        priority: "High",
      },
    }),
    prisma.project.create({
      data: {
        title: "Weather Dashboard",
        description: "Create a responsive weather dashboard with API integration",
        difficulty: "Easy",
        status: "Completed",
        progress: 100,
        dueDate: new Date("2024-03-20"),
        mentor: "Mike Johnson",
        assignedTo: "Alex Johnson",
        priority: "Medium",
        githubUrl: "https://github.com/alex/weather-dashboard",
        submission: "Submitted and approved",
        feedback: "Excellent work on the UI and API integration!",
      },
    }),
    prisma.project.create({
      data: {
        title: "Task Management System",
        description: "Develop a comprehensive task management system with real-time updates",
        difficulty: "Hard",
        status: "Not Started",
        progress: 0,
        dueDate: new Date("2024-05-01"),
        mentor: "David Kim",
        assignedTo: "Alex Johnson",
        priority: "Low",
      },
    }),
    prisma.project.create({
      data: {
        title: "Mobile App Design",
        description: "Design mobile app UI/UX for the company product",
        difficulty: "Medium",
        status: "Not Started",
        progress: 0,
        dueDate: new Date("2024-04-20"),
        mentor: "Sarah Chen",
        assignedTo: "Sarah Chen",
        priority: "Medium",
      },
    }),
    prisma.project.create({
      data: {
        title: "Data Dashboard",
        description: "Create analytics dashboard for business data visualization",
        difficulty: "Medium",
        status: "Completed",
        progress: 100,
        dueDate: new Date("2024-03-20"),
        mentor: "Mike Johnson",
        assignedTo: "Mike Johnson",
        priority: "Low",
      },
    }),
  ]);
  console.log(`  ✅ Created ${projects.length} projects`);

  // ─── Lectures ─────────────────────────────────────────────
  const lectures = await Promise.all([
    prisma.lecture.create({
      data: {
        title: "Advanced React Patterns",
        instructor: "Sarah Chen",
        date: new Date("2024-03-28T14:00:00"),
        duration: 90,
        description: "Learn advanced React patterns and performance optimization",
        status: "upcoming",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "TypeScript Best Practices",
        instructor: "Mike Johnson",
        date: new Date("2024-03-25T10:00:00"),
        duration: 60,
        description: "Deep dive into TypeScript best practices and type safety",
        status: "live",
        joinUrl: "https://meet.company.com/ts-best-practices",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "CSS Grid and Flexbox Mastery",
        instructor: "Emily Davis",
        date: new Date("2024-03-20T15:00:00"),
        duration: 75,
        description: "Master modern CSS layout techniques",
        status: "completed",
        recordingUrl: "https://recordings.company.com/css-mastery",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "Node.js Microservices Architecture",
        instructor: "Alex Johnson",
        date: new Date("2024-03-29T11:00:00"),
        duration: 120,
        description: "Build scalable microservices with Node.js and Docker",
        status: "upcoming",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "Database Design with PostgreSQL",
        instructor: "Sarah Chen",
        date: new Date("2024-03-27T09:00:00"),
        duration: 90,
        description: "Schema design, indexing, and query optimization in PostgreSQL",
        status: "live",
        joinUrl: "https://meet.company.com/postgres-design",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "REST API Security Fundamentals",
        instructor: "Mike Johnson",
        date: new Date("2024-03-18T13:00:00"),
        duration: 60,
        description: "JWT authentication, rate limiting, and input validation",
        status: "completed",
        recordingUrl: "https://recordings.company.com/api-security",
      },
    }),
    prisma.lecture.create({
      data: {
        title: "Agile Project Management",
        instructor: "Emily Davis",
        date: new Date("2024-03-15T16:00:00"),
        duration: 45,
        description: "Scrum, Kanban, and sprint planning for engineering teams",
        status: "completed",
        recordingUrl: "https://recordings.company.com/agile-pm",
      },
    }),
  ]);
  console.log(`  ✅ Created ${lectures.length} lectures`);

  // ─── Recommendations ──────────────────────────────────────
  const recommendations = await Promise.all([
    prisma.recommendation.create({
      data: {
        title: "Complete React Course",
        type: "course",
        provider: "Udemy",
        duration: "40 hours",
        difficulty: "Intermediate",
        tags: ["React", "JavaScript", "Web Development"],
        priority: "High",
        description: "Comprehensive React course covering hooks, context, and best practices",
      },
    }),
    prisma.recommendation.create({
      data: {
        title: "System Design Fundamentals",
        type: "video",
        provider: "YouTube",
        duration: "2 hours",
        difficulty: "Advanced",
        tags: ["System Design", "Architecture"],
        priority: "Medium",
        description: "Learn the fundamentals of system design and architecture",
      },
    }),
    prisma.recommendation.create({
      data: {
        title: "Internal Workshop: Git Advanced",
        type: "training",
        provider: "Internal",
        duration: "3 hours",
        difficulty: "Intermediate",
        tags: ["Git", "Version Control"],
        priority: "High",
        description: "Advanced Git workshop covering branching strategies and conflict resolution",
      },
    }),
  ]);
  console.log(`  ✅ Created ${recommendations.length} recommendations`);

  // ─── Certificates ─────────────────────────────────────────
  const certificates = await Promise.all([
    prisma.certificate.create({
      data: {
        title: "React Development",
        issuer: "Company Training",
        issueDate: new Date("2024-02-15"),
        expiryDate: new Date("2025-02-15"),
        credentialId: "RCT-2024-001",
        status: "active",
      },
    }),
    prisma.certificate.create({
      data: {
        title: "JavaScript Fundamentals",
        issuer: "Online Academy",
        issueDate: new Date("2024-01-20"),
        expiryDate: null,
        credentialId: "JSF-2024-042",
        status: "active",
      },
    }),
  ]);
  console.log(`  ✅ Created ${certificates.length} certificates`);

  // ─── Notifications ────────────────────────────────────────
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: "New project assigned",
        message: "You have been assigned to the E-commerce Platform project",
        type: "info",
        read: false,
        userId: users[0].id,
        timestamp: new Date("2024-03-27T10:00:00"),
      },
    }),
    prisma.notification.create({
      data: {
        title: "Live lecture starting soon",
        message: "TypeScript Best Practices lecture starts in 30 minutes",
        type: "reminder",
        read: false,
        userId: users[0].id,
        timestamp: new Date("2024-03-25T09:30:00"),
      },
    }),
    prisma.notification.create({
      data: {
        title: "Project feedback",
        message: "Sarah Chen provided feedback on your Weather Dashboard project",
        type: "success",
        read: true,
        userId: users[0].id,
        timestamp: new Date("2024-03-24T16:45:00"),
      },
    }),
  ]);
  console.log(`  ✅ Created ${notifications.length} notifications`);

  // ─── Analytics Entries ────────────────────────────────────
  const analyticsData = [
    // Skill progress over time
    { category: "skillProgress", key: "Jan", value: 2 },
    { category: "skillProgress", key: "Feb", value: 3 },
    { category: "skillProgress", key: "Mar", value: 5 },
    { category: "skillProgress", key: "Apr", value: 4 },
    { category: "skillProgress", key: "May", value: 6 },
    { category: "skillProgress", key: "Jun", value: 8 },
    // Learning hours by day
    { category: "learningHours", key: "Mon", value: 4 },
    { category: "learningHours", key: "Tue", value: 6 },
    { category: "learningHours", key: "Wed", value: 5 },
    { category: "learningHours", key: "Thu", value: 7 },
    { category: "learningHours", key: "Fri", value: 4 },
    { category: "learningHours", key: "Sat", value: 8 },
    { category: "learningHours", key: "Sun", value: 3 },
    // Skill distribution
    { category: "skillDistribution", key: "Programming", value: 40 },
    { category: "skillDistribution", key: "Design", value: 15 },
    { category: "skillDistribution", key: "Soft Skills", value: 25 },
    { category: "skillDistribution", key: "Management", value: 10 },
    { category: "skillDistribution", key: "Analytics", value: 10 },
  ];

  await Promise.all(
    analyticsData.map((entry) => prisma.analyticsEntry.create({ data: entry }))
  );
  console.log(`  ✅ Created ${analyticsData.length} analytics entries`);

  console.log("\n🎉 Database seeded successfully!");
  console.log(`   ${departments.length} departments`);
  console.log(`   ${users.length} users`);
  console.log(`   ${skills.length} skills`);
  console.log(`   ${userSkills.length} user-skill links`);
  console.log(`   ${projects.length} projects`);
  console.log(`   ${lectures.length} lectures`);
  console.log(`   ${recommendations.length} recommendations`);
  console.log(`   ${certificates.length} certificates`);
  console.log(`   ${notifications.length} notifications`);
  console.log(`   ${analyticsData.length} analytics entries`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
