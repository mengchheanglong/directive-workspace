import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readStandaloneScientifyLiteratureAccessBundle } from "../hosts/standalone-host/runtime-lane.ts";
import {
  runDirectiveRuntimeV0ScientifyLiteratureAccessBundleIntegration,
  DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0,
} from "../runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts";
import {
  DIRECTIVE_RUNTIME_SCIENTIFY_LITERATURE_ACCESS_BUNDLE,
  getDirectiveRuntimeScientifyLiteratureAccessTool,
  listDirectiveRuntimeScientifyLiteratureAccessTools,
} from "../runtime/capabilities/literature-access/bundle.ts";
import {
  executeLiteratureAccessTool,
  disableLiteratureAccessCapability,
  enableLiteratureAccessCapability,
  isLiteratureAccessCapabilityEnabled,
  createLiteratureAccessCallableCapability,
  LITERATURE_ACCESS_CALLABLE_CAPABILITY,
} from "../runtime/capabilities/literature-access/executor.ts";
import { checkCallableContractCompliance } from "../runtime/core/callable-contract.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER_ID = "directive_scientify_runtime_callable";
const CALLABLE_STUB_PATH =
  "runtime/01-callable-integrations/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-callable-integration.ts";
const PROMOTION_READINESS_PATH =
  "runtime/05-promotion-readiness/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-readiness.md";
const PROMOTION_SPECIFICATION_PATH =
  "runtime/06-promotion-specifications/2026-03-27-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-specification.json";
const PROMOTION_RECORD_PATH =
  "runtime/promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md";

type MockResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  text?: string;
  json?: unknown;
  body?: Uint8Array;
};

class FakeResponse {
  ok: boolean;
  status: number;
  statusText: string;
  #headers: Map<string, string>;
  #text: string;
  #json: unknown;
  #body: Uint8Array;

  constructor(input: MockResponse) {
    this.ok = input.ok;
    this.status = input.status;
    this.statusText = input.statusText;
    this.#headers = new Map(
      Object.entries(input.headers ?? {}).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
    );
    this.#text = input.text ?? "";
    this.#json = input.json ?? null;
    this.#body = input.body ?? new Uint8Array();
  }

  headers = {
    get: (name: string) => this.#headers.get(name.toLowerCase()) ?? null,
  };

  async text() {
    return this.#text;
  }

  async json() {
    return this.#json;
  }

  async arrayBuffer() {
    return this.#body.buffer.slice(
      this.#body.byteOffset,
      this.#body.byteOffset + this.#body.byteLength,
    );
  }
}

function readRequestHeader(
  init: RequestInit | undefined,
  headerName: string,
): string | null {
  const headers = init?.headers;
  if (!headers) return null;

  if (headers instanceof Headers) {
    return headers.get(headerName);
  }

  if (Array.isArray(headers)) {
    const match = headers.find(
      ([name]) => name.toLowerCase() === headerName.toLowerCase(),
    );
    return match?.[1] ?? null;
  }

  const value = (headers as Record<string, string | undefined>)[headerName]
    ?? (headers as Record<string, string | undefined>)[headerName.toLowerCase()];
  return value ?? null;
}

