"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SignUpForm() {
  return (
    <Card className="rounded-2xl border border-border shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-balance font-bold tracking-tight">Request Access</CardTitle>
        <CardDescription className="text-pretty">
          White content card with consistent spacing, readable typography, and soft elevation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="mx-auto grid max-w-md gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jane@example.com" className="rounded-xl" />
          </div>
          <Button
            type="submit"
            className="mt-2 rounded-xl bg-primary text-primary-foreground px-6 py-6 font-semibold shadow-sm hover:shadow-md"
          >
            Join waitlist
          </Button>
          <p className="sr-only">Form is non-functional in this demo.</p>
        </form>
      </CardContent>
    </Card>
  )
}
