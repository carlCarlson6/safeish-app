import { openSafeBoxEndpoint } from "@/backend/open-safebox/api/openSafeboxEndpoint";
import { NextRequest } from "next/server";

export function GET(request: NextRequest, {params}: {params: {id: string}}) {
  return openSafeBoxEndpoint(request, params);
}