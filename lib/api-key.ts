import crypto from "crypto";

//  Generate raw API key
export function generateApiKey() {
  const random = crypto.randomBytes(32).toString("hex"); // 64 chars
  const key = `sk_live_${random}`;

  return key;
}

//  Hash API key (SHA-256)
export function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

//  Get prefix (first 8 chars after sk_live_)
export function getApiKeyPrefix(key: string) {
  return key.slice(0, 16); 
  // example: sk_live_abcd1234
}