import { apiRoutes } from "./apiRoutes";
import { routes } from "./routes";

const PUBLIC_PAGES_ROUTES = [routes.home];

const PUBLIC_API_ROUTES = [apiRoutes.auth.getSession, apiRoutes.emails.test];

const PUBLIC_ROUTES = [...PUBLIC_PAGES_ROUTES, ...PUBLIC_API_ROUTES];

export default PUBLIC_ROUTES;
