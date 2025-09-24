'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { setAuthToken } from '@/app/utils/spotify'

export const useSpotifyPlayer = () => {
  const { data: session } = useSession()
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  const initializePlayer = useCallback(() => {
    if (!session?.accessToken || !window.Spotify) return

    const spotifyPlayer = new window.Spotify.Player({
      name: 'Spotify Music Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(session.accessToken)
      },
      volume: 0.5,
    })

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Initialization Error:', message)
    })

    spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Authentication Error:', message)
    })

    spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Account Error:', message)
    })

    // Playback status updates
    spotifyPlayer.addListener('player_state_changed', (state) => {
      if (!state) return

      setCurrentTrack(state.track_window.current_track)
      setIsPlaying(!state.paused)
      setPosition(state.position)
      setDuration(state.duration)
    })

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      setDeviceId(device_id)
      setIsReady(true)
    })

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
      setIsReady(false)
    })

    // Connect to the player
    spotifyPlayer.connect()
    setPlayer(spotifyPlayer)

    return () => {
      spotifyPlayer.disconnect()
    }
  }, [session?.accessToken])

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken)
    }
  }, [session?.accessToken])

  useEffect(() => {
    if (!window.Spotify) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = initializePlayer
    } else {
      initializePlayer()
    }
  }, [initializePlayer])

  const togglePlay = useCallback(() => {
    if (player) {
      player.togglePlay()
    }
  }, [player])

  const nextTrack = useCallback(() => {
    if (player) {
      player.nextTrack()
    }
  }, [player])

  const previousTrack = useCallback(() => {
    if (player) {
      player.previousTrack()
    }
  }, [player])

  const seek = useCallback((positionMs: number) => {
    if (player) {
      player.seek(positionMs)
    }
  }, [player])

  return {
    player,
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
  }
}