// Declare global namespace for Express
import type { JwtPayload } from "jsonwebtoken";

declare global {
  export type MyPayload = JwtPayload & { sub: string; isAdmin: boolean };
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // Extend Express Request with custom properties
      user?: IUser;
      auth?: MyPayload;
      /* ************************************************************************* */
    }
  }
}
