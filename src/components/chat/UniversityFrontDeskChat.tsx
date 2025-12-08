'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  CreditCard,
  BookOpen,
  FileText,
  Calendar,
  Phone,
  ChevronRight,
  Loader2,
  Library,
  IdCard,
  RefreshCw,
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  query: string
  category: string
}

const quickActions: QuickAction[] = [
  { id: '1', label: 'Pay Fees', icon: CreditCard, query: 'How do I pay my fees?', category: 'Fees' },
  { id: '2', label: 'Course Registration', icon: BookOpen, query: 'How do I register for courses?', category: 'Courses' },
  { id: '3', label: 'Get Transcript', icon: FileText, query: 'How do I get my transcript?', category: 'Documents' },
  { id: '4', label: 'Library Access', icon: Library, query: 'How do I access the library?', category: 'Library' },
  { id: '5', label: 'Student ID', icon: IdCard, query: 'How do I get a student ID card?', category: 'Documents' },
  { id: '6', label: 'Change Course', icon: RefreshCw, query: 'How do I change my course or major?', category: 'Courses' },
  { id: '7', label: 'Exam Schedule', icon: Calendar, query: 'Where can I find the exam schedule?', category: 'Schedule' },
  { id: '8', label: 'Contact Support', icon: Phone, query: 'How do I contact student support?', category: 'Support' },
]

