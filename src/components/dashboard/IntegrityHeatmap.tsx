'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface HeatmapData {
  studentId: string
  studentName: string
  score: number
}

interface IntegrityHeatmapProps {
  data: HeatmapData[]
  title?: string
}

export function IntegrityHeatmap({ data, title = 'Class Integrity Overview' }: IntegrityHeatmapProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-green-400'
    if (score >= 40) return 'bg-amber-400'
    if (score >= 20) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    if (score >= 20) return 'Concerning'
    return 'Critical'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {data.map((item) => (
            <div
              key={item.studentId}
              className={cn(
                'aspect-square rounded-md flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-transform hover:scale-110',
                getScoreColor(item.score)
              )}
              title={`${item.studentName}: ${item.score}% (${getScoreLabel(item.score)})`}
            >
              {item.score}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>Excellent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-400" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span>Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span>Concerning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
