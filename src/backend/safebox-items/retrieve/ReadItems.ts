import { getSafeboxContainer } from "@/backend/infrastructure/azure-cosmos-db";

export type ReadItems = (safeboxId: string) => Promise<string[]>;

export const readItemsFromCosmos = async (safeboxId: string) => getSafeboxContainer()
  .item(`items__${safeboxId}`, 'items')
  .read<{ encryptedItems: string[]; }>()
  .then(result => result.resource?.encryptedItems ?? []);