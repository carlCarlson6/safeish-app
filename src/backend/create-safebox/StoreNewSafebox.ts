import { getSafeboxContainer } from "../infrastructure/azure-cosmos-db";
import { Safebox } from "../Safebox";

export type StoreNewSafebox = (safeboxData: Safebox) => Promise<void>;

export const storeNewSafeboxOnCosmos: StoreNewSafebox = (data) => getSafeboxContainer()
  .items.create({
    id:             `safebox__${data.id}`,
    name:           data.name,
    hashedPassword: data.hashedPassword,
    collection:     "safebox",
  })
  .then(_ => { return; })

