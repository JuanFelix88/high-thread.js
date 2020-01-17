/// <reference path="dependency.ts" />

import { Worker, MessagePort } from "worker_threads";
import { readFileSync } from "fs";
import { resolve } from "path";
import scriptThread from "./template/slave-thread";
import {
  UnwrapFunction,
  MessageForSlaveThread
} from "./template/boilerplate-active-thread";

interface Options {
  initalSleep?: boolean;
}

export interface MessageForParentThread {
  type: "executed-func";
  id: number;
  data: any;
}

type FunctionDeclaration<T, U> = (
  argument?: T,
  callback?: (data: U) => void
) => Promise<U>;

function getTextDeclareContents(contents?: Contents): string {
  const names = Object.keys(contents || {});
  return `const { require, ${names.join(",")} } = this;`;
}

class SlaveThread {
  public worker: Worker;
  public threadId: any;
  private idCount: number;
  /**
   *
   * ## Slave Thread
   * - Create a new `Thread` always activated
   * - For intense CPU usage
   * - Asynchronous
   * - Not recomended for E / S
   *
   * @license {MIT}
   */
  constructor(option?: Options) {
    const code = scriptThread();
    this.worker = new Worker(code, {
      eval: true
    });
    this.threadId = this.worker.threadId;
    this.idCount = 0;
  }

  private getNewId(): number {
    return (this.idCount += 1);
  }

  public useThread<T, U>(
    func: (argument: T) => U,
    contents?: Contents
  ): FunctionDeclaration<T, U> {
    let funcText = func.toString();

    const [param] = funcText
      .match(/^\(*[$\w\s\r,\.]*\)*[\s\r]*=>[\s\r]*{/i)[0]
      .replace(/^\(/, "")
      .replace(/\)*[\s\r]*=>[\s\r]*{$/, "")
      .trim()
      .split(/\s\n*,\s\n*/);

    funcText = funcText
      .replace(/^\(*[$\w\s\r,]*\)*[\s\r]*=>[\s\r]*{/i, "")
      .replace(/}$/, "");

    const id = this.getNewId();

    const unwrapFunction: UnwrapFunction = {
      id,
      contentsDeclaration: getTextDeclareContents(contents),
      textFunction: funcText,
      contents: contents || {},
      params: param ? [param] : void 0
    };

    const msg: MessageForSlaveThread = {
      type: "register-func",
      register: {
        unwrapFunction
      }
    };

    this.worker.postMessage(msg);

    // prettier-ignore
    return (argument?: T, callback?: (data: U) => void) => new Promise(resolve => {
      const msg: MessageForSlaveThread = {
        type: "execute-func",
        executer: {
          id: id,
          argument
        }
      };

      this.worker.postMessage(msg)

      this.worker.on('message', (data: MessageForParentThread) => {
        if (data.type === 'executed-func' && data.id === id) {
          if (callback) callback(data.data)
          resolve(data.data)
        }
      })
    })
  }

  public kill(): void {
    this.worker.terminate();
  }
}

export default SlaveThread;
