'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { VerificationQuestion } from '@/types'

interface TeachingTestProps {
  questions: VerificationQuestion[]
  onSubmit: (responses: Record<string, string>) => void
}

export function TeachingTest({ questions, onSubmit }: TeachingTestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentQuestion = questions[currentIndex]

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onSubmit(responses)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Verification Test</CardTitle>
          <Badge variant="outline">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge className="mb-2">{currentQuestion?.type}</Badge>
          <p className="text-lg font-medium">{currentQuestion?.question}</p>
        </div>
        <Textarea
          placeholder="Type your response..."
          value={responses[currentQuestion?.id] || ''}
          onChange={(e) =>
            setResponses({ ...responses, [currentQuestion?.id]: e.target.value })
          }
          className="min-h-[150px]"
        />
        <Button onClick={handleNext} className="w-full">
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Submit Test'}
        </Button>
      </CardContent>
    </Card>
  )
}
