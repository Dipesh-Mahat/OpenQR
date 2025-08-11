'use client'

import { Button } from '@/components/ui/button'
import { ArrowDown, Sparkles, Zap, Shield } from 'lucide-react'

export function Hero() {
  const scrollToGenerator = () => {
    const generator = document.querySelector('#generator')
    generator?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            Create Beautiful QR Codes
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create professional QR codes with custom colors, logos, and beautiful designs.
            Fast, free, and no sign-up required.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Exclusive Features</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
