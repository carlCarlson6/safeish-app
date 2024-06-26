import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { upsertItemsOnCosmos } from "../UpsertItems";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";
import { extractJwtFromHeader } from "@/backend/auth/jwt-token";

const addSafeboxItems = handler({
  getSafebox: getSafeboxFromCosmos,
  upsertItems: upsertItemsOnCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof addSafeboxItems>>) => match(result)
  .with("invalid_credentials",  ()        => invalidBasicAuthResponse)
  .with("malformed-data",       ()        => malformedDataResponse)
  .with("safebox_not_found",    ()        => safeboxNotFoundResponse)
  .with("unknown-error",        ()        => unknownErrorResponse)
  .with({type: "stored-items"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();

export const addSafeboxItemsEndpoint = (request: Request, params: {id: string}) => request
  .json()
  .then(body => addSafeboxItems({
    safeboxId: params.id,
    token: extractJwtFromHeader(request),
    ...body,
  }))
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });
