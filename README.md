# Bysell

## About the Project

Bysell is a full-stack marketplace where students from McGill, Concordia, Université de Montréal, UQAM, HEC Montréal, and Polytechnique Montréal can **buy and sell with people from their own city's campuses**. From textbooks between semesters, furniture for move-in, tickets, tech, and more. Registration is gated to verified Montreal university email domains, keeping the marketplace student-only.

🔗 **Live site**: [bysell.onrender.com](https://bysell.onrender.com)

## Features

- ✅ JWT-based authentication with BCrypt password hashing
- ✅ Registration restricted to Montreal university email domains
- ✅ Redis-backed login rate limiting (distributed, not in-memory)
- ✅ Create, edit, and delete listings with up to 8 images each
- ✅ Image storage via Supabase Storage, not local disk
- ✅ Search, category/price filtering, sorting, and pagination
- ✅ Redis-cached item details to reduce database load
- ✅ CI pipeline that boots the real Spring context against live Postgres/Redis service containers, gating deploys
- ✅ Automated keep-alive checks to prevent free-tier services from pausing

## Tech Stack

| Technology | Description |
| --- | --- |
| **Spring Boot** | Backend REST API |
| **Spring Security + JWT** | Authentication & authorization |
| **React + TypeScript** | Frontend UI (Vite) |
| **PostgreSQL** | Primary database (Neon) |
| **Redis** | Caching & rate limiting (Upstash) |
| **Supabase Storage** | Image storage |
| **Neon** | User and item storage |
| **Docker** | Multi-stage build for backend + frontend |
| **Render** | Hosting and deployment |
| **GitHub Actions** | CI pipeline + scheduled keep-alive automation |

## Architecture

Bysell runs across four separate services, each chosen deliberately:

- **Neon** holds all relational data (users, items, image metadata) — its serverless Postgres auto-resumes from idle with no manual intervention.
- **Supabase Storage** holds the actual image files, kept alive by a scheduled GitHub Actions ping since its free tier pauses after a week of low activity.
- **Upstash** backs both the item-detail cache and the distributed login rate limiter.
- **Render** runs the Spring Boot app itself, serving the built React frontend from the same origin, no separate frontend host, no CORS to manage.

A second GitHub Actions workflow builds and tests the full backend and frontend on every push including booting a real Spring context against live Postgres/Redis service containers and Render only deploys once those checks pass.

## In Progress features
- E-mail verification
- Forgot password functionality

