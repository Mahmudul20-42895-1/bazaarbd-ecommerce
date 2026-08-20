import { Star } from "lucide-react"

interface ReviewCardProps {
  reviewerName: string
  rating: number
  date: string
  text: string
}

export function ReviewCard({ reviewerName, rating, date, text }: ReviewCardProps) {
  return (
    <div className="rounded-xl bg-bg-card p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-slate-100">{reviewerName}</div>
        <div className="text-sm text-gray-400">{date}</div>
      </div>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-emerald-500 text-emerald-500" : "fill-transparent text-gray-500"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
