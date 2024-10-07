import {CommentOutputModel} from "./commentOutput.type";

export type pagCommentOutputModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Array<CommentOutputModel>
};
