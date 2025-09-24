'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SpotifyPlaylist } from '@/app/types/spotify'
import { getUserPlaylists } from '@/app/utils/spotify'
import { Music, Users } from 'lucide-react'

interface PlaylistListProps {
  onSelectPlaylist: (playlist: SpotifyPlaylist) => void
  selectedPlaylist: SpotifyPlaylist | null
}

export default function PlaylistList({ onSelectPlaylist, selectedPlaylist }: PlaylistListProps) {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken) return

      try {
        setLoading(true)
        const userPlaylists = await getUserPlaylists()
        setPlaylists(userPlaylists)
        setError(null)
      } catch (err) {
        setError('Failed to fetch playlists')
        console.error('Error fetching playlists:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [session?.accessToken])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Playlists</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 bg-gray-200 rounded-lg p-4">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
        <Music className="w-5 h-5" />
        <span>Your Playlists ({playlists.length})</span>
      </h2>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist)}
            className={`w-full text-left flex items-center space-x-3 p-4 rounded-lg transition-all hover:bg-gray-50 ${
              selectedPlaylist?.id === playlist.id
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {playlist.images[0] ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-16 h-16 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                  <Music className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {playlist.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{playlist.tracks.total} tracks</span>
              </div>
              {playlist.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}