import { apiRoutes } from "./apiRoutes";
import { routes } from "./routes";

const PROTECTED_PAGES_ROUTES = [routes.protected];

const PROTECTED_API_ROUTES = [apiRoutes.auth.updateUser];

const PROTECTED_ROUTES = [...PROTECTED_PAGES_ROUTES, ...PROTECTED_API_ROUTES];

export default PROTECTED_ROUTES;
