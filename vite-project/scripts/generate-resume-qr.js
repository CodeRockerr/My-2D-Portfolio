import QRCode from "qrcode";
import { loadEnv } from "vite";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { profile } from "../src/content.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const mode = process.argv[2] || "production";
const env = loadEnv(mode, root, "VITE_");
const site = new URL(env.VITE_SITE_URL || profile.siteUrl);
if (!["http:", "https:"].includes(site.protocol))
  throw new Error("VITE_SITE_URL must be an HTTP(S) origin.");
const target = new URL(profile.resume, site.origin).href;
const directory = resolve(root, "public/art");
await mkdir(directory, { recursive: true });
const options = {
  errorCorrectionLevel: "M",
  margin: 4,
  width: 512,
  color: { dark: "#213b31", light: "#ffffff" },
};
await QRCode.toFile(resolve(directory, "resume-qr.svg"), target, {
  ...options,
  type: "svg",
});
await QRCode.toFile(resolve(directory, "resume-qr.png"), target, {
  ...options,
  type: "png",
});
console.log(`Résumé QR generated: ${target}`);
