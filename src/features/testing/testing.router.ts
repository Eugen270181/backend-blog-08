import {Router} from 'express'
import {clearDBTestingController} from './controllers/clearDBTestingController'
//import {adminMiddleware} from "../../common/middleware/admin-middleware"
export const testingRouter = Router()

//testingRouter.use(adminMiddleware)
testingRouter.delete('/all-data', clearDBTestingController)
