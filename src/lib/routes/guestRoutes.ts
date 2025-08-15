import { apiRoutes } from "./apiRoutes";
import { routes } from "./routes";

const GUEST_PAGES_ROUTES = [
  routes.auth.signIn,
  routes.auth.signUp,
];

const GUEST_API_ROUTES = [
  apiRoutes.auth.signIn.email,
  apiRoutes.auth.signIn.social,
  apiRoutes.auth.signUp.email,
  apiRoutes.auth.signUp.social,
  apiRoutes.auth.callback.google,
  apiRoutes.auth.verifyEmail
];

const GUEST_ROUTES = [...GUEST_PAGES_ROUTES, ...GUEST_API_ROUTES];

export default GUEST_ROUTES;
