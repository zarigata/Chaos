                 .-''''-.
                /  .--.  \
               /  /    \  \
               |  |    |  |
               \  \__/  /
                \      /
            _.-'        '-._
         .-'                '-.
       .'       ____            '.
      /      .-"""""-.           \
     /     .'          '.          \
    |     /    O    O     \         |
    |    |                |         |
    |    |     \__/       |         |
     \    \              /         /
      '.   '.          .'         .'
        '-._ '-.____.-' _.----.-'
             '---------'

                   _.-'~
               _.-'      '.
            .-~  .-~~~-.._ \
           /    /      \   \|
          |     \      /    |
          \      \_ _/     /
           '-._         _.'
                '~-----~'

     ,--.   ,--.
    ( (  \/  ) )
     > `'   `' <   MUAHAHA
    (_   /^\\   _)
      | (   ) |
      \\  VVV  /
       '-----'

# C.H.A.O.S: MSN/Discord Hybrid Platform

// CODEX: Emergent documentation etched in ASCII darkness.
// This project fuses the nostalgia of MSN Messenger with the power of Discord.

## Overview
C.H.A.O.S is a cross-platform desktop application (Electron) and web service that blends MSN's iconic contact-list UI and emoticon culture with Discord's modern text, voice, and video chat features. Dark mode is enabled by default, offering a sleek, eye-friendly experience.

## Core Features
- Real-time text messaging (channels & direct messages)
- MSN-style contact list with emoticon support
- Voice and video calls via WebRTC
- Server (guild) management with roles & permissions
- File sharing (images, videos, documents)
- Offline message caching & desktop notifications
- Bot framework with commands (`/kick`, `/ban`, `/help`)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + Socket.IO + WebRTC
- Backend: Node.js + Express + TypeScript + PostgreSQL + Redis + Socket.IO
- Desktop: Electron + Electron Forge (EXE, DMG, DEB installers)
- DevOps: Docker, Kubernetes (EKS), Terraform, GitHub Actions, Prometheus, Grafana, ELK

## Repo Structure
```
/backend          # REST & real-time API service
/frontend         # React client
/electron-client  # Electron wrapper
/infra            # Terraform & Helm charts
/devops           # CI/CD, monitoring configs
/docs             # Architecture & API specs
/sample-data      # Seed scripts & sample JSON
```

## Installation
1. Clone repo:
   ```bash
   git clone <repo-url> chaos
   cd chaos
   ```
2. Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
3. Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Electron App:
   ```bash
   cd ../electron-client
   npm install
   npm start
   ```

## Setup

### Backend
- cd backend
- cp .env.example .env
- Edit `.env` to set `database_url` (Postgres URL) and `jwt_secret`
- npm install
- npm run dev

### Frontend
- cd frontend
- npm install
- npm run dev

Navigate to http://localhost:3001 to access the app.

## License & Contributing
Contributions welcome. Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
