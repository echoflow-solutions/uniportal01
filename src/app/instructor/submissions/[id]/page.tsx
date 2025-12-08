'use client'

export default function SubmissionReviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Submission Review</h1>
      <p className="text-slate-600 mt-2">Submission ID: {params.id}</p>
    </div>
  )
}
