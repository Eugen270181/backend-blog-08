import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {authRouter} from './features/auth/auth.router'
import {usersRouter} from './features/users/users.router'
import {blogsRouter} from './features/blogs/blogs.router'
import {testingRouter} from './features/testing/testing.router'
import {postsRouter} from './features/posts/posts.router'
import {commentsRouter} from "./features/comments/comments.router";
import {routersPaths} from "./common/settings/paths";


export const initApp = () => {
    const app = express() // создать приложение

    app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
    app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк
    app.use(cookieParser()) // создание свойств-объектов cookies во всех реквестах

    app.use(routersPaths.auth, authRouter)
    app.use(routersPaths.users, usersRouter)
    app.use(routersPaths.blogs, blogsRouter)
    app.use(routersPaths.posts, postsRouter)
    app.use(routersPaths.comments, commentsRouter)
    app.use(routersPaths.testing, testingRouter)

    return app
}


