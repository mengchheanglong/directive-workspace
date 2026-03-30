export const DIRECTIVE_ENGINE_SUPPORTED_SOURCE_TYPES = [
  "github-repo",
  "paper",
  "product-doc",
  "theory",
  "technical-essay",
  "workflow-writeup",
  "external-system",
  "internal-signal",
] as const;

export const DIRECTIVE_ENGINE_INTEGRATION_MODES = [
  "none",
  "reimplement",
  "adapt",
  "wrap",
] as const;

export type DirectiveEngineSourceType =
  (typeof DIRECTIVE_ENGINE_SUPPORTED_SOURCE_TYPES)[number];

export type DirectiveEngineIntegrationMode =
  (typeof DIRECTIVE_ENGINE_INTEGRATION_MODES)[number];

export type DirectiveEngineUsefulnessLevel = "direct" | "structural" | "meta";

export type DirectiveEngineRoutingConfidence = "high" | "medium" | "low";

export type DirectiveEngineHostDependence =
  | "engine_only"
  | "host_adapter_required";

export type DirectiveEngineLaneId = string;

export type DirectiveEngineCapabilityGapPriority = "high" | "medium" | "low";

export type DirectiveEngineEventType =
  | "source_ingested"
  | "source_analyzed"
  | "candidate_routed"
  | "value_extracted"
  | "value_adapted"
  | "value_improved"
  | "proof_planned"
  | "decision_recorded"
  | "integration_proposed"
  | "report_planned";

export type DirectiveEngineSourceItem = {
  sourceId?: string | null;
  sourceType: DirectiveEngineSourceType;
  sourceRef: string;
  title: string;
  summary?: string | null;
  notes?: string[] | null;
  missionAlignmentHint?: string | null;
  capabilityGapId?: string | null;
};

export type DirectiveEngineMissionInput = {
  missionId?: string | null;
  currentObjective?: string | null;
  usefulnessSignals?: string[] | null;
  capabilityLanes?: string[] | null;
  activeMissionMarkdown?: string | null;
};

export type DirectiveEngineMissionContext = {
  missionId: string | null;
  currentObjective: string;
  usefulnessSignals: string[];
  capabilityLanes: string[];
  activeMissionMarkdown: string;
};

export type DirectiveEngineCapabilityGap = {
  gapId: string;
  description: string;
  priority: DirectiveEngineCapabilityGapPriority;
  relatedMissionObjective: string;
  currentState: string;
  desiredState: string;
  detectedAt: string;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
};

export type DirectiveEngineRoutingAssessment = {
  recommendedLaneId: DirectiveEngineLaneId;
  recommendedRecordShape: string;
  missionPriorityScore: number;
  confidence: DirectiveEngineRoutingConfidence;
  matchedGapId: string | null;
  matchedGapRank: number | null;
  explicitRouteDestination: DirectiveEngineLaneId | null;
  routeConflict: boolean;
  needsHumanReview: boolean;
  scoreBreakdown: {
    missionFit: number;
    gapAlignment: number;
    laneScores: Record<DirectiveEngineLaneId, number>;
    metaUsefulnessSignal: number;
    patternExtractionSignal: number;
    transformationSignal: number;
    runtimeSignal: number;
    ambiguityPenalty: number;
    total: number;
  };
  rationale: string[];
};

export type DirectiveEngineSelectedLane = {
  laneId: DirectiveEngineLaneId;
  label: string;
  hostDependence: DirectiveEngineHostDependence;
  valuableWithoutHostRuntime: boolean;
};

export type DirectiveEngineCandidate = {
  candidateId: string;
  candidateName: string;
  recommendedLaneId: DirectiveEngineLaneId;
  recommendedLaneLabel: string | null;
  recommendedRecordShape: string;
  usefulnessLevel: DirectiveEngineUsefulnessLevel;
  missionPriorityScore: number;
  confidence: DirectiveEngineRoutingConfidence;
  matchedGapId: string | null;
  matchedGapRank: number | null;
  requiresHumanReview: boolean;
  rationale: string[];
};

