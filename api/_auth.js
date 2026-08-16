import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "topknot_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = createHash("sha256").update(String(left)).digest();
  const rightBuffer = createHash("sha256").update(String(right)).digest();
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasAdminConfig() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && secret());
}

export function createSessionCookie() {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;

  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expectedUsername || !expected || !username || !password) return false;
  return safeEqual(username, expectedUsername) && safeEqual(password, expected);
}

export function isAuthenticated(req) {
  if (!hasAdminConfig()) return false;

  const cookieHeader = req.headers.cookie || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!token) return false;

  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) return false;

  const [role, expires, signature] = tokenParts;
  const payload = `${role}.${expires}`;
  const expiry = Number(expires);

  if (role !== "admin" || !Number.isFinite(expiry) || expiry < Date.now()) return false;
  return safeEqual(signature, sign(payload));
}

export function requireAdmin(req, res) {
  if (isAuthenticated(req)) return true;

  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Admin login required." }));
  return false;
}
