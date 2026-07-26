# Top Knot Studios

Development, deployment, and management workspace for `topknotstudios.ca`.

## Local Tooling

This project uses a project-local portable Node install because the machine-wide Node installer hung during setup.

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
.\.tools\node-v24.14.0-win-x64\npm.cmd install
.\.tools\node-v24.14.0-win-x64\npm.cmd run dev
```

## Site Config

Copy `.env.example` to `.env.local` and fill in the real business values:

```powershell
Copy-Item .env.example .env.local
```

Important values:

- `VITE_INSTAGRAM_URL`: public Instagram profile URL for gallery/contact links.
- `VITE_CONTACT_PHONE`: public business phone number. Current value: `519 221 9634`.
- `VITE_CONTACT_EMAIL`: public business email address. Current value: `jodie@topknotstudios.ca`.
- `VITE_STUDIO_ADDRESS`: public studio address. Current value: `216 King Street East, Ingersoll Ontario, N5C 1H2`.
- `ADMIN_USERNAME`: username for `/admin`.
- `ADMIN_PASSWORD`: password for `/admin`.
- `ADMIN_SESSION_SECRET`: long random value used to sign the admin login cookie.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token used for persistent gallery image and manifest storage.

## Studio Images and Product Direction

The production site uses the supplied Top Knot Studios salon photos from `public/images/studio`:

- `studio-main.jpg`: hero, cut/finish service card, and gallery.
- `redken-shelf.jpg`: styling product shelf, event styling card, booking panel background, and gallery.
- `redken-care.jpg`: Redken wash and colour care products, blonding card, product section, and gallery.
- `redken-color-wall.jpg`: Redken colour inventory wall, colour service card, product section, and gallery.
- `wash-station.jpg`: wash station, experience section, and gallery.

The production images are color-graded files with a consistent bright, light salon look. Original supplied photos are preserved in `public/images/studio-originals`.

The hairstyle gallery is built from the supplied `Top Knots` ZIP. Production gallery images live in `public/images/style-gallery` and are cropped to a consistent 4:5 portrait format with a bright salon grade. The raw ZIP and extraction workspace stay local under `work/` and are excluded from deployment.

## Gallery Admin

The administrator console is available at `/admin`.

Capabilities:

- Login-protected admin session.
- Rename categories and edit category summary text.
- Enter service rows with description and price to generate the public services table.
- Add new categories.
- Upload new images. The browser center-crops uploads to 4:5, brightens them, softens saturation, and exports compressed JPEG before upload.
- Move images between categories.
- Remove images.
- Remove empty categories.

Storage model:

- Public visitors read `/api/gallery`.
- If Vercel Blob is configured, `/api/gallery` reads the live `gallery/manifest.json` from Blob.
- If Blob is not configured yet, the public site falls back to the built-in gallery from `src/galleryData.js`.
- The public Services section shows category directions from the gallery library and a separate services table from admin-entered service rows.
- Admin writes require `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `BLOB_READ_WRITE_TOKEN` in the Vercel project environment.

Vercel setup:

1. In Vercel, open the `topknot` project.
2. Open Storage and create/connect a Blob store.
3. Confirm `BLOB_READ_WRITE_TOKEN` is present in the project environment.
4. Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in Project Settings > Environment Variables.
5. Redeploy production.

Redken is the in-studio product and colour-care direction. Current site copy is inspired by Redken's public professional colour and care positioning, including professional hair colour, Shades EQ glossing/toning, and colour maintenance products:

- https://www.redken.ca/en-ca/products/salon-hair-color-products/haircolor
- https://www.redkenpro.com/products/haircolor/shades-eq-hair-gloss
- https://www.redken.ca/en-ca/products/by-concern/colored-hair

## Booking

Appointments are requested directly by email or phone.

- Email: `jodie@topknotstudios.ca`
- Phone/text: `519 221 9634`
- Payment methods: e-transfer to `jodie@topknotstudios.ca` or cash.

The public Services section is generated from the admin-managed gallery categories.

## Instagram

Add the public Instagram profile URL to `.env.local`:

```powershell
VITE_INSTAGRAM_URL=https://www.instagram.com/your-handle/
```

For booking from Instagram, direct clients to email or phone.

Embedding a live Instagram feed is possible, but it requires Meta developer/API authorization or a third-party feed service. For this site, the default is a reliable profile/gallery link plus direct email or phone booking.

## Deployment

Recommended host: Vercel.

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
.\.tools\node-v24.14.0-win-x64\npm.cmd run build
.\.tools\node-v24.14.0-win-x64\npm.cmd run deploy
```

This repo includes `vercel.json` so Vercel uses the Vite framework preset, `npm run build`, and the `dist` output directory.

If this local checkout is not linked yet:

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
.\.tools\node-v24.14.0-win-x64\npx.cmd vercel@56.3.1 login
.\.tools\node-v24.14.0-win-x64\npx.cmd vercel@56.3.1 link
.\.tools\node-v24.14.0-win-x64\npx.cmd vercel@56.3.1 --prod
```

Current Vercel project:

- Team: `gmode2020x-3356s-projects`
- Project: `topknot`
- Production URL: `https://topknot.vercel.app`
- Project settings: `https://vercel.com/gmode2020x-3356s-projects/topknot`

After the first Vercel deployment, add `topknotstudios.ca` in the Vercel project domain settings. Vercel will show the exact DNS records to add in GoDaddy.

Current custom-domain status:

- `topknotstudios.ca` is attached to the Vercel project.
- `www.topknotstudios.ca` is attached to the Vercel project.
- GoDaddy DNS has been updated from WebsiteBuilder records to Vercel records.
- Vercel verification passes for both `topknotstudios.ca` and `www.topknotstudios.ca`.

Current GoDaddy DNS records:

```text
A      @      216.198.79.1
A      @      64.29.17.1
CNAME  www    ecfa3c89fc19522a.vercel-dns-017.com.
```

The old apex `A` records pointing at `76.223.105.230` and `13.248.243.5` have been removed. The old `www` CNAME pointing back to `topknotstudios.ca` has been replaced.

To re-check Vercel domain status:

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.0-win-x64;$env:PATH"
.\.tools\node-v24.14.0-win-x64\npx.cmd vercel@56.3.1 domains verify topknotstudios.ca
.\.tools\node-v24.14.0-win-x64\npx.cmd vercel@56.3.1 domains verify www.topknotstudios.ca
```

Use Vercel's displayed values as authoritative because DNS targets can change by project.
