import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FeedbackToast from '@/components/ui/FeedbackToast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aetheris Game Platform | Play. Enjoy. Repeat.',
  description: 'A comprehensive game platform featuring RPGs, puzzles, arcade games, and procedurally generated content. Play Aetheris, Memory Master, Word Wizard, and more!',
  keywords: ['games', 'RPG', 'puzzle', 'arcade', 'strategy', 'procedural generation', 'Aetheris'],
  openGraph: {
    title: 'Aetheris Game Platform',
    description: 'Play amazing games including RPGs, puzzles, and arcade games',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <FeedbackToast />
      </body>
    </html>
  )
}
