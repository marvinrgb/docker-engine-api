import express, { Application, Request, Response, NextFunction } from 'express';
import * as types from './types';
const app:Application = express();
const PORT:number = 3000

import container from './routes/container';
import containers from './routes/containers';
import image from './routes/image';

app.use('/container', container);
app.use('/containers', containers);
app.use('/image', image);








app.listen(PORT, () => {
  console.log("running");
})