export type DirectiveEngineAnalysis = {
  missionFitSummary: string;
  primaryAdoptionQuestion: string;
  matchedCapabilityGapId: string | null;
  usefulnessRationale: string;
  rationale: string[];
};

export type DirectiveEngineExtractionPlan = {
  extractedValue: string[];
  excludedBaggage: string[];
};

export type DirectiveEngineAdaptationPlan = {
  directiveOwnedForm: string;
  adaptedValue: string[];
};

export type DirectiveEngineImprovementPlan = {
  improvementGoals: string[];
  intendedDelta: string;
};

export type DirectiveEngineProofPlan = {
  proofKind: string;
  objective: string;
  requiredEvidence: string[];
  requiredGates: string[];
  rollbackPrompt: string;
};

export type DirectiveEngineDecisionState =
  | "hold_in_discovery"
  | "accept_for_architecture"
  | "route_to_runtime_follow_up"
  | "needs_human_review";

export type DirectiveEngineDecision = {
  decisionState: DirectiveEngineDecisionState;
  adoptionTargetLaneId: DirectiveEngineLaneId;
  adoptionTargetLaneLabel: string | null;
  requiresHumanApproval: boolean;
  summary: string;
  rationale: string[];
};

export type DirectiveEngineIntegrationProposal = {
  targetLaneId: DirectiveEngineLaneId;
  targetLaneLabel: string | null;
  integrationMode: DirectiveEngineIntegrationMode;
  hostDependence: DirectiveEngineHostDependence;
  valuableWithoutHostRuntime: boolean;
  handoffArtifactFamily: string;
  nextAction: string;
  requiresHumanReview: boolean;
};

export type DirectiveEngineReportPlan = {
  reportKind: string;
  summary: string;
  usefulnessRationale: string;
  requiredDestinations: string[];
  syncRequired: boolean;
};

export type DirectiveEngineEvent = {
  type: DirectiveEngineEventType;
  at: string;
  summary: string;
};

export type DirectiveEngineRunRecord = {
  runId: string;
  receivedAt: string;
  source: DirectiveEngineSourceItem;
  mission: DirectiveEngineMissionContext;
  openGaps: DirectiveEngineCapabilityGap[];
  selectedLane: DirectiveEngineSelectedLane;
  candidate: DirectiveEngineCandidate;
  analysis: DirectiveEngineAnalysis;
  routingAssessment: DirectiveEngineRoutingAssessment;
  extractionPlan: DirectiveEngineExtractionPlan;
  adaptationPlan: DirectiveEngineAdaptationPlan;
  improvementPlan: DirectiveEngineImprovementPlan;
  proofPlan: DirectiveEngineProofPlan;
  decision: DirectiveEngineDecision;
  integrationProposal: DirectiveEngineIntegrationProposal;
  reportPlan: DirectiveEngineReportPlan;
  events: DirectiveEngineEvent[];
};

export type DirectiveEngineHostAdapterResult = {
  accepted: boolean;
  note?: string | null;
};

export type DirectiveEngineHostAdapter = {
  id: string;
  onRunRecorded?(
    record: DirectiveEngineRunRecord,
  ):
    | DirectiveEngineHostAdapterResult
    | void
    | Promise<DirectiveEngineHostAdapterResult | void>;
};

export type DirectiveEngineProcessSourceInput = {
  source: DirectiveEngineSourceItem;
  mission: DirectiveEngineMissionInput;
  gaps?: DirectiveEngineCapabilityGap[] | null;
  receivedAt?: string | null;
};

export type DirectiveEngineProcessSourceResult = {
  ok: true;
  record: DirectiveEngineRunRecord;
  adapterResults: Array<{
    adapterId: string;
    accepted: boolean;
    note: string | null;
  }>;
};
