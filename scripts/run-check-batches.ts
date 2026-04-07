import { spawn } from "node:child_process";

import { readDirectiveCheckBatches, type DirectiveCheckBatch } from "./check-batches.ts";

type DirectiveCheckCommandResult = {
  command: string;
  ok: boolean;
  exitCode: number;
  durationMs: number;
};

function writePrefixedChunk(prefix: string, chunk: string) {
  const normalized = chunk.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.length === 0 && index === lines.length - 1) {
      continue;
    }
    process.stdout.write(`[${prefix}] ${line}\n`);
  }
}

function runDirectiveCheckCommand(command: string): Promise<DirectiveCheckCommandResult> {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(`npm run ${command}`, {
      cwd: process.cwd(),
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => writePrefixedChunk(command, chunk));
    child.stderr.on("data", (chunk: string) => writePrefixedChunk(command, chunk));
    child.on("close", (exitCode) => {
      resolve({
        command,
        ok: (exitCode ?? 1) === 0,
        exitCode: exitCode ?? 1,
        durationMs: Date.now() - startedAt,
      });
    });
  });
}

async function runDirectiveCheckBatch(batch: DirectiveCheckBatch) {
  const pending = [...batch.commands];
  const running = new Set<Promise<DirectiveCheckCommandResult>>();
  const results: DirectiveCheckCommandResult[] = [];

  const startNext = () => {
    while (pending.length > 0 && running.size < batch.concurrency) {
      const command = pending.shift()!;
      const promise = runDirectiveCheckCommand(command).then((result) => {
        running.delete(promise);
        results.push(result);
        return result;
      });
      running.add(promise);
    }
  };

  startNext();
  while (running.size > 0) {
    await Promise.race(running);
    startNext();
  }

  const failures = results.filter((result) => !result.ok);
  return {
    batchId: batch.id,
    results,
    ok: failures.length === 0,
    failures,
  };
}

async function main() {
  const batchSetId = process.argv[2] ?? "main";
  const batches = readDirectiveCheckBatches(batchSetId);
  const startedAt = Date.now();
  const batchResults = [];

  process.stdout.write(
    `${JSON.stringify({
      ok: true,
      runner: "directive_check_batches",
      batchSetId,
      batchCount: batches.length,
    }, null, 2)}\n`,
  );

  for (const batch of batches) {
    process.stdout.write(`\n== Running check batch: ${batch.id} ==\n`);
    const result = await runDirectiveCheckBatch(batch);
    batchResults.push(result);
    if (!result.ok) {
      process.stderr.write(
        `${JSON.stringify({
          ok: false,
          runner: "directive_check_batches",
          batchSetId,
          failedBatch: result.batchId,
          failures: result.failures,
        }, null, 2)}\n`,
      );
      process.exit(1);
    }
  }

  process.stdout.write(
    `${JSON.stringify({
      ok: true,
      runner: "directive_check_batches",
      batchSetId,
      durationMs: Date.now() - startedAt,
      batches: batchResults.map((batch) => ({
        batchId: batch.batchId,
        commandCount: batch.results.length,
        maxDurationMs: batch.results.reduce(
          (max, result) => Math.max(max, result.durationMs),
          0,
        ),
      })),
    }, null, 2)}\n`,
  );
}

void main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      ok: false,
      runner: "directive_check_batches",
      error: error instanceof Error ? error.message : String(error),
    }, null, 2)}\n`,
  );
  process.exit(1);
});
