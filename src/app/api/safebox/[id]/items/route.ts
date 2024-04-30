import { addSafeboxItemsEndpoint } from "@/backend/safebox-items/store/api/addSafeboxItemsEndpoint";
import { retrieveItemsEndpoint } from "@/backend/safebox-items/retrieve/api/retrieveItemsEndpoint";

export function GET(request: Request, { params }: { params: { id: string } }) {
  return retrieveItemsEndpoint(request, params);
}

export function PUT(request: Request, { params }: { params: { id: string } }) {
  return addSafeboxItemsEndpoint(request, params);
}