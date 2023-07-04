export class CustomError extends Error {
  constructor (msg:string, text:string, httpCode?:number) {
    super(msg);
    this.time = Date.now();
    this.text = text;
    this.httpCode = httpCode || undefined;
  }
  text:string;
  time:number;
  httpCode?:number;
}