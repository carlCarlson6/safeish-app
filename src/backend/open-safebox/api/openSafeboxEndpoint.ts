import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { NextRequest } from "next/server";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { unknownErrorResponse } from "@/backend/infrastructure/api-errors";

const openSafeBox = handler({
  getSafebox: getSafeboxFromCosmos,
});

// TODO - check if this works with Request instead NextRequest
export const openSafeBoxEndpoint = (request: NextRequest, params: { id: string }) => openSafeBox({safeboxData: {
    id: params.id,
    ...readBasicAuthHeader(request),
  }})
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });

function formatResponse(result: Awaited<ReturnType<typeof openSafeBox>>) {
  throw new Error("Function not implemented.");
}
