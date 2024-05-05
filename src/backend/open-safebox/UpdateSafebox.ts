import { Safebox } from "../Safebox";
import { CosmosConfig, getSafeboxContainer } from "../infrastructure/azure-cosmos-db";

export type UpdateSafebox = (safebox: Safebox) => Promise<void>;

export const updateSafeboxOnCosmos = (cosmos: CosmosConfig) => async (safebox: Safebox) => {
  await getSafeboxContainer(cosmos)()
    .item(`safebox__${safebox.id}`, "safebox")
    .replace({
      ...safebox,
      id:             `safebox__${safebox.id}`,
      collection:     "safebox",
    });
}