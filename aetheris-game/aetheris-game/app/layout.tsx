import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aetheris: The Symbol War',
  description: 'An epic browser-based RPG adventure',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
