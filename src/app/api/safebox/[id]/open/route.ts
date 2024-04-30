import { openSafeBoxEndpoint } from "@/backend/open-safebox/api/openSafeboxEndpoint";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
  return await openSafeBoxEndpoint(request, params);
}