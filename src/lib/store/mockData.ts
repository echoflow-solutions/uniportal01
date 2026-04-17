import type {
  User,
  Course,
  Assignment,
  Submission,
  WritingSession,
  WritingEvent,
  VerificationTest,
  VerificationQuestion,
  VerificationResponse,
  IntegrityReport,
} from '@/types'

// Helper to generate dates relative to now
const now = new Date()
const daysAgo = (days: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const hoursAgo = (hours: number) => {
  const date = new Date(now)
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

const daysFromNow = (days: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// ============================================================================
// USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'instructor1',
    name: 'Dr. Ifeanyi Egwutuoha',
    email: 'ifeanyi.egwutuoha@demo.edu',
    role: 'instructor',
    avatar: '/avatars/instructor1.jpg',
  },
  {
    id: 'student1',
    name: 'Emmanuel Alisetti',
    email: 'emmanuel.alisetti@demo.edu',
    role: 'student',
    avatar: '/avatars/student1.jpg',
  },
  {
    id: 'student2',
    name: 'Kabir Arya Niraula',
    email: 'kabir.niraula@demo.edu',
    role: 'student',
    avatar: '/avatars/student2.jpg',
  },
  {
    id: 'student3',
    name: 'Bernard Adjei-Yeboah',
    email: 'bernard.adjei-yeboah@demo.edu',
    role: 'student',
    avatar: '/avatars/student3.jpg',
  },
  {
    id: 'student4',
    name: 'Sarah Chen',
    email: 'sarah.chen@demo.edu',
    role: 'student',
    avatar: '/avatars/student4.jpg',
  },
  {
    id: 'student5',
    name: 'Michael Thompson',
    email: 'michael.thompson@demo.edu',
    role: 'student',
    avatar: '/avatars/student5.jpg',
  },
]

// ============================================================================
// COURSES
// ============================================================================

export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'Applied Project',
    code: 'ICT6001',
    instructorId: 'instructor1',
    studentIds: ['student1', 'student2', 'student3', 'student4', 'student5'],
  },
]

// ============================================================================
// ASSIGNMENTS
// ============================================================================

export const mockAssignments: Assignment[] = [
  {
    id: 'assignment1',
    courseId: 'course1',
    title: 'Literature Review',
    description: 'Conduct a comprehensive literature review on your chosen project topic. Identify key theories, frameworks, and prior research relevant to your project.',
    instructions: `Your literature review should:
1. Cover at least 15-20 peer-reviewed sources
2. Identify gaps in existing research
3. Establish theoretical framework for your project
4. Be 3000-4000 words in length
5. Follow APA 7th edition formatting

You must complete this assignment across multiple writing sessions (minimum 4 sessions) with at least 2 hours of active writing time.`,
    dueDate: daysAgo(21),
    minSessions: 4,
    minActiveTimeMinutes: 120,
  },
  {
    id: 'assignment2',
    courseId: 'course1',
    title: 'Project Proposal',
    description: 'Develop a detailed proposal for your applied project, including methodology, timeline, and expected outcomes.',
    instructions: `Your proposal should include:
1. Executive Summary
2. Problem Statement
3. Research Questions/Objectives
4. Methodology
5. Timeline and Milestones
6. Expected Outcomes
7. Risk Assessment

Length: 2500-3500 words
Complete across minimum 3 sessions with at least 90 minutes active time.`,
    dueDate: daysAgo(7),
    minSessions: 3,
    minActiveTimeMinutes: 90,
  },
  {
    id: 'assignment3',
    courseId: 'course1',
    title: 'Final Report',
    description: 'Complete your final project report documenting your research, implementation, findings, and conclusions.',
    instructions: `Your final report should include:
1. Abstract
2. Introduction
3. Literature Review (expanded)
4. Methodology
5. Implementation
6. Results and Analysis
7. Discussion
8. Conclusions and Future Work
9. References
10. Appendices

Length: 8000-12000 words
Complete across minimum 8 sessions with at least 6 hours active time.`,
    dueDate: daysFromNow(10),
    minSessions: 8,
    minActiveTimeMinutes: 360,
  },
  {
    id: 'assignment4',
    courseId: 'course1',
    title: 'Research Reflection Essay',
    description: 'Write a reflective essay on your research journey, discussing challenges faced, lessons learned, and how your understanding evolved throughout the project.',
    instructions: `Your reflection essay should cover:
1. Initial expectations vs reality
2. Key challenges and how you overcame them
3. Most significant learnings
4. How your research skills developed
5. What you would do differently
6. Future research directions

Length: 1500-2000 words
Complete across minimum 2 sessions with at least 45 minutes active time.`,
    dueDate: daysFromNow(14),
    minSessions: 2,
    minActiveTimeMinutes: 45,
  },
]

// ============================================================================
// SUBMISSIONS
// ============================================================================

