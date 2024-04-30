import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { readItemsFromCosmos } from "../ReadItems";
import { NextRequest } from "next/server";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";
import { extractJwtFromHeader } from "@/backend/auth/jwt-token";

const retrieveItems = handler({
  getSafebox: getSafeboxFromCosmos,
  readItems:  readItemsFromCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof retrieveItems>>) => match(result)
  .with("invalid_credentials",     ()        => invalidBasicAuthResponse)
  .with("safebox_not_found",       ()        => safeboxNotFoundResponse)
  .with("malformed-data",          ()        => malformedDataResponse)
  .with("unknown-error",           ()        => unknownErrorResponse)
  .with({type: "retrieved-tiems"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();

// TODO - check if this works with Request instead NextRequest
export const retrieveItemsEndpoint = (request: NextRequest, params: { id: string }) => retrieveItems({
    safeboxId: params.id,
    token: extractJwtFromHeader(request),
  })
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });
