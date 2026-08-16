# Website analytics

Top Knot Studios uses a small first-party analytics endpoint and a dashboard inside `/admin`.

## What is measured

- Public page views.
- Appointment-email clicks.
- Phone-link clicks.
- Google Maps clicks.
- Instagram clicks when an Instagram URL is configured.
- Gallery category views.
- The referring hostname for the first page view, such as `google.com` or `Direct`.

The tracker does not create cookies or visitor IDs and does not store IP addresses, email addresses,
phone numbers, full referring URLs, device fingerprints, or form content. Reports are aggregate counts,
so the dashboard intentionally does not claim to show unique visitors.

## Storage and access

Each anonymous event is saved as a small randomly suffixed JSON object in the existing Vercel Blob
store under `analytics/events/YYYY-MM-DD/`. The Blob store is public because it is also used by the
public gallery, but event URLs are never returned to visitors and contain no personal information.

The report API is `GET /api/analytics?days=30`. It accepts 7, 30, or 90 days and requires the same
signed administrator session as gallery management. The public collector only accepts a fixed event
schema and same-site browser requests.

## Dashboard

Sign in at `https://topknotstudios.ca/admin`, then open **Traffic dashboard**. The dashboard shows:

- Page views and appointment-action rate.
- Appointment, phone, Maps, and gallery interactions.
- A daily activity chart.
- Top referrers, most-viewed gallery categories, and appointment-button locations.

The report reads at most 5,000 events per request. If that limit is reached, the dashboard displays a
sampling warning; at that point the storage model should be upgraded to an aggregate analytics store.
