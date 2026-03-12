import { Router } from "express"
import CourseRoute from "../modules/course/course.routes"
import MilestoneRoute from "../modules/milestone/milestone.routes"
import LessonRoute from "../modules/lesson/lesson.route"
import UserProgressRoutes from "../modules/progress/progress.route"
import EnrollmentRoutes from "../modules/enrollment/enrollment.route"
import UserRoute from "../modules/auth/auth.route"
import Category from '../modules/category/category.routes'
import OverView from '../modules/overview/overview.routes'
import TestimonialRoutes  from "../modules/testimonial/testimonial.routes"
import Assignment  from "../modules/agt/agt.route"
import Promo  from "../modules/promoCode/promo.routes"
import practiceRoutes   from "../modules/practice/practice.routes"
import MockTestRoute from "../modules/mockTest/mockTest.routes"
import MockTestSectionRoute from "../modules/mockTestSection/mockTestSection.routes"
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
       path: "/promo",
       route: Promo
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
       path: "/practice",
       route: practiceRoutes 
   },
   {
       path: "/mock-test",
       route: MockTestRoute
   },
   {
       path: "/mock-test-section",
       route: MockTestSectionRoute
   }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

