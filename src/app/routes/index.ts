import { Router } from "express"
import CourseRoute from '../modules/course/course.routes'
import MilestoneRoute from '../modules/milestone/milestone.routes'











interface ModuleRoute {
    path: string;
    route: Router;
}




export const router = Router()
const moduleRoutes: ModuleRoute[] = [
    // {
    //     path: "/user",
    //     route: UserRoute
    // },
    {
        path: "/course",
        route: CourseRoute
    },
    {
        path: "/milestone",
        route: MilestoneRoute
    },

   
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

