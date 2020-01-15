interface ResponseThread {
  isMainThread: boolean;
  return: (msg?: any) => void;
}

type FuncWrapperThread = (data: any, res: ResponseThread) => void;

type GetScript = [string, string];

type Contents = {
  [path: string]: any;
};

interface ContentParsed {
  name: string;
  value: any;
}

type CallbackWorker = (message: any) => void;
