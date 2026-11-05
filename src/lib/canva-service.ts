import fs from "fs";
import path from "path";
import crypto from "crypto";

const TOKEN_FILE = path.resolve(process.cwd(), ".canva_token.json");
const PKCE_FILE = path.resolve(process.cwd(), ".canva_pkce.json");

export interface CanvaTokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  saved_at: number;
}

export function getCanvaCredentials() {
  return {
    clientId: process.env.CANVA_CLIENT_ID || "",
    clientSecret: process.env.CANVA_CLIENT_SECRET || "",
    redirectUri: process.env.CANVA_REDIRECT_URI || "http://localhost:3000/api/canva/callback",
  };
}

export function saveCanvaToken(tokenData: any) {
  const data: CanvaTokenData = {
    ...tokenData,
    saved_at: Date.now(),
  };
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getCanvaToken(): CanvaTokenData | null {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const raw = fs.readFileSync(TOKEN_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

export function isCanvaConnected(): boolean {
  const token = getCanvaToken();
  return !!token?.access_token;
}

export function generatePkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  fs.writeFileSync(PKCE_FILE, JSON.stringify({ verifier, challenge }), "utf8");
  return { verifier, challenge };
}

export function getSavedPkceVerifier(): string {
  try {
    if (fs.existsSync(PKCE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PKCE_FILE, "utf8"));
      return data.verifier;
    }
  } catch {
    // ignore
  }
  return "";
}

export function buildCanvaAuthUrl(): string {
  const { clientId, redirectUri } = getCanvaCredentials();
  const { challenge } = generatePkcePair();

  const scopes = [
    "design:content:read",
    "design:content:write",
    "design:meta:read",
    "asset:read",
    "asset:write",
    "profile:read",
    "folder:read",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    scope: scopes,
    redirect_uri: redirectUri,
  });

  return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<CanvaTokenData> {
  const { clientId, clientSecret, redirectUri } = getCanvaCredentials();
  const verifier = getSavedPkceVerifier();

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Canva token exchange failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  saveCanvaToken(data);
  return data;
}

export async function createCanvaDesign(title: string, designType: string = "presentation") {
  const token = getCanvaToken();
  if (!token?.access_token) {
    throw new Error("Canva is not connected. User must authorize first.");
  }

  const res = await fetch("https://api.canva.com/rest/v1/designs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      design_type: {
        type: "preset",
        name: designType,
      },
      title,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Canva design creation failed (${res.status}): ${errText}`);
  }

  return await res.json();
}

