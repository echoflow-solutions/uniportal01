# UniPortal - University Management System

<div align="center">

![UniPortal](https://img.shields.io/badge/UniPortal-University%20Management%20System-blue?style=for-the-badge)

**A Comprehensive University Portal for Asia Pacific International College**

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

</div>

---

## Project Overview

**UniPortal** is a modern, full-featured university management system developed as a **Master's Final Assessment Project** for **ICT6001 Applied Project** at **Asia Pacific International College (APIC)**, **Trimester 3, 2025**.

This application serves as a comprehensive digital platform for managing academic activities, providing separate interfaces for instructors and students with features including course management, grading, academic integrity verification, scheduling, analytics, and AI-powered assistance.

---

## Academic Information

| Field | Details |
|-------|---------|
| **Course** | ICT6001 Applied Project |
| **Institution** | Asia Pacific International College (APIC) |
| **Program** | Master of Information Technology |
| **Trimester** | Trimester 3, 2025 |
| **Lecturer** | Dr. Ifeanyi Egwutuoha |

### Development Team

| Name | Student ID |
|------|------------|
| Bernard Adjei-Yeboah | 202401320 |
| Emmanuel Alisetti | 202500143 |
| Kabir Arya Niraula | 202500531 |

---

## Key Features

### For Instructors

- **Dashboard**: Overview of courses, students, submissions, and key metrics
- **Course Management**: Create, edit, and manage course content and materials
- **Student Management**: View and manage enrolled students across courses
- **Submissions & Grading**: Review student submissions with integrated grading tools
- **Academic Integrity (TrueLearn)**: AI-powered plagiarism detection and integrity verification
- **Analytics**: Comprehensive performance analytics and grade distribution insights
- **Schedule Management**: Manage teaching schedules, office hours, and appointments
- **AI Academic Assistant**: Intelligent assistant for rubric generation, feedback drafting, and lesson planning
- **Notifications**: Real-time alerts for submissions, deadlines, and important updates
- **Settings**: Comprehensive account and preference management

### For Students

- **Dashboard**: Personal academic overview with upcoming deadlines and notifications
- **Course Enrollment**: Browse and enroll in available courses
- **Assignments**: View, submit, and track assignment status
- **Grades**: Access detailed grade reports and academic performance
- **Fees Management**: View fee balances, payment history, and make payments
- **Academic Integrity**: Monitor personal integrity score and verification status
- **Schedule**: Personal timetable with class schedules and events
- **AI Study Assistant**: Intelligent chatbot for academic support
- **Profile & Settings**: Manage personal information and preferences

---

## Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **React 18** - Component-based UI library with hooks
- **TypeScript** - Type-safe JavaScript for improved developer experience

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, consistent icon library
- **Custom Gradients** - Modern gradient-based design system

### State Management
- **Zustand** - Lightweight state management with persistence
- **React Hooks** - Built-in state management with useState and useEffect

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Turbopack** - Fast development server bundling

---

## Project Structure

```
uniportal/
├── public/                    # Static assets and images
│   ├── apic-logo.png         # APIC institution logo
│   └── ...
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── instructor/        # Instructor portal pages
│   │   │   ├── dashboard/
│   │   │   ├── my-courses/
│   │   │   ├── students/
│   │   │   ├── submissions/
│   │   │   ├── grading/
│   │   │   ├── integrity/
│   │   │   ├── analytics/
│   │   │   ├── schedule/
│   │   │   ├── ai-assistant/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── student/           # Student portal pages
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── assignments/
│   │   │   ├── grades/
│   │   │   ├── fees/
│   │   │   ├── integrity/
│   │   │   ├── schedule/
│   │   │   ├── ai-assistant/
│   │   │   ├── notifications/
│   │   │   └── profile/
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Login/landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components (Sidebar, Header)
│   │   └── demo/             # Demo mode components
│   └── lib/                   # Utilities and state management
│       ├── store/            # Zustand stores
│       │   ├── appStore.ts   # Main application state
│       │   ├── mockData.ts   # Demo data
│       │   └── demoMode.ts   # Demo mode utilities
│       └── utils.ts          # Utility functions
├── package.json              # Project dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

---

## Installation & Setup

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/echoflow-solutions/uniportal01.git
   cd uniportal01
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## Demo Access

The application includes a demo mode with pre-configured accounts for testing:

### Lecturer Account
- **Name**: Dr. Ifeanyi Egwutuoha
- **Role**: Senior Lecturer
- Access to full instructor dashboard and features

### Student Accounts
- **Emmanuel Alisetti** - Student access
- **Kabir Arya Niraula** - Student access
- **Bernard Adjei-Yeboah** - Student access

Simply click on "Demo Access" tab on the login page and select an account to explore.

---

## Australian Grading System

UniPortal implements the Australian Higher Education grading scale:

| Grade | Description | Percentage | GPA Points |
|-------|-------------|------------|------------|
| HD | High Distinction | 85-100% | 7.0 |
| D | Distinction | 75-84% | 6.0 |
| C | Credit | 65-74% | 5.0 |
| P | Pass | 50-64% | 4.0 |
| F | Fail | 0-49% | 0.0 |

---

## Key Modules

### 1. Academic Integrity Module (TrueLearn)

The TrueLearn system provides comprehensive academic integrity verification:

- **AI Detection**: Identifies AI-generated content in submissions
- **Plagiarism Check**: Cross-references against academic databases
- **Integrity Score**: Calculates and tracks student integrity ratings
- **Flagged Work Management**: Review and adjudicate flagged submissions
- **Detailed Reports**: Generate integrity reports for administration

### 2. AI Academic Assistant

Intelligent AI-powered assistant for educators:

- **Rubric Generation**: Create assessment criteria automatically
- **Feedback Templates**: Draft constructive feedback for students
- **Lesson Planning**: Structure course content and learning objectives
- **Assignment Ideas**: Generate engaging assessment concepts
- **Concept Explanation**: Simplify complex topics for teaching
- **Performance Analysis**: Interpret grade patterns and trends

### 3. Analytics Dashboard

Comprehensive analytics for instructors:

- **Grade Distribution**: Visual breakdown of student performance
- **Submission Trends**: Track submission patterns over time
- **Course Comparisons**: Compare performance across courses
- **Student Progress**: Monitor individual and cohort progress
- **Export Reports**: Generate PDF/CSV reports for records

### 4. Schedule Management

Full-featured scheduling system:

- **Weekly Calendar**: Visual week/day schedule views
- **Event Management**: Create lectures, tutorials, office hours
- **Deadline Tracking**: Monitor upcoming assignment deadlines
- **Room Booking**: Schedule meeting rooms and venues

---

## Design Philosophy

### User Experience
- **Clean, Modern Interface**: Minimalist design with intuitive navigation
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant with keyboard navigation support
- **Dark Mode Ready**: Architecture supports theme switching

### Visual Design
- **Gradient Accents**: Modern gradient-based color scheme
- **Card-Based Layout**: Organized information in digestible cards
- **Consistent Iconography**: Lucide icons throughout for visual consistency
- **Micro-interactions**: Subtle animations for enhanced feedback

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Future Enhancements

Planned features for future development:

- [ ] Real-time notifications with WebSocket
- [ ] Mobile application (React Native)
- [ ] Integration with external LMS platforms
- [ ] Advanced reporting and data export
- [ ] Multi-language support
- [ ] Video conferencing integration
- [ ] Document collaboration tools

---

## Acknowledgements

- **Asia Pacific International College** for the opportunity to develop this project
- **Dr. Ifeanyi Egwutuoha** for guidance and supervision
- **Next.js Team** for the excellent framework
- **Vercel** for deployment platform
- **shadcn** for the beautiful UI components

---

## License

This project was developed as an academic assessment and is intended for educational purposes.

**Copyright 2025 - Asia Pacific International College**

---

<div align="center">

**Developed with dedication by**

**Bernard Adjei-Yeboah | Emmanuel Alisetti | Kabir Arya Niraula**

*Master of Information Technology - ICT6001 Applied Project*

*Asia Pacific International College - Trimester 3, 2025*

---

**EchoFlow Solutions**

</div>
