import {Response} from 'express'
import {LoginInputModel} from "../types/input/loginInput.model";
import {authServices} from "../services/authServices";
import {LoginSuccessOutputModel} from "../types/output/loginSuccessOutput.model";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
//import cookieParser from "cookie-parser";


export const loginAuthController = async (req: RequestWithBody<LoginInputModel>, res: Response<{accessToken:LoginSuccessOutputModel['accessToken']}>) => {
    const isLogin = await authServices.loginUser(req.body)
    if (isLogin.status === ResultStatus.Unauthorized) return res.sendStatus(HttpStatus.Unauthorized)

    res.cookie("refreshToken",isLogin.data!.refreshToken,{
        httpOnly: true,
        secure: true,
    });
    return res.status(HttpStatus.Success).send({accessToken:isLogin.data!.accessToken})

}