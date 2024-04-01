import { match } from "ts-pattern";
import { alreadyExistsResponse, malformedDataResponse } from "@/backend/api/errors";
import { UUID } from "crypto";
import { createSafeBox } from "./createSafeBox";

export const formatResponse = (result: Awaited<ReturnType<typeof createSafeBox>>) => match(result)
  .with({type: "created"}, ({id}) => createdResponse(id))
  .with("already-exists",  ()     => alreadyExistsResponse)
  .with("malformed-data",  ()     => malformedDataResponse)
  .exhaustive();

const createdResponse = (safeboxId: UUID) => Response.json({ 
  id: safeboxId, 
  message: "Safebox correctly created" 
}, { status: 200 });