export const mockSubmissions: Submission[] = [
  // Emmanuel Alisetti (student1) - HIGH INTEGRITY
  {
    id: 'sub1-1',
    assignmentId: 'assignment1',
    studentId: 'student1',
    content: `<h1>Literature Review: Machine Learning Applications in Healthcare Diagnostics</h1>
<h2>Introduction</h2>
<p>The integration of machine learning (ML) in healthcare diagnostics represents a paradigm shift in medical practice. This literature review examines the current state of ML applications in diagnostic medicine, identifying key frameworks, methodologies, and research gaps that inform the direction of this applied project.</p>
<h2>Theoretical Framework</h2>
<p>The theoretical underpinning of this research draws from three interconnected domains: computational learning theory, medical informatics, and clinical decision support systems. Vapnik's (1998) statistical learning theory provides the mathematical foundation for understanding how ML algorithms generalize from training data to unseen cases...</p>
<h2>Current Applications</h2>
<p>Recent advances in deep learning have enabled remarkable progress in medical image analysis. Esteva et al. (2017) demonstrated that convolutional neural networks could classify skin lesions with dermatologist-level accuracy, achieving an AUC of 0.94 compared to 0.91 for certified dermatologists...</p>`,
    wordCount: 3847,
    status: 'verified',
    createdAt: daysAgo(28),
    submittedAt: daysAgo(21),
  },
  {
    id: 'sub1-2',
    assignmentId: 'assignment2',
    studentId: 'student1',
    content: `<h1>Project Proposal: AI-Assisted Diagnostic Tool for Early Detection of Diabetic Retinopathy</h1>
<h2>Executive Summary</h2>
<p>This proposal outlines the development of an AI-assisted diagnostic tool leveraging deep learning for early detection of diabetic retinopathy (DR). The project aims to create a clinically validated system that can be deployed in primary care settings to improve screening accessibility...</p>`,
    wordCount: 3124,
    status: 'verified',
    createdAt: daysAgo(14),
    submittedAt: daysAgo(7),
  },
  {
    id: 'sub1-3',
    assignmentId: 'assignment3',
    studentId: 'student1',
    content: `<h1>Final Report: AI-Assisted Diagnostic Tool for Diabetic Retinopathy Detection</h1>
<h2>Abstract</h2>
<p>This report presents the development and evaluation of a deep learning-based diagnostic tool for detecting diabetic retinopathy in fundus photographs. Our system achieved a sensitivity of 94.2% and specificity of 91.8% on a held-out test set of 5,000 images, demonstrating clinical viability for deployment in primary care screening programs...</p>
<h2>Chapter 1: Introduction</h2>
<p>Diabetic retinopathy affects approximately 35% of individuals with diabetes and remains the leading cause of preventable blindness in working-age adults worldwide (WHO, 2024). Early detection is critical for preventing vision loss, yet access to specialist ophthalmological screening remains limited, particularly in underserved communities...</p>`,
    wordCount: 4521,
    status: 'draft',
    createdAt: daysAgo(5),
  },

  // Kabir Arya Niraula (student2) - MEDIUM INTEGRITY
  {
    id: 'sub2-1',
    assignmentId: 'assignment1',
    studentId: 'student2',
    content: `<h1>Literature Review: Blockchain Technology in Supply Chain Management</h1>
<h2>Introduction</h2>
<p>Blockchain technology has emerged as a transformative force in supply chain management. This review examines existing research on blockchain applications in supply chain contexts...</p>`,
    wordCount: 3256,
    status: 'verified',
    createdAt: daysAgo(26),
    submittedAt: daysAgo(21),
  },
  {
    id: 'sub2-2',
    assignmentId: 'assignment2',
    studentId: 'student2',
    content: `<h1>Project Proposal: Blockchain-Based Pharmaceutical Supply Chain Tracking System</h1>
<h2>Executive Summary</h2>
<p>This proposal presents a blockchain-based system for tracking pharmaceutical products through the supply chain to combat counterfeiting and ensure drug authenticity...</p>`,
    wordCount: 2876,
    status: 'verified',
    createdAt: daysAgo(12),
    submittedAt: daysAgo(7),
  },
  {
    id: 'sub2-3',
    assignmentId: 'assignment3',
    studentId: 'student2',
    content: `<h1>Final Report: Blockchain-Based Pharmaceutical Tracking System</h1>
<h2>Abstract</h2>
<p>This report details the implementation of a permissioned blockchain system for pharmaceutical supply chain tracking. The system utilizes Hyperledger Fabric to create an immutable record of drug provenance...</p>`,
    wordCount: 3102,
    status: 'draft',
    createdAt: daysAgo(4),
  },

  // Bernard Adjei-Yeboah (student3) - LOW INTEGRITY
  {
    id: 'sub3-1',
    assignmentId: 'assignment1',
    studentId: 'student3',
    content: `<h1>Literature Review: Cybersecurity Frameworks</h1>
<h2>Introduction</h2>
<p>Cybersecurity is becoming increasingly important in the modern digital landscape. Organizations must protect their data and systems from various threats...</p>`,
    wordCount: 3089,
    status: 'verified',
    createdAt: daysAgo(25),
    submittedAt: daysAgo(21),
  },
  {
    id: 'sub3-2',
    assignmentId: 'assignment2',
    studentId: 'student3',
    content: `<h1>Project Proposal: Security Assessment Framework</h1>
<h2>Summary</h2>
<p>This proposal outlines a framework for conducting security assessments in small and medium enterprises...</p>`,
    wordCount: 2654,
    status: 'verified',
    createdAt: daysAgo(10),
    submittedAt: daysAgo(7),
  },
  {
    id: 'sub3-3',
    assignmentId: 'assignment3',
    studentId: 'student3',
    content: `<h1>Final Report: SME Security Assessment Framework</h1>
<h2>Abstract</h2>
<p>This report presents a comprehensive security assessment framework designed specifically for small and medium enterprises. The framework provides a systematic approach to identifying vulnerabilities and implementing appropriate security controls based on industry best practices and established standards such as NIST and ISO 27001...</p>`,
    wordCount: 4234,
    status: 'submitted',
    createdAt: daysAgo(2),
    submittedAt: daysAgo(1),
  },

  // Sarah Chen (student4) - NEW STUDENT
  {
    id: 'sub4-1',
    assignmentId: 'assignment1',
    studentId: 'student4',
    content: `<h1>Literature Review: User Experience Design in Mobile Banking Applications</h1>
<h2>Introduction</h2>
<p>The proliferation of mobile banking has transformed how consumers interact with financial institutions. This literature review explores UX design principles and their impact on user adoption and satisfaction in mobile banking contexts...</p>`,
    wordCount: 3567,
    status: 'verified',
    createdAt: daysAgo(24),
    submittedAt: daysAgo(21),
  },
  {
    id: 'sub4-2',
    assignmentId: 'assignment2',
    studentId: 'student4',
    content: `<h1>Project Proposal: Redesigning Mobile Banking for Elderly Users</h1>
<h2>Executive Summary</h2>
<p>This proposal outlines the development of a mobile banking interface specifically designed to address the unique needs and challenges faced by elderly users...</p>`,
    wordCount: 2943,
    status: 'verified',
    createdAt: daysAgo(13),
    submittedAt: daysAgo(7),
  },
  {
    id: 'sub4-3',
    assignmentId: 'assignment3',
    studentId: 'student4',
    content: `<h1>Final Report: Accessible Mobile Banking for Elderly Users</h1>
<h2>Abstract</h2>
<p>This report presents the design, implementation, and evaluation of a mobile banking interface optimized for elderly users. Through iterative user-centered design and extensive usability testing with participants aged 65+, we developed an interface that significantly improves task completion rates...</p>`,
    wordCount: 2876,
    status: 'draft',
    createdAt: daysAgo(3),
  },

  // Michael Thompson (student5) - EXCELLENT STUDENT
  {
    id: 'sub5-1',
    assignmentId: 'assignment1',
    studentId: 'student5',
    content: `<h1>Literature Review: Natural Language Processing for Automated Code Review</h1>
<h2>Introduction</h2>
<p>The exponential growth of software development has created unprecedented challenges in maintaining code quality. This comprehensive literature review examines the intersection of natural language processing (NLP) and software engineering, specifically focusing on automated code review systems...</p>
<h2>Theoretical Foundations</h2>
<p>The application of NLP to code review draws from multiple theoretical traditions. The work of Hindle et al. (2012) established the foundational concept of software naturalness—the observation that programming languages, despite their formal nature, exhibit statistical properties similar to natural languages. This insight enabled the application of language models to source code...</p>`,
    wordCount: 4123,
    status: 'verified',
    createdAt: daysAgo(27),
    submittedAt: daysAgo(21),
  },
  {
    id: 'sub5-2',
    assignmentId: 'assignment2',
    studentId: 'student5',
    content: `<h1>Project Proposal: AI-Powered Code Review Assistant</h1>
<h2>Executive Summary</h2>
<p>This proposal outlines the development of an AI-powered code review assistant that combines large language models with static analysis to provide contextual, actionable feedback on code submissions. The system aims to reduce reviewer workload while improving code quality consistency...</p>`,
    wordCount: 3456,
    status: 'verified',
    createdAt: daysAgo(15),
    submittedAt: daysAgo(7),
  },
  {
    id: 'sub5-3',
    assignmentId: 'assignment3',
    studentId: 'student5',
    content: `<h1>Final Report: CodeSage - An AI-Powered Code Review Assistant</h1>
<h2>Abstract</h2>
<p>This report presents CodeSage, a novel AI-powered code review assistant that combines transformer-based language models with traditional static analysis techniques. Evaluated on a dataset of 50,000 code reviews from open-source projects, CodeSage demonstrates a 47% reduction in review time while maintaining review quality comparable to senior developers...</p>
<h2>Chapter 1: Introduction</h2>
<p>Modern software development teams face an increasingly complex challenge: maintaining code quality at scale. Code review, while essential for catching bugs and ensuring maintainability, has become a significant bottleneck. Studies indicate that developers spend an average of 6.4 hours per week on code review activities (Microsoft Research, 2023)...</p>`,
    wordCount: 5234,
    status: 'draft',
    createdAt: daysAgo(6),
  },
]

