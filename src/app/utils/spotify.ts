import axios from 'axios'
import { SpotifyPlaylist, SpotifyTrack, PlaylistTracksResponse } from '@/app/types/spotify'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_BASE,
})

export const setAuthToken = (token: string) => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const getUserPlaylists = async (): Promise<SpotifyPlaylist[]> => {
  try {
    const response = await spotifyApi.get('/me/playlists?limit=50')
    return response.data.items
  } catch (error) {
    console.error('Error fetching playlists:', error)
    throw error
  }
}

export const getPlaylistTracks = async (playlistId: string): Promise<SpotifyTrack[]> => {
  try {
    const response = await spotifyApi.get<PlaylistTracksResponse>(`/playlists/${playlistId}/tracks`)
    return response.data.items.map(item => item.track).filter(track => track.id)
  } catch (error) {
    console.error('Error fetching playlist tracks:', error)
    throw error
  }
}

export const startPlayback = async (deviceId: string, contextUri?: string, trackUris?: string[]) => {
  try {
    const body: any = {}
    
    if (contextUri) {
      body.context_uri = contextUri
    } else if (trackUris) {
      body.uris = trackUris
    }

    await spotifyApi.put(`/me/player/play?device_id=${deviceId}`, body)
  } catch (error) {
    console.error('Error starting playback:', error)
    throw error
  }
}