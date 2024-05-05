import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { readItemsFromCosmos } from "../ReadItems";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";
import { extractJwtFromHeader } from "@/backend/auth/jwt-token";
import { env } from "@/env";

const retrieveItems = handler({
  getSafebox:     getSafeboxFromCosmos,
  readItems:      readItemsFromCosmos,
  encryptionKey:  env.encryptionKey,
});

const formatResponse = (result: Awaited<ReturnType<typeof retrieveItems>>) => match(result)
  .with("invalid_credentials",     ()        => invalidBasicAuthResponse)
  .with("safebox_not_found",       ()        => safeboxNotFoundResponse)
  .with("malformed-data",          ()        => malformedDataResponse)
  .with("unknown-error",           ()        => unknownErrorResponse)
  .with({type: "retrieved-tiems"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();

export const retrieveItemsEndpoint = (request: Request, params: { id: string }) => retrieveItems({
    safeboxId: params.id,
    token: extractJwtFromHeader(request),
  })
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });
