'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  Send,
  User,
  Loader2,
  FileText,
  ClipboardCheck,
  BookOpen,
  Lightbulb,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  History,
  Trash2,
  Zap,
  Shield,
} from 'lucide-react'

// Quick action suggestions for instructors
const quickActions = [
  {
    icon: ClipboardCheck,
    title: 'Generate Rubric',
    description: 'Create assessment criteria',
    prompt: 'Help me create a detailed grading rubric for a research paper assignment',
  },
  {
    icon: MessageSquare,
    title: 'Feedback Templates',
    description: 'Draft constructive feedback',
    prompt: 'Generate constructive feedback template for a student submission that needs improvement',
  },
  {
    icon: FileText,
    title: 'Assignment Ideas',
    description: 'Create engaging assessments',
    prompt: 'Suggest creative assignment ideas for teaching database design concepts',
  },
  {
    icon: BookOpen,
    title: 'Lesson Planning',
    description: 'Structure course content',
    prompt: 'Help me outline a 2-hour lecture on cloud computing architecture',
  },
  {
    icon: Lightbulb,
    title: 'Explain Concepts',
    description: 'Simplify complex topics',
    prompt: 'Explain machine learning concepts in simple terms suitable for undergraduate students',
  },
  {
    icon: BarChart3,
    title: 'Analyze Performance',
    description: 'Interpret grade patterns',
    prompt: 'What strategies can I use to help students who are struggling with programming concepts?',
  },
]

