"use server"

import { alreadyExistsResponse, malformedDataResponse, unknownErrorResponse } from "@/backend/infrastructure/api-errors";
import { checkSafeBoxNameIsUniqueOnCosmos } from "../CheckSafeboxNameUnique";
import { storeNewSafeboxOnCosmos } from "../StoreNewSafebox";
import { handler } from "../handler";
import { match } from "ts-pattern";
import { UUID } from "crypto";

const createSafeBox = handler({
  checkSafeboxNameUnique: checkSafeBoxNameIsUniqueOnCosmos, 
  storeNewSafebox:        storeNewSafeboxOnCosmos,
});

const formatResponse = (result: Awaited<ReturnType<typeof createSafeBox>>) => match(result)
  .with("already-exists",  ()     => alreadyExistsResponse)
  .with("malformed-data",  ()     => malformedDataResponse)
  .with("unknown-error",   ()     => unknownErrorResponse)
  .with({type: "created"}, ({id}) => createdResponse(id))
  .exhaustive();

const createdResponse = (safeboxId: UUID) => Response.json({ 
  id: safeboxId, 
  message: "Safebox correctly created" 
}, { status: 200 });

export const createSafeBoxEndpoint = (request: Request) => request
  .json()
  .then(createSafeBox)
  .then(formatResponse)
  .catch(error => {
    console.log(error);
    return unknownErrorResponse
  });
