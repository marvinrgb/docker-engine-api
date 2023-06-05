export default function envsToObject(envStrings:Array<string>) {
  let object:any = {};
  envStrings.forEach((envstring:string) => {
    let index:number = envstring.indexOf('=');
    object[envstring.slice(0, index)] = envstring.slice(index + 1, envstring.length);
  })
  return object;
}