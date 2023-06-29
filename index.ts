import express, { Express, NextFunction, Request, Response } from 'express';
import "./src/dbs/initDb";
import router from './src/routers/index.router';

require('dotenv').config();

const app: Express = express();
const port = process.env.PORT || 2000;

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/v1/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});


app.use((req: Request, res: Response, next: NextFunction) => {
    const error : any = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message
    })
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});