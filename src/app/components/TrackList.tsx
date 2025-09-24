'use client'

import { SpotifyTrack } from '@/app/types/spotify'
import { Play, Music } from 'lucide-react'

interface TrackListProps {
  tracks: SpotifyTrack[]
  onTrackSelect: (track: SpotifyTrack, index: number) => void
  currentTrack?: SpotifyTrack | null
  isPlaying: boolean
}

export default function TrackList({ tracks, onTrackSelect, currentTrack, isPlaying }: TrackListProps) {
  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = ((durationMs % 60000) / 1000).toFixed(0)
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tracks ({tracks.length})
      </h3>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {tracks.map((track, index) => (
          <button
            key={`${track.id}-${index}`}
            onClick={() => onTrackSelect(track, index)}
            className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-gray-50 ${
              currentTrack?.id === track.id
                ? 'bg-green-50 border border-green-500'
                : 'bg-white border border-gray-100'
            }`}
          >
            <div className="flex-shrink-0 relative">
              {track.album.images[0] ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-500" />
                </div>
              )}
              
              {currentTrack?.id === track.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                  {isPlaying ? (
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-white animate-pulse"></div>
                      <div className="w-1 h-4 bg-white animate-pulse delay-75"></div>
                      <div className="w-1 h-4 bg-white animate-pulse delay-150"></div>
                    </div>
                  ) : (
                    <Play className="w-4 h-4 text-white fill-white" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${
                currentTrack?.id === track.id ? 'text-green-700' : 'text-gray-900'
              }`}>
                {track.name}
              </h4>
              <p className="text-sm text-gray-500 truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {track.album.name}
              </p>
            </div>
            
            <div className="flex-shrink-0 text-sm text-gray-500">
              {formatDuration(track.duration_ms)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}