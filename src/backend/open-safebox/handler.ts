import { z } from "zod";
import { GetSafebox, Safebox } from "../Safebox";
import { validateCredentials } from "../auth/basicAuthValidator";
import { generateToken } from "../auth/jwt-token";
import { UpdateSafebox } from "./UpdateSafebox";

const MAX_NUMBER_OPEN_TRIES = 3;

const openSafeboxCommandSchema = z.object({
  safeboxData: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    password: z.string().min(1),
  }),
});

type Dependencies = {
  get:    GetSafebox,
  update: UpdateSafebox
}

export const handler = ({
  get, update
}: Dependencies) => async (
  command: z.infer<typeof openSafeboxCommandSchema>
) => {
  try {
    console.log("opening-safe-box");
    const parsedResult = await openSafeboxCommandSchema.safeParseAsync(command);
    if (!parsedResult.success) {
      return "malformed-data" as const;
    }
    const { safeboxData } = parsedResult.data;
    
    const safebox = await get(safeboxData.id);
    if (!safebox) {
      return "not-found" as const;
    }
    if (safebox.unlocksFailureTries >= MAX_NUMBER_OPEN_TRIES) {
      return "locked" as const;
    }
  
    const areValid = await validateCredentials(safeboxData, safebox);
    return areValid
      ? await handleValidCredentials(safebox.id)
      : handleInvalidCredentials(safebox, update);
  } catch (error) {
    console.error("unknown-error",error)
    return "unknown-error" as const; 
  }
}

const handleValidCredentials = async (safeBoxId: string) => ({
  type: "opened" as const,
  token: await generateToken(safeBoxId),
})

const handleInvalidCredentials = async (safebox: Safebox, updateSafebox: UpdateSafebox) => {
  const safeboxUpdateUnlockTries = { ...safebox, unlocksFailureTries: safebox.unlocksFailureTries+1 };
  await updateSafebox(safeboxUpdateUnlockTries);

  return safebox.unlocksFailureTries >= MAX_NUMBER_OPEN_TRIES 
    ? "locked" as const
    : "invalid-credentials" as const;
}