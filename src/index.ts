import express, { Application, Request, Response } from 'express';
import { CustomError } from './errorClass'
const app:Application = express();
const PORT:number = 3000

import container from './routes/container';
import containers from './routes/containers';
import image from './routes/image';
import images from './routes/images';

app.use(express.json())

app.use('/container', container);
app.use('/containers', containers);
app.use('/image', image);
app.use('/images', images);





app.use((err:any, req:Request, res:Response) => {
  if (!(err instanceof CustomError)) {
    err.time = Date.now();
    console.log(err);
    res.status(500).send('unknown exception occured');
  } else {
    console.log(err);
    res.status(err.httpCode || 500).send(err.text);
  }
})


app.listen(PORT, () => {
  console.log("running");
})