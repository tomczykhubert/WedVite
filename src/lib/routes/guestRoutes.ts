import { apiRoutes } from "./apiRoutes";
import { routes } from "./routes";

const GUEST_PAGES_ROUTES = [
  routes.public,
  routes.auth.signIn,
  routes.auth.signUp,
];

const GUEST_API_ROUTES = [
  apiRoutes.auth.signIn.email,
  apiRoutes.auth.signUp.email,
];

const GUEST_ROUTES = [...GUEST_PAGES_ROUTES, ...GUEST_API_ROUTES];

export default GUEST_ROUTES;
