import { match } from "ts-pattern";
import { retrieveItems } from "./retrieveItems";
import { invalidBasicAuthResponse, malformedDataResponse, safeboxNotFoundResponse } from "@/backend/api/errors";

export const formatResponse = (result: Awaited<ReturnType<typeof retrieveItems>>) => match(result)
  .with("invalid_credentials",     ()        => invalidBasicAuthResponse)
  .with("safebox_not_found",       ()        => safeboxNotFoundResponse)
  .with("invalid_input_data",      ()        => malformedDataResponse)
  .with("malformed-data",          ()        => malformedDataResponse)
  .with({type: "retrieved-tiems"}, ({items}) => Response.json({items}, {status: 200}))
  .exhaustive();