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
export const authRouter = Router()

//testingRouter.use(adminMiddleware)
authRouter.post(routersPaths.inAuth.login, loginAuthValidators, loginAuthController)
authRouter.get(routersPaths.inAuth.me, accessTokenMiddleware, getMeController)
authRouter.post(routersPaths.inAuth.registration, registrationAuthValidators, registrationAuthController)
authRouter.post(routersPaths.inAuth.registrationConfirmation, regConfirmAuthValidators, regConfirmAuthController)
authRouter.post(routersPaths.inAuth.registrationEmailResending, emailResendingAuthValidators, emailResendingAuthController)
