import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { QRGenerator } from '@/components/qr/qr-generator'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <Hero />
      <div id="generator" className="container mx-auto px-4 py-8">
        <QRGenerator />
      </div>
      <Footer />
    </main>
  )
}
