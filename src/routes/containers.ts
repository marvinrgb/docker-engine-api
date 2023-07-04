import axios, { AxiosResponse } from 'axios';
import { Router, Request, Response, NextFunction } from "express";
const router = Router();


router.get('/containers', async (req:Request, res:Response) => {
  const url:string = "http://localhost:2375/containers/json?all=true";
  const response:AxiosResponse = await axios.get(url);

  const data = response.data;

  let containers:Array<any> = [];

  for (let i = 0; i < data.length; i++) {
    let c = data[i];
    containers.push({
      id : c.Id,
      names : c.ames,
      image : c.Image,
      image_id : c.ImageID,
      created : c.Created,
      state : c.state,
      status : c.Status,
      ports: c.Ports,
    })
  }

  res.json(containers);
})

export default router;