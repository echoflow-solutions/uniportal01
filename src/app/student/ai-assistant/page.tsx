'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Send,
  Bot,
  User,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  GraduationCap,
  Clock,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Mock AI responses based on keywords
const mockResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['deadline', 'due', 'submit', 'submission'],
    response: `Based on your current enrollments, here are your upcoming deadlines:

**ICT6001 - Applied Project:**
• Final Report - Due December 18, 2025 (10 days left)
• Peer Review Submission - Due December 15, 2025 (7 days left)

**ICT6002 - Research Methods:**
• Research Presentation - Due December 22, 2025 (14 days left)

💡 **Tip:** I recommend starting with the Peer Review as it's due first. Would you like me to help you plan your submission schedule?`,
  },
  {
    keywords: ['grade', 'gpa', 'score', 'mark', 'result'],
    response: `Here's a summary of your academic performance:

**Current GPA:** 3.85 / 4.0 ⭐

**Recent Grades:**
• ICT6001 Applied Project (In Progress) - Projected: A
• ICT5003 Database Systems - Final Grade: A (92%)
• ICT5002 Network Security - Final Grade: A- (88%)
• ICT5001 Software Engineering - Final Grade: B+ (85%)

Your academic standing is **Excellent**. You're on track for Dean's List recognition! Keep up the great work.`,
  },
  {
    keywords: ['course', 'enroll', 'register', 'class', 'module'],
    response: `You're currently enrolled in the following courses:

**Current Semester (Fall 2025):**

1. **ICT6001 - Applied Project**
   - Instructor: Dr. Ifeanyi Egwutuoha
   - Credits: 4 | Status: In Progress
   - Next Class: Tomorrow, 9:00 AM (Room 301)

2. **ICT6002 - Research Methods**
   - Instructor: Prof. Sarah Mitchell
   - Credits: 3 | Status: In Progress

3. **ICT6003 - Advanced Database Systems**
   - Instructor: Dr. James Chen
   - Credits: 3 | Status: In Progress

4. **ICT6004 - Cloud Computing**
   - Instructor: Dr. Amara Okonkwo
   - Credits: 3 | Status: In Progress

**Total Credits:** 13 | **Registration Status:** Complete`,
  },
  {
    keywords: ['fee', 'payment', 'tuition', 'finance', 'pay', 'money', 'balance'],
    response: `Here's your financial summary:

**Account Status:** ✅ Good Standing

**Tuition Breakdown (Fall 2025):**
• Tuition Fees: $4,500.00
• Technology Fee: $250.00
• Library Fee: $150.00
• **Total Due:** $4,900.00

**Payment History:**
• Sept 15, 2025 - $2,500.00 (Paid) ✓
• Oct 15, 2025 - $2,400.00 (Paid) ✓

**Balance:** $0.00 🎉

All fees are paid for this semester. Your next payment will be due January 15, 2026 for Spring semester registration.`,
  },
  {
    keywords: ['schedule', 'timetable', 'class time', 'when'],
    response: `Here's your schedule for today and this week:

**Today (Monday):**
• 9:00 AM - Applied Project Lecture (Room 301)
• 11:30 AM - Group Meeting (Library Study Room B)
• 2:00 PM - Supervisor Consultation (Office 204)
• 4:00 PM - AI Workshop (Computer Lab 2)

**This Week's Highlights:**
• Wednesday: Research Methods Seminar (2:00 PM)
• Thursday: Database Lab Session (10:00 AM)
• Friday: Cloud Computing Workshop (1:00 PM)

Would you like me to add any reminders to your calendar?`,
  },
  {
    keywords: ['assignment', 'homework', 'task', 'project'],
    response: `Here are your current assignments:

**Pending Assignments:**

1. **Final Report - ICT6001** 🔴 High Priority
   - Due: December 18, 2025
   - Progress: 65% complete
   - Remaining: Literature review section

2. **Peer Review Submission** 🔴 High Priority
   - Due: December 15, 2025
   - Status: Not started
   - Review 2 peer submissions

3. **Research Presentation** 🟡 Medium Priority
   - Due: December 22, 2025
   - Progress: 40% complete
   - Slides preparation needed

💡 **Recommendation:** Focus on the Peer Review first since it's due in 7 days. Need help getting started?`,
  },
  {
    keywords: ['help', 'support', 'assist', 'how to', 'how do'],
    response: `I'm here to help! Here's what I can assist you with:

📚 **Academic Support:**
• Check your grades and GPA
• View upcoming deadlines
• Track assignment progress
• Course information

📅 **Schedule & Planning:**
• View your class schedule
• Check upcoming events
• Set study reminders

💰 **Financial:**
• View tuition balance
• Payment history
• Fee breakdowns

🎓 **General:**
• University policies
• Contact information
• Registration help

Just ask me anything! For example:
- "What are my upcoming deadlines?"
- "Show me my grades"
- "What's my class schedule?"`,
  },
  {
    keywords: ['integrity', 'plagiarism', 'academic honesty', 'cheating'],
    response: `**Academic Integrity at APIC**

Your current Integrity Score: **92%** ✅

Academic integrity is fundamental to your education. Here are key points:

**Do's:**
✓ Always cite your sources properly
✓ Use the plagiarism checker before submitting
✓ Collaborate ethically on group projects
✓ Ask when unsure about citation rules

**Don'ts:**
✗ Copy without attribution
✗ Share assignment answers
✗ Use unauthorized materials during exams
✗ Submit others' work as your own

**Resources:**
• Citation Guide: Library Portal > Resources
• Plagiarism Checker: Submit tab in each course
• Academic Integrity Office: Room 105, Admin Building

Need help with proper citations? I can guide you through APA, MLA, or Harvard formats.`,
  },
  {
    keywords: ['supervisor', 'advisor', 'lecturer', 'professor', 'dr', 'instructor'],
    response: `**Your Academic Contacts:**

**Project Supervisor:**
👨‍🏫 **Dr. Ifeanyi Egwutuoha**
- Role: Course Coordinator - ICT6001 Applied Project
- Email: i.egwutuoha@apic.edu
- Office: Room 204, ICT Building
- Office Hours: Mon & Wed, 2:00 PM - 4:00 PM
- Next Consultation: Today at 2:00 PM

**Other Instructors:**
• Prof. Sarah Mitchell (Research Methods)
• Dr. James Chen (Database Systems)
• Dr. Amara Okonkwo (Cloud Computing)

**Academic Advisor:**
• Dr. Michael Owusu
- Office: Student Services, Room 102

Would you like me to help you schedule a meeting with any of them?`,
  },
  {
    keywords: ['exam', 'test', 'final', 'midterm'],
    response: `**Upcoming Examinations:**

📝 **Final Exams Schedule (December 2025):**

• **ICT6002 Research Methods**
  - Date: December 20, 2025
  - Time: 9:00 AM - 12:00 PM
  - Venue: Exam Hall A

• **ICT6003 Database Systems**
  - Date: December 21, 2025
  - Time: 2:00 PM - 5:00 PM
  - Venue: Exam Hall B

• **ICT6004 Cloud Computing**
  - Date: December 23, 2025
  - Time: 9:00 AM - 12:00 PM
  - Venue: Computer Lab 1

**Note:** ICT6001 Applied Project is assessed through continuous assessment (no final exam).

📚 **Study Tips:**
- Review past papers (available in Library Portal)
- Form study groups with classmates
- Attend revision sessions

Good luck with your exams! 🍀`,
  },
]

