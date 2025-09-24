'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SpotifyPlaylist, SpotifyTrack } from '@/app/types/spotify'
import { getPlaylistTracks, startPlayback } from '@/app/utils/spotify'
import { useSpotifyPlayer } from '@/app/hooks/useSpotifyPlayer'
import PlaylistList from './PlaylistList'
import TrackList from './TrackList'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  AlertCircle,
  Loader2,
  Music
} from 'lucide-react'

export default function SpotifyPlayer() {
  const { data: session } = useSession()
  const {
    deviceId,
    isReady,
    isPlaying,
    currentTrack,
    position,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
  } = useSpotifyPlayer()

  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    setSelectedPlaylist(playlist)
    setLoading(true)
    setError(null)

    try {
      const playlistTracks = await getPlaylistTracks(playlist.id)
      setTracks(playlistTracks)
    } catch (err) {
      setError('Failed to fetch tracks')
      console.error('Error fetching tracks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackSelect = async (track: SpotifyTrack, index: number) => {
    if (!isReady || !deviceId) {
      setError('Player not ready. Make sure you have Spotify Premium.')
      return
    }

    try {
      const trackUris = tracks.map(t => t.uri)
      await startPlayback(deviceId, undefined, trackUris.slice(index))
    } catch (err) {
      setError('Failed to start playback. Make sure you have Spotify Premium.')
      console.error('Error starting playback:', err)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newPosition = percent * duration
    seek(newPosition)
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Welcome to Spotify Music Player
        </h2>
        <p className="text-gray-500">Please log in with Spotify to continue</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Player Status */}
      {!isReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-2">
          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
          <p className="text-yellow-800">
            Initializing Spotify Player... Make sure you have Spotify Premium.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Playlists */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PlaylistList
            onSelectPlaylist={handlePlaylistSelect}
            selectedPlaylist={selectedPlaylist}
          />
        </div>

        {/* Tracks */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">Loading tracks...</p>
            </div>
          ) : tracks.length > 0 ? (
            <TrackList
              tracks={tracks}
              onTrackSelect={handleTrackSelect}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          ) : selectedPlaylist ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No tracks found in this playlist</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Select a playlist to view tracks</p>
            </div>
          )}
        </div>
      </div>

      {/* Player Controls */}
      {currentTrack && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1">
              {currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-16 h-16 rounded object-cover"
                />
              )}
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {currentTrack.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={previousTrack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={!isReady}
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors disabled:bg-gray-400"
                disabled={!isReady}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              
              <button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={!isReady}
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span>{formatTime(position)}</span>
                <div
                  className="flex-1 bg-gray-200 rounded-full h-2 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(position / duration) * 100}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}