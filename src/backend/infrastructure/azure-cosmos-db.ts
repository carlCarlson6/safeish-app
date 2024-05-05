import { env } from "@/env";
import { CosmosClient, } from "@azure/cosmos";

export type CosmosConfig = typeof env.cosmos;

export const getSafeboxContainer = ({endpoint, key, safeishDbName, safeboxContainerName}: CosmosConfig) => () => new CosmosClient({ 
    endpoint: endpoint,
    key:      key
  })
  .database(safeishDbName)
  .container(safeboxContainerName);