import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse } from "@/backend/api/errors";
import { match } from "ts-pattern";
import { addSafeboxItems } from "./addSafeboxItems";

export const formatResponse = (result: Awaited<ReturnType<typeof addSafeboxItems>>) => match(result)
  .with("invalid_credentials",  ()        => invalidBasicAuthResponse)
  .with("invalid_input_data",   ()        => malformedDataResponse)
  .with("malformed-data",       ()        => malformedDataResponse)
  .with("safebox_not_found",    ()        => safeboxNotFoundResponse)
  .with({type: "stored-items"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();
