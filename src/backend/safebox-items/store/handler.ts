import { z } from "zod"
import { GetSafebox } from "../../Safebox";
import { basicAuthValidator } from "../../auth/basicAuthValidator";
import { UpsertItems } from "./UpsertItems";
import {AES} from "crypto-js";
import { env } from "@/common/env";

const addItemsCommandSchema = z.object({
  safebox: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    password: z.string().min(1),
  }),
  items: z.array(z.string())
});

type Dependencies = {
  getSafebox: GetSafebox,
  upsertItems: UpsertItems,
}

export const handler = ({
  getSafebox, upsertItems
}: Dependencies) => async (
  command: z.infer<typeof addItemsCommandSchema>
) => {
  const parsedResult = await addItemsCommandSchema.safeParseAsync(command);

  if (!parsedResult.success) {
    return "malformed-data" as const;
  }

  const { safebox, items } = parsedResult.data;
  
  const authResult = await basicAuthValidator(getSafebox, safebox);
  if (authResult !== "auth_succeed") {
    return authResult;
  }

  await upsertItems({
    safeboxId: safebox.id.replace("safebox__", ""), 
    encryptedItems: encryptItems(items)
  });

  return { type: "stored-items" as const, items };
}

const encryptItems = (items: string[]) => items.map(item => 
  AES.encrypt(item, env.encryptionKey).toString()
);

