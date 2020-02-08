interface ResponseThread {
  isMainThread: boolean;
  return: (msg?: any) => void;
}

type FuncWrapperThread = (data: any, res: ResponseThread) => void;

type GetScript = [string, string];

type Contents = {
  [path: string]: any;
};

type NewContents = Array<any>;

declare interface UnwrapFunction {
  contentsDeclaration: string;
  contents?: {
    [path: string]: any;
  };
  textFunction: string;
  id: number;
}

interface ContentParsed {
  name: string;
  value: any;
}

type CallbackWorker = (message: any) => void;
