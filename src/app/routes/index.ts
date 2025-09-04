import { Router } from "express"
import  UserRoute  from "../modules/auth/auth.route"


export const router = Router()

interface ModuleRoute {
    path: string;
    route: Router;
}

const moduleRoutes: ModuleRoute[] = [
    {
        path: "/user",
        route: UserRoute
    },

   
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

