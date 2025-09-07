import { Router } from "express"
import CourseRoute from "../modules/course/course.routes"
import MilestoneRoute from "../modules/milestone/milestone.routes"
import ModuleRoute from "../modules/module/module.routes"
import  QuizRoutes  from "../modules/quiz/quiz.routes"
import UserProgressRoutes from "../modules/progress/userProgress.routes"
// import UserRoute from "../modules/user/user.routes"

export const router = Router()

interface ModuleRoute {
    path: string;
    route: Router;
}

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
   {
       path: "/module",
       route: ModuleRoute
   },
   {
       path: "/quiz",
       route: QuizRoutes
   },
   {
       path: "/progress",
       route: UserProgressRoutes
   },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