const faqResponses: Record<string, { response: string; suggestions: string[] }> = {
  'fees': {
    response: `**Payment Options for Tuition Fees:**

1. **Online Payment Portal**
   - Go to Fees & Payments in your dashboard
   - Select the outstanding balance you want to pay
   - Choose payment method (Card, Bank Transfer, Mobile Money)
   - Complete the secure checkout

2. **Bank Transfer**
   - Account Name: Asia Pacific International College
   - Bank: GCB Bank
   - Account Number: 1234567890
   - Branch: Accra Main
   - Reference: Your Student ID

3. **Mobile Money**
   - Dial *170# or use your mobile money app
   - Select "Pay Bill" > Education
   - Enter Merchant Code: APIC2024
   - Enter your Student ID as reference

4. **In-Person Payment**
   - Visit the Finance Office (Admin Block, Room 105)
   - Office Hours: Mon-Fri, 8:00 AM - 4:00 PM

**Important:** Always keep your payment receipts and allow 24-48 hours for online payments to reflect in your account.`,
    suggestions: ['View my fee balance', 'Payment deadline', 'Installment options', 'Fee receipt']
  },
  'course registration': {
    response: `**Course Registration Process:**

1. **Check Eligibility**
   - Ensure your fees are up to date (minimum 50% paid)
   - Check for any academic holds on your account

2. **Registration Period**
   - Early Registration: 2 weeks before semester starts
   - Regular Registration: First week of semester
   - Late Registration: Week 2 (with additional fee)

3. **How to Register:**
   - Navigate to "My Courses" in the sidebar
   - Click "Register for Courses"
   - Select your program and level
   - Choose courses from available options
   - Confirm your selection
   - Print your course registration slip

4. **Course Load:**
   - Minimum: 15 credit hours
   - Maximum: 21 credit hours
   - Overload requires Academic Advisor approval

**Need help?** Visit the Academic Affairs Office (Block B, Room 201) or email academics@apic.edu.gh`,
    suggestions: ['View available courses', 'Check prerequisites', 'Contact academic advisor', 'Registration deadline']
  },
  'transcript': {
    response: `**How to Request Your Academic Transcript:**

1. **Online Request (Recommended)**
   - Go to Student Services in your portal
   - Select "Request Documents"
   - Choose "Academic Transcript"
   - Select type (Official/Unofficial)
   - Pay processing fee (if applicable)
   - Track your request status

2. **Processing Time:**
   - Unofficial Transcript: 1-2 business days
   - Official Transcript: 3-5 business days
   - Express Service: Same day (+GHS 50)

3. **Fees:**
   - Unofficial Transcript: Free (first 2 copies)
   - Official Transcript: GHS 30 per copy
   - International Courier: GHS 150 additional

4. **Collection:**
   - Pick up from Records Office (Admin Block, Room 102)
   - Or request delivery to your registered address

**Required Documents:** Valid Student ID or Receipt of Request`,
    suggestions: ['Track my request', 'Transcript fees', 'Records office hours', 'Verify my transcript']
  },
  'library': {
    response: `**Library Access & Services:**

1. **Library Hours:**
   - Monday - Friday: 8:00 AM - 10:00 PM
   - Saturday: 9:00 AM - 6:00 PM
   - Sunday: 12:00 PM - 6:00 PM
   - 24/7 during exam periods

2. **Access Requirements:**
   - Valid Student ID card
   - Active student status

3. **Services Available:**
   - Book borrowing (up to 5 books for 14 days)
   - E-Library access (journals, e-books)
   - Study rooms (bookable online)
   - Printing & scanning services
   - Research assistance

4. **Online Resources:**
   - Access e-Library: library.apic.edu.gh
   - Login with your student credentials
   - Access 50,000+ e-books and journals

5. **Fines:**
   - Overdue books: GHS 2 per day
   - Lost books: Replacement cost + GHS 50

**Location:** Main Campus Library Building, 1st & 2nd Floor`,
    suggestions: ['E-library login', 'Book a study room', 'Renew my books', 'Research databases']
  },
  'student id': {
    response: `**Student ID Card Information:**

1. **New Students:**
   - ID cards are issued during orientation week
   - Bring your admission letter and passport photo
   - Processing: Same day at Registration Center

2. **Replacement Card:**
   - Report loss to Security Office immediately
   - Fill out ID Replacement Form online
   - Pay replacement fee: GHS 50
   - Processing time: 3-5 business days

3. **Card Uses:**
   - Campus access and identification
   - Library services
   - Exam hall entry
   - Student discounts
   - Meal plan (if applicable)

4. **Photo Requirements:**
   - Recent passport-sized photo
   - White background
   - No glasses or headwear
   - Professional attire

**Collection Point:** Student Affairs Office (Admin Block, Ground Floor)`,
    suggestions: ['Replace lost ID', 'Update ID photo', 'ID card fees', 'Student Affairs contact']
  },
  'change course': {
    response: `**Course/Major Change Process:**

1. **Eligibility:**
   - Must be within first 2 semesters
   - Minimum GPA: 2.0
   - No outstanding fees

2. **Required Steps:**
   - Download "Change of Program Form" from portal
   - Get approval from current department
   - Get approval from new department
   - Submit to Academic Affairs with:
     - Completed form
     - Statement of reason
     - Updated admission documents (if required)

3. **Timeline:**
   - Application Period: First 2 weeks of semester
   - Processing: 5-7 business days
   - Fee: GHS 100 (administrative)

4. **Important Notes:**
   - Some credits may not transfer
   - May affect graduation timeline
   - Financial aid may be affected

**Consult your Academic Advisor first!** Book an appointment through the portal.`,
    suggestions: ['Book advisor meeting', 'Download change form', 'Credit transfer policy', 'Program requirements']
  },
  'exam schedule': {
    response: `**Examination Schedule Information:**

1. **Where to Find:**
   - Go to "Schedule" in your sidebar
   - Select "Exam Timetable" tab
   - Or check the Academic Calendar

2. **Exam Periods:**
   - Mid-Semester: Week 7-8
   - Final Exams: Week 15-16
   - Supplementary: 4 weeks after results

3. **Exam Day Requirements:**
   - Valid Student ID (mandatory)
   - Exam docket (download from portal)
   - Approved calculator (if applicable)
   - Blue or black pen only

4. **Exam Venues:**
   - Check your personal timetable
   - Arrive 30 minutes early
   - Seat numbers posted at venue

5. **Conflicts & Clashes:**
   - Report to Exams Office within 48 hours
   - Fill out "Exam Clash Form"
   - Alternative arrangements will be made

**Exams Office:** Block A, Room 301 | exams@apic.edu.gh`,
    suggestions: ['Download exam docket', 'View my exam dates', 'Exam rules', 'Past exam papers']
  },
  'contact support': {
    response: `**Student Support Contact Information:**

**1. General Inquiries**
   - 📧 info@apic.edu.gh
   - 📞 +233 30 123 4567
   - 🕐 Mon-Fri: 8:00 AM - 5:00 PM

**2. Academic Support**
   - Academic Affairs: academics@apic.edu.gh
   - Course Registration: registrar@apic.edu.gh
   - Exams Office: exams@apic.edu.gh

**3. Financial Services**
   - Fees & Payments: finance@apic.edu.gh
   - Scholarships: scholarships@apic.edu.gh

**4. Student Welfare**
   - Counseling: counseling@apic.edu.gh
   - Health Services: clinic@apic.edu.gh
   - Accommodation: housing@apic.edu.gh

**5. IT Support**
   - Portal Issues: itsupport@apic.edu.gh
   - Password Reset: helpdesk@apic.edu.gh

**Walk-In Support:**
   📍 Student Services Center, Ground Floor, Admin Block
   🕐 Mon-Fri: 8:00 AM - 4:00 PM

**Emergency:** Security Office - +233 30 123 4599 (24/7)`,
    suggestions: ['IT helpdesk', 'Academic advisor', 'Financial aid office', 'Health services']
  },
  'default': {
    response: `I'm here to help you with general university inquiries! Here are some things I can assist you with:

**Common Topics:**
- 💳 **Fees & Payments** - Payment methods, deadlines, installments
- 📚 **Course Registration** - How to register, add/drop courses
- 📄 **Documents** - Transcripts, certificates, letters
- 📖 **Library** - Access, borrowing, e-resources
- 🎓 **Academic Services** - Advising, course changes, graduation
- 📅 **Schedule** - Exams, academic calendar, events

**Quick Actions:**
Click on any of the buttons above for instant answers, or type your question below.

**Can't find what you need?**
Visit the Student Services Center or email support@apic.edu.gh

How can I help you today?`,
    suggestions: ['Pay my fees', 'Get transcript', 'Library hours', 'Contact support']
  }
}

