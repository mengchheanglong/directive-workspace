import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ACQUISITION_PY = path.join(
  DIRECTIVE_ROOT,
  "discovery/research-engine/src/research_engine/acquisition.py",
);
const MODELS_PY = path.join(
  DIRECTIVE_ROOT,
  "discovery/research-engine/src/research_engine/models.py",
);
const MISSION_PY = path.join(
  DIRECTIVE_ROOT,
  "discovery/research-engine/src/research_engine/mission.py",
);

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function assertContains(source: string, needle: string, label: string) {
  assert.ok(
    source.includes(needle),
    `${label} must contain "${needle}"`,
  );
}

const assertions: string[] = [];
let passed = 0;
let failed = 0;

function check(label: string, fn: () => void) {
  try {
    fn();
    passed++;
    assertions.push(`  PASS: ${label}`);
  } catch (error) {
    failed++;
    const message = error instanceof Error ? error.message : String(error);
    assertions.push(`  FAIL: ${label} — ${message}`);
  }
}

// --- MissionConstraints contract ---

const modelsSrc = readFile(MODELS_PY);

check("MissionConstraints has max_requests field", () => {
  assertContains(modelsSrc, "max_requests: int", "models.py");
});

check("MissionConstraints has per_provider_max_requests field", () => {
  assertContains(modelsSrc, "per_provider_max_requests: dict[str, int]", "models.py");
});

check("ProviderHealth has budget_max_requests field", () => {
  assertContains(modelsSrc, "budget_max_requests: int | None", "models.py");
});

check("ProviderHealth has budget_used_requests field", () => {
  assertContains(modelsSrc, "budget_used_requests: int | None", "models.py");
});

check("ProviderHealth has budget_exhaustion_events field", () => {
  assertContains(modelsSrc, "budget_exhaustion_events: list[str]", "models.py");
});

// --- Acquisition enforcement contract ---

const acquisitionSrc = readFile(ACQUISITION_PY);

check("RequestBudget class exists", () => {
  assertContains(acquisitionSrc, "class RequestBudget:", "acquisition.py");
});

check("RequestBudgetExhausted class exists", () => {
  assertContains(acquisitionSrc, "class RequestBudgetExhausted(Exception):", "acquisition.py");
});

check("Budget initialized from mission constraints in acquire()", () => {
  assertContains(
    acquisitionSrc,
    "self._request_budget = RequestBudget(",
    "acquisition.py",
  );
  assertContains(
    acquisitionSrc,
    "max_requests=mission.constraints.max_requests",
    "acquisition.py",
  );
});

check("Budget enforcement in _request_with_retry", () => {
  assertContains(acquisitionSrc, "budget.check(provider_key)", "acquisition.py");
  assertContains(acquisitionSrc, "budget.record(provider_key)", "acquisition.py");
});

check("Budget-aware early termination in discovery loop", () => {
  assertContains(
    acquisitionSrc,
    "aggregate request budget exhausted",
    "acquisition.py",
  );
});

check("Budget-aware enrichment gating in fetch expansion", () => {
  assertContains(
    acquisitionSrc,
    "budget.aggregate_remaining > 6",
    "acquisition.py",
  );
});

check("Budget-aware early termination in documents_from_hits", () => {
  assertContains(
    acquisitionSrc,
    "Fetch loop stopped after",
    "acquisition.py",
  );
});

check("Budget-aware evidence-gap follow-up short-circuit", () => {
  assertContains(
    acquisitionSrc,
    "Evidence-gap follow-up stopped early: request budget exhausted",
    "acquisition.py",
  );
});

// --- Default mission surfaces budget ---

const missionSrc = readFile(MISSION_PY);

check("Default mission surfaces max_requests", () => {
  assertContains(missionSrc, "max_requests=240", "mission.py");
});

check("Default mission surfaces per_provider_max_requests", () => {
  assertContains(missionSrc, "per_provider_max_requests=", "mission.py");
});

// --- Summary ---

console.log(`check-acquisition-request-budget: ${passed} passed, ${failed} failed`);
for (const line of assertions) {
  console.log(line);
}
if (failed > 0) {
  process.exit(1);
}
