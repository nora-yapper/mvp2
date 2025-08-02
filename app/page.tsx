import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Build Your Startup
              <span className="text-blue-600 dark:text-blue-400"> Systematically</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              From idea validation to market launch. Get structured guidance, actionable insights, and proven frameworks
              to turn your startup vision into reality.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/main">
                <Button size="lg" className="px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/health-check">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Health Check
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Comprehensive tools and frameworks designed specifically for early-stage startups
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Target className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" />
                  Research & Validation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Validate your ideas with structured research methodologies and customer discovery frameworks.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <Zap className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" />
                  Product Development
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">
                    Build products that matter with lean methodologies and user-centered design principles.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" />
                  Growth & Sales
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                  <p className="flex-auto">Scale your business with proven growth strategies and sales frameworks.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to build your startup?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of entrepreneurs who are building successful startups with our systematic approach.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/main">
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  Start Building Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
