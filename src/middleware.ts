import { stackMiddlewares } from "./middlewares/stackMiddleware";
import { withAuthentication } from "./middlewares/withAuthentication";
import { withHeaders } from "./middlewares/withHeaders";
import { withLocale } from "./middlewares/withLocale";

const middlewares = [withAuthentication, withHeaders, withLocale];
export default stackMiddlewares(middlewares);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon.svg|images/|api/trpc/).*)",
  ],
};
