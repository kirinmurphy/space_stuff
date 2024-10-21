import jwt from "jsonwebtoken";
import { IncomingMessage, ServerResponse } from 'http';
import { clearAuthCookie, getCookieValue, setAuthCookie } from "./cookieActions";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./jwtCookieNames";

interface GetCookieProps { req: IncomingMessage }
type GetCookieReturnType = string | undefined;
interface SetCookieProps { res: ServerResponse, userId: string | number }


// -- ACCESS TOKEN ------------ //
export const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'secret_key';
export const ACCESS_COOKIE_PROPS = { name: ACCESS_COOKIE_NAME, maxAge:  60 * 15 }
export const ACCESS_TOKEN_SECRET_EXPIRES_IN = '1m';

export function getAccessTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
  console.log('GETTING COOKIEEEEE');
  return getCookieValue({ req, name: ACCESS_COOKIE_PROPS.name  })
}

export function setAccessTokenCookie ({ res, userId }: SetCookieProps) {
  console.log('SETTING COOOOOOKIE');
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_SECRET_EXPIRES_IN });
  setAuthCookie({ res, token: accessToken, ...ACCESS_COOKIE_PROPS  });
}

export function decodeAccessTokenCookie ({ accessToken }: { accessToken: string }) {
  try {
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: number }  
  } catch (err: unknown) {
    console.error('failed to decode access token: ', err);
    throw err;
  }
}  

// -- REFRESH TOKEN ------------ //
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET || 'refresh_key';
export const REFRESH_COOKIE_PROPS = { name: REFRESH_COOKIE_NAME, maxAge: 60 * 60 * 24 * 7 };
const REFRESH_TOKEN_SECRET_EXPIRES_IN = '7d';

export function getRefreshTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
  return getCookieValue({ req, name: REFRESH_COOKIE_PROPS.name  })
}

export function setRefreshTokenCookie ({ res, userId }: SetCookieProps) {
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_SECRET_EXPIRES_IN });
  setAuthCookie({ res, token: refreshToken, ...REFRESH_COOKIE_PROPS  });
}

export function decodeRefreshTokenCookie ({ refreshToken }: { refreshToken: string }) {
  try {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: number, exp: number }  
  } catch (err: unknown) {
    console.error('failed to decode access token: ', err);
    throw err;
  }
}


// -- CLEAR ALL ------------ //
export function clearAuthCookies ({ res, req }: { res: ServerResponse, req: IncomingMessage }) {
  clearAuthCookie({ res, req, cookieName: ACCESS_COOKIE_PROPS.name });
  clearAuthCookie({ res, req, cookieName: REFRESH_COOKIE_PROPS.name });  
}

