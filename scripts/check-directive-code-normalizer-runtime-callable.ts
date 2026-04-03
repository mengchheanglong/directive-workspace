import assert from "node:assert/strict";

import {
  createCodeNormalizerCallableCapability,
  executeCodeNormalizerTool,
  disableCodeNormalizerCapability,
  enableCodeNormalizerCapability,
  isCodeNormalizerCapabilityEnabled,
  normalizeCode,
} from "../runtime/capabilities/code-normalizer/index.ts";
import { checkCallableContractCompliance } from "../runtime/core/callable-contract.ts";

const CHECKER_ID = "directive_code_normalizer_runtime_callable";

async function main() {
  // --- Verify callable contract compliance ---
  const capability = createCodeNormalizerCallableCapability();
  const compliance = checkCallableContractCompliance(capability);
  assert.equal(compliance.ok, true, `Contract violations: ${compliance.violations.join(", ")}`);
  assert.equal(capability.descriptor.status, "callable");
  assert.equal(capability.descriptor.form, "runtime_owned_behavior_preserving_transformation");
  assert.equal(capability.descriptor.toolCount, 1);
  assert.equal(capability.descriptor.tools[0], "normalize-code");

  // --- Verify direct normalizer behavior ---
  const directResult = normalizeCode({
    code: "const x = 1;\n\n\n\nconst y = 2;  \r\n",
  });
  assert.equal(directResult.ok, true);
  if (directResult.ok) {
    assert.equal(directResult.preservationProof.behaviorPreserved, true);
    assert.equal(directResult.preservationProof.inputNonBlankLines, 2);
    assert.equal(directResult.preservationProof.outputNonBlankLines, 2);
    assert.ok(directResult.preservationProof.transformsApplied.length > 0);
  }

  // --- Verify executor input validation ---
  const validationResult = await executeCodeNormalizerTool({
    tool: "normalize-code",
    input: { code: "" },
  });
  assert.equal(validationResult.ok, false);
  assert.equal(validationResult.status, "validation_error");

  const unknownToolResult = await executeCodeNormalizerTool({
    tool: "unknown-tool" as any,
    input: { code: "test" },
  });
  assert.equal(unknownToolResult.ok, false);
  assert.equal(unknownToolResult.status, "validation_error");

  // --- Verify executor disable gate ---
  assert.equal(isCodeNormalizerCapabilityEnabled(), true);
  disableCodeNormalizerCapability();
  assert.equal(isCodeNormalizerCapabilityEnabled(), false);
  const disabledResult = await executeCodeNormalizerTool({
    tool: "normalize-code",
    input: { code: "const x = 1;" },
  });
  assert.equal(disabledResult.ok, false);
  assert.equal(disabledResult.status, "disabled");
  enableCodeNormalizerCapability();
  assert.equal(isCodeNormalizerCapabilityEnabled(), true);

  // --- Verify executor real execution ---
  const execResult = await executeCodeNormalizerTool({
    tool: "normalize-code",
    input: {
      code: "function hello() {\n  return 'world';\n}\n\n\n\n// end  \n",
    },
    timeoutMs: 5000,
  });
  assert.equal(execResult.ok, true);
  assert.equal(execResult.status, "success");
  assert.equal(execResult.tool, "normalize-code");
  assert.equal(typeof execResult.metadata.startedAt, "string");
  assert.equal(typeof execResult.metadata.completedAt, "string");
  assert.equal(typeof execResult.metadata.durationMs, "number");
  assert.ok(execResult.metadata.durationMs >= 0);
  assert.equal(execResult.metadata.capabilityId, "dw-transform-code-normalizer");

  // Verify the result is a valid normalizer output with preservation proof
  const normalized = execResult.result as { ok: true; preservationProof: { behaviorPreserved: boolean } };
  assert.equal(normalized.ok, true);
  assert.equal(normalized.preservationProof.behaviorPreserved, true);

  // --- Verify behavior preservation with real code ---
  const realCodeResult = await executeCodeNormalizerTool({
    tool: "normalize-code",
    input: {
      code: [
        "export function add(a: number, b: number): number {",
        "  return a + b;  ",
        "}",
        "",
        "",
        "",
        "export function multiply(a: number, b: number): number {",
        "  return a * b;",
        "}  ",
        "",
      ].join("\n"),
    },
  });
  assert.equal(realCodeResult.ok, true);
  const realNormalized = realCodeResult.result as {
    ok: true;
    normalizedCode: string;
    preservationProof: {
      behaviorPreserved: boolean;
      inputNonBlankLines: number;
      outputNonBlankLines: number;
    };
  };
  assert.equal(realNormalized.ok, true);
  assert.equal(realNormalized.preservationProof.behaviorPreserved, true);
  assert.equal(realNormalized.preservationProof.inputNonBlankLines, 6);
  assert.equal(realNormalized.preservationProof.outputNonBlankLines, 6);
  // Verify trailing whitespace was removed
  assert.ok(!realNormalized.normalizedCode.includes("  \n"));

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        capabilityId: capability.descriptor.capabilityId,
        status: capability.descriptor.status,
        form: capability.descriptor.form,
        toolCount: capability.descriptor.toolCount,
        contractCompliant: compliance.ok,
      },
      null,
      2,
    )}\n`,
  );
}

void main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: false,
        checkerId: CHECKER_ID,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  process.exit(1);
});
