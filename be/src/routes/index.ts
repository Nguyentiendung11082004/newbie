import { Express } from "express-serve-static-core"
import StudentRouter from "./students"
import ClassRouter from "./class"
export default function routes(app: Express) {
    app.use('/api/v1/students', StudentRouter)
    app.use('/api/v1/class', ClassRouter)
}