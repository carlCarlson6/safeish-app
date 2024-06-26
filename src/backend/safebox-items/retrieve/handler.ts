import { GetSafebox } from "@/backend/Safebox";
import { z } from "zod";
import { ReadItems } from "./ReadItems";
import { AES, enc } from "crypto-js";
import { validateToken } from "@/backend/auth/jwt-token";

const retrieveItemsQuerySchema = z.object({
  safeboxId: z.string().uuid(),
  token: z.string().min(1),
});

type Dependencies = {
  getSafebox: GetSafebox,
  readItems:  ReadItems,
  encryptionKey: string,
}

export const handler = ({
  getSafebox, readItems, encryptionKey
}: Dependencies) => async (
  query: z.infer<typeof retrieveItemsQuerySchema>
) => {
  console.log("list safebox items")
  try {
    const parsedResult = await retrieveItemsQuerySchema.safeParseAsync(query);
    if (!parsedResult.success) {
      return "malformed-data" as const;
    }
    
    const isValidToken = await validateToken(parsedResult.data.token);
    if (!isValidToken) {
      return "invalid_credentials" as const;
    }
  
    const safebox = await getSafebox(parsedResult.data.safeboxId);
    if (!safebox) {
      return "safebox_not_found" as const;
    }
  
    const encryptedItems = await readItems(safebox.id);
  
    return { 
      type: "retrieved-tiems" as const, 
      items: decryptItems(encryptedItems, encryptionKey) 
    };
  } catch (error) {
    console.error("unknown-error", error);
    return "unknown-error" as const;
  }
}

const decryptItems = (encryptedItems: string[], encryptionKey: string) => encryptedItems.map(encryptedItem => 
  AES.decrypt(encryptedItem, encryptionKey).toString(enc.Utf8)
);
