import { resolve } from "path";
import { readFileSync } from "fs";

function normalizeStackTrace(stackTrace: string): string {
  const removedAnom = stackTrace.split(/Object\.<anonymous> \(/).join("");
  return removedAnom.substr(0, removedAnom.length - 1);
}

/**
 * @returns This function Return a list of names contents by stack trace
 */
function bindContents(stackTrace: string): string[] {
  if (/Object\.<anonymous>/.test(stackTrace))
    stackTrace = normalizeStackTrace(stackTrace);

  const splitted = stackTrace.split(":");

  const lineAndPosition = splitted.slice(2).map(item => parseInt(item));

  const fileData = readFileSync(
    resolve(splitted.slice(0, 2).join(":")),
    "utf8"
  );

  const lines: string[] = fileData.split("\n");
  let code: string = lines.slice(lineAndPosition[0] - 1).join("\n");

  let amountRemove: number = lineAndPosition[1] - 1;

  for (let i = amountRemove; i < code.length; i++) {
    if (code[i] === "(") break;
    amountRemove++;
  }

  code = code.substr(amountRemove);

  let brakets = 0;
  let closure = 0;
  let funcLength = 0;
  let acountLength: number;
  let braketInitPoint: number;
  let loop = true;
  // implements and get name content bind's
  for (let i = 0; i < code.length; i++) {
    if (!loop) break;
    switch (code[i]) {
      case "[":
        if (funcLength === 0) continue;
        if (brakets === 0) braketInitPoint = i + 1;
        brakets++;
        continue;
      case "]":
        brakets--;
        if (brakets > 0) continue;
        acountLength = i - braketInitPoint;
        loop = false;
        continue;
      case "{":
        closure++;
        continue;
      case "}":
        closure--;
        if (closure > 0) continue;
        funcLength = i;
      default:
        continue;
    }
  }

  code = code.substr(braketInitPoint, acountLength);

  if (/\/\*[.\n\w\s\S]*\*\//gi.test(code))
    code = code.split(/\/\*[.\n\w\s\S]*\*\//gi).join("");

  const names = code.split(/,\s+/);

  // test if none
  if (names[0] === "" || !names) return [];
  return names;
}

export default bindContents;
