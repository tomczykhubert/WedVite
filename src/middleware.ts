import { stackMiddlewares } from "./middlewares/stackMiddleware";
import { withAuthentication } from "./middlewares/withAuthentication";
import { withLocale } from "./middlewares/withLocale";

const middlewares = [withLocale, withAuthentication];
export default stackMiddlewares(middlewares);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon.svg|images/).*)",
  ],
};
