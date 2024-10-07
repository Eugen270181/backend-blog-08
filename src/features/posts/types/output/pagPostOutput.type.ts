import { PostOutputModel } from './postOutput.type';

export type pagPostOutputModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Array<PostOutputModel>
};
