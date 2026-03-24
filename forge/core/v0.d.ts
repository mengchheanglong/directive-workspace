export declare const DIRECTIVE_SUPPORTED_SOURCE_TYPES: readonly ["github-repo", "paper", "product-doc", "theory", "technical-essay", "workflow-writeup", "external-system", "internal-signal"];
export declare const DIRECTIVE_SOURCE_FLOW: readonly ["source", "analyze", "route", "extract", "adapt", "improve", "prove", "integrate"];
export declare const DIRECTIVE_USEFULNESS_LEVELS: readonly ["direct", "structural", "meta"];
export declare const DIRECTIVE_WORKSPACE_V0: {
    readonly supportedSourceTypes: readonly ["github-repo", "paper", "product-doc", "theory", "technical-essay", "workflow-writeup", "external-system", "internal-signal"];
    readonly sourceFlow: readonly ["source", "analyze", "route", "extract", "adapt", "improve", "prove", "integrate"];
    readonly usefulnessLevels: readonly ["direct", "structural", "meta"];
    readonly workflowFamily: "source-adaptation-engine";
    readonly workflowSentence: "Analyze a source against the active mission, route it to the right track, adapt the useful mechanism into Directive-owned form, prove it safely, and integrate the result with rollback clarity.";
    readonly primaryMetricKey: "decision_lead_time_hours";
    readonly primaryMetricTargetHours: 72;
};
export type DirectiveCapabilitySourceType = (typeof DIRECTIVE_SUPPORTED_SOURCE_TYPES)[number];
export type DirectiveCapabilityStatus = "intake" | "analyzed" | "experimenting" | "evaluated" | "decided" | "integrated";
export type DirectiveFrameworkStatus = "intake" | "analyzed" | "experimenting" | "evaluated" | "decided";
export type DirectiveRuntimeStatus = "none" | "planned" | "implementing" | "callable" | "parked" | "removed";
export type DirectiveCapabilityRecommendation = "ignore" | "monitor" | "test";
export type DirectiveExperimentStatus = "proposed" | "running" | "completed" | "aborted";
export type DirectiveEvaluationOutcome = "positive" | "negative" | "mixed" | "inconclusive";
export type DirectiveDecision = "adopt" | "reject" | "defer" | "monitor";
export type DirectiveIntegrationStatus = "planned" | "active" | "parked" | "removed";
export interface DirectiveIntegrationProof {
    execution: {
        ok: true;
        method: string;
        reference: string;
        timestamp: string;
    };
    artifact: {
        reportId: string | null;
        reportHref: string | null;
        artifactPath: string | null;
        summary: string | null;
    };
}
export type DirectiveIntegrationMode = "reimplement" | "adapt" | "wrap";
export declare function parseDirectiveIntegrationProof(value: unknown): DirectiveIntegrationProof | null;
export declare function normalizeDirectiveSourceType(value: unknown): DirectiveCapabilitySourceType;
export declare function normalizeDirectiveRecommendation(value: unknown): DirectiveCapabilityRecommendation;
export declare function normalizeDirectiveEvaluationOutcome(value: unknown): DirectiveEvaluationOutcome;
export declare function normalizeDirectiveDecision(value: unknown): DirectiveDecision;
export declare function normalizeDirectiveCapabilityStatus(value: unknown): DirectiveCapabilityStatus;
export declare function normalizeDirectiveExperimentStatus(value: unknown): DirectiveExperimentStatus;
export declare function normalizeDirectiveIntegrationStatus(value: unknown): DirectiveIntegrationStatus;
export declare function normalizeDirectiveFrameworkStatus(value: unknown): DirectiveFrameworkStatus;
export declare function normalizeDirectiveRuntimeStatus(value: unknown): DirectiveRuntimeStatus;
export declare function normalizeDirectiveIntegrationMode(value: unknown): DirectiveIntegrationMode;
export declare function normalizeDirectiveNotes(value: unknown): string[];
export declare function inferDirectiveCapabilityTitle(sourceRef: string): string;
