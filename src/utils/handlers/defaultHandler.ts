export default function defaultHandler(
  proxy: any,
  target: any,
  key: any,
  ...args: any[]
) {
  const result = target[key](...args);
  return result === target ? proxy : result;
}
