/// <reference path="dependency.ts" />

import { Worker, MessagePort } from "worker_threads";
import { readFileSync } from "fs";
import { resolve } from "path";
import scriptThread from "./template/slave-thread";
import { MessageForSlaveThread } from "./template/boilerplate-active-thread";
import bindContents from "./bind-contents";

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

function getTextDeclareContents(contentsName?: Array<string>): string {
  return `const { require, ${contentsName.join(",")} } = this;`;
}

class SlaveThread {
  public worker: Worker;
  public threadId: any;
  private idCount: number;
  /**
   * ## Slave Thread
   * A construnctor Slave Thread is abstract manner to orchestration a child thread,
   * allowing the reuse handling and thus avoiding the overhead necessary to
   * creating a new thread;
   *
   * - Create a new `Thread` always activated;
   * - For intense CPU usage;
   * - Asynchronous;
   * - Not recomended for E / S;
   *
   *
   * @license MIT
   */
  constructor(public option?: Options) {
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

  /**
   * ### Use Thread
   *
   * Use this method when you need to create a function that will be executed on the child thread;
   * - easy to clone data;
   * - thread `hooked`;
   * - use to spawn thread easely;
   *
   * @name threadSpawn
   *
   * @returns This method create function and execute returning a new Promise;
   *
   * @example
   *  const c = 5;
   *  const result = await useThread((a, b) => (a + b + c), [c]);
   *
   * @decoupled
   * @license MIT
   */
  public threadSpawn = <T, U>(
    func: (argument: T) => U,
    contents: NewContents
  ): Promise<U> => {
    let funcText = `return (${func.toString()})`;

    const stack2: string = new Error().stack.split(/at/g)[2].trim();

    const namesContents = bindContents(stack2);

    const contentsObject = {};

    namesContents.forEach(
      (name, index) => (contentsObject[name] = contents[index])
    );

    const id = this.getNewId();

    const unwrapFunction: UnwrapFunction = {
      id,
      contentsDeclaration: getTextDeclareContents(namesContents),
      textFunction: funcText,
      contents: contentsObject
    };

    const msg: MessageForSlaveThread = {
      type: "register-func",
      register: {
        unwrapFunction
      }
    };

    this.worker.postMessage(msg);

    // prettier-ignore
    return new Promise(resolve => {
      const msg: MessageForSlaveThread = {
        type: "execute-func",
        executer: {
          id: id,
        }
      };

      this.worker.postMessage(msg)

      this.worker.on('message', (data: MessageForParentThread) => {
        if (data.type === 'executed-func' && data.id === id) {
          resolve(data.data)
        }
      })
    })
  };

  /**
   * ### Use Thread
   *
   * Use this method when you need to create a function that will be executed on this child thread;
   * - easy to clone data;
   * - thread `hooked`;
   *
   * @name useThread
   * @returns This function returns a new function that when
   * executed returns a new Promise;
   *
   * @example
   *  const c = 5;
   *  const funAdd = useThread((a, b) => (a + b + c), [c]);
   *  const result = await funcAdd(0,1);
   *
   * @decoupled
   * @license MIT
   */
  public useThread = <T, U>(
    func: (argument: T) => U,
    contents: NewContents
  ): FunctionDeclaration<T, U> => {
    // get text function;
    let funcText = `return (${func.toString()})`;

    const namesContents = bindContents(
      new Error().stack.split(/at/g)[2].trim()
    );

    // Contents
    const contentsObject: object = {};

    namesContents.forEach(
      (name, index) => (contentsObject[name] = contents[index])
    );

    const id = this.getNewId();

    const unwrapFunction: UnwrapFunction = {
      id,
      contentsDeclaration: getTextDeclareContents(namesContents),
      textFunction: funcText,
      contents: contentsObject
    };

    const msg: MessageForSlaveThread = {
      type: "register-func",
      register: {
        unwrapFunction
      }
    };

    this.worker.postMessage(msg);

    return (argument?: T, callback?: (data: U) => void) =>
      new Promise(resolve => {
        const msg: MessageForSlaveThread = {
          type: "execute-func",
          executer: {
            id: id,
            argument
          }
        };

        this.worker.postMessage(msg);

        this.worker.on("message", (data: MessageForParentThread) => {
          if (data.type === "executed-func" && data.id === id) {
            if (callback) callback(data.data);
            resolve(data.data);
          }
        });
      });
  };

  /**
   * ### Kill process
   *
   * This method is responsible for finalizing the generated process;
   *
   * `Important`: After the termination of the process, it is not
   * possible to reinstate the lifespan of the process, that is,
   * the thread cannot be rebuilt, if necessary, then use the method of creating a new thread;
   *
   * @returns This function returns nothing;
   *
   * @decoupled
   * @license MIT
   */
  public kill = (): void => {
    this.worker.terminate();
  };
}

export default SlaveThread;
