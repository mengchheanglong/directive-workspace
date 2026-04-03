import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type TempDirectiveRootInput = {
  prefix: string;
  workspaceDirName?: string;
};

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value;
}

export function withTempDirectiveRoot<T>(
  input: TempDirectiveRootInput,
  run: (directiveRoot: string, tempRoot: string) => T | Promise<T>,
): T | Promise<T> {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), input.prefix));
  const directiveRoot = path.join(tempRoot, input.workspaceDirName ?? "directive-workspace");
  let cleanedUp = false;

  const cleanup = () => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    fs.rmSync(tempRoot, { recursive: true, force: true });
  };

  try {
    fs.mkdirSync(directiveRoot, { recursive: true });
    const result = run(directiveRoot, tempRoot);
    if (isPromiseLike(result)) {
      return result.finally(cleanup);
    }
    cleanup();
    return result;
  } catch (error) {
    cleanup();
    throw error;
  }
}
