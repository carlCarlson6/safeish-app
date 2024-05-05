import { z } from "zod"
import { GetSafebox } from "../../Safebox";
import { UpsertItems } from "./UpsertItems";
import { AES } from "crypto-js";
import { env } from "@/env";
import { validateToken } from "@/backend/auth/jwt-token";

const addItemsCommandSchema = z.object({
  safeboxId: z.string().uuid(),
  token: z.string().min(1),
  items: z.array(z.string()),
});

type Dependencies = {
  getSafebox: GetSafebox,
  upsertItems: UpsertItems,
  encryptionKey: string
}

export const handler = ({
  getSafebox, upsertItems, encryptionKey
}: Dependencies) => async (
  command: z.infer<typeof addItemsCommandSchema>
) => {
  console.log("updating-safebox-items");
  try {
    const parsedResult = await addItemsCommandSchema.safeParseAsync(command);
    if (!parsedResult.success) {
      return "malformed-data" as const;
    }
    const { safeboxId, items, token } = parsedResult.data;
  
    const isValidToken = await validateToken(token);
    console.log(isValidToken);
    if (!isValidToken) {
      return "invalid_credentials" as const;
    }
  
    const safebox = await getSafebox(safeboxId);
    if (!safebox) {
      return "safebox_not_found" as const;
    }
    
    await upsertItems({
      safeboxId,
      encryptedItems: encryptItems(items, encryptionKey)
    });
  
    return { type: "stored-items" as const, items };
  } catch (error) {
    console.error(error);
    return "unknown-error" as const;
  }
}

const encryptItems = (items: string[], encryptionKey: string) => items.map(item => 
  AES.encrypt(item, env.encryptionKey).toString()
);

