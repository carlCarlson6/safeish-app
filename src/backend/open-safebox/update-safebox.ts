import { Safebox } from "../Safebox";

export type UpdateSafebox = (safebox: Safebox) => Promise<void>;

export const updateSafeboxOnCosmos = (safebox: Safebox) => {
  return Promise.resolve(); // TODO - update safebox
}