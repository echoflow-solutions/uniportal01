'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { IntegrityReport as IntegrityReportType } from '@/types'

interface IntegrityReportProps {
  report: IntegrityReportType
}

export function IntegrityReport({ report }: IntegrityReportProps) {
  const getRiskIcon = () => {
    switch (report.riskLevel) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getRiskColor = () => {
    switch (report.riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-amber-100 text-amber-800'
      case 'high':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Integrity Report</CardTitle>
          <Badge className={getRiskColor()}>
            {getRiskIcon()}
            <span className="ml-1 capitalize">{report.riskLevel} Risk</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Authorship Score</span>
              <span>{report.authorshipScore}%</span>
            </div>
            <Progress value={report.authorshipScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Comprehension Score</span>
              <span>{report.comprehensionScore}%</span>
            </div>
            <Progress value={report.comprehensionScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Style Consistency</span>
              <span>{report.styleConsistencyScore}%</span>
            </div>
            <Progress value={report.styleConsistencyScore} className="h-2" />
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Combined Score</span>
              <span className="font-medium">{report.combinedScore}%</span>
            </div>
            <Progress value={report.combinedScore} className="h-3" />
          </div>
        </div>

        {report.flags.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Flags Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2">
                {report.flags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Recommendation</p>
          <p className="text-sm text-slate-600 mt-1">{report.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}
