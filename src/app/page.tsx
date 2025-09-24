'use client'

import { useSession } from 'next-auth/react'
import AuthButton from './components/AuthButton'
import SpotifyPlayer from './components/SpotifyPlayer'
import { Music } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl shadow-xl p-6 text-white">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/20 p-3 rounded-xl shadow-lg">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Spotify Music Player
            </h1>
            <p className="text-green-100">
              Stream your playlists right in your browser
            </p>
          </div>
        </motion.div>
        <AuthButton />
      </header>

      {/* Main Content */}
      <main>
        {status === 'loading' ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-white border-b-4 border-green-400 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading your music...</p>
          </div>
        ) : session ? (
          <SpotifyPlayer />
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Music className="w-20 h-20 mx-auto text-green-600 mb-8 drop-shadow-md" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-green-600">Spotify Music Player</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 text-lg">
              Connect your Spotify account and enjoy <span className="font-semibold">seamless playback</span>, discover your playlists, and stream high-quality music directly in your browser.
            </p>
            <motion.div
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 max-w-lg mx-auto mb-8 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-yellow-800 leading-relaxed">
                <strong>Note:</strong> Spotify Premium is required for music playback.
              </p>
            </motion.div>
            {/* <AuthButton /> */}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>
          🎵 Built with <span className="font-medium">Next.js</span>,{' '}
          <span className="font-medium">Tailwind CSS</span>, and{' '}
          <span className="font-medium">Spotify Web Playback SDK</span>
        </p>
        <p className="mt-2 italic">
          Requires Spotify Premium for full playback functionality
        </p>
      </footer>
    </div>
  )
}