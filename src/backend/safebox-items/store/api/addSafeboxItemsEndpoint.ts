import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { upsertItemsOnCosmos } from "../UpsertItems";
import { NextRequest } from "next/server";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";

const addSafeboxItems = handler({
  getSafebox: getSafeboxFromCosmos,
  upsertItems: upsertItemsOnCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof addSafeboxItems>>) => match(result)
  .with("invalid_credentials",  ()        => invalidBasicAuthResponse)
  .with("invalid_input_data",   ()        => malformedDataResponse)
  .with("malformed-data",       ()        => malformedDataResponse)
  .with("safebox_not_found",    ()        => safeboxNotFoundResponse)
  .with({type: "stored-items"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();

// TODO - check if this works with Request instead NextRequest
export const addSafeboxItemsEndpoint = (request: NextRequest, params: {id: string}) => request
  .json()
  .then(body => addSafeboxItems({
    safebox: {
      id: params.id,
      ...readBasicAuthHeader(request),
    },
    ...body
  }))
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });
