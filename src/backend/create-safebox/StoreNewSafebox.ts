import { CosmosConfig, getSafeboxContainer } from "../infrastructure/azure-cosmos-db";
import { Safebox } from "../Safebox";

export type StoreNewSafebox = (safeboxData: Safebox) => Promise<void>;

export const storeNewSafeboxOnCosmos = (cosmos: CosmosConfig) => (data: Safebox) => getSafeboxContainer(cosmos)()
  .items.create({
    ...data,
    id:             `safebox__${data.id}`,
    collection:     "safebox",
  })
  .then(_ => { return; })

