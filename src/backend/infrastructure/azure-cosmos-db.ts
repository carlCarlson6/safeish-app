import { env } from "@/env";
import { CosmosClient, } from "@azure/cosmos";

const {cosmos: {endpoint, key, safeishDbName, safeboxContainerName}} = env;

export const getSafeboxContainer = () => new CosmosClient({ 
    endpoint: endpoint,
    key:      key
  })
  .database(safeishDbName)
  .container(safeboxContainerName);