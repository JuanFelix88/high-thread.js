/// <reference path="../dependency.ts" />

import { parentPort } from "worker_threads";

interface BindedFunction {
  id: number;
  func: Function;
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
  id
}: UnwrapFunction): void {
  console.log("in thread child ", contents);

  const funcx = new Function(contentsDeclaration + "\n" + textFunction).bind({
    ...(contents || void 0),
    require: require
  })();

  console.log(funcx);

  funcs.push({
    func: funcx,
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

parentPort.on("close", () => {
  process.removeAllListeners();
  process.exit();
});
