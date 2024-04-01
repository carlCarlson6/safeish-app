import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { upsertItemsOnCosmos } from "../UpsertItems";

export const addSafeboxItems = handler({
  getSafebox: getSafeboxFromCosmos,
  upsertItems: upsertItemsOnCosmos,
});