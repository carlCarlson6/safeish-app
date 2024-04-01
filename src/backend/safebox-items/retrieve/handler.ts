import { GetSafebox } from "@/backend/Safebox";
import { basicAuthValidator } from "@/backend/auth/basicAuthValidator";
import { z } from "zod";
import { ReadItems } from "./ReadItems";
import { AES, enc } from "crypto-js";
import { env } from "@/common/env";

const retrieveItemsQuerySchema = z.object({
  safeboxData: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    password: z.string().min(1),
  }),
});

type Dependencies = {
  getSafebox: GetSafebox,
  readItems:  ReadItems,
}

export const handler = ({
  getSafebox, readItems
}: Dependencies) => async (
  query: z.infer<typeof retrieveItemsQuerySchema>
) => {
  const parsedResult = await retrieveItemsQuerySchema.safeParseAsync(query);

  if (!parsedResult.success) {
    return "malformed-data" as const;
  }

  const { safeboxData } = parsedResult.data;
  
  const authResult = await basicAuthValidator(getSafebox, safeboxData);
  if (authResult !== "auth_succeed") {
    return authResult;
  }

  const encryptedItems = await readItems(safeboxData.id);

  return { 
    type: "retrieved-tiems" as const, 
    items: decryptItems(encryptedItems) 
  };
}

const decryptItems = (encryptedItems: string[]) => encryptedItems.map(encryptedItem => 
  AES.decrypt(encryptedItem, env.encryptionKey).toString(enc.Utf8)
);