// Chat history
const sampleHistory = [
  {
    id: '1',
    title: 'Rubric for Final Project',
    preview: 'Creating assessment criteria for...',
    date: 'Today',
  },
  {
    id: '2',
    title: 'Feedback Templates',
    preview: 'Constructive feedback for...',
    date: 'Yesterday',
  },
  {
    id: '3',
    title: 'Lecture Planning',
    preview: 'Database normalization lesson...',
    date: '2 days ago',
  },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function InstructorAIAssistantPage() {
  const { currentUser } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello Dr. Egwutuoha! I'm your AI Academic Assistant. I can help you with:\n\n• Creating rubrics for assignments and assessments\n• Generating feedback for student submissions\n• Lesson planning and content structuring\n• Assignment ideas and assessment design\n• Explaining complex concepts for teaching\n• Analysing student performance patterns\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!currentUser) return null

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('rubric')) {
      return `Here's a suggested rubric structure for your assessment:

ASSESSMENT RUBRIC

Criteria breakdown by grade:

HD (85-100%):
• Content Quality: Exceptional depth, original insights
• Critical Analysis: Outstanding analysis, synthesis
• Structure: Excellent organisation
• Referencing: Flawless APA 7th

D (75-84%):
• Content Quality: Strong content, well-researched
• Critical Analysis: Strong analytical skills
• Structure: Well-organised
• Referencing: Minor errors only

C (65-74%):
• Content Quality: Good coverage, adequate research
• Critical Analysis: Some analysis present
• Structure: Adequately organised
• Referencing: Some referencing errors

P (50-64%):
• Content Quality: Basic understanding shown
• Critical Analysis: Limited analysis
• Structure: Some structure issues
• Referencing: Multiple errors

F (<50%):
• Content Quality: Insufficient content
• Critical Analysis: No analysis
• Structure: Poor organisation
• Referencing: No/incorrect referencing

Would you like me to customise this rubric for a specific assignment type?`
    }

    if (lowerInput.includes('feedback') || lowerInput.includes('comment')) {
      return `Here are some constructive feedback templates:

FOR STRONG WORK:
"Your analysis of [topic] demonstrates excellent critical thinking. The way you connected [concept A] with [concept B] shows sophisticated understanding. To achieve an HD, consider expanding on [specific area]."

FOR WORK NEEDING IMPROVEMENT:
"You've made a good start on understanding [topic]. To strengthen your work, I suggest:
1. Deepening your analysis of [specific point]
2. Including more scholarly sources (aim for 10+ peer-reviewed)
3. Improving the connection between your arguments

Please come to my office hours if you'd like to discuss this further."

FOR LATE SUBMISSIONS:
"Thank you for your submission. As per the unit outline, late penalties have been applied. The quality of your work shows [positive aspect]. For future assignments, please reach out if you're experiencing difficulties."

Would you like me to tailor feedback for a specific submission?`
    }

    if (lowerInput.includes('assignment') || lowerInput.includes('assessment')) {
      return `Here are some engaging assignment ideas:

1. CASE STUDY ANALYSIS
Students analyse a real-world scenario and propose solutions using course concepts. Encourages practical application.

2. PEER REVIEW WORKSHOP
Students review and provide constructive feedback on each other's work. Develops critical evaluation skills.

3. VIDEO PRESENTATION
A 5-7 minute video explaining a complex concept to a non-technical audience. Builds communication skills.

4. INDUSTRY INTERVIEW PROJECT
Students interview a professional in the field and write a reflective report. Connects theory to practice.

5. PROBLEM-BASED LEARNING
Present an authentic problem that requires research and collaborative problem-solving.

Which type of assignment would you like me to develop further?`
    }

    if (lowerInput.includes('lesson') || lowerInput.includes('lecture') || lowerInput.includes('plan')) {
      return `Here's a suggested lecture structure:

2-HOUR LECTURE PLAN

Introduction (10 mins)
• Learning objectives
• Connection to previous content
• Engaging hook question

Core Content Block 1 (25 mins)
• Key concept presentation
• Visual aids/diagrams
• Real-world examples

Interactive Activity (15 mins)
• Think-pair-share
• Quick quiz/poll
• Group discussion

Break (10 mins)

Core Content Block 2 (25 mins)
• Advanced concepts
• Case study walkthrough
• Demonstration/tutorial

Application Exercise (15 mins)
• Hands-on practice
• Problem-solving activity

Wrap-up (10 mins)
• Key takeaways summary
• Preview of next session
• Q&A and clarifications

Would you like me to help develop specific content for any section?`
    }

    if (lowerInput.includes('struggling') || lowerInput.includes('help student') || lowerInput.includes('support')) {
      return `Here are strategies to support struggling students:

EARLY INTERVENTION
• Identify at-risk students through early assessments
• Reach out proactively after missed classes/submissions
• Offer additional consultation times

DIFFERENTIATED SUPPORT
• Provide scaffolded resources for complex topics
• Create study guides with worked examples
• Offer alternative assessment formats where appropriate

PEER SUPPORT
• Establish study groups
• Implement peer mentoring programs
• Create collaborative learning opportunities

UNIVERSITY RESOURCES
• Academic Skills Unit for study support
• Student counselling services
• Disability support services
• English language support

IN-CLASS STRATEGIES
• Use formative assessments to gauge understanding
• Provide immediate feedback opportunities
• Break complex tasks into smaller steps

Would you like specific strategies for a particular student situation?`
    }

    return `I understand you're asking about "${input.substring(0, 50)}..."

As your AI Academic Assistant, I can help you with:

• Grading & Assessment: Creating rubrics, feedback templates, grade moderation
• Teaching Resources: Lesson plans, lecture structures, activity ideas
• Student Support: Strategies for struggling students, intervention approaches
• Content Development: Explaining concepts, creating materials

Could you please provide more details about what you'd like help with? For example:
- What course is this for?
- What level are the students?
- What specific outcome are you hoping to achieve?

This will help me provide more tailored assistance.`
  }

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Chat History Sidebar */}
      <Card className={`border-0 shadow-lg transition-all ${showHistory ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Chat History
            </span>
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mb-4 gap-2">
            <MessageSquare className="h-4 w-4" />
            New Chat
          </Button>
          <div className="space-y-2">
            {sampleHistory.map((chat) => (
              <div
                key={chat.id}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
              >
                <p className="font-medium text-slate-900 text-sm truncate">{chat.title}</p>
                <p className="text-xs text-slate-500 truncate">{chat.preview}</p>
                <p className="text-xs text-slate-400 mt-1">{chat.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Card className="border-0 shadow-lg mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!showHistory && (
                  <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
                    <History className="h-5 w-5" />
                  </Button>
                )}
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">AI Academic Assistant</h1>
                  <p className="text-sm text-slate-500">Your intelligent teaching companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by AI
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Secure
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="border-0 shadow-lg flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-6">
            {/* Quick Actions (shown when chat is empty or at start) */}
            {messages.length <= 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-600 mb-3">Quick Actions</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg group-hover:scale-110 transition-transform">
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">{action.title}</span>
                      </div>
                      <p className="text-sm text-slate-500">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                        : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === 'assistant'
                          ? 'bg-slate-100 text-slate-900 rounded-tl-none'
                          : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-tr-none'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ThumbsUp className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ThumbsDown className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Trash2 className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about rubrics, feedback, lesson planning, or teaching strategies..."
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              AI responses are generated to assist with teaching tasks. Always review suggestions before use.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
