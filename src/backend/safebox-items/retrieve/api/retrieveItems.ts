import { getSafeboxFromCosmos } from "@/backend/Safebox";
import { handler } from "../handler";
import { readItemsFromCosmos } from "../ReadItems";

export const retrieveItems = handler({
  getSafebox: getSafeboxFromCosmos,
  readItems:  readItemsFromCosmos,
});