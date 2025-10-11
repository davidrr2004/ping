"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    title: "Simple & Flat",
    desc: "Clean layouts with centered alignment and even spacing for calm, futuristic vibes.",
  },
  {
    title: "Soft Curves",
    desc: "Rounded rectangles and smooth corners provide comfort and approachability.",
  },
  {
    title: "Contrast & Clarity",
    desc: "Orange sections and white cards create clear hierarchy with subtle elevation.",
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((f) => (
        <Card key={f.title} className="rounded-xl border border-border shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-balance text-lg font-bold tracking-tight">{f.title}</CardTitle>
            <CardDescription className="text-pretty">{f.desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-28 rounded-lg bg-muted/40" aria-hidden="true" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