// ============================================================================
// WRITING SESSIONS
// ============================================================================

export const mockWritingSessions: WritingSession[] = [
  // Emmanuel Alisetti (student1) - 7 sessions over 5 days for assignment3
  {
    id: 'session1-1',
    submissionId: 'sub1-3',
    startedAt: daysAgo(5),
    endedAt: daysAgo(5),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 876,
    wordsPasted: 45,
    pasteEvents: 2,
    editEvents: 234,
  },
  {
    id: 'session1-2',
    submissionId: 'sub1-3',
    startedAt: daysAgo(4),
    endedAt: daysAgo(4),
    activeTimeSeconds: 7200, // 2 hours
    wordsTyped: 1123,
    wordsPasted: 67,
    pasteEvents: 3,
    editEvents: 312,
  },
  {
    id: 'session1-3',
    submissionId: 'sub1-3',
    startedAt: daysAgo(4),
    endedAt: daysAgo(4),
    activeTimeSeconds: 3600, // 1 hour
    wordsTyped: 534,
    wordsPasted: 23,
    pasteEvents: 1,
    editEvents: 156,
  },
  {
    id: 'session1-4',
    submissionId: 'sub1-3',
    startedAt: daysAgo(3),
    endedAt: daysAgo(3),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 789,
    wordsPasted: 34,
    pasteEvents: 2,
    editEvents: 198,
  },
  {
    id: 'session1-5',
    submissionId: 'sub1-3',
    startedAt: daysAgo(2),
    endedAt: daysAgo(2),
    activeTimeSeconds: 6300, // 105 minutes
    wordsTyped: 654,
    wordsPasted: 56,
    pasteEvents: 2,
    editEvents: 187,
  },
  {
    id: 'session1-6',
    submissionId: 'sub1-3',
    startedAt: daysAgo(1),
    endedAt: daysAgo(1),
    activeTimeSeconds: 4500, // 75 minutes
    wordsTyped: 423,
    wordsPasted: 28,
    pasteEvents: 1,
    editEvents: 145,
  },
  {
    id: 'session1-7',
    submissionId: 'sub1-3',
    startedAt: hoursAgo(8),
    endedAt: hoursAgo(6),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 467,
    wordsPasted: 38,
    pasteEvents: 2,
    editEvents: 167,
  },

  // Kabir Arya Niraula (student2) - 3 sessions over 2 days for assignment3
  {
    id: 'session2-1',
    submissionId: 'sub2-3',
    startedAt: daysAgo(4),
    endedAt: daysAgo(4),
    activeTimeSeconds: 7200, // 2 hours
    wordsTyped: 1456,
    wordsPasted: 534,
    pasteEvents: 8,
    editEvents: 89,
  },
  {
    id: 'session2-2',
    submissionId: 'sub2-3',
    startedAt: daysAgo(3),
    endedAt: daysAgo(3),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 876,
    wordsPasted: 423,
    pasteEvents: 6,
    editEvents: 67,
  },
  {
    id: 'session2-3',
    submissionId: 'sub2-3',
    startedAt: daysAgo(2),
    endedAt: daysAgo(2),
    activeTimeSeconds: 3600, // 1 hour
    wordsTyped: 534,
    wordsPasted: 287,
    pasteEvents: 4,
    editEvents: 45,
  },

  // Bernard Adjei-Yeboah (student3) - SINGLE session for assignment3 (RED FLAG)
  {
    id: 'session3-1',
    submissionId: 'sub3-3',
    startedAt: daysAgo(2),
    endedAt: daysAgo(2),
    activeTimeSeconds: 7200, // 2 hours exactly
    wordsTyped: 1234,
    wordsPasted: 2876,
    pasteEvents: 23,
    editEvents: 34,
  },

  // Sarah Chen (student4) - 5 sessions over 3 days for assignment3
  {
    id: 'session4-1',
    submissionId: 'sub4-3',
    startedAt: daysAgo(3),
    endedAt: daysAgo(3),
    activeTimeSeconds: 4500, // 75 minutes
    wordsTyped: 654,
    wordsPasted: 89,
    pasteEvents: 3,
    editEvents: 123,
  },
  {
    id: 'session4-2',
    submissionId: 'sub4-3',
    startedAt: daysAgo(3),
    endedAt: daysAgo(3),
    activeTimeSeconds: 3600, // 60 minutes
    wordsTyped: 534,
    wordsPasted: 67,
    pasteEvents: 2,
    editEvents: 98,
  },
  {
    id: 'session4-3',
    submissionId: 'sub4-3',
    startedAt: daysAgo(2),
    endedAt: daysAgo(2),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 723,
    wordsPasted: 78,
    pasteEvents: 2,
    editEvents: 134,
  },
  {
    id: 'session4-4',
    submissionId: 'sub4-3',
    startedAt: daysAgo(1),
    endedAt: daysAgo(1),
    activeTimeSeconds: 4200, // 70 minutes
    wordsTyped: 567,
    wordsPasted: 56,
    pasteEvents: 2,
    editEvents: 112,
  },
  {
    id: 'session4-5',
    submissionId: 'sub4-3',
    startedAt: hoursAgo(12),
    endedAt: hoursAgo(10),
    activeTimeSeconds: 3600, // 60 minutes
    wordsTyped: 398,
    wordsPasted: 45,
    pasteEvents: 1,
    editEvents: 87,
  },

  // Michael Thompson (student5) - 9 sessions over 7 days for assignment3
  {
    id: 'session5-1',
    submissionId: 'sub5-3',
    startedAt: daysAgo(6),
    endedAt: daysAgo(6),
    activeTimeSeconds: 6300, // 105 minutes
    wordsTyped: 876,
    wordsPasted: 23,
    pasteEvents: 1,
    editEvents: 267,
  },
  {
    id: 'session5-2',
    submissionId: 'sub5-3',
    startedAt: daysAgo(6),
    endedAt: daysAgo(6),
    activeTimeSeconds: 4500, // 75 minutes
    wordsTyped: 654,
    wordsPasted: 18,
    pasteEvents: 1,
    editEvents: 198,
  },
  {
    id: 'session5-3',
    submissionId: 'sub5-3',
    startedAt: daysAgo(5),
    endedAt: daysAgo(5),
    activeTimeSeconds: 7200, // 2 hours
    wordsTyped: 1123,
    wordsPasted: 34,
    pasteEvents: 2,
    editEvents: 345,
  },
  {
    id: 'session5-4',
    submissionId: 'sub5-3',
    startedAt: daysAgo(4),
    endedAt: daysAgo(4),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 789,
    wordsPasted: 28,
    pasteEvents: 1,
    editEvents: 234,
  },
  {
    id: 'session5-5',
    submissionId: 'sub5-3',
    startedAt: daysAgo(4),
    endedAt: daysAgo(4),
    activeTimeSeconds: 3600, // 60 minutes
    wordsTyped: 534,
    wordsPasted: 15,
    pasteEvents: 1,
    editEvents: 167,
  },
  {
    id: 'session5-6',
    submissionId: 'sub5-3',
    startedAt: daysAgo(3),
    endedAt: daysAgo(3),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 678,
    wordsPasted: 22,
    pasteEvents: 1,
    editEvents: 212,
  },
  {
    id: 'session5-7',
    submissionId: 'sub5-3',
    startedAt: daysAgo(2),
    endedAt: daysAgo(2),
    activeTimeSeconds: 4800, // 80 minutes
    wordsTyped: 567,
    wordsPasted: 19,
    pasteEvents: 1,
    editEvents: 178,
  },
  {
    id: 'session5-8',
    submissionId: 'sub5-3',
    startedAt: daysAgo(1),
    endedAt: daysAgo(1),
    activeTimeSeconds: 6000, // 100 minutes
    wordsTyped: 723,
    wordsPasted: 25,
    pasteEvents: 1,
    editEvents: 234,
  },
  {
    id: 'session5-9',
    submissionId: 'sub5-3',
    startedAt: hoursAgo(10),
    endedAt: hoursAgo(8),
    activeTimeSeconds: 5400, // 90 minutes
    wordsTyped: 598,
    wordsPasted: 21,
    pasteEvents: 1,
    editEvents: 189,
  },
]

