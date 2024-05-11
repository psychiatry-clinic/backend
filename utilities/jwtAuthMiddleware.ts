import jwt, { JwtPayload } from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY || "alnoorimustafa";

const jwtAuthMiddleware = (ctx: any, next: any) => {
  // Check if the request contains the API token in the headers
  const token = ctx.headers.authorization;
  const user_id = +ctx.params.user_id;

  if (token && user_id) {
    try {
      // Verify the JWT with the provided secret key
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        secretKey
      ) as JwtPayload;

      if (decoded.id !== user_id) {
        ctx.status = 401;
        return;
      }
      // Set the authenticated user data in the request context
      ctx.state.user = decoded;
      // Proceed to the next middleware
      return next();
    } catch (err) {
      // Invalid token, send a 401 Unauthorized response
      ctx.status = 401;
      return;
    }
  } else {
    // API token is invalid or missing, send a 401 Unauthorized response
    ctx.status = 401;
  }
};

export default jwtAuthMiddleware;
