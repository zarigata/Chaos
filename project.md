# Discord Clone Project

## Overview
A full-stack Discord-like platform for real-time text, voice, and video communication with server (guild) management, roles, and private messaging.

## Repository Structure

```
/backend                # Express.js + Socket.IO + TypeORM service
/frontend               # React + Vite + Tailwind client
/electron-client        # Electron wrapper around frontend
/infra                  # Terraform & Kubernetes Helm charts
/devops                 # CI/CD workflows, monitoring, logging configs
/docs                   # Architecture docs and API specs
/sample-data            # Seed scripts and sample JSON data
project.md              # This project overview
log.md                  # Changelog and progress log
steps.md                # Development roadmap & steps
```

## Goals
- Real-time chat (text, voice, video)
- Server/guild creation & RBAC
- Direct messaging & notifications
- Bot framework
- Cross-platform desktop client via Electron
- Scalable DevOps with Docker, Kubernetes, CI/CD, monitoring
