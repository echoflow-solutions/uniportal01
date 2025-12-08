'use client'

export default function CoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="text-slate-600 mt-2">Course ID: {params.id}</p>
    </div>
  )
}
