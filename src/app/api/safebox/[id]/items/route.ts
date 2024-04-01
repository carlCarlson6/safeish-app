import { formatResponse as formatPutResponse } from "@/backend/safebox-items/store/api/formatResponse";
import { unknownErrorResponse } from "@/backend/api/errors";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { NextRequest } from "next/server";
import { addSafeboxItems } from "@/backend/safebox-items/store/api/addSafeboxItems";
import { retrieveItems } from "@/backend/safebox-items/retrieve/api/retrieveItems";
import { formatResponse as formatGetResponse } from "@/backend/safebox-items/retrieve/api/formatResponse";
import { error } from "console";

export function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return retrieveItems({safeboxData: {
    id: params.id,
    ...readBasicAuthHeader(request),
  }})
  .then(formatGetResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });
}

export function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return request.json()
    .then(body => addSafeboxItems({
      safebox: {
        id: params.id,
        ...readBasicAuthHeader(request),
      },
      ...body
    }))
    .then(formatPutResponse)
    .catch(error => {
      console.error(error);
      return unknownErrorResponse;
    });
}