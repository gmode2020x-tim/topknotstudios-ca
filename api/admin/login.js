import { createSessionCookie, hasAdminConfig, verifyCredentials } from "../_auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!hasAdminConfig()) {
    res.status(503).json({ error: "Admin credentials are not configured." });
    return;
  }

  const username = req.body?.username;
  const password = req.body?.password;
  if (!verifyCredentials(username, password)) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  res.setHeader("Set-Cookie", createSessionCookie());
  res.status(200).json({ ok: true });
}
