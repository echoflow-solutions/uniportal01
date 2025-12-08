'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { AuthorshipAnalytics } from '@/types'

interface AuthorshipReportProps {
  analytics: AuthorshipAnalytics
}

export function AuthorshipReport({ analytics }: AuthorshipReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorship Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Total Sessions</p>
            <p className="text-2xl font-bold">{analytics.totalSessions}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Active Time</p>
            <p className="text-2xl font-bold">{Math.round(analytics.totalActiveTime / 60)} min</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Words Typed</p>
            <p className="text-2xl font-bold">{analytics.wordsTyped}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Paste %</p>
            <p className="text-2xl font-bold">{analytics.pastePercentage.toFixed(1)}%</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-2">Typing vs Pasting</p>
          <Progress value={100 - analytics.pastePercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  )
}
