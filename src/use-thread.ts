/// <reference path="dependency.ts" />

type FunctionDeclaration<T, U> = (argument?: T) => U;

function getTextDeclareContents(contents?: Contents): string {
  const names = Object.keys(contents || {});
  return `const {${names.join(",")}} = this;`;
}

function useThread<T, U>(
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

  const funcWrapped = param
    ? new Function(param, getTextDeclareContents(contents) + funcText).bind(
        contents || {}
      )
    : new Function(getTextDeclareContents(contents) + funcText).bind(
        contents || {}
      );

  return (argument?: T) => funcWrapped(argument);
}

export default useThread;
