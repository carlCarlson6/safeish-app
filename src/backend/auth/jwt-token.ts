import { env } from "@/env";
import { SignJWT, jwtDecrypt, jwtVerify } from "jose";

const { key, audience, issuer } = env.auth;
const secretAuthKey = new TextEncoder().encode(key);

export const generateToken = (safeboxId: string) => new SignJWT({safeboxId})
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime(`${3*60} sec from now`)
  .setIssuer(issuer)
  .setAudience(audience)
  .sign(secretAuthKey);

export const extractJwtFromHeader = (request: Request) => request.headers.get("Authorization")?.replace("Bearer ", "") ?? "TOKEN-NOT-FOUND";

export const validateToken = async (jwt: string) => jwtVerify(jwt, secretAuthKey, { algorithms: ["HS256"], issuer, audience })
  .then(_ => true)
  .catch(_ => false)