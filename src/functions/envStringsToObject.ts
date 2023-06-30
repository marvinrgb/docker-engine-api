export default function envsToObject(envStrings:Array<string>) {
  let array:Array<any> = [];
  envStrings.forEach((envstring:string) => {
    let index:number = envstring.indexOf('=');
    array.push([envstring.slice(0, index), envstring.slice(index + 1, envstring.length)])
  })
  return array;
}