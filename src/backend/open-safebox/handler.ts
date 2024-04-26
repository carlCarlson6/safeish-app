import { z } from "zod";
import { GetSafebox, Safebox } from "../Safebox";
import { validateCredentials } from "../auth/basicAuthValidator";

const openSafeboxCommandSchema = z.object({
  safeboxData: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    password: z.string().min(1),
  }),
})

type Dependencies = {
  getSafebox: GetSafebox
};

export const handler = ({
  getSafebox
}: Dependencies) => async (
  command: z.infer<typeof openSafeboxCommandSchema>
) => {
  const parsedResult = await openSafeboxCommandSchema.safeParseAsync(command);
  if (!parsedResult.success) {
    return "malformed-data" as const;
  }
  const { safeboxData } = parsedResult.data;
  
  const safebox = await getSafebox(safeboxData.id);
  if (!safebox) {
    return "not-found" as const;
  }
  if (safebox.unlocksFailureTries >= 3) {
    return "locked" as const;
  }

  const areValid = await validateCredentials(safeboxData, safebox);
  return areValid
    ? handleValidCredentials(safebox.id)
    : handleInvalidCredentials(safebox);
}

const handleValidCredentials = (safeBoxId: string) => {
  return {
    type: "opened" as const,
    token: "some-token" // TODO - generate token
  }
}

const handleInvalidCredentials = (safebox: Safebox) => {
  const safeboxUpdateUnlockTries = { ...safebox, unlocksFailureTries: safebox.unlocksFailureTries+1 };
  // TODO - update safebox on db

  return safebox.unlocksFailureTries >= 3 
    ? "locked" as const
    : "invalid-credentials" as const;
}