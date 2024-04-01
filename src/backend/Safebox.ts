import { getSafeboxContainer } from "./infrastructure/azure-cosmos-db";

export type Safebox = {
  id: string; 
  name: string; 
  hashedPassword: string;
}

export type GetSafebox = (id: string) => Promise<Safebox|null>;

export const getSafeboxFromCosmos = async (id: string) => {
  const safeboxContainer = getSafeboxContainer();
  const result = await safeboxContainer.item(`safebox__${id}`, "safebox").read<Safebox>();
  return result.resource ?? null;
}