function getResponse(query: string): { response: string; suggestions: string[] } {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('fee') || lowerQuery.includes('pay') || lowerQuery.includes('payment') || lowerQuery.includes('tuition')) {
    return faqResponses['fees']
  }
  if (lowerQuery.includes('register') || lowerQuery.includes('enroll') || lowerQuery.includes('course registration')) {
    return faqResponses['course registration']
  }
  if (lowerQuery.includes('transcript') || lowerQuery.includes('academic record') || lowerQuery.includes('grades record')) {
    return faqResponses['transcript']
  }
  if (lowerQuery.includes('library') || lowerQuery.includes('book') || lowerQuery.includes('borrow') || lowerQuery.includes('e-library')) {
    return faqResponses['library']
  }
  if (lowerQuery.includes('student id') || lowerQuery.includes('id card') || lowerQuery.includes('identification')) {
    return faqResponses['student id']
  }
  if (lowerQuery.includes('change course') || lowerQuery.includes('change major') || lowerQuery.includes('switch program') || lowerQuery.includes('transfer')) {
    return faqResponses['change course']
  }
  if (lowerQuery.includes('exam') || lowerQuery.includes('test') || lowerQuery.includes('examination')) {
    return faqResponses['exam schedule']
  }
  if (lowerQuery.includes('contact') || lowerQuery.includes('support') || lowerQuery.includes('help desk') || lowerQuery.includes('phone') || lowerQuery.includes('email')) {
    return faqResponses['contact support']
  }

  return faqResponses['default']
}

interface UniversityFrontDeskChatProps {
  isOpen: boolean
  onClose: () => void
}

export function UniversityFrontDeskChat({ isOpen, onClose }: UniversityFrontDeskChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `👋 **Welcome to APIC AI Chatbot!**

I'm your intelligent AI Chatbot assistant, powered by artificial intelligence to help you with general university inquiries. Whether you need help with fees, course registration, documents, or finding your way around campus - this AI Chatbot has got you covered!

**Choose a quick action below or type your question to the AI Chatbot.**`,
      timestamp: new Date(),
      suggestions: ['Pay my fees', 'Get transcript', 'Library access', 'Contact support']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (query: string) => {
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const { response, suggestions } = getResponse(query)

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    }

    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[85vh] max-h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">APIC AI Chatbot</h2>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online - Ready to help</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 4).map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
              )}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-800'
              )}>
                <div
                  className={cn(
                    'text-sm leading-relaxed prose prose-sm max-w-none',
                    message.type === 'user' ? 'prose-invert' : ''
                  )}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />')
                  }}
                />
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white/90 text-blue-700 rounded-lg text-xs font-medium hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* More Quick Actions */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickActions.slice(4).map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(inputValue)
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-slate-50 border-slate-200 focus:bg-white"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-slate-400 mt-2 text-center">
            <Sparkles className="h-3 w-3 inline mr-1" />
            AI Chatbot | For complex issues, visit Student Services
          </p>
        </div>
      </div>
    </div>
  )
}
