import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProofPass - Human-Verified Ticketing',
  description: 'Bot-free ticketing powered by verifiable credentials and zero-knowledge proofs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <div className="min-h-screen">
          <header className="border-b border-gray-800 bg-gray-950">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div className="text-2xl font-bold text-primary">
                ✅ ProofPass
              </div>
              <div className="flex gap-8">
                <a href="/" className="hover:text-primary transition">
                  Home
                </a>
                <a href="/events" className="hover:text-primary transition">
                  Events
                </a>
                <a href="/dashboard" className="hover:text-primary transition">
                  Dashboard
                </a>
              </div>
            </nav>
          </header>
          <main className="max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
