import {Response} from 'express'
import {LoginInputModel} from "../types/input/loginInput.model";
import {authServices} from "../services/authServices";
import {LoginSuccessOutputModel} from "../types/output/loginSuccessOutput.model";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";


export const loginAuthController = async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessOutputModel>) => {
    const isLogin = await authServices.loginUser(req.body)
    if (isLogin.status === ResultStatus.Unauthorized) return res.sendStatus(HttpStatus.Unauthorized)

    return res.status(HttpStatus.Success).send(isLogin.data!)
}