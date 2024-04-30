import { createSafeBoxEndpoint } from "@/backend/create-safebox/api/createSafeBoxEndpoint";

export function POST(request: Request) {
  return createSafeBoxEndpoint(request);
}