async function withMockFetch<T>(
  handler: (url: string, init?: RequestInit) => Promise<MockResponse> | MockResponse,
  run: () => Promise<T>,
) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    return new FakeResponse(await handler(url, init)) as unknown as Response;
  }) as typeof fetch;

  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function verifyBundleInvocations() {
  const bundleTools = listDirectiveRuntimeScientifyLiteratureAccessTools();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "directive-scientify-callable-"));

  try {
    const arxivSearchResult = await withMockFetch(async (url) => {
      assert.ok(url.startsWith("https://export.arxiv.org/api/query"), `Unexpected arXiv URL: ${url}`);
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        text: [
          "<feed>",
          "<entry>",
          "<id>http://arxiv.org/abs/2404.12345v2</id>",
          "<title> Test Paper </title>",
          "<summary> Example abstract content for directive workspace scientify proof. </summary>",
          "<published>2026-04-01</published>",
          "<updated>2026-04-01</updated>",
          "<author><name>Ada</name></author>",
          "<category term=\"cs.AI\"/>",
          "<link title=\"pdf\" href=\"https://arxiv.org/pdf/2404.12345\"/>",
          "</entry>",
          "</feed>",
        ].join(""),
      };
    }, async () =>
      bundleTools[0].invoke({ query: "directive workspace", max_results: 1 }),
    );
    assert.equal((arxivSearchResult as { ok: boolean }).ok, true);

    const arxivDownloadOutput = path.join(tempRoot, "arxiv");
    const arxivDownloadResult = await withMockFetch(async (url) => {
      if (url.startsWith("https://arxiv.org/src/")) {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          body: new TextEncoder().encode("\\documentclass{article}\n\\begin{document}test\\end{document}\n"),
        };
      }
      throw new Error(`Unexpected arXiv download URL: ${url}`);
    }, async () =>
      bundleTools[1].invoke({ arxiv_ids: ["2404.12345"], output_dir: arxivDownloadOutput }),
    );
    assert.equal((arxivDownloadResult as { ok: boolean }).ok, true);

    const openAlexResult = await withMockFetch(async (url, init) => {
      assert.ok(url.startsWith("https://api.openalex.org/works?"), `Unexpected OpenAlex URL: ${url}`);
      const userAgent = readRequestHeader(init, "User-Agent") ?? "";
      assert.ok(
        userAgent.includes("directive-workspace/1.0"),
        `Expected Directive Workspace user agent, got: ${userAgent || "<missing>"}`,
      );
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: {
          meta: { count: 1 },
          results: [
            {
              id: "https://openalex.org/W123",
              doi: "https://doi.org/10.1000/example",
              title: "OpenAlex Test",
              publication_year: 2026,
              publication_date: "2026-04-01",
              type: "article",
              cited_by_count: 7,
              authorships: [{ author: { display_name: "Ada" } }],
              primary_location: { source: { display_name: "Test Venue" } },
              abstract_inverted_index: { Test: [0], abstract: [1] },
              open_access: { is_oa: true, oa_url: "https://example.test/file.pdf" },
            },
          ],
        },
      };
    }, async () =>
      bundleTools[2].invoke({ query: "directive workspace", max_results: 1 }),
    );
    assert.equal((openAlexResult as { ok: boolean }).ok, true);

    const unpaywallOutput = path.join(tempRoot, "unpaywall");
    let unpaywallApiSeen = false;
    let unpaywallPdfSeen = false;
    const unpaywallResult = await withMockFetch(async (url) => {
      if (url.startsWith("https://api.unpaywall.org/v2/")) {
        unpaywallApiSeen = true;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: {
            doi: "10.1000/example",
            is_oa: true,
            best_oa_location: {
              url: "https://example.test/file.pdf",
              url_for_pdf: "https://example.test/file.pdf",
              url_for_landing_page: "https://example.test/landing",
              license: "cc-by",
            },
            title: "OA Test",
            year: 2026,
          },
        };
      }
      if (url === "https://example.test/file.pdf") {
        unpaywallPdfSeen = true;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/pdf" },
          body: new Uint8Array([0x25, 0x50, 0x44, 0x46]),
        };
      }
      throw new Error(`Unexpected Unpaywall URL: ${url}`);
    }, async () =>
      bundleTools[3].invoke({ dois: ["10.1000/example"], output_dir: unpaywallOutput }),
    );
    assert.equal((unpaywallResult as { ok: boolean }).ok, true);
    assert.equal(unpaywallApiSeen, true);
    assert.equal(unpaywallPdfSeen, true);

    return {
      arxivSearch: (arxivSearchResult as { ok: true; total: number }).total,
      arxivDownloadSuccess: (arxivDownloadResult as { ok: true; successful: number }).successful,
      openAlexReturned: (openAlexResult as { ok: true; returned: number }).returned,
      unpaywallSuccess: (unpaywallResult as { ok: true; success: number }).success,
    };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  const callableRuntime = runDirectiveRuntimeV0ScientifyLiteratureAccessBundleIntegration();
  const bundleTools = listDirectiveRuntimeScientifyLiteratureAccessTools();
  const descriptor = readStandaloneScientifyLiteratureAccessBundle({
    directiveRoot: DIRECTIVE_ROOT,
  });
  const readinessFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: PROMOTION_READINESS_PATH,
  }).focus;
  const callableFocus = resolveDirectiveWorkspaceState({
    directiveRoot: DIRECTIVE_ROOT,
    artifactPath: CALLABLE_STUB_PATH,
  }).focus;

  assert.ok(readinessFocus?.ok, "Scientify promotion-readiness focus should resolve");
  assert.ok(callableFocus?.ok, "Scientify callable integration focus should resolve");
  assert.equal(callableRuntime.status, "callable");
  assert.equal(typeof callableRuntime.executorModulePath, "string");
  assert.ok(
    fs.existsSync(path.join(DIRECTIVE_ROOT, callableRuntime.executorModulePath)),
    `Executor module should exist: ${callableRuntime.executorModulePath}`,
  );
  assert.equal(bundleTools.length, 4);
  assert.equal(
    bundleTools.length,
    DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.tools.length,
  );
  assert.equal(
    bundleTools.length,
    DIRECTIVE_RUNTIME_SCIENTIFY_LITERATURE_ACCESS_BUNDLE.tools.length,
  );

  for (const tool of DW_SCIENTIFY_LITERATURE_ACCESS_BUNDLE_CALLABLE_V0.tools) {
    const runtimeTool = getDirectiveRuntimeScientifyLiteratureAccessTool(tool.tool);
    assert.equal(runtimeTool.functionName, tool.functionName);
    assert.equal(runtimeTool.modulePath, tool.modulePath);
    assert.equal(runtimeTool.inputType, tool.inputType);
    assert.equal(runtimeTool.resultType, tool.resultType);
    assert.equal(typeof runtimeTool.invoke, "function");
    assert.ok(
      fs.existsSync(path.join(DIRECTIVE_ROOT, tool.modulePath)),
      `Expected tool module to exist: ${tool.modulePath}`,
    );
  }

  const invocationSummary = await verifyBundleInvocations();

  assert.equal(
    readinessFocus.linkedArtifacts.runtimeCallableStubPath,
    CALLABLE_STUB_PATH,
  );
  assert.equal(
    readinessFocus.linkedArtifacts.runtimePromotionSpecificationPath,
    PROMOTION_SPECIFICATION_PATH,
  );
  assert.equal(
    readinessFocus.linkedArtifacts.runtimePromotionRecordPath,
    PROMOTION_RECORD_PATH,
  );
  // --- Verify executor capability metadata ---
  assert.equal(LITERATURE_ACCESS_CALLABLE_CAPABILITY.status, "callable");
  assert.equal(LITERATURE_ACCESS_CALLABLE_CAPABILITY.toolCount, 4);
  assert.equal(LITERATURE_ACCESS_CALLABLE_CAPABILITY.capabilityId, "dw-source-scientify-research-workflow-plugin-2026-03-27");

  // --- Verify executor input validation ---
  const validationResult = await executeLiteratureAccessTool({
    tool: "arxiv-search",
    input: { query: "" },
  });
  assert.equal(validationResult.ok, false);
  assert.equal(validationResult.status, "validation_error");

  // --- Verify executor disable gate ---
  assert.equal(isLiteratureAccessCapabilityEnabled(), true);
  disableLiteratureAccessCapability();
  assert.equal(isLiteratureAccessCapabilityEnabled(), false);
  const disabledResult = await executeLiteratureAccessTool({
    tool: "arxiv-search",
    input: { query: "test" },
  });
  assert.equal(disabledResult.ok, false);
  assert.equal(disabledResult.status, "disabled");
  enableLiteratureAccessCapability();
  assert.equal(isLiteratureAccessCapabilityEnabled(), true);

  // --- Verify executor real invocation (with mock fetch) ---
  const executorSearchResult = await withMockFetch(async (url) => {
    assert.ok(url.startsWith("https://export.arxiv.org/api/query"), `Unexpected arXiv URL: ${url}`);
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      text: [
        "<feed>",
        "<entry>",
        "<id>http://arxiv.org/abs/2404.99999v1</id>",
        "<title>Executor Test Paper</title>",
        "<summary>Executor test abstract.</summary>",
        "<published>2026-04-02</published>",
        "<updated>2026-04-02</updated>",
        "<author><name>Test</name></author>",
        "<category term=\"cs.AI\"/>",
        "<link title=\"pdf\" href=\"https://arxiv.org/pdf/2404.99999\"/>",
        "</entry>",
        "</feed>",
      ].join(""),
    };
  }, async () =>
    executeLiteratureAccessTool({
      tool: "arxiv-search",
      input: { query: "executor test", max_results: 1 },
      timeoutMs: 10_000,
    }),
  );
  assert.equal(executorSearchResult.ok, true);
  assert.equal(executorSearchResult.status, "success");
  assert.equal(executorSearchResult.tool, "arxiv-search");
  assert.equal(typeof executorSearchResult.metadata.startedAt, "string");
  assert.equal(typeof executorSearchResult.metadata.completedAt, "string");
  assert.equal(typeof executorSearchResult.metadata.durationMs, "number");
  assert.ok(executorSearchResult.metadata.durationMs >= 0);
  assert.equal(executorSearchResult.metadata.capabilityId, "dw-source-scientify-research-workflow-plugin-2026-03-27");

  // --- Verify callable contract compliance ---
  const capability = createLiteratureAccessCallableCapability();
  const compliance = checkCallableContractCompliance(capability);
  assert.equal(compliance.ok, true, `Contract violations: ${compliance.violations.join(", ")}`);

  assert.equal(callableFocus.artifactStage, "runtime.callable.executing");
  assert.equal(
    descriptor.linkedArtifacts.runtimeCallableStubPath,
    CALLABLE_STUB_PATH,
  );
  assert.equal(
    descriptor.linkedArtifacts.runtimePromotionSpecificationPath,
    PROMOTION_SPECIFICATION_PATH,
  );
  assert.equal(
    descriptor.linkedArtifacts.runtimePromotionRecordPath,
    PROMOTION_RECORD_PATH,
  );
  assert.deepEqual(
    descriptor.tools.map((tool) => tool.tool),
    bundleTools.map((tool) => tool.tool),
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        checkerId: CHECKER_ID,
        callableId: callableRuntime.callableId,
        bundleId: DIRECTIVE_RUNTIME_SCIENTIFY_LITERATURE_ACCESS_BUNDLE.bundleId,
        toolCount: bundleTools.length,
        runtimeCallableStubPath: readinessFocus.linkedArtifacts.runtimeCallableStubPath,
        runtimePromotionRecordPath:
          readinessFocus.linkedArtifacts.runtimePromotionRecordPath,
        runtimePromotionSpecificationPath:
          readinessFocus.linkedArtifacts.runtimePromotionSpecificationPath,
        currentStage: readinessFocus.currentStage,
        invocationSummary,
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
