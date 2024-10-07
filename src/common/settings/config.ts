import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env
export const appConfig = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    //ADMIN: process.env.ADMIN || 'admin:qwerty',
    MONGO_URL:process.env.MONGO_URL as string,
    DB_NAME:process.env.DB_NAME as string || 'BlogsPosts',
    BLOG_COLLECTION_NAME:process.env.BLOG_COLLECTION_NAME || 'Blogs',
    POST_COLLECTION_NAME:process.env.POST_COLLECTION_NAME || 'Posts',
    USER_COLLECTION_NAME:process.env.USERS_COLLECTION_NAME || 'Users',
    COMMENT_COLLECTION_NAME:process.env.COMMENT_COLLECTION_NAME || 'Comments',

    AT_SECRET:process.env.DB_NAME as string || 'f1f5deg4hy5fr5d5g',
    AT_TIME: process.env.AT_TIME as string || '1h',
    RT_SECRET: process.env.RT_SECRET as string,
    DB_TYPE: process.env.DB_TYPE as string,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
}
//console.log(process.env.MONGO_URL)
// console.log(process.env.ADMIN)