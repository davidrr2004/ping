"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <header className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent-foreground/10 px-3 py-1 text-xs font-medium text-accent-foreground/90">
            Human-centered • Minimal • Calm
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight md:text-5xl">Ping</h1>
          <p className="mt-4 text-pretty text-base font-medium opacity-90 md:text-lg">
            A simple, accessible interface for clear, silent communication— designed with soft curves, ample whitespace,
            and thoughtful contrast.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              className="rounded-xl bg-primary text-primary-foreground px-6 py-6 text-sm font-semibold shadow-sm hover:shadow-md"
              size="lg"
            >
              Get started
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-primary/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10 px-6 py-6 text-sm font-semibold"
              size="lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
