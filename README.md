# StudioSpace

StudioSpace is a marketplace for discovering and listing creative studios and production spaces.

## Features

- Browse, search, and filter photo studios, film stages, podcast rooms, and other creative spaces.
- Register and sign in with email/password or the configured social providers.
- Create studios, see your own listings, and manage them as the owner; the configured administrator can manage all listings.
- Request a studio booking with a date, start time, and duration; bookings are stored in MongoDB per signed-in account.
- Manage owned studio listings and booking requests from the signed-in dashboard.
- Responsive studio detail pages and branded loading and not-found states.

## Technology

- Next.js App Router, React, TypeScript, and Tailwind CSS
- Better Auth with MongoDB adapter and JWT plugin
- Express and MongoDB studio API
- React Hot Toast, GSAP, and Swiper
- ImgBB for studio image uploads

## Local setup

1. Install the frontend dependencies from this directory:

   ```powershell
   npm install
   ```

2. Configure the frontend `.env` (do not commit credentials):

   ```env
   MONGODB_URI=your_auth_mongodb_connection_string
   BETTER_AUTH_SECRET=use_a_long_random_secret
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_APP_API_URL=http://localhost:5000
   NEXT_PUBLIC_STUDIO_ADMIN_EMAIL=admin@example.com
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
   ```

   `NEXT_PUBLIC_STUDIO_ADMIN_EMAIL` controls the admin UI. The backend must use
   the same admin account email in its private `STUDIO_ADMIN_EMAIL` setting.
   The ImgBB upload key is exposed to the browser because uploads go directly
   to ImgBB; use an appropriately scoped key and configure ImgBB account limits.

   For deployment, set `BETTER_AUTH_URL` to the frontend's canonical HTTPS URL
   and add any custom frontend domains to `BETTER_AUTH_TRUSTED_ORIGINS` as a
   comma-separated list of origins (scheme and hostname, no path). Vercel
   deployment and production domains are also trusted automatically. These are
   frontend auth settings; `NEXT_PUBLIC_APP_API_URL` is the separate studio API.

3. Configure the backend `.env` in the sibling `assingment-8 backend` folder:

   ```env
   MONGODB_URI=your_studio_mongodb_connection_string
   CLIENT_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   STUDIO_ADMIN_EMAIL=admin@example.com
   PORT=5000
   ```

4. In one terminal, start the API from the backend folder:

   ```powershell
   npm install
   npm run dev
   ```

5. In another terminal, start the frontend from this folder:

   ```powershell
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Submission details

- Live site URL: **Add the deployed URL before submission.**
- Examiner test credentials: **Create a dedicated test account and provide its email/password before submission. Do not use a personal account.**

## Booking storage

Booking requests are stored in the backend MongoDB `bookings` collection.
Each request is tied to the authenticated customer and studio, starts with
`Pending` status, and can only be cancelled by its customer while pending.
Overlapping requests for the same studio and time are rejected by the API.
Studio listings are stored in `studios`. On startup, the backend copies
existing documents from the legacy `Assingment` collection when `studios` is
empty; the legacy collection is left untouched.

## Validation

```powershell
npm run lint
npm run build
```
