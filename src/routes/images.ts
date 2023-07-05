import axios, { AxiosResponse } from 'axios';
import { CustomError } from '../errorClass';
import { Router, Request, Response, NextFunction } from "express";
const router = Router();


router.get('/', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const url:string = "http://localhost:2375/images/json";
    const response:AxiosResponse = await axios.get(url);
  
    const data = response.data;
  
    let images:Array<any> = [];
  
    for (let i = 0; i < data.length; i++) {
      let image = data[i];
      let image_data = {
        id : image.Id,
        created : image.Created,
        size : image.Size,
        name : image.RepoTags[0].slice(0, image.RepoTags[0].indexOf(":")),
        tag : image.RepoTags[0].slice(image.RepoTags[0].indexOf(":") + 1)
      }

      images.push(image_data);
    }
  
    res.json(images);
  } catch (error:any) {
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500)
    return next(err);
  }
})

export default router;