import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { SignUpForm } from "@/components/signup-form"

export default function Page() {
  return (
    <main>
      <Hero />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FeatureCards />
        </div>
      </section>
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-2xl px-6">
          <SignUpForm />
        </div>
      </section>
      <footer className="py-10">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
          <p className="text-pretty">Built with accessibility and calm simplicity.</p>
        </div>
      </footer>
    </main>
  )
}