// Suggested questions for quick access
const suggestedQuestions = [
  { icon: Calendar, text: 'What are my upcoming deadlines?', color: 'text-red-500' },
  { icon: GraduationCap, text: 'Show me my grades', color: 'text-amber-500' },
  { icon: BookOpen, text: 'What courses am I enrolled in?', color: 'text-blue-500' },
  { icon: Clock, text: "What's my schedule today?", color: 'text-green-500' },
  { icon: FileText, text: 'Show my assignments', color: 'text-purple-500' },
  { icon: HelpCircle, text: 'How can you help me?', color: 'text-indigo-500' },
]

function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Check each response pattern
  for (const pattern of mockResponses) {
    if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return pattern.response
    }
  }

  // Default response if no pattern matches
  return `Thank you for your question! While I'm still learning about that specific topic, here are some things I can definitely help you with:

• **Deadlines** - Ask about your upcoming submissions
• **Grades** - Check your GPA and course grades
• **Schedule** - View your class timetable
• **Courses** - See your enrolled modules
• **Fees** - Check your financial status
• **Assignments** - Track your pending work

Try asking something like "What are my deadlines?" or "Show me my grades" and I'll provide detailed information!

Is there anything specific from the list above I can help you with?`
}

export default function AIAssistantPage() {
  const { currentUser } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${currentUser?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Academic Assistant powered by advanced language models.

I'm here to help you with:
• 📅 Checking deadlines and schedules
• 📊 Viewing your grades and GPA
• 📚 Course information and registration
• 💰 Financial and fee inquiries
• 📝 Assignment tracking
• 🎓 General academic guidance

How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Get AI response
    const aiResponse = getAIResponse(text)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                AI Academic Assistant
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Powered by Advanced AI • Always here to help</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
            <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar - Suggested Questions */}
          <div className="lg:col-span-1 space-y-4 hidden lg:block">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-sm text-slate-900">Quick Questions</h3>
                </div>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question.text)}
                      className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <question.icon className={`h-4 w-4 mt-0.5 ${question.color}`} />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">{question.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">AI Capabilities</h3>
                </div>
                <ul className="space-y-2 text-xs text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-300 rounded-full" />
                    Real-time academic info
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-300 rounded-full" />
                    Personalized responses
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-300 rounded-full" />
                    24/7 availability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-300 rounded-full" />
                    Instant answers
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden flex flex-col flex-1">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-br from-slate-700 to-slate-800'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Bot className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.role === 'assistant'
                          ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                      }`}>
                        <div className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? 'prose prose-sm max-w-none' : ''}`}>
                          {message.content.split('\n').map((line, i) => (
                            <span key={i}>
                              {line.startsWith('**') && line.endsWith('**') ? (
                                <strong>{line.replace(/\*\*/g, '')}</strong>
                              ) : line.startsWith('•') || line.startsWith('-') ? (
                                <span className="block ml-2">{line}</span>
                              ) : line.startsWith('✓') || line.startsWith('✗') ? (
                                <span className="block ml-2">{line}</span>
                              ) : (
                                line
                              )}
                              {i < message.content.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your academics..."
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <MessageSquare className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  AI responses are for guidance only. For official information, please contact the administration.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