// ============================================================================
// WRITING EVENTS (sample events for tracking)
// ============================================================================

export const mockWritingEvents: WritingEvent[] = [
  // Sample events for Emmanuel's session
  {
    id: 'event1-1',
    sessionId: 'session1-1',
    type: 'keystroke',
    timestamp: daysAgo(5),
    data: { count: 234 },
  },
  {
    id: 'event1-2',
    sessionId: 'session1-1',
    type: 'paste',
    timestamp: daysAgo(5),
    data: { wordCount: 23, source: 'declared_quote' },
  },
  // Sample events for Bernard's session (showing problematic pattern)
  {
    id: 'event3-1',
    sessionId: 'session3-1',
    type: 'paste',
    timestamp: daysAgo(2),
    data: { wordCount: 456, source: 'undeclared' },
  },
  {
    id: 'event3-2',
    sessionId: 'session3-1',
    type: 'paste',
    timestamp: daysAgo(2),
    data: { wordCount: 678, source: 'undeclared' },
  },
  {
    id: 'event3-3',
    sessionId: 'session3-1',
    type: 'paste',
    timestamp: daysAgo(2),
    data: { wordCount: 534, source: 'undeclared' },
  },
]

// ============================================================================
// VERIFICATION QUESTIONS (Teaching Tests)
// ============================================================================

