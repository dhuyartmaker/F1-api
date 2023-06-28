import express, { Express, Request, Response } from 'express';
import "./src/dbs/initDb";

require('dotenv').config();

const app: Express = express();
const port = process.env.PORT || 2000;
console.log(port)
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});