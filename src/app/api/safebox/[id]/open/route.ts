import { openSafeBoxEndpoint } from "@/backend/open-safebox/api/openSafeboxEndpoint";

export async function GET(request: Request, {params}: {params: {id: string}}) {
  return await openSafeBoxEndpoint(request, params);
}