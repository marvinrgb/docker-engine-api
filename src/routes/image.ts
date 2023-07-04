import axios, { AxiosResponse } from 'axios';
import { Router, Request, Response, NextFunction } from "express";
import * as types from '../helper/types';
import { CustomError } from '../errorClass';
const router = Router();


router.get('/check_hub/:image_name', async (req:Request, res:Response, next:NextFunction) => {
  let image_name:string = '';
  
  image_name = req.params.image_name;

  try {
    const response:AxiosResponse = await axios.get(`https://registry.hub.docker.com/v1/search?q=${req.params.image_name}&type=image`);
    let data:types.DockerHubSearchResponse = response.data;
    if (data.results.find((v) => v.name === req.params.image_name)) {
      res.status(200).send();
    } else {
      res.status(404).send(data.results);
    }
  } catch (error:any) {
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500)
    return next(err);
  }
})


export default router;