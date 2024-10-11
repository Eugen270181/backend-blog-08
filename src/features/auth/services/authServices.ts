import {LoginInputModel} from '../types/input/loginInput.model';
import {hashServices} from '../../../common/adapters/hashServices';
import {usersRepository} from '../../users/repositories/usersRepository';
import {ResultClass} from '../../../common/classes/result.class';
import {ResultStatus} from '../../../common/types/enum/resultStatus';
import {jwtServices} from "../../../common/adapters/jwtServices";
import {IdType} from "../../../common/types/id.type";
import {nodemailerServices} from "../../../common/adapters/nodemailerServices";
import {User} from "../../users/classes/user.class";
import {CreateUserInputModel} from "../../users/types/input/createUserInput.type";
import {WithId} from "mongodb";
import {UserDbModel} from "../../users/types/userDb.model";
import {LoginSuccessOutputModel} from "../types/output/loginSuccessOutput.model";
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import {appConfig} from "../../../common/settings/config";

export const authServices = {
    async loginUser(login:LoginInputModel) {
        const result = new ResultClass<LoginSuccessOutputModel>()
        const {loginOrEmail, password} = login
        const user=await this.checkUserCredentials(loginOrEmail, password)
        //если логин или пароль не верны или не существуют
        if (user.status !== ResultStatus.Success) {
            result.status = ResultStatus.Unauthorized
            result.addError('Wrong credentials','loginOrEmail|password')
            return result
        }
        //если данные для входа валидны, то генеирруем токен для пользователя по его id
        const accessToken = await jwtServices.createToken(user.data!._id.toString(),appConfig.AT_SECRET,appConfig.AT_TIME)
        const refreshToken = await jwtServices.createToken(user.data!._id.toString(),appConfig.RT_SECRET,appConfig.RT_TIME)
        //возвращаем статус успех и сам токен в объекте
        result.status = ResultStatus.Success
        result.data = {accessToken,refreshToken}

        return result
    },
    async registerUser(user:CreateUserInputModel) {
        const {login, password, email} = user
        const result = new ResultClass()

        if (await usersRepository.findUserByLogin(login)) {
            result.addError("not unique field!", "login")
            return result
        }
        if (await usersRepository.findUserByEmail(email)) {
            result.addError("not unique field!", "email")
            return result
        }

        const passwordHash = await hashServices.getHash(password)
        const newUser = new User(login, email, passwordHash);//create user from constructor of User Class, not from admin - usersServices.createUser

        await usersRepository.createUser(newUser);

        nodemailerServices
            .sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode)
            .catch((er) => console.error('error in send email:', er));

        result.status = ResultStatus.Success
        return result
    },
    async checkAccessToken(authHeader: string) {
        const [type, token] = authHeader.split(" ")
        const result = new ResultClass<IdType>()
        const userId = await jwtServices.verifyToken(token)

        if (userId) {
            const user = await usersRepository.getUserById(userId.id)
            if (user) { result.data = userId; result.status = ResultStatus.Success }
        }

        return result
    },
    async checkUserCredentials(loginOrEmail: string, password: string){
        const result = new ResultClass<WithId<UserDbModel>>()
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        // Проверка на наличие пользователя
        if (!user) {
            result.status = ResultStatus.NotFound
            result.addError('User not found','loginOrEmail')
            return result
        }
        // Проверка пароля
        const isPassCorrect = await hashServices.checkHash(password, user.passwordHash);
        if (!isPassCorrect) {
            result.addError('Wrong Password','password')
            return result
        }

        return {
            status: ResultStatus.Success,
            data: user
        }
    },
    async confirmEmail(code: string) {
        const result = new ResultClass()
        const user = await usersRepository.findUserByRegConfirmCode(code)

        if (!user) {
            result.addError('confirmation code is incorrect','code')
            return result
        }
        if (user.emailConfirmation.isConfirmed) {
            result.addError('confirmation code already been applied','code')
            return result
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            result.addError('confirmation code is expired','code')
            return result
        }

        const isUpdateConfirmation = await usersRepository.updateConfirmation(user._id)

        if (!isUpdateConfirmation) {
            result.addError('Something wrong with activate your account, try later','code')
            return result
        }

        result.status = ResultStatus.Success
        return result
    },
    async resendEmail(email:string) {
        const result = new ResultClass()
        const user = await usersRepository.findUserByEmail(email)
        if (!user) {
            result.addError("Users account with this Email not found!", "email")
            return result
        }
        if (user.emailConfirmation.isConfirmed) {
            result.addError('Users account with this email already activated!','email')
            return result
        }
        const newConfirmationCode = randomUUID()
        const newConfirmationDate =add( new Date(), { hours: 1, minutes: 30 } )
        const isUpdateConfirmationCode = await usersRepository.setConfirmationCode(user._id,newConfirmationCode,newConfirmationDate)
        if (!isUpdateConfirmationCode) {
            result.addError('Something wrong with activate your account, try later','email')
            return result
        }
        nodemailerServices
          .sendEmail(email, newConfirmationCode)
          .catch((er) => console.error('error in send email:', er));

        result.status = ResultStatus.Success
        return result
    },
}