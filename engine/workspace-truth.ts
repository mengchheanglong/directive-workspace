export const DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE =
  "No workflow advancement is legal until the broken or inconsistent artifact state is repaired and the anchor is rerun.";

export const DIRECTIVE_WORKSPACE_FIELD_INTERPRETATION = {
  artifactStage:
    "The stage represented by the inspected artifact itself. Use this to understand the local boundary and what that artifact directly authorizes next.",
  currentStage:
    "The latest reachable case state discovered from linked downstream artifacts. Use this to understand where the full case currently stands.",
  currentHead:
    "The derived current live artifact for the case. Use currentHead.artifactPath and currentHead.artifactStage to find the practical continuation point without treating the queue as workflow state.",
  artifactNextLegalStep:
    "The next legal step from the inspected artifact boundary only.",
  nextLegalStep:
    "The next legal step from the latest reachable case state only.",
  routeTarget:
    "When present, this is the original Discovery routing target for the case, not a claim that the currently inspected artifact belongs to that lane.",
} as const;

export const DIRECTIVE_WORKSPACE_LEGAL_NEXT_SEAMS = {
  discovery: [
    "Use the existing Discovery front door on real sources and keep route approval explicit.",
    "Tighten Discovery truth only through queue/routing/evidence consistency and capability-gap linkage clarity.",
    "Do not add automatic downstream advancement or duplicate Engine routing/usefulness logic inside Discovery.",
  ],
  runtime: [
    "The non-executing promotion-readiness artifact is now the current Runtime stop for the real March 25 route-proof chain.",
    "Further Runtime work must remain explicit, bounded, and non-executing unless a later task intentionally opens the next seam.",
    "Do not treat follow-up/proof records as runtime surfaces.",
  ],
  architecture: [
    "No required new structural seam is open for the current Architecture phase; use the existing chain for new bounded cases instead of redesigning it.",
    "Architecture infrastructure work should stay limited to truth/checking hardening or new real-case coverage through the existing path.",
    "Do not reopen Architecture flow design unless product truth is broken.",
  ],
  sharedEngineWholeProduct: [
    "Use shared/lib/dw-state.ts as the canonical read surface instead of building new ad hoc state readers.",
    "The highest-value whole-product seam is negative-path validation hardening around broken links, stale statuses, and overstated next steps.",
    "Do not turn the anchor into a workflow engine, dashboard, or automation layer.",
  ],
} as const;

export const DIRECTIVE_WORKSPACE_PRODUCT_TRUTH = {
  hierarchy: [
    "Directive Workspace",
    "Engine",
    "Discovery lane",
    "Runtime lane",
    "Architecture lane",
  ],
  workflow: [
    "Source",
    "Analyze",
    "Route",
    "Extract",
    "Adapt",
    "Improve",
    "Prove",
    "Decide",
    "Integrate + Report",
  ],
  proven: [
    "Discovery front door artifactization",
    "Shared Engine usefulness/routing persistence",
    "Discovery route approval into Architecture handoff",
    "Discovery route approval into Runtime follow-up",
    "Architecture bounded closeout / continuation / adoption / retained / integration / consumption / evaluation chain",
    "Architecture reopened re-entry and downstream reuse",
    "Runtime follow-up review/open boundary",
    "Runtime record proof-open boundary",
    "Runtime proof runtime-capability-boundary-open boundary",
    "Runtime runtime-capability-boundary promotion-readiness-open boundary",
    "Runtime runtime capability boundary (non-executing)",
    "Runtime promotion-readiness artifact (non-executing)",
    "Architecture composition checker",
    "Directive Workspace state resolver and current-state report",
    "Directive Workspace whole-product composition checker",
  ],
  partiallyBuilt: [
    "Discovery is operational as a front door and approval boundary, but still intentionally stops before automatic downstream work.",
    "Runtime is operational as a bounded non-executing v0 chain through promotion-readiness, but host-facing promotion, runtime execution, host integration, and callable implementation remain closed.",
    "Architecture is complete for the current bounded phase, but new work should arrive as new cases through the existing path rather than new structural mechanics.",
  ],
  intentionallyMinimal: [
    "no runtime execution",
    "no host integration",
    "no callable implementation",
    "no promotion automation",
    "no lifecycle orchestration",
    "no automatic workflow advancement",
  ],
  notBuilt: [
    "runtime execution surfaces",
    "host integration",
    "callable implementation",
    "promotion automation",
    "lifecycle orchestration",
    "automatic downstream advancement",
  ],
  forbiddenScopeExpansion: [
    "new workflow advancement in truth/read/check/report work",
    "runtime execution or host integration",
    "callable implementation",
    "promotion automation",
    "lifecycle engines or orchestration",
    "dashboard expansion",
    "reconstruction of state through lane-local custom readers when the shared resolver already covers it",
  ],
  legalNextSeams: DIRECTIVE_WORKSPACE_LEGAL_NEXT_SEAMS,
  fieldInterpretation: DIRECTIVE_WORKSPACE_FIELD_INTERPRETATION,
} as const;

export type DirectiveWorkspaceProductTruth = typeof DIRECTIVE_WORKSPACE_PRODUCT_TRUTH;

export function buildDirectiveWorkspaceProductTruth() {
  return {
    hierarchy: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.hierarchy],
    workflow: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.workflow],
    proven: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.proven],
    partiallyBuilt: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.partiallyBuilt],
    intentionallyMinimal: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.intentionallyMinimal],
    notBuilt: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.notBuilt],
    forbiddenScopeExpansion: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.forbiddenScopeExpansion],
    legalNextSeams: {
      discovery: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.legalNextSeams.discovery],
      runtime: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.legalNextSeams.runtime],
      architecture: [...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.legalNextSeams.architecture],
      sharedEngineWholeProduct: [
        ...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.legalNextSeams.sharedEngineWholeProduct,
      ],
    },
    fieldInterpretation: {
      ...DIRECTIVE_WORKSPACE_PRODUCT_TRUTH.fieldInterpretation,
    },
  };
}

export function applyDirectiveWorkspaceIntegrityGate<
  T extends {
    inconsistentLinks: string[];
    artifactNextLegalStep: string;
    nextLegalStep: string;
  },
>(focus: T): T & { integrityState: "ok" | "broken" } {
  if (focus.inconsistentLinks.length === 0) {
    return {
      ...focus,
      integrityState: "ok",
    };
  }

  return {
    ...focus,
    integrityState: "broken",
    artifactNextLegalStep: DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
    nextLegalStep: DIRECTIVE_WORKSPACE_BLOCKED_ADVANCEMENT_MESSAGE,
  };
}
