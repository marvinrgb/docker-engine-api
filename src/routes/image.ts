import axios, { AxiosResponse } from 'axios';
import { Router, Request, Response, NextFunction } from "express";
import * as types from '../types';
const router = Router();


router.get('/image/check_hub/:image_name', async (req:Request, res:Response) => {
  const image_name = req.params.image_name
  const response:AxiosResponse = await axios.get(`https://registry.hub.docker.com/v1/search?q=${req.params.image_name}&type=image`);
  let data:types.DockerHubSearchResponse = response.data;
  if (data.results.find((v) => v.name === req.params.image_name)) {
    res.status(200).send();
  } else {
    res.status(404).send(data.results);
  }
})


export default router;