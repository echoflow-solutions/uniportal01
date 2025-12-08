'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  BookOpen,
  ExternalLink,
  Clock,
  BookMarked,
  Star,
  GraduationCap,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bookmark,
  Eye,
  Library,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react'

// Mock data for books by course - Australian system (Trimester 3, 2025 - 3 units enrolled)
const courseBooks = [
  {
    course: 'ICT6001 - Applied Project',
    courseCode: 'ICT6001',
    books: [
      {
        id: '1',
        title: 'Project Management for Information Systems',
        author: 'James Cadle, Donald Yeates',
        edition: '6th Edition',
        isbn: '978-0273746522',
        available: 3,
        total: 5,
        coverColor: 'from-blue-500 to-indigo-600',
        rating: 4.8,
        reviews: 124,
        pages: 456,
        publisher: 'Pearson Education',
        year: 2023,
        borrowed: false,
      },
      {
        id: '2',
        title: 'Software Engineering: A Practitioner\'s Approach',
        author: 'Roger S. Pressman',
        edition: '9th Edition',
        isbn: '978-1259872976',
        available: 2,
        total: 4,
        coverColor: 'from-emerald-500 to-teal-600',
        rating: 4.9,
        reviews: 256,
        pages: 892,
        publisher: 'McGraw-Hill',
        year: 2021,
        borrowed: false,
      },
    ],
  },
  {
    course: 'ICT6002 - Research Methods',
    courseCode: 'ICT6002',
    books: [
      {
        id: '3',
        title: 'Research Methods for Business Students',
        author: 'Mark Saunders, Philip Lewis',
        edition: '8th Edition',
        isbn: '978-1292208787',
        available: 0,
        total: 3,
        coverColor: 'from-purple-500 to-pink-600',
        rating: 4.7,
        reviews: 89,
        pages: 768,
        publisher: 'Pearson',
        year: 2022,
        borrowed: false,
      },
      {
        id: '4',
        title: 'Research Design: Qualitative, Quantitative, and Mixed Methods',
        author: 'John W. Creswell',
        edition: '5th Edition',
        isbn: '978-1506386706',
        available: 4,
        total: 5,
        coverColor: 'from-emerald-500 to-teal-600',
        rating: 4.8,
        reviews: 312,
        pages: 488,
        publisher: 'SAGE Publications',
        year: 2023,
        borrowed: false,
      },
    ],
  },
  {
    course: 'ICT6003 - Advanced Database Systems',
    courseCode: 'ICT6003',
    books: [
      {
        id: '5',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz, Henry F. Korth',
        edition: '7th Edition',
        isbn: '978-0078022159',
        available: 4,
        total: 6,
        coverColor: 'from-orange-500 to-red-600',
        rating: 4.6,
        reviews: 312,
        pages: 1376,
        publisher: 'McGraw-Hill',
        year: 2020,
        borrowed: false,
      },
      {
        id: '6',
        title: 'SQL Performance Explained',
        author: 'Markus Winand',
        edition: '1st Edition',
        isbn: '978-3950307820',
        available: 5,
        total: 5,
        coverColor: 'from-cyan-500 to-blue-600',
        rating: 4.9,
        reviews: 178,
        pages: 204,
        publisher: 'Self-published',
        year: 2022,
        borrowed: false,
      },
    ],
  },
]

// Mock Google Scholar articles
const scholarArticles = [
  {
    id: 'a1',
    title: 'Machine Learning Approaches for Academic Performance Prediction',
    authors: 'Smith, J., Johnson, M., Williams, K.',
    journal: 'Journal of Educational Computing Research',
    year: 2024,
    citations: 156,
    url: 'https://scholar.google.com',
    abstract: 'This paper explores various machine learning techniques for predicting student academic performance...',
    relevantCourse: 'ICT6001',
  },
  {
    id: 'a2',
    title: 'Modern Database Design Patterns for Scalable Applications',
    authors: 'Chen, L., Kumar, R., Patel, S.',
    journal: 'ACM Computing Surveys',
    year: 2024,
    citations: 89,
    url: 'https://scholar.google.com',
    abstract: 'A comprehensive review of database design patterns suitable for modern scalable applications...',
    relevantCourse: 'ICT6003',
  },
  {
    id: 'a3',
    title: 'Qualitative Research Methods in Information Systems',
    authors: 'Anderson, T., Lee, S.',
    journal: 'MIS Quarterly',
    year: 2023,
    citations: 234,
    url: 'https://scholar.google.com',
    abstract: 'This study presents best practices for conducting qualitative research in information systems...',
    relevantCourse: 'ICT6002',
  },
  {
    id: 'a4',
    title: 'Agile Project Management in Software Development',
    authors: 'Brown, D., Taylor, E., Wilson, A.',
    journal: 'Project Management Journal',
    year: 2024,
    citations: 178,
    url: 'https://scholar.google.com',
    abstract: 'An empirical study on the effectiveness of agile methodologies in software project management...',
    relevantCourse: 'ICT6001',
  },
  {
    id: 'a5',
    title: 'NoSQL vs SQL: Performance Comparison Study',
    authors: 'Garcia, M., Lopez, R.',
    journal: 'Data Science Journal',
    year: 2023,
    citations: 312,
    url: 'https://scholar.google.com',
    abstract: 'A comprehensive performance comparison between NoSQL and SQL databases under various workloads...',
    relevantCourse: 'ICT6003',
  },
]

