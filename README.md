# 🎵 Spotify Music Player

A modern web application built with Next.js that integrates with Spotify's Web API and Web Playback SDK to create a full-featured music streaming experience directly in your browser.

![Spotify Music Player](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify)

## ✨ Features

- 🔐 **Secure Spotify OAuth Authentication** - Login with your Spotify account
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎶 **Playlist Management** - Browse and select from your personal playlists
- 🎵 **Music Playback** - Stream music directly in your browser with Web Playback SDK
- ⏯️ **Player Controls** - Play, pause, skip tracks, and seek through songs
- 📊 **Real-time Updates** - Live track progress and playback state
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- ⚡ **Fast Performance** - Optimized with Next.js 14 and TypeScript
- 🛡️ **Error Handling** - Comprehensive error handling for common issues

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Spotify Premium account (required for playback functionality)
- Spotify Developer account (free)

### 1. Clone the Repository

```bash
git clone <https://github.com/arsal214/verso-music.git>
cd spotify-music-player
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create an App"
3. Fill in your app details:
   - **App name**: Spotify Music Player
   - **App description**: NextJS music player with Web Playback SDK
4. Add Redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/callback/spotify`
   - **Production**: `https://yourdomain.com/api/auth/callback/spotify`
5. Save your app and copy the **Client ID** and **Client Secret**

### 4. Environment Configuration

Create a `.env.local` file in your project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
spotify-music-player/
├── src/
│   └── app/
│       ├── api/
│       │   └── auth/
│       │       └── [...nextauth]/
│       │           └── route.ts          # NextAuth configuration
│       ├── components/
│       │   ├── AuthButton.tsx            # Login/logout functionality
│       │   ├── PlaylistList.tsx          # Display user playlists
│       │   ├── SpotifyPlayer.tsx         # Main player component
│       │   └── TrackList.tsx             # Display tracks in playlist
│       ├── hooks/
│       │   └── useSpotifyPlayer.ts       # Custom hook for Spotify SDK
│       ├── types/
│       │   └── spotify.ts                # TypeScript interfaces
│       ├── utils/
│       │   └── spotify.ts                # Spotify API utilities
│       ├── globals.css                   # Global styles
│       ├── layout.tsx                    # App layout
│       └── page.tsx                      # Home page
├── public/                               # Static assets
├── .env.local                           # Environment variables (create this)
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies
├── tailwind.config.js                   # Tailwind configuration
└── tsconfig.json                        # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **API**: Spotify Web API & Web Playback SDK
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🎯 Key Components

### AuthButton
Handles Spotify OAuth login/logout with user profile display.

### PlaylistList
Fetches and displays user playlists with images, track counts, and selection functionality.

### SpotifyPlayer
Main player component that orchestrates playlist selection, track display, and playback controls.

### TrackList
Displays tracks from selected playlist with album art, artist info, and duration.

### useSpotifyPlayer Hook
Custom React hook that manages Spotify Web Playback SDK initialization, player state, and control functions.

## 🔧 Configuration

### Spotify Scopes
The app requests these Spotify permissions:
- `streaming` - Control playback
- `user-read-email` - User profile access
- `user-read-private` - User profile access
- `user-read-playback-state` - Read playback state
- `user-modify-playback-state` - Control playback
- `playlist-read-private` - Access private playlists
- `playlist-read-collaborative` - Access collaborative playlists
- `user-library-read` - Access saved music

### Image Domains
Next.js image optimization is configured for Spotify CDN domains in `next.config.js`.

## ⚠️ Important Notes

### Spotify Premium Requirement
- **Spotify Premium is required** for the Web Playback SDK to work
- Free Spotify accounts can authenticate and browse playlists but cannot stream music
- The app gracefully handles this limitation with appropriate error messages

### HTTPS Requirement
- Production deployments must use HTTPS
- Spotify requires secure redirect URIs for OAuth
- Local development works with HTTP

### Rate Limiting
- Spotify API has rate limits (typically 100 requests per hour per user)
- The app implements proper error handling for rate limit scenarios

## 🐛 Troubleshooting

### Common Issues

**"Redirect URI not secure" error:**
- Ensure redirect URI in Spotify app matches exactly: `http://localhost:3000/api/auth/callback/spotify`
- No trailing spaces or extra characters
- Use `http://` (not `https://`) for localhost

**"Player not ready" error:**
- Ensure you have Spotify Premium
- Check browser console for SDK initialization errors
- Try refreshing the page to reinitialize the player

**Build errors with imports:**
- Ensure all files are in the correct directory structure
- Check that relative imports match the file locations
- Run `npm install` to ensure all dependencies are installed

**Authentication issues:**
- Verify all environment variables are set correctly
- Check Spotify app credentials
- Ensure redirect URI is added to Spotify app settings

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Verify environment variables** are loaded correctly
3. **Test Spotify authentication** flow step by step
4. **Check network tab** for failed API requests
5. **Verify Spotify app settings** in developer dashboard

## 📝 API Endpoints Used

- `GET /me/playlists` - Fetch user playlists
- `GET /playlists/{id}/tracks` - Fetch playlist tracks
- `PUT /me/player/play` - Start/control playback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Developed by arsal214 using Next.js, TypeScript, and Spotify Web APIs**