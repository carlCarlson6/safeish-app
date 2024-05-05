import { CosmosConfig, getSafeboxContainer } from "@/backend/infrastructure/azure-cosmos-db";

export type ReadItems = (safeboxId: string) => Promise<string[]>;

export const readItemsFromCosmos = (cosmos: CosmosConfig) => async (safeboxId: string) => getSafeboxContainer(cosmos)()
  .item(`items__${safeboxId}`, 'items')
  .read<{ encryptedItems: string[]; }>()
  .then(result => result.resource?.encryptedItems ?? []);