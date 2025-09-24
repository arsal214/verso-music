'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('spotify')}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
    >
      <LogIn className="w-5 h-5" />
      <span>Login with Spotify</span>
    </button>
  )
}