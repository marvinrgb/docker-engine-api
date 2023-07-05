import axios, { AxiosResponse } from 'axios';
import envsToObject from '../helper/envStringsToObject';
import { CustomError } from '../errorClass';
import { Router, Request, Response, NextFunction } from "express";
import { validate } from '../helper/validate';
import * as schemas from '../helper/schemas';
import * as types from '../helper/types';
const router = Router();

router.post('/create', async (req:Request, res:Response, next:NextFunction) => {
  let body:types.CreateContainerProps;
  try {
    body = req.body;
    validate(body, schemas.createContainerProps);
  } catch (error:any) {
    let err = new CustomError(error.msg, "Invalid Payload Data", 400);
    return next(err);
  }

  let requestBody:any = {
    ExposedPorts: {},
    Image: body.image,
    HostConfig: {
      PortBindings: {}
    }
  }

  const ports = body.ports;

  ports.forEach((port) => {
    requestBody.ExposedPorts[`${port.container}/tcp`] = {};
    requestBody.HostConfig.PortBindings[`${port.container}/tcp`] = [{ "HostPort": `${port.host}` }];
  })

  let docker_response;
  try {
    docker_response = await axios.post(
      `http://localhost:2375/containers/create?name=${body.name || `unnamed-${body.image}`}`,
      JSON.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    res.send(docker_response.data);
  } catch (error:any) {
    console.log(error.response)
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500)
    return next(err);    
  }

})



router.get('/:id', async (req:Request, res:Response, next:NextFunction) => {
  const container_id = req.params.id;
  let url:string = `http://localhost:2375/containers/${container_id}/json`;
  let container:any;
  try {
    let response:AxiosResponse = await axios.get(url);
    let c = response.data;

    container = {
      name : c.Name,
      id : c.Id,
      created : c.Created,
      state : c.State,
      imageName : c.Config.Image,
      imageId : c.Image,
      restartCount : c.RestartCount,
      env : envsToObject(c.Config.Env)
    }
      
  
    url = `http://localhost:2375/containers/${container_id}/stats`;
    let response_stats = await axios.get(url, { responseType: "stream"});

    let s:any = {};

    response_stats.data.on('data', (chunk: any) => {
      
      s = JSON.parse(chunk.toString()).memory_stats
      let limit = (s.limit)
      let mem_used = ((s.usage - s.stats.cache + s.stats.active_file))
      s = {
        'memory' : {
          'percentage' : Math.round((mem_used / ( limit / 100)) * 100) / 100,
          'used' : Math.round(mem_used / 8000) / 100,
          'max' : Math.round(limit / 8000) / 100
        }
      }

      let c:any = JSON.parse(chunk.toString())
      let cpuDelta = c.cpu_stats.cpu_usage.total_usage - c.precpu_stats.cpu_usage.total_usage;
      let systemDelta = c.cpu_stats.system_cpu_usage - c.precpu_stats.system_cpu_usage;
      let result = cpuDelta / systemDelta * c.cpu_stats.cpu_usage.percpu_usage.length * 100;
      // console.log(c.precpu_stats)
      s.cpu = {
        'percentage' : result
      }

      container.stats = s;
      response_stats.data.destroy();
      response_stats.data.on('end', () => {});
      res.json(container);
    })
    
  } catch (error:any) {
    let err = new CustomError(error.message, "request to docker engine or processing of response failed. check if the docker engine is running", 500)    
    return next(err);
  }

})

router.post('/start/:id', async (req:Request, res:Response, next:NextFunction) => {
  const container_id = req.params.id;
  let data:any;
  try {
    const url:string = `http://localhost:2375/containers/${container_id}/start`;
    let response:any;
    try {
      response = await axios.post(url);
    } catch (error:any) {
      console.log(error.response.status)
      if (error.response.status === 304) {
        return res.status(400).send('container already running');
      } else if (error.response.status === 404) {
        return res.status(404).send('container not found');
      } else {
        throw new Error(error.message)
      }
    }
    data = response.data;
  } catch (error:any) {
    console.log(error);
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500);
    return next(err);
  }

  res.send(data);
})

router.post('/stop/:id', async (req:Request, res:Response, next:NextFunction) => {
  const container_id = req.params.id;
  let data:any;
  try {
    const url:string = `http://localhost:2375/containers/${container_id}/stop`;
    let response:any;
    try {
      response = await axios.post(url);
    } catch (error:any) {
      console.log(error.response.status)
      if (error.response.status === 304) {
        return res.status(400).send('container not running');
      } else if (error.response.status === 404) {
        return res.status(404).send('container not found');
      } else {
        throw new Error(error.message)
      }
    }
    data = response.data;
  } catch (error:any) {
    console.log(error);
    let err = new CustomError(error.message, "request to docker hub or processing of response failed", 500);
    return next(err);
  }

  res.send(data);
})

export default router;