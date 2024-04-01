import { getSafeboxContainer } from "../infrastructure/azure-cosmos-db";

export type CheckSafeboxNameUnique = (safeboxName: string) => Promise<boolean>;

export const checkSafeBoxNameIsUniqueOnCosmos = async (safeboxName: string) => getSafeboxContainer().items
  .query<{}>({
    query: "select * from c where c.name = @safeboxName",
    parameters: [{ name: "@safeboxName", value: safeboxName, }]
  }, {
    partitionKey: "safebox"
  })
  .fetchAll()
  .then(result => result.resources.length === 0);