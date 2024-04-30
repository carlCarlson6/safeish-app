import { NextRequest } from "next/server";

// TODO - check if this works with Request instead NextRequest
export const readBasicAuthHeader = (request: NextRequest) => {
  const header = request.headers.get("Authorization");
  console.log(header);
  const encodedAuthHeader = header?.split(" ").at(1);
  if (!encodedAuthHeader) {
    return {
      name: "",
      password: ""
    };
  }

  const auth = Buffer.from(encodedAuthHeader, 'base64').toString().split(':');
  return {
    name: auth.at(0) ?? "",
    password: auth.at(1) ?? "",
  };
};
