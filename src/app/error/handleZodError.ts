import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => ({
    path: issue.path.join(".") || "body",
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
