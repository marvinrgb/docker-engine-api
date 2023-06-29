import express, { Application, Request, Response, NextFunction } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import envsToObject from './functions/envStringsToObject';
const app:Application = express();
const PORT:number = 3000


app.get('/container/:id', async (req:Request, res:Response) => {
  const container_id = req.params.id;
  let url:string = `http://localhost:2375/containers/${container_id}/json`;
  let response:AxiosResponse = await axios.get(url);

  const c = response.data;

  let container:any = {
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
})


app.get('/containers', async (req:Request, res:Response) => {
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

app.post('/start/:id', async (req:Request, res:Response) => {
  const url:string = `http://localhost:2375/containers/${req.params.id}/start`;
  const response:AxiosResponse = await axios.post(url);

  const data = response.data;
  res.send(data);
})

app.post('/stop/:id', async (req:Request, res:Response) => {
  const url:string = `http://localhost:2375/containers/${req.params.id}/stop`;
  const response:AxiosResponse = await axios.post(url);

  const data = response.data;
  res.send(data);
})

const config:AxiosRequestConfig = {

}

app.listen(PORT, () => {
  console.log("running");
})