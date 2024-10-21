import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingMessage, ServerResponse } from 'http';
import { clearCookie, getCookieValue, setCookie } from "../utils/cookieActions";
import { ACCESS_COOKIE_NAME } from "./jwtCookieNames";

interface GetCookieProps { req: IncomingMessage }
type GetCookieReturnType = string | undefined;
interface SetCookieProps { res: ServerResponse, userId: string | number }


// -- ACCESS TOKEN ------------ //
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'secret_key';
const ACCESS_COOKIE_PROPS = { name: ACCESS_COOKIE_NAME, maxAge:  60 * 15 }
const ACCESS_TOKEN_SECRET_EXPIRES_IN = '1m';

export function getAccessTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
  return getCookieValue({ req, name: ACCESS_COOKIE_PROPS.name  })
}

export function setAccessTokenCookie ({ res, userId }: SetCookieProps) {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { 
    expiresIn: ACCESS_TOKEN_SECRET_EXPIRES_IN 
  });
  setCookie({ res, value: accessToken, cookieName: ACCESS_COOKIE_NAME });
}

export function decodeAccessTokenCookie ({ accessToken }: { accessToken: string }) {
  try {
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (err: unknown) {
    console.error('failed to decode access token: ', err);
    throw err;
  }
}  

export function clearAccessTokenCookie ({ res }: { res: ServerResponse }) {
  clearCookie({ res, cookieName: ACCESS_COOKIE_NAME });
}

// -- REFRESH TOKEN ------------ //
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET || 'refresh_key';
// const REFRESH_COOKIE_PROPS = { name: REFRESH_COOKIE_NAME, maxAge: 60 * 60 * 24 * 7 };
// const REFRESH_TOKEN_SECRET_EXPIRES_IN = '7d';

// export function getRefreshTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
//   return getCookieValue({ req, name: REFRESH_COOKIE_PROPS.name  })
// }

// export function setRefreshTokenCookie ({ res, userId }: SetCookieProps) {
//   const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_SECRET_EXPIRES_IN });
//   setCookie({ res, token: refreshToken, cookieName: REFRESH_COOKIE_NAME });
// }

// export function decodeRefreshTokenCookie ({ refreshToken }: { refreshToken: string }) {
//   try {
//     return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: number, exp: number }  
//   } catch (err: unknown) {
//     console.error('failed to decode access token: ', err);
//     throw err;
//   }
// }