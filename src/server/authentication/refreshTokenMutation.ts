import { TRPCError } from "@trpc/server";
import { ContextType } from "./types";
// import { getRefreshTokenCookie } from "./jwtCookies";

export async function refreshTokenMutation ({ ctx }: { ctx: ContextType }) {
  console.log('ctx', ctx);
  // const refreshToken = getRefreshTokenCookie({ req: ctx.req });

  // if (!refreshToken ) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No refresh token' });
  // }

  try {
    // const decoded = decodeRefreshTokenCookie({ refreshToken });
    
    // // check revoked/blacklisted token

    // const NOW = Math.floor(Date.now() / 1000);
    // const notExpiredYet = decoded.exp - NOW < 3600;
    
    // if ( notExpiredYet ) {
    //   setRefreshTokenCookie({ res: ctx.res, userId: decoded.userId });
    // }
    // setAccessTokenCookie({ res: ctx.res, userId: decoded.userId });

    return {
      success: true, 
      message: 'Token refreshed successfully'
    };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid/expired refresh token' });
  }
}
