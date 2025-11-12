import { Router } from "express"
import CourseRoute from "../modules/course/course.routes"
import MilestoneRoute from "../modules/milestone/milestone.routes"
import LessonRoute from "../modules/lesson/lesson.route"
import UserProgressRoutes from "../modules/progress/progress.route"
import EnrollmentRoutes from "../modules/enrollment/enrollment.route"
import UserRoute from "../modules/auth/auth.route"
import AppConfig from "../modules/appSetting/appConfig.routes"
import Category from '../modules/category/category.routes'
import OverView from '../modules/overview/overview.routes'
import TestimonialRoutes  from "../modules/testimonial/testimonial.routes"
import Assignment  from "../modules/agt/agt.route"
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
    {
        path: "/course",
        route: CourseRoute
    },

   {
       path: "/milestone",
       route: MilestoneRoute
   },
   {
       path: "/lesson",
       route: LessonRoute
   },
   {
       path: "/progress",
       route: UserProgressRoutes
   },
   {
       path: "/enrolment",
       route: EnrollmentRoutes
   },
   {
       path: "/category",
       route: Category
   },
   {
       path: "/assignment",
       route: Assignment
   },
   {
       path: "/testimonial",
       route: TestimonialRoutes
   },
   {
       path: "/overview",
       route: OverView
   },
   {
       path: "/app-config",
       route: AppConfig
   },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

