import { unknownErrorResponse } from "@/backend/api/errors";
import { createSafeBox } from "@/backend/create-safebox/api/createSafeBox";
import { formatResponse } from "@/backend/create-safebox/api/formatResponse";

export async function POST(request: Request) {
  return request
    .json()
    .then(createSafeBox)
    .then(formatResponse)
    .catch(error => {
      console.log(error);
      return unknownErrorResponse
    });
}
