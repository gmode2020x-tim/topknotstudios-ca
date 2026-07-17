# Top Knot Studios

Development, deployment, and management workspace for `topknotstudios.ca`.

## Local Tooling

This project uses a project-local portable Node install because the machine-wide Node installer hung during setup.

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
npm install
npm run dev
```

## Site Config

Copy `.env.example` to `.env.local` and fill in the real business values:

```powershell
Copy-Item .env.example .env.local
```

Important values:

- `VITE_SQUARE_BOOKING_URL`: Square Appointments booking page or embed URL.
- `VITE_DEPOSIT_PAYMENT_URL`: optional Square or Stripe payment link for deposits.
- `VITE_INSTAGRAM_URL`: public Instagram profile URL for gallery/contact links.
- `VITE_CONTACT_PHONE`: public business phone number.
- `VITE_CONTACT_EMAIL`: public business email address.

## Booking and Payments

Default provider: Square Appointments.

Reason: Square Appointments handles online booking, client scheduling, deposits/payment capture, and an embeddable booking flow in one product. Stripe is excellent for payments, but it does not provide salon scheduling by itself.

Square setup steps:

1. Create or sign in to Square.
2. Open Appointments.
3. Add Top Knot Studios services, durations, prices, cancellation rules, and any deposit requirements.
4. In Online Booking > Channels, create the booking link or embed code.
5. Add the booking URL to `.env.local` as `VITE_SQUARE_BOOKING_URL`.

## Instagram

Add the public Instagram profile URL to `.env.local`:

```powershell
VITE_INSTAGRAM_URL=https://www.instagram.com/your-handle/
```

For booking from Instagram, use a professional Instagram account and add a Book Now action button connected to Square Appointments.

Embedding a live Instagram feed is possible, but it requires Meta developer/API authorization or a third-party feed service. For this site, the default is a reliable profile/gallery link plus Square's Instagram booking integration.

## Deployment

Recommended host: Vercel.

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
npm run build
npm run deploy
```

After the first Vercel deployment, add `topknotstudios.ca` in the Vercel project domain settings. Vercel will show the exact DNS records to add in GoDaddy.

Typical DNS shape:

- `A` record for apex `@` to Vercel's assigned address.
- `CNAME` record for `www` to Vercel's assigned hostname.

Use Vercel's displayed values as authoritative because DNS targets can change by project.
