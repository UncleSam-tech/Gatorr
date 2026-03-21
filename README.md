# Gatorr

Gatorr is a public-web pain-signal intelligence platform designed to crawl, parse, and score intent signals from the open web. It operates securely with an anonymous-first search model tracking rate-limits via generated fingerprints, and is architected using Next.js 15, Prisma (PostgreSQL), and Tailwind CSS v4.

## Core Features
1. **Anonymous Rate Limiting & Fingerprinting**: Supports up to 3 deep web searches per 24 hours per user, tracked transparently by hashing IP and User-Agent footprints.
2. **Automated Crawling Engine**: Fetches data while circumventing SSRF attacks by strictly whitelisting HTTP/HTTPS and dropping internal loopback IPs.
3. **Intelligence Dashboard**: Processes raw data into actionable clusters and opportunities (scored 0-100 on intent/pain metrics).
4. **Offline-first Development**: Developed defensively allowing logic processing even without upstream connectivity.

## Tech Stack
- **Framework**: Next.js 15 App Router
- **UI/Styling**: React 19 + Tailwind CSS v4
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **DOM Parsing**: Cheerio

## Getting Started

### 1. Environment Variables
To get started, create an `.env` file at the root of the project with your Supabase PostgreSQL credentials and Gemini API Key. Do not commit this file to version control.

```env
# URL for Prisma Client (e.g. connection pooler in Supabase)
DATABASE_URL="postgresql://user:password@aws-pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://user:password@aws-pooler.supabase.com:5432/postgres"

# Google Gemini API Key for Intelligence Dashboard Extraction
GEMINI_API_KEY="your_api_key_here"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma & Push Schema
Generate the Prisma PostgreSQL client and push the schema directly to your Supabase instance:
```bash
npx prisma generate
npx prisma db push
```

### 4. Start the Application
Run the Next.js development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

## Deployment on Render
Gatorr is configured for direct deployment via Render. In your Render dashboard:
1. Set Environment to **Node**.
2. Set Build Command to `npm install && npm run build`.
3. Set Start Command to `npm run start`.
4. Ensure `DATABASE_URL`, `DIRECT_URL`, and `GEMINI_API_KEY` are configured via Render’s environment variable settings.
