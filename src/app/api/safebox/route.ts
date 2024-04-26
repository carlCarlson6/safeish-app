import { createSafeBoxEndpoint } from "@/backend/create-safebox/api/createSafeBoxEndpoint";

export async function POST(request: Request) {
  return createSafeBoxEndpoint(request);
}
