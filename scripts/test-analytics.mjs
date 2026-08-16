import assert from "node:assert/strict";
import { summarizeAnalytics } from "../api/analytics.js";

const report = summarizeAnalytics(
  [
    { event: "page_view", occurredAt: "2026-08-14T12:00:00.000Z", referrerHost: "google.com" },
    { event: "page_view", occurredAt: "2026-08-15T12:00:00.000Z", referrerHost: "Direct" },
    { event: "appointment_click", occurredAt: "2026-08-15T12:01:00.000Z", section: "hero" },
    { event: "phone_click", occurredAt: "2026-08-15T12:02:00.000Z", section: "contact" },
    { event: "gallery_view", occurredAt: "2026-08-15T12:03:00.000Z", category: "Colour" },
  ],
  7,
  new Date("2026-08-15T23:00:00.000Z"),
);

assert.equal(report.totals.pageViews, 2);
assert.equal(report.totals.appointmentClicks, 1);
assert.equal(report.totals.phoneClicks, 1);
assert.equal(report.appointmentActionRate, 100);
assert.equal(report.directViews, 1);
assert.deepEqual(report.topReferrers, [
  { label: "Direct", count: 1 },
  { label: "google.com", count: 1 },
]);
assert.deepEqual(report.galleryInterest, [{ label: "Colour", count: 1 }]);
assert.equal(report.daily.at(-1).pageViews, 1);
assert.equal(report.daily.at(-1).appointmentClicks, 1);

console.log("Analytics aggregation tests passed.");
