import { Safebox } from "../Safebox";
import { getSafeboxContainer } from "../infrastructure/azure-cosmos-db";

export type UpdateSafebox = (safebox: Safebox) => Promise<void>;

export const updateSafeboxOnCosmos = async (safebox: Safebox) => {
  await getSafeboxContainer()
    .item(`safebox__${safebox.id}`, "safebox")
    .replace(safebox);
}