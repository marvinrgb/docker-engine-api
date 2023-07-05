import axios, { AxiosResponse } from 'axios';
import { CustomError } from '../errorClass';
import { Router, Request, Response, NextFunction } from "express";
const router = Router();


router.get('/containers', async (req:Request, res:Response, next:NextFunction) => {
  try {
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
  } catch (error:any) {
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500)
    return next(err);
  }
})

export default router;