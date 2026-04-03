import assert from "node:assert/strict";

import {
  startDirectiveFrontendServer,
  type DirectiveFrontendServerHandle,
} from "../hosts/web-host/server.ts";
import { ensureDirectiveFrontendBuild } from "./ensure-frontend-build.ts";

export async function startDirectiveFrontendCheckServer(input: {
  directiveRoot: string;
  frontendBuildDirectiveRoot?: string;
  host?: string;
  port?: number;
}) {
  ensureDirectiveFrontendBuild({
    directiveRoot: input.frontendBuildDirectiveRoot ?? input.directiveRoot,
  });
  return startDirectiveFrontendServer({
    directiveRoot: input.directiveRoot,
    host: input.host ?? "127.0.0.1",
    port: input.port ?? 0,
  });
}

export async function withDirectiveFrontendCheckServer<T>(
  input: {
    directiveRoot: string;
    frontendBuildDirectiveRoot?: string;
    host?: string;
    port?: number;
  },
  run: (handle: DirectiveFrontendServerHandle) => Promise<T>,
) {
  const handle = await startDirectiveFrontendCheckServer(input);
  try {
    return await run(handle);
  } finally {
    await handle.close();
  }
}

export async function getDirectiveFrontendCheckJson<T>(
  handleOrOrigin: DirectiveFrontendServerHandle | string,
  pathname: string,
) {
  const origin = typeof handleOrOrigin === "string" ? handleOrOrigin : handleOrOrigin.origin;
  const response = await fetch(`${origin}${pathname}`);
  assert.equal(response.ok, true, `request_failed:${pathname}:${response.status}`);
  return response.json() as Promise<T>;
}
