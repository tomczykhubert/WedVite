import { routes } from "../routes/routes";
import { authClient } from "./authClient";

type ErrorTypeConfig = {
  message: string;
  fieldName?: string;
};

type ErrorsConfig = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, ErrorTypeConfig>
>;

const errorsConfig = {
  USER_ALREADY_EXISTS: {
    message: "auth.emailAlreadyTaken",
    fieldName: "email",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    message: "auth.invalidEmailOrPassword",
  },
  EMAIL_NOT_VERIFIED: {
    message: "auth.emailNotVerified",
  },
} satisfies ErrorsConfig;

export const getErrorTypeConfig = (code: string): ErrorTypeConfig => {
  if (!(code in errorsConfig)) return { message: "auth.default" };
  return errorsConfig[code as keyof typeof errorsConfig];
};
