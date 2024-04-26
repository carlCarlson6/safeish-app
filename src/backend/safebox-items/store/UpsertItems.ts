import { getSafeboxContainer } from "../../infrastructure/azure-cosmos-db";

export type UpsertItems = (data: {safeboxId: string, encryptedItems: string[]}) => Promise<void>;

export const upsertItemsOnCosmos = async (data: {safeboxId: string, encryptedItems: string[]}) => {
  const container = getSafeboxContainer();
  const result = await container.item(`items__${data.safeboxId}`, "items").read<{}>();
  if (!result.resource) {
    await container.items.create({
      encryptedItems: data.encryptedItems,
      collection: "items"
    })
  } else {
    await container.item(`items__${data.safeboxId}`, "items").replace({ // TODO - check to use patch instead of replace
      id: `items__${data.safeboxId}`,
      encryptedItems: data.encryptedItems,
      collection: "items",
    })
  }
};