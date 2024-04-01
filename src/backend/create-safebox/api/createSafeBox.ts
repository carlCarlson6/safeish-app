import { checkSafeBoxNameIsUniqueOnCosmos } from "../CheckSafeboxNameUnique";
import { storeNewSafeboxOnCosmos } from "../StoreNewSafebox";
import { handler } from "../handler";

export const createSafeBox = handler({
  checkSafeboxNameUnique: checkSafeBoxNameIsUniqueOnCosmos, 
  storeNewSafebox:        storeNewSafeboxOnCosmos,
});