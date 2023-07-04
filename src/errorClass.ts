export default class CustomError extends Error {
  constructor (msg:string, httpCode?:number) {
    super(msg);
    this.time = Date.now();
    this.httpCode = httpCode || undefined;
  }
  time:number;
  httpCode?:number;
}