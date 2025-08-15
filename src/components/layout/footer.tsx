import Link from 'next/link'
import { DonationDialog } from './donation-dialog'

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 OpenQR. Built by{' '}
            <a 
              href="https://github.com/Dipesh-Mahat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              Dipesh Mahat
            </a>
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="ml-4" style={{ position: 'relative' }}>
              <DonationDialog />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
