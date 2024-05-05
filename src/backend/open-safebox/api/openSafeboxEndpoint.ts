"use server"

import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { invalidBasicAuthResponse, lockedSafeboxErrorResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";
import { updateSafeboxOnCosmos } from "../UpdateSafebox";
import { env } from "@/env";

const openSafeBox = handler({
  get: getSafeboxFromCosmos(env.cosmos),
  update: updateSafeboxOnCosmos(env.cosmos),
});

const formatResponse = (result: Awaited<ReturnType<typeof openSafeBox>>) => match(result)
  .with("invalid-credentials", ()        => invalidBasicAuthResponse)
  .with("not-found",           ()        => safeboxNotFoundResponse)
  .with("malformed-data",      ()        => malformedDataResponse)
  .with("locked",              ()        => lockedSafeboxErrorResponse)
  .with("unknown-error",       ()        => unknownErrorResponse)
  .with({type: "opened"},      ({token}) => Response.json({token}, {status: 200}))
  .exhaustive();

export const openSafeBoxEndpoint = async (request: Request, params: { id: string }) => {
  try {
    const result = await openSafeBox({
      safeboxData: {
        id: params.id,
        ...readBasicAuthHeader(request),
      }
    });
    return formatResponse(result);
  } catch (error) {
    console.error(error);
    return unknownErrorResponse;
  }
};