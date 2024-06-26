import { z } from "zod";
import { GetSafebox } from "../Safebox";
import { compare } from "bcrypt";

const validateSafeboxAuthSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  password: z.string().min(1),
});

export const basicAuthValidator = async (get: GetSafebox, inputData: z.infer<typeof validateSafeboxAuthSchema>) => {
  const parseResult = await validateSafeboxAuthSchema.safeParseAsync(inputData);
  if (!parseResult.success) {
    console.log("basicAuthValidator - invalid_input_data")
    return "invalid_input_data" as const;
  }
  const {id, name, password} = parseResult.data;

  const maybeSafebox = await get(id);
  if (!maybeSafebox) {
    return "safebox_not_found" as const;
  }

  const credentialsValidation = await validateCredentials({name, password}, maybeSafebox);
  return credentialsValidation ? "auth_succeed" : "invalid_credentials";
}

export const validateCredentials = async (
  inputCredentials:  {name: string, password: string}, 
  storedCredentials: {name: string, hashedPassword: string}
) => {
  const isSameName = inputCredentials.name === storedCredentials.name;
  const isSamePassword = await validateEncryptedPassword(inputCredentials.password, storedCredentials.hashedPassword);
  return isSameName && isSamePassword;
}

const validateEncryptedPassword = async (inputPassword: string, hashedPassword: string) => compare(inputPassword, hashedPassword);