// Mock borrowed books
const initialBorrowedBooks = [
  {
    id: 'b1',
    bookId: '1',
    title: 'Project Management for Information Systems',
    author: 'James Cadle, Donald Yeates',
    borrowDate: '2024-12-01',
    dueDate: '2024-12-15',
    coverColor: 'from-blue-500 to-indigo-600',
  },
]

// Academic references - Australian system
const academicReferences = [
  {
    id: 'r1',
    title: 'IEEE Citation Guidelines',
    type: 'Style Guide',
    description: 'Official IEEE citation and referencing guidelines for academic papers',
    url: 'https://ieee.org',
    icon: FileText,
  },
  {
    id: 'r2',
    title: 'APA 7th Edition Manual',
    type: 'Style Guide',
    description: 'American Psychological Association formatting and citation rules',
    url: 'https://apastyle.apa.org',
    icon: BookMarked,
  },
  {
    id: 'r3',
    title: 'Academic Writing Hub',
    type: 'Writing Resource',
    description: 'Tips and guides for academic writing, thesis structure, and research methodology',
    url: 'https://academic.writing',
    icon: GraduationCap,
  },
  {
    id: 'r4',
    title: 'Research Ethics Guidelines',
    type: 'Ethics',
    description: 'APIC research ethics and integrity guidelines for student projects',
    url: 'https://apic.edu.au/ethics',
    icon: Award,
  },
]

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scholarSearch, setScholarSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [borrowedBooks, setBorrowedBooks] = useState(initialBorrowedBooks)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<typeof courseBooks[0]['books'][0] | null>(null)
  const [borrowSuccess, setBorrowSuccess] = useState(false)

  const allBooks = courseBooks.flatMap((c) => c.books)
  const filteredBooks = selectedCourse
    ? courseBooks.find((c) => c.courseCode === selectedCourse)?.books || []
    : allBooks

  const searchedBooks = filteredBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredArticles = scholarArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(scholarSearch.toLowerCase()) ||
      article.authors.toLowerCase().includes(scholarSearch.toLowerCase()) ||
      article.journal.toLowerCase().includes(scholarSearch.toLowerCase())
  )

  const handleBorrow = (book: typeof courseBooks[0]['books'][0]) => {
    setSelectedBook(book)
    setShowBorrowModal(true)
    setBorrowSuccess(false)
  }

  const confirmBorrow = () => {
    if (!selectedBook) return

    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 14) // 14 days borrowing period

    const newBorrow = {
      id: `b${Date.now()}`,
      bookId: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      coverColor: selectedBook.coverColor,
    }

    setBorrowedBooks([...borrowedBooks, newBorrow])
    setBorrowSuccess(true)
  }

  const handleReturn = (borrowId: string) => {
    setBorrowedBooks(borrowedBooks.filter((b) => b.id !== borrowId))
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Virtual Library</h1>
          <p className="text-lg text-slate-600 mt-1">Access course materials, e-books, and academic resources</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <BookOpen className="h-3 w-3 mr-1" />
            {allBooks.length} Books Available
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BookMarked className="h-3 w-3 mr-1" />
            {borrowedBooks.length} Borrowed
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-base">Total Books</p>
                <p className="text-4xl font-bold mt-1">{allBooks.length}</p>
              </div>
              <Library className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-base">Available Now</p>
                <p className="text-4xl font-bold mt-1">{allBooks.filter((b) => b.available > 0).length}</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-base">Scholar Articles</p>
                <p className="text-4xl font-bold mt-1">{scholarArticles.length}</p>
              </div>
              <FileText className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-base">Your Units</p>
                <p className="text-4xl font-bold mt-1">{courseBooks.length}</p>
              </div>
              <GraduationCap className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="books" className="space-y-6">
        <TabsList className="bg-slate-100 p-1.5 h-auto">
          <TabsTrigger value="books" className="data-[state=active]:bg-white py-3 px-5 text-base">
            <BookOpen className="h-5 w-5 mr-2" />
            Course Books
          </TabsTrigger>
          <TabsTrigger value="scholar" className="data-[state=active]:bg-white py-3 px-5 text-base">
            <Globe className="h-5 w-5 mr-2" />
            Google Scholar
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="data-[state=active]:bg-white py-3 px-5 text-base">
            <BookMarked className="h-5 w-5 mr-2" />
            My Borrowed
          </TabsTrigger>
          <TabsTrigger value="references" className="data-[state=active]:bg-white py-3 px-5 text-base">
            <FileText className="h-5 w-5 mr-2" />
            References
          </TabsTrigger>
        </TabsList>

        {/* Course Books Tab */}
        <TabsContent value="books" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant={selectedCourse === null ? 'default' : 'outline'}
                onClick={() => setSelectedCourse(null)}
                className="h-12 px-6"
              >
                All Units
              </Button>
              {courseBooks.map((c) => (
                <Button
                  key={c.courseCode}
                  variant={selectedCourse === c.courseCode ? 'default' : 'outline'}
                  onClick={() => setSelectedCourse(c.courseCode)}
                  className="h-12 px-6"
                >
                  {c.courseCode}
                </Button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-3 bg-gradient-to-r ${book.coverColor}`} />
                <CardContent className="p-6">
                  <div className="flex gap-5">
                    {/* Book Cover Placeholder */}
                    <div className={`w-24 h-32 rounded-lg bg-gradient-to-br ${book.coverColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <BookOpen className="h-10 w-10 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-base leading-tight line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-slate-500 mt-2">{book.author}</p>
                      <p className="text-sm text-slate-400 mt-1">{book.edition}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{book.rating}</span>
                        <span className="text-sm text-slate-400">({book.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-500">Availability</span>
                      <span className={`text-sm font-medium ${book.available > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {book.available}/{book.total} copies
                      </span>
                    </div>
                    <Progress value={(book.available / book.total) * 100} className="h-2 mb-4" />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 h-11"
                        disabled={book.available === 0 || borrowedBooks.some((b) => b.bookId === book.id)}
                        onClick={() => handleBorrow(book)}
                      >
                        {borrowedBooks.some((b) => b.bookId === book.id) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Borrowed
                          </>
                        ) : book.available === 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Unavailable
                          </>
                        ) : (
                          <>
                            <BookMarked className="h-4 w-4 mr-2" />
                            Borrow
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="h-11 w-11 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Google Scholar Tab */}
        <TabsContent value="scholar" className="space-y-8">
          {/* Google Scholar Search */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-slate-900">Google Scholar Search</h3>
                  <p className="text-base text-slate-600">Find academic papers, articles, and citations</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search for academic papers, journals, articles..."
                    value={scholarSearch}
                    onChange={(e) => setScholarSearch(e.target.value)}
                    className="pl-12 bg-white h-12 text-base"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                  <Search className="h-5 w-5 mr-2" />
                  Search Scholar
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-sm text-slate-500">Popular:</span>
                {['Machine Learning', 'Database Design', 'React Architecture', 'Agile Methods'].map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-white py-1.5 px-3 text-sm"
                    onClick={() => setScholarSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Articles */}
          <div>
            <h3 className="font-semibold text-xl text-slate-900 mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Recommended for Your Units
            </h3>
            <div className="space-y-5">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-sm py-1 px-3">
                            {article.relevantCourse}
                          </Badge>
                          <Badge variant="outline" className="text-sm py-1 px-3 bg-emerald-50 text-emerald-700 border-emerald-200">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {article.citations} citations
                          </Badge>
                        </div>
                        <h4 className="font-medium text-lg text-slate-900 hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h4>
                        <p className="text-base text-slate-600 mt-2">{article.authors}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {article.journal} - {article.year}
                        </p>
                        <p className="text-base text-slate-500 mt-3 line-clamp-2">{article.abstract}</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="h-10" asChild>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </Button>
                        <Button variant="ghost" className="h-10">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* My Borrowed Books Tab */}
        <TabsContent value="borrowed" className="space-y-6">
          {borrowedBooks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-16 text-center">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                <h3 className="font-medium text-xl text-slate-900 mb-2">No Borrowed Books</h3>
                <p className="text-base text-slate-500 mb-6">
                  You haven&apos;t borrowed any books yet. Browse the library to find materials for your units.
                </p>
                <Button variant="outline" className="h-11 px-6">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Browse Library
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl text-slate-900">Your Borrowed Books ({borrowedBooks.length})</h3>
                <Badge variant="outline" className="py-1.5 px-4 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  14-day loan period
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {borrowedBooks.map((book) => {
                  const daysRemaining = getDaysRemaining(book.dueDate)
                  const isOverdue = daysRemaining < 0
                  const isAlmostDue = daysRemaining <= 3 && daysRemaining >= 0

                  return (
                    <Card key={book.id} className={`overflow-hidden ${isOverdue ? 'border-red-200 bg-red-50/50' : isAlmostDue ? 'border-yellow-200 bg-yellow-50/50' : ''}`}>
                      <div className={`h-2 bg-gradient-to-r ${book.coverColor}`} />
                      <CardContent className="p-6">
                        <div className="flex gap-5">
                          <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${book.coverColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <BookOpen className="h-8 w-8 text-white/80" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-base line-clamp-2">{book.title}</h4>
                            <p className="text-sm text-slate-500 mt-2">{book.author}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm">
                              <div className="flex items-center gap-2 text-slate-500">
                                <Calendar className="h-4 w-4" />
                                Borrowed: {book.borrowDate}
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 mt-2 text-sm ${isOverdue ? 'text-red-600' : isAlmostDue ? 'text-yellow-600' : 'text-slate-500'}`}>
                              <Clock className="h-4 w-4" />
                              {isOverdue ? (
                                <span className="font-medium">Overdue by {Math.abs(daysRemaining)} days!</span>
                              ) : (
                                <span>Due: {book.dueDate} ({daysRemaining} days left)</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <Button
                            variant={isOverdue ? 'destructive' : 'default'}
                            className="flex-1 h-11"
                            onClick={() => handleReturn(book.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Return Book
                          </Button>
                          <Button variant="outline" className="h-11 px-4">
                            <Clock className="h-4 w-4 mr-2" />
                            Renew
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Academic References Tab */}
        <TabsContent value="references" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicReferences.map((ref) => (
              <Card key={ref.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-slate-100 rounded-xl">
                      <ref.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg text-slate-900">{ref.title}</h4>
                        <Badge variant="outline" className="text-sm py-1 px-3">{ref.type}</Badge>
                      </div>
                      <p className="text-base text-slate-600">{ref.description}</p>
                      <Button variant="link" className="px-0 mt-3 text-base" asChild>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer">
                          Access Resource
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Reference Guides */}
          <Card className="mt-8">
            <CardContent className="p-8">
              <h3 className="font-semibold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Quick Reference Guides
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'How to Cite', icon: FileText, color: 'blue' },
                  { label: 'Research Tips', icon: Search, color: 'emerald' },
                  { label: 'Writing Guide', icon: BookOpen, color: 'purple' },
                  { label: 'Plagiarism Check', icon: Award, color: 'orange' },
                ].map((guide) => (
                  <div
                    key={guide.label}
                    className={`p-6 rounded-xl bg-${guide.color}-50 border border-${guide.color}-100 text-center cursor-pointer hover:shadow-md transition-all`}
                  >
                    <guide.icon className={`h-8 w-8 text-${guide.color}-600 mx-auto mb-3`} />
                    <p className="text-base font-medium text-slate-700">{guide.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Borrow Modal */}
      {showBorrowModal && selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md animate-in zoom-in-95">
            <CardContent className="p-6">
              {!borrowSuccess ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-22 rounded-lg bg-gradient-to-br ${selectedBook.coverColor} flex items-center justify-center shadow-lg`}>
                      <BookOpen className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{selectedBook.title}</h3>
                      <p className="text-sm text-slate-500">{selectedBook.author}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Borrowing Terms
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>- Loan period: <strong>14 days</strong></li>
                      <li>- Renewable: Up to 2 times</li>
                      <li>- Late fee: $2 AUD per day</li>
                      <li>- Return location: Main Library</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowBorrowModal(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={confirmBorrow}>
                      <BookMarked className="h-4 w-4 mr-2" />
                      Confirm Borrow
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Book Borrowed Successfully!</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Please return by <strong>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-500">Collection Point</p>
                    <p className="font-medium text-slate-900">Main Library - Ground Floor</p>
                    <p className="text-xs text-slate-500">Show your Student ID to collect</p>
                  </div>
                  <Button className="w-full" onClick={() => setShowBorrowModal(false)}>
                    Done
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
