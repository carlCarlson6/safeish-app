import { z } from "zod";

export const env = z.object({
  cosmos: z.object({
    endpoint:             z.string().min(1),
    key:                  z.string().min(1),
    safeishDbName:        z.string().min(1),
    safeboxContainerName: z.string().min(1),
  }),
  encryptionKey: z.string().min(1),
}).parse({
  cosmos: {
    endpoint:             process.env.COSMOS_ENDPOINT,
    key:                  process.env.COSMOS_KEY,
    safeishDbName:        process.env.COSMOS_SAFEISH_DB,
    safeboxContainerName: process.env.COSMOS_SAFEBOX_CONTAINER,
  },
  encryptionKey: process.env.ENCRYPTION_KEY,
})