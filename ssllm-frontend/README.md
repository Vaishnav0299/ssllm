# Smart Skill & Live Learning Module (SSLLM)

A modern, high-performance, AI-powered ERP web application frontend designed for companies to train interns using real-world skills, live lectures, and project-based learning.

## 🚀 Features

### Core Functionality
- **Dashboard**: Comprehensive overview with analytics, progress tracking, and activity timeline
- **Skill Requirements**: Department-wise skill tracking with gap visualization
- **AI Skill Analysis**: Personalized skill gap analysis with learning roadmap
- **Live Lectures**: Calendar-based lecture management with live sessions
- **Projects**: Project management with submission and mentor feedback
- **Progress Tracking**: Detailed analytics with charts and achievement tracking
- **AI Recommendations**: Personalized learning suggestions and career path guidance
- **Certifications**: Certificate management with achievement badges
- **Profile**: Editable user profile with skills overview
- **Admin Panel**: User management, project assignment, and system analytics

### Advanced Features
- **AI Chatbot**: Floating AI assistant for learning guidance
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Notifications**: Live updates and reminders
- **Glassmorphism UI**: Modern, premium SaaS design
- **Micro-interactions**: Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons

### UI/UX
- **Glassmorphism** design system
- **Dark/Light mode** support
- **Responsive** layouts (mobile, tablet, desktop)
- **Smooth animations** and micro-interactions
- **Modern SaaS** aesthetic (inspired by Notion, Linear, Stripe)

## 📁 Project Structure

```
ssllm-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── skills/             # Skill Requirements
│   │   ├── analysis/           # AI Skill Analysis
│   │   ├── lectures/           # Live Lectures
│   │   ├── projects/           # Projects Management
│   │   ├── progress/           # Progress Tracking
│   │   ├── recommendations/    # AI Recommendations
│   │   ├── certifications/     # Certifications
│   │   ├── profile/            # User Profile
│   │   └── admin/             # Admin Panel
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── pages/            # Page-specific components
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── data/                # Mock data
├── public/                    # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ssllm-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Secondary**: Muted grays and whites
- **Success**: Green tones
- **Warning**: Yellow tones
- **Destructive**: Red tones

### Components
- **Cards**: Glassmorphic with hover effects
- **Buttons**: Multiple variants (default, outline, gradient)
- **Forms**: Clean, accessible inputs
- **Charts**: Interactive data visualizations
- **Badges**: Status indicators and tags

### Animations
- **Page transitions**: Smooth fade and slide effects
- **Hover states**: Scale and color transitions
- **Loading states**: Skeleton screens and spinners
- **Micro-interactions**: Button clicks and card hovers

## 📊 Pages Overview

### Dashboard
- Welcome section with personalized greeting
- Skill progress cards with completion rates
- Active projects and upcoming lectures
- Performance analytics with interactive charts
- Activity timeline with recent achievements

### Skill Requirements
- Department and category filters
- Skill cards with level indicators
- Gap visualization with progress bars
- Interactive comparison charts

### AI Skill Analysis
- Profile summary with statistics
- Current vs required skills comparison
- Missing skills with priority badges
- Personalized learning roadmap timeline

### Live Lectures
- Calendar-style layout for sessions
- "Join Now" buttons for live sessions
- Past sessions with replay options
- Instructor and duration information

### Projects
- Project cards with difficulty and status
- Submission section with GitHub integration
- Mentor feedback display
- Progress tracking and deadlines

### Progress Tracking
- Circular progress indicators
- Weekly and monthly charts
- Attendance statistics
- Skill completion percentages

### AI Recommendations
- Personalized suggestion cards
- Course, video, and training categories
- Smart tags for difficulty and priority
- Career path recommendations

### Certifications
- Certificate preview cards
- Download and share functionality
- Achievement badges UI
- Progress tracking for ongoing certifications

### Profile
- Editable profile information
- Skills overview with progress bars
- Activity history and achievements
- Settings and preferences

### Admin Panel
- User management with search and filters
- Project assignment and tracking
- Skill management and analytics
- System health monitoring

## 🎯 Key Features

### AI Integration
- **Smart Recommendations**: Personalized learning paths
- **Skill Gap Analysis**: Automated assessment
- **Career Guidance**: AI-powered suggestions
- **Chatbot Assistant**: Real-time help and guidance

### User Experience
- **Responsive Design**: Works on all devices
- **Dark Mode**: Eye-friendly theme option
- **Smooth Animations**: Professional transitions
- **Intuitive Navigation**: Easy-to-use sidebar

### Performance
- **Optimized Images**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and data
- **Caching**: Efficient data management

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Tailwind Configuration
Custom theme with CSS variables for consistent theming:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... custom colors
      },
    },
  },
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1280px
- **Large**: > 1280px

### Adaptive Features
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Touch-friendly**: Larger tap targets on mobile
- **Flexible Grids**: Responsive card layouts
- **Optimized Charts**: Mobile-readable data viz

## 🎨 UI Components

### Available Components
- Button, Card, Badge, Progress
- Tabs, Select, Dropdown Menu
- Avatar, Dialog, Toast
- Charts (Line, Bar, Pie, Radar)
- Form inputs and controls

### Custom Hooks
- `useDebounce` - Performance optimization
- `useLocalStorage` - Client-side persistence
- `useResponsive` - Breakpoint detection
- `useDarkMode` - Theme management

## 📈 Analytics & Tracking

### Performance Metrics
- **Page Load Times**: Optimized for speed
- **Interaction Response**: Smooth animations
- **Memory Usage**: Efficient rendering
- **Bundle Size**: Code splitting optimization

### User Analytics
- **Learning Progress**: Skill completion rates
- **Engagement**: Session duration and frequency
- **Achievement Tracking**: Badge and certificate unlocks
- **Path Analysis**: Learning journey insights

## 🔒 Security

### Best Practices
- **Input Validation**: XSS prevention
- **CSRF Protection**: Token-based security
- **Content Security**: Trusted sources only
- **Data Encryption**: Secure transmission

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Static site deployment
- **AWS**: Custom server deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

### Development Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Test on multiple screen sizes

### Code Style
- **Components**: Reusable and modular
- **Naming**: Descriptive and consistent
- **Comments**: Clear documentation
- **Structure**: Organized file hierarchy

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Next.js Team** - Excellent framework
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible components
- **Framer Motion** - Smooth animations
- **Lucide** - Beautiful icons

---

**Built with ❤️ for modern learning and skill development**
