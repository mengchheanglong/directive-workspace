import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function latestMtimeMsForPath(targetPath: string): number {
  if (!fs.existsSync(targetPath)) {
    return 0;
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return stat.mtimeMs;
  }

  if (!stat.isDirectory()) {
    return stat.mtimeMs;
  }

  let latest = stat.mtimeMs;
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    latest = Math.max(latest, latestMtimeMsForPath(path.join(targetPath, entry.name)));
  }
  return latest;
}

function shouldBuildFrontend(directiveRoot: string) {
  const frontendRoot = path.join(directiveRoot, "frontend");
  const distRoot = path.join(frontendRoot, "dist");
  const distIndex = path.join(distRoot, "index.html");
  if (!fs.existsSync(distIndex)) {
    return true;
  }

  const sourceCandidates = [
    path.join(frontendRoot, "src"),
    path.join(frontendRoot, "public"),
    path.join(frontendRoot, "index.html"),
    path.join(frontendRoot, "package.json"),
    path.join(frontendRoot, "vite.config.ts"),
    path.join(frontendRoot, "tsconfig.json"),
  ];

  const latestSourceMtime = sourceCandidates.reduce(
    (current, candidate) => Math.max(current, latestMtimeMsForPath(candidate)),
    0,
  );
  const buildMtime = fs.statSync(distIndex).mtimeMs;
  return latestSourceMtime > buildMtime;
}

export function ensureDirectiveFrontendBuild(input: {
  directiveRoot: string;
  stdio?: "inherit" | "pipe";
}): "built" | "fresh" {
  if (!shouldBuildFrontend(input.directiveRoot)) {
    return "fresh";
  }

  execSync("npm run frontend:build", {
    cwd: input.directiveRoot,
    stdio: input.stdio ?? "inherit",
  });
  return "built";
}
