import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { readItemsFromCosmos } from "../ReadItems";
import { NextRequest } from "next/server";
import { readBasicAuthHeader } from "@/backend/auth/readBasicAuthHeader";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { match } from "ts-pattern";

const retrieveItems = handler({
  getSafebox: getSafeboxFromCosmos,
  readItems:  readItemsFromCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof retrieveItems>>) => match(result)
  .with("invalid_credentials",     ()        => invalidBasicAuthResponse)
  .with("safebox_not_found",       ()        => safeboxNotFoundResponse)
  .with("invalid_input_data",      ()        => malformedDataResponse)
  .with("malformed-data",          ()        => malformedDataResponse)
  .with({type: "retrieved-tiems"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();

// TODO - check if this works with Request instead NextRequest
export const retrieveItemsEndpoint = (request: NextRequest, params: { id: string }) => retrieveItems({safeboxData: {
    id: params.id,
    ...readBasicAuthHeader(request),
  }})
  .then(formatResponse)
  .catch(error => {
    console.error(error);
    return unknownErrorResponse;
  });