const verificationQuestions: Record<string, VerificationQuestion[]> = {
  'sub1-3': [
    {
      id: 'q1-1',
      type: 'simplify',
      question: 'In your own words, explain the main contribution of your diabetic retinopathy detection system to a non-technical audience.',
      expectedConcepts: ['early detection', 'accessibility', 'AI assistance', 'primary care'],
    },
    {
      id: 'q1-2',
      type: 'justify',
      question: 'Why did you choose to use a convolutional neural network architecture instead of other machine learning approaches for image analysis?',
      expectedConcepts: ['image processing', 'feature extraction', 'spatial relationships', 'performance'],
    },
    {
      id: 'q1-3',
      type: 'counter',
      question: 'A critic argues that AI diagnostic tools could lead to over-reliance on technology and deskilling of healthcare professionals. How would you respond?',
      expectedConcepts: ['augmentation not replacement', 'human oversight', 'decision support', 'training'],
    },
    {
      id: 'q1-4',
      type: 'extend',
      question: 'How could your system be adapted to detect other eye conditions beyond diabetic retinopathy?',
      expectedConcepts: ['transfer learning', 'multi-class classification', 'additional training data', 'generalization'],
    },
    {
      id: 'q1-5',
      type: 'process',
      question: 'Walk me through the steps you took to validate your model\'s performance and ensure it would work reliably in clinical settings.',
      expectedConcepts: ['test set', 'cross-validation', 'clinical trial', 'sensitivity/specificity', 'bias testing'],
    },
  ],
  'sub2-3': [
    {
      id: 'q2-1',
      type: 'simplify',
      question: 'Explain how blockchain ensures drug authenticity in your supply chain system to someone unfamiliar with the technology.',
      expectedConcepts: ['immutable records', 'distributed ledger', 'verification', 'transparency'],
    },
    {
      id: 'q2-2',
      type: 'justify',
      question: 'Why did you choose Hyperledger Fabric over public blockchain platforms like Ethereum for this application?',
      expectedConcepts: ['permissioned', 'privacy', 'performance', 'enterprise requirements'],
    },
    {
      id: 'q2-3',
      type: 'counter',
      question: 'Some argue that traditional database systems with proper access controls could achieve the same results. How would you respond?',
      expectedConcepts: ['decentralization', 'trust', 'tamper-proof', 'multi-party'],
    },
    {
      id: 'q2-4',
      type: 'extend',
      question: 'How could your system be enhanced to handle temperature-sensitive medications that require cold chain monitoring?',
      expectedConcepts: ['IoT sensors', 'smart contracts', 'automated alerts', 'compliance'],
    },
    {
      id: 'q2-5',
      type: 'process',
      question: 'Describe the process a pharmacist would follow to verify a drug\'s authenticity using your system.',
      expectedConcepts: ['scan', 'query ledger', 'verify hash', 'provenance check'],
    },
  ],
  'sub3-3': [
    {
      id: 'q3-1',
      type: 'simplify',
      question: 'Explain the main purpose of your security assessment framework in simple terms.',
      expectedConcepts: ['identify vulnerabilities', 'risk assessment', 'protection', 'SME focused'],
    },
    {
      id: 'q3-2',
      type: 'justify',
      question: 'Why did you choose to base your framework on NIST and ISO 27001 standards?',
      expectedConcepts: ['industry recognition', 'comprehensive', 'best practices', 'compliance'],
    },
    {
      id: 'q3-3',
      type: 'counter',
      question: 'Critics might say SMEs don\'t have resources for comprehensive security frameworks. How does your solution address this?',
      expectedConcepts: ['scalable', 'prioritization', 'cost-effective', 'phased approach'],
    },
    {
      id: 'q3-4',
      type: 'extend',
      question: 'How would you adapt your framework to address emerging threats from AI-powered attacks?',
      expectedConcepts: ['AI threats', 'adaptive controls', 'monitoring', 'updates'],
    },
    {
      id: 'q3-5',
      type: 'process',
      question: 'Walk through the step-by-step process an SME would follow to implement your framework.',
      expectedConcepts: ['assessment', 'gap analysis', 'implementation', 'review'],
    },
  ],
  'sub4-3': [
    {
      id: 'q4-1',
      type: 'simplify',
      question: 'What are the key design principles you applied to make your mobile banking app accessible to elderly users?',
      expectedConcepts: ['larger text', 'simple navigation', 'clear feedback', 'reduced cognitive load'],
    },
    {
      id: 'q4-2',
      type: 'justify',
      question: 'Why did you choose to conduct usability testing with participants aged 65+ specifically?',
      expectedConcepts: ['target users', 'real feedback', 'accessibility needs', 'validation'],
    },
    {
      id: 'q4-3',
      type: 'counter',
      question: 'Some might argue that a separate interface for elderly users is discriminatory. How would you respond?',
      expectedConcepts: ['inclusive design', 'choice', 'accessibility standards', 'universal benefit'],
    },
    {
      id: 'q4-4',
      type: 'extend',
      question: 'How could your design principles be applied to other applications beyond banking?',
      expectedConcepts: ['healthcare apps', 'government services', 'e-commerce', 'general accessibility'],
    },
    {
      id: 'q4-5',
      type: 'process',
      question: 'Describe your iterative design process from initial concept to final tested prototype.',
      expectedConcepts: ['research', 'prototyping', 'testing', 'iteration', 'refinement'],
    },
  ],
  'sub5-3': [
    {
      id: 'q5-1',
      type: 'simplify',
      question: 'Explain how CodeSage helps developers write better code to someone who isn\'t a programmer.',
      expectedConcepts: ['automated review', 'suggestions', 'quality improvement', 'time saving'],
    },
    {
      id: 'q5-2',
      type: 'justify',
      question: 'Why did you combine transformer-based language models with traditional static analysis rather than relying on LLMs alone?',
      expectedConcepts: ['complementary strengths', 'reliability', 'deterministic checks', 'contextual understanding'],
    },
    {
      id: 'q5-3',
      type: 'counter',
      question: 'Developers might worry that AI code review could miss subtle bugs that humans would catch. How would you address this concern?',
      expectedConcepts: ['augmentation', 'human oversight', 'confidence scores', 'continuous improvement'],
    },
    {
      id: 'q5-4',
      type: 'extend',
      question: 'How could CodeSage be extended to not just review code but also help developers learn and improve their skills?',
      expectedConcepts: ['educational feedback', 'explanations', 'best practices', 'personalized learning'],
    },
    {
      id: 'q5-5',
      type: 'process',
      question: 'Walk me through the architecture of CodeSage, from code input to final review output.',
      expectedConcepts: ['parsing', 'AST analysis', 'LLM processing', 'static analysis', 'aggregation', 'output formatting'],
    },
  ],
}

// ============================================================================
// VERIFICATION RESPONSES
// ============================================================================

const verificationResponses: Record<string, VerificationResponse[]> = {
  // Emmanuel's responses - EXCELLENT
  'sub1-3': [
    {
      questionId: 'q1-1',
      response: 'My diabetic retinopathy detection system acts like a highly trained assistant for eye doctors. It analyzes photographs of the back of the eye to spot early signs of damage from diabetes - things like tiny blood vessel changes or swelling. The key contribution is making this screening available in regular doctor\'s offices, not just specialist eye clinics. This means more diabetic patients can get checked early, when treatment is most effective, without needing to travel to see a specialist. The AI doesn\'t replace doctors but helps them catch problems they might otherwise miss, especially in busy primary care settings.',
      score: 95,
      feedback: 'Excellent explanation that demonstrates deep understanding. Clearly articulates the value proposition and clinical workflow integration.',
      answeredAt: daysAgo(4),
    },
    {
      questionId: 'q1-2',
      response: 'I chose CNNs because they\'re specifically designed to understand images in a way that mirrors how we process visual information. Unlike traditional ML approaches that require manual feature engineering, CNNs automatically learn to detect relevant patterns - from basic edges in early layers to complex structures like microaneurysms in deeper layers. For retinal images, spatial relationships matter enormously. A CNN preserves this spatial information through its convolutional operations, whereas approaches like SVMs or random forests would lose this context when flattening the image into a feature vector. Additionally, CNNs have proven track records in medical imaging with architectures like ResNet and EfficientNet achieving state-of-the-art results across multiple diagnostic tasks.',
      score: 92,
      feedback: 'Strong technical justification showing understanding of both the architecture choice and alternatives considered.',
      answeredAt: daysAgo(4),
    },
    {
      questionId: 'q1-3',
      response: 'This is an important concern that I\'ve thought carefully about. My system is explicitly designed as a decision support tool, not a replacement for clinical judgment. The output includes confidence scores and highlighted regions, giving clinicians the information to make informed decisions. In fact, I argue it could reduce deskilling by exposing primary care physicians to ophthalmological concepts they wouldn\'t otherwise encounter. The system flags cases for specialist review rather than making final diagnoses. Additionally, requiring human sign-off on all results ensures clinicians stay engaged in the diagnostic process. The goal is augmentation - helping good doctors be even better, while catching cases that might slip through in high-volume settings.',
      score: 90,
      feedback: 'Thoughtful response that directly addresses the critique with specific design decisions.',
      answeredAt: daysAgo(4),
    },
    {
      questionId: 'q1-4',
      response: 'The system architecture supports extension through transfer learning. The base CNN layers that detect fundamental image features like vessels, textures, and lesions would transfer well to conditions like age-related macular degeneration, glaucoma, or hypertensive retinopathy. We\'d fine-tune the classification layers with condition-specific training data while keeping the feature extraction layers largely intact. This approach is data-efficient, requiring fewer labeled examples than training from scratch. I\'ve actually designed the model with a multi-head output that could be expanded - currently it outputs DR severity grades, but additional heads could classify other conditions simultaneously, creating a comprehensive retinal screening tool.',
      score: 93,
      feedback: 'Demonstrates forward-thinking design and understanding of transfer learning applications.',
      answeredAt: daysAgo(4),
    },
    {
      questionId: 'q1-5',
      response: 'Validation was a multi-stage process. First, I used k-fold cross-validation during development to ensure the model wasn\'t overfitting to specific image characteristics. Then I evaluated on a completely held-out test set of 5,000 images from different clinical sites than the training data - this geographic diversity is crucial for real-world generalization. I measured sensitivity (94.2%) and specificity (91.8%), but also analyzed performance across demographic subgroups to check for bias - the model performs consistently across age groups and ethnicities represented in the data. Finally, I conducted a prospective pilot study where the system ran alongside standard clinical workflow, comparing its recommendations against specialist diagnoses. This revealed edge cases that informed further refinement before any deployment recommendation.',
      score: 94,
      feedback: 'Comprehensive validation approach demonstrating understanding of clinical requirements and bias considerations.',
      answeredAt: daysAgo(4),
    },
  ],

  // Kabir's responses - ADEQUATE but surface-level
  'sub2-3': [
    {
      questionId: 'q2-1',
      response: 'Blockchain is like a shared notebook that everyone can read but no one can erase. When a drug moves through the supply chain, each step gets written down and locked in. So if someone tries to insert fake drugs, it would be obvious because they can\'t fake the history of where the drug has been. Everyone in the network - manufacturers, distributors, pharmacies - can verify the drug is real by checking this shared record.',
      score: 72,
      feedback: 'Adequate explanation but could provide more specific details about the verification mechanism.',
      answeredAt: daysAgo(3),
    },
    {
      questionId: 'q2-2',
      response: 'Hyperledger Fabric is better for business applications because it\'s permissioned - only authorized parties can participate. Ethereum is public so anyone could join, which creates privacy concerns for pharmaceutical companies. Fabric also has better transaction throughput which matters when tracking millions of drug packages. The modular architecture lets us customize it for pharmaceutical requirements.',
      score: 68,
      feedback: 'Covers key points but lacks depth on specific pharmaceutical industry requirements.',
      answeredAt: daysAgo(3),
    },
    {
      questionId: 'q2-3',
      response: 'Traditional databases have a single point of control, so a determined attacker could potentially modify records if they gained admin access. Blockchain distributes this control across multiple parties, making tampering much harder. Also, in a supply chain with multiple companies, no single company should control the database - blockchain provides a neutral shared infrastructure.',
      score: 65,
      feedback: 'Basic understanding shown but doesn\'t address all aspects of the counter-argument comprehensively.',
      answeredAt: daysAgo(3),
    },
    {
      questionId: 'q2-4',
      response: 'We could add IoT temperature sensors that write to the blockchain automatically. Smart contracts could trigger alerts if temperature goes out of range. This would create an automatic compliance record for regulators. The blockchain timestamp would prove exactly when any temperature excursion occurred.',
      score: 70,
      feedback: 'Good ideas but lacks implementation details and consideration of challenges.',
      answeredAt: daysAgo(3),
    },
    {
      questionId: 'q2-5',
      response: 'The pharmacist would scan the QR code on the drug package. This sends a query to the blockchain network. The system looks up the drug\'s full history - manufacturer, distributor, shipping dates. If everything matches expected patterns, it shows a green verification. Any discrepancy would flag the drug for further investigation.',
      score: 66,
      feedback: 'Process is described but misses technical details about cryptographic verification.',
      answeredAt: daysAgo(3),
    },
  ],

  // Bernard's responses - POOR (struggling to explain)
  'sub3-3': [
    {
      questionId: 'q3-1',
      response: 'The framework helps small businesses check their security. It looks at different areas like networks and policies and tells them what needs fixing. It\'s based on standards that are widely used.',
      score: 35,
      feedback: 'Very vague response lacking specificity. Does not demonstrate understanding of the framework\'s unique value.',
      answeredAt: daysAgo(1),
    },
    {
      questionId: 'q3-2',
      response: 'NIST and ISO 27001 are the main security standards that companies use. They cover all the important security areas. Using established standards means the framework is credible and comprehensive.',
      score: 32,
      feedback: 'Generic answer that could apply to any security framework. No specific reasoning provided.',
      answeredAt: daysAgo(1),
    },
    {
      questionId: 'q3-3',
      response: 'The framework is designed to be simple and not require too many resources. SMEs can implement it gradually. It focuses on the most important risks first.',
      score: 38,
      feedback: 'Surface-level response. Does not explain how the framework actually achieves resource efficiency.',
      answeredAt: daysAgo(1),
    },
    {
      questionId: 'q3-4',
      response: 'AI attacks are a new threat that the framework would need to address. We would need to add new controls and monitoring. Regular updates would be needed to stay current with threats.',
      score: 30,
      feedback: 'Extremely vague. No specific understanding of AI threats or how to counter them demonstrated.',
      answeredAt: daysAgo(1),
    },
    {
      questionId: 'q3-5',
      response: 'First the SME would assess their current security. Then identify gaps compared to the framework requirements. Then implement the necessary controls. Finally review and maintain the security measures.',
      score: 36,
      feedback: 'Generic process description. Lacks specific details about the framework\'s methodology.',
      answeredAt: daysAgo(1),
    },
  ],

  // Sarah's responses - GOOD but brief (new student)
  'sub4-3': [
    {
      questionId: 'q4-1',
      response: 'The main principles I applied were: larger touch targets and text (minimum 16pt), simplified navigation with no more than 3 levels deep, high contrast colors, clear feedback for every action, and reduced number of options per screen to prevent cognitive overload. I also avoided gestures like swiping in favor of explicit buttons.',
      score: 78,
      feedback: 'Good coverage of key principles with specific examples.',
      answeredAt: daysAgo(2),
    },
    {
      questionId: 'q4-2',
      response: 'Elderly users face unique challenges - declining vision, motor control issues, and often less familiarity with mobile interfaces. Testing with the actual target demographic reveals problems that younger testers wouldn\'t encounter. Their feedback was essential for validating that my accessibility features actually helped rather than just looking good on paper.',
      score: 75,
      feedback: 'Solid reasoning though could elaborate on specific findings from testing.',
      answeredAt: daysAgo(2),
    },
    {
      questionId: 'q4-3',
      response: 'The interface is offered as an option, not forced on elderly users. Many accessibility features like larger text and clearer navigation actually benefit all users. The goal is inclusion - giving users choice about how they interact with their banking. It\'s similar to how wheelchair ramps help everyone, not just wheelchair users.',
      score: 72,
      feedback: 'Good analogy used. Could strengthen argument with universal design principles.',
      answeredAt: daysAgo(2),
    },
    {
      questionId: 'q4-4',
      response: 'The principles directly apply to healthcare apps where medication reminders and appointment booking need to be accessible. Government services for pensions and benefits are another clear application. E-commerce checkout flows could benefit from the simplified navigation approach. Basically any app where elderly users need to complete important tasks.',
      score: 74,
      feedback: 'Good identification of application areas with reasonable justification.',
      answeredAt: daysAgo(2),
    },
    {
      questionId: 'q4-5',
      response: 'I started with literature review and interviews with elderly banking customers to understand pain points. Created low-fidelity wireframes and tested with 5 participants. Refined the design and built an interactive prototype in Figma. Conducted two more rounds of testing with 8 participants each time, making changes after each round. The final prototype showed 40% improvement in task completion rates compared to the standard banking app.',
      score: 76,
      feedback: 'Clear process described with quantifiable outcome. Good methodological approach.',
      answeredAt: daysAgo(2),
    },
  ],

  // Michael's responses - EXCEPTIONAL
  'sub5-3': [
    {
      questionId: 'q5-1',
      response: 'Imagine having an experienced colleague look over your work before you submit it - that\'s what CodeSage does for programmers. When developers write code, CodeSage reads through it and points out potential problems, like a spell-checker for code but much smarter. It catches things like security vulnerabilities, performance issues, and unclear code that could cause problems later. The key benefit is speed - it provides this feedback in seconds rather than the hours it might take waiting for a human reviewer, while catching issues that busy reviewers might miss. This means developers can fix problems immediately while the code is fresh in their minds.',
      score: 98,
      feedback: 'Exceptional explanation that uses effective analogies and clearly articulates value without oversimplifying.',
      answeredAt: daysAgo(5),
    },
    {
      questionId: 'q5-2',
      response: 'This hybrid approach leverages complementary strengths. Static analysis provides deterministic, reliable detection of well-defined issues - things like null pointer dereferences, SQL injection patterns, or style violations. These tools never hallucinate or miss obvious bugs. However, they can\'t understand context or intent. That\'s where LLMs excel - they understand natural language comments, can reason about code semantics, and catch subtle issues like misleading variable names or logic that doesn\'t match the documented purpose. By combining both, we get reliable detection of known patterns PLUS intelligent analysis of context-dependent issues. The static analysis results also help ground the LLM\'s suggestions, reducing hallucination by providing verified facts about the code.',
      score: 96,
      feedback: 'Demonstrates sophisticated understanding of both technologies and their synergistic combination.',
      answeredAt: daysAgo(5),
    },
    {
      questionId: 'q5-3',
      response: 'This concern is valid and shapes how we present CodeSage\'s output. First, every suggestion includes a confidence score based on the agreement between static analysis and LLM components - high confidence for deterministic issues, lower for subjective ones. Second, we explicitly categorize findings into "definite bugs," "likely issues," and "suggestions for consideration." Third, CodeSage never auto-commits changes; all suggestions require human approval. Fourth, we track false positive rates and tune the system to maintain precision above 85%. Finally, we frame CodeSage as the first pass, not the final word - the goal is to handle routine checking so human reviewers can focus on architecture, design, and subtle logical issues that require deep domain knowledge.',
      score: 95,
      feedback: 'Comprehensive response addressing the concern with specific design decisions and metrics.',
      answeredAt: daysAgo(5),
    },
    {
      questionId: 'q5-4',
      response: 'CodeSage is already positioned for this extension. Currently, it provides brief explanations with each suggestion. The learning enhancement would expand this into a teaching mode where developers can request detailed explanations of why something is problematic, see examples of better approaches, and access curated resources. We could track patterns in each developer\'s code to provide personalized recommendations - if someone repeatedly makes the same mistake, CodeSage could offer a targeted mini-lesson. Integration with IDE learning features could suggest relevant documentation as developers type. Long-term, aggregated anonymized data could identify common skill gaps across teams, informing training program design. The key insight is that every code review moment is a learning opportunity.',
      score: 97,
      feedback: 'Visionary response that shows both immediate implementation path and strategic thinking.',
      answeredAt: daysAgo(5),
    },
    {
      questionId: 'q5-5',
      response: 'The pipeline starts when code is submitted for review. First, the parsing layer extracts the Abstract Syntax Tree and builds a graph representation capturing data flow, control flow, and call relationships. This feeds into parallel processing paths. The static analysis path runs rule-based checkers, security scanners, and complexity analyzers - these complete quickly with deterministic results. Simultaneously, the LLM path chunks the code with surrounding context, processes through a fine-tuned CodeLlama model, and generates semantic analysis. Both paths produce structured findings with locations, severities, and explanations. The aggregation layer merges these, deduplicates overlapping findings, and applies learned ranking based on historical developer responses. Finally, the output formatter generates inline comments for IDE integration, summary reports for review dashboards, and API responses for CI/CD integration. The whole pipeline completes in under 30 seconds for typical PRs.',
      score: 98,
      feedback: 'Exceptional technical depth showing complete understanding of system architecture.',
      answeredAt: daysAgo(5),
    },
  ],
}

// ============================================================================
// VERIFICATION TESTS
// ============================================================================

export const mockVerificationTests: VerificationTest[] = [
  // Emmanuel's test - HIGH SCORE
  {
    id: 'test1-3',
    submissionId: 'sub1-3',
    questions: verificationQuestions['sub1-3'],
    responses: verificationResponses['sub1-3'],
    overallScore: 92,
    status: 'completed',
    startedAt: daysAgo(4),
    completedAt: daysAgo(4),
  },
  // Kabir's test - MEDIUM SCORE
  {
    id: 'test2-3',
    submissionId: 'sub2-3',
    questions: verificationQuestions['sub2-3'],
    responses: verificationResponses['sub2-3'],
    overallScore: 68,
    status: 'completed',
    startedAt: daysAgo(3),
    completedAt: daysAgo(3),
  },
  // Bernard's test - LOW SCORE
  {
    id: 'test3-3',
    submissionId: 'sub3-3',
    questions: verificationQuestions['sub3-3'],
    responses: verificationResponses['sub3-3'],
    overallScore: 34,
    status: 'completed',
    startedAt: daysAgo(1),
    completedAt: daysAgo(1),
  },
  // Sarah's test - GOOD SCORE
  {
    id: 'test4-3',
    submissionId: 'sub4-3',
    questions: verificationQuestions['sub4-3'],
    responses: verificationResponses['sub4-3'],
    overallScore: 75,
    status: 'completed',
    startedAt: daysAgo(2),
    completedAt: daysAgo(2),
  },
  // Michael's test - EXCELLENT SCORE
  {
    id: 'test5-3',
    submissionId: 'sub5-3',
    questions: verificationQuestions['sub5-3'],
    responses: verificationResponses['sub5-3'],
    overallScore: 96,
    status: 'completed',
    startedAt: daysAgo(5),
    completedAt: daysAgo(5),
  },
]

