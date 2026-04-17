'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store/appStore'
import { Timer, Pause, Play, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionTimerProps {
  isActive: boolean
  showWpm?: boolean
}

export function SessionTimer({
  isActive,
  showWpm = true,
}: SessionTimerProps) {
  const { activeWritingSession } = useAppStore()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [wpm, setWpm] = useState(0)

  // Calculate elapsed time from session start
  useEffect(() => {
    if (!isActive || !activeWritingSession) {
      return
    }

    const startTime = new Date(activeWritingSession.startedAt).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedSeconds(elapsed)

      // Calculate WPM (words per minute)
      if (elapsed > 0) {
        const minutes = elapsed / 60
        const wordsTyped = activeWritingSession.wordsTyped
        setWpm(Math.round(wordsTyped / minutes))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, activeWritingSession])

  // Reset timer when session ends
  useEffect(() => {
    if (!isActive) {
      setElapsedSeconds(0)
      setWpm(0)
    }
  }, [isActive])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const isIdle = activeWritingSession?.isIdle ?? false

  return (
    <Card className={cn(
      "transition-all duration-300",
      isActive ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Timer display */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center h-10 w-10 rounded-full",
              isActive
                ? isIdle
                  ? "bg-amber-100 text-amber-600"
                  : "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
            )}>
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-2xl font-mono font-bold",
                  isActive ? "text-gray-900" : "text-gray-400"
                )}>
                  {formatTime(elapsedSeconds)}
                </span>
                {isActive && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      isIdle
                        ? "border-amber-500 text-amber-600 bg-amber-50"
                        : "border-green-500 text-green-600 bg-green-50"
                    )}
                  >
                    {isIdle ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Idle
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Active
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isActive ? 'Session in progress' : 'Session paused'}
              </p>
            </div>
          </div>

          {/* WPM display */}
          {showWpm && isActive && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-xl font-bold text-gray-900">{wpm}</span>
              </div>
              <p className="text-xs text-gray-500">words/min</p>
            </div>
          )}
        </div>

        {/* Session stats when active */}
        {isActive && activeWritingSession && (
          <div className="mt-4 pt-3 border-t border-blue-100">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-medium text-gray-900">
                  {activeWritingSession.keystrokeCount}
                </p>
                <p className="text-gray-500">Keystrokes</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {activeWritingSession.wordsTyped}
                </p>
                <p className="text-gray-500">Words Typed</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {activeWritingSession.pasteEvents}
                </p>
                <p className="text-gray-500">Paste Events</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
