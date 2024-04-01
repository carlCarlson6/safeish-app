export const alreadyExistsResponse = Response.json({
  error:   "ALREADY_EXISTS",
  message: "Safebox already exists" 
}, { 
  status: 409 
});

export const malformedDataResponse = Response.json({
  error:   "INVALID_DATA",
  message: "Malformed expected data" 
}, { 
  status: 422 
});

export const unknownErrorResponse = Response.json({
  error:   "API_ERROR",
  message: "Unexpected API error" 
}, { 
  status: 500 
});

export const safeboxNotFoundResponse = Response.json({
  error: "SAFEBOX_NOT_FOUND",
  message: "Requested safebox does not exist"
}, { 
  status: 404
});

export const invalidBasicAuthResponse = Response.json({
  error: "INVALID_AUTH",
  message: "Specified Basic Auth does not match"
}, { 
  status: 404
});