import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <h1 className="text-xl font-bold">StudyAI Platform</h1>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Supercharge Your Learning</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                AI-powered study tools to help you prepare for exams, identify weak areas, and improve your
                understanding.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="mb-8 text-2xl font-bold text-center">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-2 text-xl font-bold">Smart Summarizer</h3>
                <p className="text-gray-500">Generate concise summaries of PDFs and identify important exam topics.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-2 text-xl font-bold">Adaptive Tests</h3>
                <p className="text-gray-500">Take MCQ and subjective tests that adapt to your knowledge gaps.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="mb-2 text-xl font-bold">AI Study Assistant</h3>
                <p className="text-gray-500">Get help from our multilingual AI chatbot for any study questions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container px-4 mx-auto">
          <p className="text-sm text-center text-gray-500">© 2025 StudyAI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
