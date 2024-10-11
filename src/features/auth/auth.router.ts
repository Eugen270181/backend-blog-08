import {Router} from 'express'
import {loginAuthController} from "./controllers/loginAuthController";
import {loginAuthValidators} from "./middlewares/loginAuthValidators";
import {getMeController} from "./controllers/getMeController";
import {accessTokenMiddleware} from "../../common/middleware/accessTokenMiddleware";
import {registrationAuthValidators} from "./middlewares/registrationAuthValidators";
import {routersPaths} from "../../common/settings/paths";
import {registrationAuthController} from "./controllers/registrationAuthController";
import {regConfirmAuthController} from "./controllers/regConfirmAuthController";
import {regConfirmAuthValidators} from "./middlewares/regConfirmAuthValidators";
import {emailResendingAuthValidators} from "./middlewares/regEmailResendingValidators";
import {emailResendingAuthController} from "./controllers/emailResendingAuthController";
import {logoutAuthController} from "./controllers/logoutAuthController";
export const authRouter = Router()

//testingRouter.use(adminMiddleware)
//login(reqirements - Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)
authRouter.post(routersPaths.inAuth.login, loginAuthValidators, loginAuthController)
authRouter.get(routersPaths.inAuth.me, accessTokenMiddleware, getMeController)
authRouter.post(routersPaths.inAuth.registration, registrationAuthValidators, registrationAuthController)
authRouter.post(routersPaths.inAuth.registrationConfirmation, regConfirmAuthValidators, regConfirmAuthController)
authRouter.post(routersPaths.inAuth.registrationEmailResending, emailResendingAuthValidators, emailResendingAuthController)
//logout(reqirements - In cookie client must send correct refreshToken that will be revoked.)
authRouter.post(routersPaths.inAuth.logout, refreshTokenMiddleware, logoutAuthController)
//refresh-token(reqirements - Generate a new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)
authRouter.post(routersPaths.inAuth.refreshToken, refreshTokenMiddleware, refreshTokenAuthController)

