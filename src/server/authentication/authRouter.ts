import { authenticatedProcedure, publicProcedure, router } from "../router";
import { registerUserMutation, registerUserSchema } from './registerUserMutation';
import { loginUserMutation, loginUserSchema } from './loginUserMutation';
import { refreshTokenMutation } from "./refreshTokenMutation";
import { clearAuthCookies } from "./jwtCookies";

export const authRouter = router({
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicProcedure
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: authenticatedProcedure 
    .mutation(({ ctx }) => {
      clearAuthCookies({ res: ctx.res });
      return { success: true }
    }),

  validateUser: authenticatedProcedure
    .query(({ ctx }) => {
      console.log('<><><><><><>< ctx', ctx);

      return ({
        isAuthenticated: !!ctx.user,
        user: ctx.user
      });
    }),

  refreshToken: publicProcedure
    .mutation(refreshTokenMutation),

  authCheck: publicProcedure.query(({ ctx }) => {
    return { isAuthenticated: !!ctx.user };
  })
});
