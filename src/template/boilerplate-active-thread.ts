import { parentPort } from "worker_threads";

interface BindedFunction {
  id: number;
  func: Function;
}

export interface UnwrapFunction {
  params?: string[];
  contentsDeclaration: string;
  contents?: {
    [path: string]: any;
  };
  textFunction: string;
  id: number;
}

interface ExecuterFunction {
  argument?: any;
  id: number;
}

export interface MessageForSlaveThread {
  type: "register-func" | "execute-func";
  executer?: ExecuterFunction;
  register?: {
    unwrapFunction: UnwrapFunction;
  };
}

let funcs: BindedFunction[] = [];

/**
 * **Register New Function**
 * - This function register a new function in actuall thread and turn it available for use
 */
function registerNewFunction({
  contentsDeclaration,
  textFunction,
  contents,
  params,
  id
}: UnwrapFunction): void {
  const param = params ? params[0] : void 0;

  const funcWrapped = param
    ? new Function(param, contentsDeclaration + textFunction).bind({
        ...(contents || void 0),
        require: require
      })
    : new Function(contentsDeclaration + textFunction).bind({
        ...(contents || void 0),
        require: require
      });

  funcs.push({
    func: funcWrapped,
    id
  });
}

async function executeFunction(executer: ExecuterFunction) {
  const { func, id } = funcs.find(({ id }) => id === executer.id);
  parentPort.postMessage({
    type: "executed-func",
    id,
    data: await func(executer.argument || void 0)
  });
}

parentPort.on("message", (data: MessageForSlaveThread) => {
  if (data.type === "register-func")
    return registerNewFunction(data.register.unwrapFunction);
  if (data.type === "execute-func") executeFunction(data.executer);
});
