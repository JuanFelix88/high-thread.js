/// <reference path="dependency.ts" />

type FunctionThread = (argument?: any, callback?: Function) => Promise<any>;

type FunctionConcurrency = (...args: any[]) => Promise<any>;

interface Options {
  resolveWhen?: (data: any) => boolean;
}

export default function useConcurrency(
  funcs: FunctionThread[],
  options?: Options
): FunctionConcurrency {
  let amount = funcs.length;

  const testResolveCallback = options
    ? options.resolveWhen
      ? options.resolveWhen
      : () => false
    : () => false;

  let results = [...Array(amount)];

  return (...args: any[]) =>
    new Promise(resolve => {
      const callbackGenenerator = index => {
        return data => {
          amount--;
          results[index] = data;
          if (amount === 0 || testResolveCallback(data)) resolve(results);
        };
      };
      funcs.forEach((func, i) => func(args[i], callbackGenenerator(i)));
    });
}
