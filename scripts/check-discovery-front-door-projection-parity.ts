import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  materializeDirectiveDiscoveryFrontDoorProjectionSet,
  writeDirectiveDiscoveryFrontDoorProjectionSet,
} from "../shared/lib/discovery-front-door-projections.ts";
import { submitDirectiveDiscoveryFrontDoor } from "../shared/lib/discovery-front-door.ts";
import { resolveDirectiveWorkspaceState } from "../shared/lib/dw-state.ts";
import { withTempDirectiveRoot } from "./temp-directive-root.ts";

const DIRECTIVE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ensureParentDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureParentDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readUtf8(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

async function main() {
  await withTempDirectiveRoot({ prefix: "directive-discovery-projection-parity-" }, async (directiveRoot) => {
    writeJson(path.join(directiveRoot, "discovery", "intake-queue.json"), {
      status: "primary",
      updatedAt: "2026-03-29",
      entries: [],
    });
    writeJson(path.join(directiveRoot, "discovery", "capability-gaps.json"), {
      status: "active",
      updatedAt: "2026-03-29",
      gaps: [
        {
          gap_id: "gap-directive-engine-materialization",
          description: "Canonical Directive Workspace engine surface remains only partially materialized.",
          priority: "high",
          related_mission_objective: "Directive engine materialization",
          current_state: "Source intake and routing still live partly outside the state-first substrate.",
          desired_state: "Source intake and routing emit durable mirrored case/event state in parallel with current artifacts.",
          detected_at: "2026-03-29",
          resolved_at: null,
        },
      ],
    });
    ensureParentDir(path.join(directiveRoot, "knowledge", "active-mission.md"));
    fs.copyFileSync(
      path.join(DIRECTIVE_ROOT, "knowledge", "active-mission.md"),
      path.join(directiveRoot, "knowledge", "active-mission.md"),
    );

    const result = await submitDirectiveDiscoveryFrontDoor({
      directiveRoot,
      request: {
        candidate_id: "phase-3-discovery-projection-parity-check",
        candidate_name: "Phase 3 Discovery Projection Parity Check",
        source_type: "github-repo",
        source_reference: "https://github.com/langchain-ai/openevals",
        mission_alignment:
          "Exercise generated Discovery front-door projections while keeping current read truth unchanged.",
        capability_gap_id: "gap-directive-engine-materialization",
        operating_mode: "note",
      },
      receivedAt: "2026-03-29T00:00:00.000Z",
    });

    const projectionSet = materializeDirectiveDiscoveryFrontDoorProjectionSet({
      directiveRoot,
      caseId: result.candidateId,
    });
    assert.ok(projectionSet.ok, "Generated Discovery projection set did not materialize");
    assert.equal(projectionSet.paths.intakeRecordPath, result.createdPaths.intakeRecordPath);
    assert.equal(projectionSet.paths.triageRecordPath, result.createdPaths.triageRecordPath);
    assert.equal(projectionSet.paths.routingRecordPath, result.createdPaths.routingRecordPath);
    assert.equal(projectionSet.routeTarget, result.discovery.routingTarget);
    assert.equal(projectionSet.operatingMode, result.queueEntry.operating_mode ?? null);
    assert.equal(projectionSet.queueStatus, result.queueEntry.status);
    assert.equal(projectionSet.latestEventType, "routed");

    const intakeAbsolutePath = path.join(directiveRoot, result.createdPaths.intakeRecordPath);
    const triageAbsolutePath = path.join(directiveRoot, result.createdPaths.triageRecordPath);
    const routingAbsolutePath = path.join(directiveRoot, result.createdPaths.routingRecordPath);

    assert.equal(
      readUtf8(intakeAbsolutePath),
      projectionSet.markdown.intake,
      "Generated intake projection diverged from the written Discovery artifact",
    );
    assert.equal(
      readUtf8(triageAbsolutePath),
      projectionSet.markdown.triage,
      "Generated triage projection diverged from the written Discovery artifact",
    );
    assert.equal(
      readUtf8(routingAbsolutePath),
      projectionSet.markdown.routing,
      "Generated routing projection diverged from the written Discovery artifact",
    );

    fs.rmSync(intakeAbsolutePath, { force: true });
    fs.rmSync(triageAbsolutePath, { force: true });
    fs.rmSync(routingAbsolutePath, { force: true });

    const regenerated = writeDirectiveDiscoveryFrontDoorProjectionSet({
      directiveRoot,
      caseId: result.candidateId,
    });
    assert.ok(regenerated.ok, "Regenerating Discovery projections from mirrored state failed");
    assert.equal(readUtf8(intakeAbsolutePath), projectionSet.markdown.intake);
    assert.equal(readUtf8(triageAbsolutePath), projectionSet.markdown.triage);
    assert.equal(readUtf8(routingAbsolutePath), projectionSet.markdown.routing);

    const focus = resolveDirectiveWorkspaceState({
      directiveRoot,
      artifactPath: result.createdPaths.routingRecordPath,
    }).focus;
    assert.ok(focus?.ok, "Generated Discovery routing record did not resolve through the authoritative reader");
    assert.equal(focus.routeTarget, result.discovery.routingTarget);
    assert.equal(focus.discovery.operatingMode, result.queueEntry.operating_mode ?? null);
    assert.equal(focus.currentHead.artifactPath, result.createdPaths.routingRecordPath);
    if (result.discovery.routingTarget === "monitor") {
      assert.match(
        focus.nextLegalStep,
        /keep the source in discovery/i,
        "Generated Discovery routing projection changed the monitor hold semantics",
      );
    } else {
      assert.match(
        focus.nextLegalStep,
        /inspect the discovery routing record/i,
        "Generated Discovery routing projection changed the route-level stop-line semantics",
      );
    }

    process.stdout.write(
      `${JSON.stringify(
        {
          ok: true,
          candidateId: result.candidateId,
          routeTarget: projectionSet.routeTarget,
          operatingMode: projectionSet.operatingMode,
          queueStatus: projectionSet.queueStatus,
          currentHead: focus.currentHead.artifactPath,
          nextLegalStep: focus.nextLegalStep,
          createdPaths: result.createdPaths,
        },
        null,
        2,
      )}\n`,
    );
  });
}

await main();
