import {Response} from 'express'
import {UpdatePostInputModel} from "../types/input/updatePostInput.type";
import {postsServices} from "../services/postsServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndBody} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const putPostController = async (req: RequestWithParamsAndBody<IdType, UpdatePostInputModel>, res: Response) => {
    const postId = req.params.id
    const updateResult = await postsServices.updatePost(req.body,postId)
    if(!updateResult) return res.sendStatus(HttpStatus.NotFound)
    return res.sendStatus(HttpStatus.NoContent)
}