import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { NextRequest } from "next/server";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { invalidBasicAuthResponse, lockedSafeboxErrorResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";

const openSafeBox = handler({
  get: getSafeboxFromCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof openSafeBox>>) => match(result)
  .with("invalid-credentials", () => invalidBasicAuthResponse)
  .with("not-found",           () => safeboxNotFoundResponse)
  .with("malformed-data",      () => malformedDataResponse)
  .with("locked",              () => lockedSafeboxErrorResponse)
  .with({type: "opened"},      ({token}) => Response.json({token}, {status: 200}))
  .exhaustive();

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