// ============================================================================
// INTEGRITY REPORTS
// ============================================================================

export const mockIntegrityReports: IntegrityReport[] = [
  // Emmanuel - HIGH INTEGRITY (89/100)
  {
    id: 'report1-3',
    submissionId: 'sub1-3',
    authorshipScore: 91,
    comprehensionScore: 92,
    styleConsistencyScore: 85,
    combinedScore: 89,
    riskLevel: 'low',
    flags: [],
    recommendation: 'Approve - Excellent demonstration of understanding. Strong authorship indicators across 7 writing sessions with consistent engagement patterns. Teaching Test responses show deep comprehension of methodology and design decisions. Writing style consistent with previous submissions.',
    generatedAt: daysAgo(4),
  },
  // Kabir - MEDIUM INTEGRITY (65/100)
  {
    id: 'report2-3',
    submissionId: 'sub2-3',
    authorshipScore: 68,
    comprehensionScore: 68,
    styleConsistencyScore: 60,
    combinedScore: 65,
    riskLevel: 'medium',
    flags: [
      'Session count below recommended minimum (3 vs 8 recommended)',
      'Elevated paste ratio (28%) - some paste events require review',
      'Limited revision activity compared to word count',
    ],
    recommendation: 'Review recommended - Verify source attribution for pasted content. While comprehension is adequate, the limited number of writing sessions and elevated paste ratio warrant a brief discussion with the student to confirm understanding. Consider asking for clarification on specific sections.',
    generatedAt: daysAgo(3),
  },
  // Bernard - LOW INTEGRITY (38/100)
  {
    id: 'report3-3',
    submissionId: 'sub3-3',
    authorshipScore: 28,
    comprehensionScore: 34,
    styleConsistencyScore: 52,
    combinedScore: 38,
    riskLevel: 'high',
    flags: [
      'Single session submission (completed in 2 hours)',
      'Critical: High undeclared paste ratio (67%)',
      'Comprehension score significantly below threshold (34/100)',
      'Multiple large paste events detected without source attribution',
      'Unable to adequately explain key concepts in Teaching Test',
      'Writing style deviation from baseline (previous submissions)',
      'Minimal revision activity inconsistent with claimed authorship',
    ],
    recommendation: 'Further investigation required - Multiple significant integrity concerns detected. The combination of single-session completion, high undeclared paste ratio, and inability to explain key concepts in the Teaching Test raises serious questions about authorship. Recommend scheduling an in-person discussion with the student and potentially requiring a supervised revision session.',
    generatedAt: daysAgo(1),
  },
  // Sarah - LOW RISK (72/100) - New student
  {
    id: 'report4-3',
    submissionId: 'sub4-3',
    authorshipScore: 74,
    comprehensionScore: 75,
    styleConsistencyScore: 68,
    combinedScore: 72,
    riskLevel: 'low',
    flags: [],
    recommendation: 'Approve - Normal patterns for new student. This is only the student\'s second major submission, so baseline patterns are still being established. Writing sessions show healthy engagement, and Teaching Test responses demonstrate good understanding of the project. Paste ratio (12%) is within normal range with appropriate attribution.',
    generatedAt: daysAgo(2),
  },
  // Michael - EXCELLENT (94/100)
  {
    id: 'report5-3',
    submissionId: 'sub5-3',
    authorshipScore: 96,
    comprehensionScore: 96,
    styleConsistencyScore: 90,
    combinedScore: 94,
    riskLevel: 'low',
    flags: [],
    recommendation: 'Approve - Outstanding engagement and comprehension. Exemplary submission demonstrating exceptional authorship indicators across 9 well-distributed writing sessions. Teaching Test responses show sophisticated understanding that goes beyond surface-level knowledge. Very low paste ratio (5%) with all instances properly attributed as quotes. Writing style highly consistent with established baseline. This submission represents best practices in academic writing.',
    generatedAt: daysAgo(5),
  },
]

// Export all mock data
export const mockData = {
  users: mockUsers,
  courses: mockCourses,
  assignments: mockAssignments,
  submissions: mockSubmissions,
  writingSessions: mockWritingSessions,
  writingEvents: mockWritingEvents,
  verificationTests: mockVerificationTests,
  integrityReports: mockIntegrityReports,
}
