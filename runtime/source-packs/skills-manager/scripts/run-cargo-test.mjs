#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { homedir, platform } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const tauriDir = join(repoRoot, "src-tauri");

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: tauriDir,
    stdio: "inherit",
    env: process.env,
    ...options
  });
  return result.status ?? 1;
};

const hasCommand = (name) => {
  const probe = spawnSync("where", [name], { stdio: "ignore", env: process.env });
  return probe.status === 0;
};

const isWindows = platform() === "win32";

if (!isWindows) {
  process.exit(run("cargo", ["test"]));
}

const vcvarsPaths = [
  "C:\\BuildTools\\VC\\Auxiliary\\Build\\vcvars64.bat",
  "C:\\Program Files\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Auxiliary\\Build\\vcvars64.bat",
  "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat"
];

const vcvarsPath = vcvarsPaths.find((path) => existsSync(path));

if (!vcvarsPath) {
  console.error(
    [
      "Windows MSVC environment not found (vcvars64.bat).",
      "Install Visual Studio Build Tools (C++ workload), then rerun:",
      "  npm run test:rust"
    ].join("\n")
  );
  process.exit(1);
}

const cargoCandidates = [
  join(homedir(), ".cargo", "bin", "cargo.exe"),
  process.env.USERPROFILE ? join(process.env.USERPROFILE, ".cargo", "bin", "cargo.exe") : null
].filter(Boolean);

const cargoPath = cargoCandidates.find((path) => existsSync(path));
const cargoInPath = hasCommand("cargo");

if (!cargoPath && !cargoInPath) {
  console.error(
    [
      "Rust toolchain not found for this session (cargo missing in PATH and ~/.cargo/bin).",
      "Install rustup/cargo for this user or expose cargo in PATH, then rerun:",
      "  npm run test:rust"
    ].join("\n")
  );
  process.exit(1);
}

const cargoCommand = cargoPath ? `"${cargoPath}"` : "cargo";
const psCommand = `$cmd = 'call "${vcvarsPath}" && ${cargoCommand} test'; cmd /c $cmd`;
process.exit(
  run("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", psCommand])
);
