'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, ClipboardPaste, ExternalLink, CheckCircle2 } from 'lucide-react'

interface DeclaredPasteModalProps {
  isOpen: boolean
  onClose: () => void
  onDeclare: (source: string) => void
  onSkip: () => void
  pastedText: string
  wordCount: number
}

export function DeclaredPasteModal({
  isOpen,
  onClose,
  onDeclare,
  onSkip,
  pastedText,
  wordCount,
}: DeclaredPasteModalProps) {
  const [source, setSource] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const handleDeclare = () => {
    onDeclare(source)
    setSource('')
    onClose()
  }

  const handleSkip = () => {
    onSkip()
    setSource('')
    onClose()
  }

  const truncatedText = pastedText.length > 200
    ? pastedText.substring(0, 200) + '...'
    : pastedText

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardPaste className="h-5 w-5 text-blue-600" />
            Paste Detected
          </DialogTitle>
          <DialogDescription>
            We detected that you pasted {wordCount} word{wordCount !== 1 ? 's' : ''} into your assignment.
            Declaring sources helps maintain academic integrity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preview of pasted content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Pasted Content</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-7 text-xs"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
            {showPreview && (
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 max-h-32 overflow-y-auto">
                {truncatedText}
              </div>
            )}
          </div>

          {/* Source input */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Source (Optional)
            </Label>
            <Input
              id="source"
              placeholder="e.g., Wikipedia, textbook page 42, lecture notes..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Where did this content come from? This helps track proper citations.
            </p>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Why declare pastes?</p>
              <p className="text-blue-600 mt-1">
                Declared pastes with sources are treated as proper citations.
                This demonstrates good academic practice and won&apos;t negatively
                impact your authorship score.
              </p>
            </div>
          </div>

          {/* Warning for skipping */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Skipping declaration</p>
              <p className="text-amber-600 mt-1">
                Undeclared pastes are tracked separately and may be flagged
                during the integrity review process.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Skip Declaration
          </Button>
          <Button
            type="button"
            onClick={handleDeclare}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Declare as Citation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
