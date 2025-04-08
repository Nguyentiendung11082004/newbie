import { Request, Response } from "express"
import { Express } from "express-serve-static-core"
export default function routes(app: Express) {
    app.use('/', (req: Request, res: Response) => {
       console.log('Hello world');
       res.send('Hello from server')
    })
}