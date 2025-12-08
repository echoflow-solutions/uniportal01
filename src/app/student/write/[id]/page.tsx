'use client'

export default function WritePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Writing Editor</h1>
      <p className="text-slate-600 mt-2">Assignment ID: {params.id}</p>
    </div>
  )
}
