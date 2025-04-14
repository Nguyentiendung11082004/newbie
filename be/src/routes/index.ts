import { Express } from "express-serve-static-core"
import StudentRouter from "./students"
import ClassRouter from "./class"
import AuthRouter from "./auth"
export default function routes(app: Express) {
    app.use('/api/v1/students', StudentRouter)
    app.use('/api/v1/class', ClassRouter)
    app.use('/api/v1/auth', AuthRouter)
}