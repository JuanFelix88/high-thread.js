/// <reference path="dependency.ts" />

/**
 *
 *
 *
 */
type FunctionThread = (argument?: any, callback?: Function) => Promise<any>;

/**
 * Expected function for parallel
 *
 */
type FunctionParallel = (...args: any[]) => Promise<any>;

interface Options {
  resolveWhen?: (data: any) => boolean;
}

/**
 *
 * ### Use Concurrency
 * This function can be used for parallel programming, when called
 * the function waits as soon as the parallelism ends (or rather, depending on the function's option);
 * - Parallel programming;
 * - Resolve chain by function;
 * - Use for Complex algorithms;
 * @param funcs
 * @param options
 *
 * @license MIT
 */
export default function useParallel(
  funcs: FunctionThread[],
  options?: Options
): FunctionParallel {
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
