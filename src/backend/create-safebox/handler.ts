import { randomUUID } from "crypto";
import { z } from "zod";
import { CheckSafeboxNameUnique } from "./CheckSafeboxNameUnique";
import { StoreNewSafebox } from "./StoreNewSafebox";
import { hashPassword } from "../auth/encryptPassword";

const createSafeboxCommandSchema = z.object({
  name: z.string().min(5),
  password: z.string().min(8)
}); // TODO - add password shape validation

type HandlerDependencies = {
  checkSafeboxNameUnique: CheckSafeboxNameUnique,
  storeNewSafebox: StoreNewSafebox,
}

export const handler = ({
  checkSafeboxNameUnique, 
  storeNewSafebox,
}: HandlerDependencies) => async (command: z.infer<typeof createSafeboxCommandSchema>) => {
  try {
    const parseResult = await createSafeboxCommandSchema.safeParseAsync(command);
    if(!parseResult.success) {
      return "malformed-data" as const;
    }
  
    const {name, password} = parseResult.data;
    
    const isSafebaxNameUnique = await checkSafeboxNameUnique(name);
    if (!isSafebaxNameUnique) {
      return "already-exists" as const;
    }
  
    const safeboxId = randomUUID();
    const hashedPassword = await hashPassword(password);
    await storeNewSafebox({id: safeboxId, name, hashedPassword, unlocksFailureTries: 0});
    return { type: "created" as const, id: safeboxId };
  } catch (error) {
    console.error("unknown error", error);
    return "unknown-error" as const; 
  }
}

