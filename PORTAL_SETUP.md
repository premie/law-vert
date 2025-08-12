# LawVert Facebook Campaign Portal Setup

## Overview
This portal provides a secure dashboard for viewing Facebook campaign data, restricted to authorized Conduit Law personnel.

## Current Status
✅ Google OAuth authentication setup
✅ User authorization for jon@conduit.law and elliot@conduit.law
✅ Protected dashboard with campaign data display
✅ Mock Facebook campaign data endpoint
✅ Database setup with Prisma and SQLite

## Setup Instructions

### 1. Google OAuth Configuration

You need to complete the Google OAuth setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to "APIs & Services" > "Credentials"
4. Your OAuth 2.0 Client ID is already configured: `216912096349-rruojnb14kdbmet0qlldnk96vjautp95.apps.googleusercontent.com`
5. Add the following to your OAuth client configuration:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Get your Client Secret and update `.env.local`:
   ```
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   ```

### 2. Facebook API Configuration (Optional)

To connect real Facebook campaign data:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app or use existing one
3. Get your App ID and App Secret
4. Generate a long-lived access token with `ads_read` permission
5. Update `.env.local`:
   ```
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
   FACEBOOK_AD_ACCOUNT_ID=your-ad-account-id
   ```

### 3. Running the Portal

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Run database migrations (already done):
   ```bash
   npx prisma migrate dev
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the portal at: http://localhost:3000

## Features

### Authentication
- Google OAuth login
- Restricted to authorized emails (jon@conduit.law and elliot@conduit.law)
- Session management with NextAuth

### Dashboard
- Campaign overview with key metrics
- Detailed campaign table with:
  - Campaign name and status
  - Spend, impressions, clicks
  - CTR, CPC, CPM metrics
- Real-time data refresh capability

### Security
- Protected routes with middleware
- Email whitelist validation
- Secure session management
- Environment variables for sensitive data

## File Structure
```
app/
├── api/
│   ├── auth/[...nextauth]/  # NextAuth configuration
│   └── facebook/campaigns/   # Facebook API endpoint
├── dashboard/                # Protected dashboard
│   ├── layout.tsx           # Dashboard layout with auth
│   └── page.tsx             # Campaign data display
├── login/                    # Login page
│   └── page.tsx             # Google sign-in
└── providers.tsx            # Session provider wrapper

prisma/
├── schema.prisma            # Database schema
└── migrations/              # Database migrations

middleware.ts                # Route protection
.env.local                  # Environment variables
```

## Deployment Notes

For production deployment:
1. Update `NEXTAUTH_URL` in environment variables
2. Use production Google OAuth credentials
3. Set up a production database (PostgreSQL recommended)
4. Configure Facebook API with production tokens
5. Update authorized redirect URIs in Google Console

## Authorized Users
Currently authorized:
- jon@conduit.law
- elliot@conduit.law

To add more users, update the `AUTHORIZED_EMAILS` in `.env.local` (comma-separated).