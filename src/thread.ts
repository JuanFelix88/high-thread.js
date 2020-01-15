/// <reference path="dependency.ts" />

import { Worker } from "worker_threads";
import boilerplate from "./template/boilerplate-thread";

class Thread {
  public contents: ContentParsed[];
  protected func: FuncWrapperThread;
  /**
   *
   * ## Thread
   * - Create a new `Thread`
   * - For intense CPU usage
   * - Asynchronous
   * - Not recomended for E / S
   *
   * @license {MIT}
   */
  constructor(func: FuncWrapperThread, contents?: Contents) {
    this.contents = [];
    this.func = func;
    this.registerContentsDependency(contents);
  }

  private getVariableBinderScript(name: string): string {
    return `const ${name} = asdsfwqsfasfwqwswww.contents.${name}`;
  }

  private getScript(script): GetScript {
    const scriptParsed = `;(${script})(asdsfwqsfasfwqwswww.msg, asdsfwqsfasfwqw)`;

    const contents = this.contents
      .map(content => this.getVariableBinderScript(content.name))
      .join(";");

    return [boilerplate + contents, scriptParsed];
  }

  public use(contents?: Contents): Thread {
    this.registerContentsDependency(contents);
    return this;
  }

  private registerContentsDependency(contents?: Contents): void {
    const names = Object.keys(contents || {});

    names.forEach(name => {
      this.contents.push({
        name,
        value: contents ? contents[name] : null
      });
    });
  }

  public call<U extends any>(callBack?: CallbackWorker, msg?: U) {
    const worker = this.execByMsg(msg);
    const voidFunc = () => {};
    worker.on("message", callBack || voidFunc);
    return worker;
  }

  public execByMsg<U extends any>(msg?: U) {
    const script = this.getScript(this.func.toString()).join("");

    const contents = {};

    this.contents.forEach(content => (contents[content.name] = content.value));

    return new Worker(script, {
      eval: true,
      workerData: {
        msg: msg,
        contents
      }
    });
  }
}

export default Thread;
