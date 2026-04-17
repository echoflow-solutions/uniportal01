'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  FileText,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WritingProgressProps {
  // Session requirements
  minSessions: number
  minActiveTimeMinutes: number
  targetWordCount?: number

  // Current progress
  currentSessions: number
  currentActiveTimeMinutes: number
  currentWordCount: number

  // Session stats
  wordsTyped: number
  wordsPasted: number
  declaredPasteWords: number
  undeclaredPasteWords: number
}

export function WritingProgress({
  minSessions,
  minActiveTimeMinutes,
  targetWordCount = 1000,
  currentSessions,
  currentActiveTimeMinutes,
  currentWordCount,
  wordsTyped,
  wordsPasted,
  declaredPasteWords,
  undeclaredPasteWords,
}: WritingProgressProps) {
  // Calculate progress percentages
  const sessionProgress = Math.min((currentSessions / minSessions) * 100, 100)
  const timeProgress = Math.min((currentActiveTimeMinutes / minActiveTimeMinutes) * 100, 100)
  const wordProgress = Math.min((currentWordCount / targetWordCount) * 100, 100)

  // Check if requirements are met
  const sessionsComplete = currentSessions >= minSessions
  const timeComplete = currentActiveTimeMinutes >= minActiveTimeMinutes
  const wordsComplete = currentWordCount >= targetWordCount

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const ProgressItem = ({
    icon: Icon,
    label,
    current,
    target,
    progress,
    isComplete,
    format = (v: number) => v.toString()
  }: {
    icon: React.ElementType
    label: string
    current: number
    target: number
    progress: number
    isComplete: boolean
    format?: (v: number) => string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "h-4 w-4",
            isComplete ? "text-green-600" : "text-gray-500"
          )} />
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm",
            isComplete ? "text-green-600 font-medium" : "text-gray-600"
          )}>
            {format(current)} / {format(target)}
          </span>
          {isComplete && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        </div>
      </div>
      <Progress
        value={progress}
        className={cn(
          "h-2",
          isComplete && "[&>div]:bg-green-600"
        )}
      />
    </div>
  )

  // Calculate paste percentage
  const totalWords = wordsTyped + wordsPasted
  const pastePercentage = totalWords > 0 ? Math.round((wordsPasted / totalWords) * 100) : 0
  const typedPercentage = 100 - pastePercentage

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4" />
          Writing Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Session Progress */}
        <ProgressItem
          icon={Activity}
          label="Writing Sessions"
          current={currentSessions}
          target={minSessions}
          progress={sessionProgress}
          isComplete={sessionsComplete}
        />

        {/* Time Progress */}
        <ProgressItem
          icon={Clock}
          label="Active Time"
          current={currentActiveTimeMinutes}
          target={minActiveTimeMinutes}
          progress={timeProgress}
          isComplete={timeComplete}
          format={formatTime}
        />

        {/* Word Count Progress */}
        <ProgressItem
          icon={FileText}
          label="Word Count"
          current={currentWordCount}
          target={targetWordCount}
          progress={wordProgress}
          isComplete={wordsComplete}
        />

        {/* Authorship Breakdown */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Content Breakdown</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                pastePercentage > 30 ? "border-amber-500 text-amber-600" : "border-green-500 text-green-600"
              )}
            >
              {typedPercentage}% typed
            </Badge>
          </div>

          {/* Visual breakdown bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100">
            <div
              className="bg-blue-500 transition-all duration-300"
              style={{ width: `${typedPercentage}%` }}
            />
            <div
              className="bg-green-500 transition-all duration-300"
              style={{ width: `${((declaredPasteWords / totalWords) * 100) || 0}%` }}
            />
            <div
              className="bg-amber-500 transition-all duration-300"
              style={{ width: `${((undeclaredPasteWords / totalWords) * 100) || 0}%` }}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Typed ({wordsTyped})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Declared ({declaredPasteWords})</span>
            </div>
            {undeclaredPasteWords > 0 && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Undeclared ({undeclaredPasteWords})</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning if high paste percentage */}
        {pastePercentage > 30 && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-md text-xs text-amber-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              High paste percentage detected. Consider typing more of your content
              or declaring paste sources for better authorship scores.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
