export const DIRECTIVE_SUPPORTED_SOURCE_TYPES = [
    "github-repo",
    "paper",
    "product-doc",
    "theory",
    "technical-essay",
    "workflow-writeup",
    "external-system",
    "internal-signal",
];
export const DIRECTIVE_SOURCE_FLOW = [
    "source",
    "analyze",
    "route",
    "extract",
    "adapt",
    "improve",
    "prove",
    "integrate",
];
export const DIRECTIVE_USEFULNESS_LEVELS = [
    "direct",
    "structural",
    "meta",
];
export const DIRECTIVE_WORKSPACE_V0 = {
    supportedSourceTypes: DIRECTIVE_SUPPORTED_SOURCE_TYPES,
    sourceFlow: DIRECTIVE_SOURCE_FLOW,
    usefulnessLevels: DIRECTIVE_USEFULNESS_LEVELS,
    workflowFamily: "source-adaptation-engine",
    workflowSentence: "Analyze a source against the active mission, route it to the right track, adapt the useful mechanism into Directive-owned form, prove it safely, and integrate the result with rollback clarity.",
    primaryMetricKey: "decision_lead_time_hours",
    primaryMetricTargetHours: 72,
};
function normalizeString(value) {
    return String(value || "").trim();
}
function hasNonEmptyString(value) {
    return normalizeString(value).length > 0;
}
export function parseDirectiveIntegrationProof(value) {
    if (!value || typeof value !== "object")
        return null;
    const raw = value;
    if (!raw.execution || typeof raw.execution !== "object")
        return null;
    if (!raw.artifact || typeof raw.artifact !== "object")
        return null;
    const execution = raw.execution;
    const artifact = raw.artifact;
    if (execution.ok !== true)
        return null;
    if (!hasNonEmptyString(execution.method))
        return null;
    if (!hasNonEmptyString(execution.reference))
        return null;
    if (!hasNonEmptyString(execution.timestamp))
        return null;
    const parsedTimestamp = new Date(normalizeString(execution.timestamp));
    if (Number.isNaN(parsedTimestamp.getTime()))
        return null;
    const reportId = normalizeString(artifact.reportId) || null;
    const reportHref = normalizeString(artifact.reportHref) || null;
    const artifactPath = normalizeString(artifact.artifactPath) || null;
    const summary = normalizeString(artifact.summary) || null;
    if (!reportId && !reportHref && !artifactPath)
        return null;
    return {
        execution: {
            ok: true,
            method: normalizeString(execution.method),
            reference: normalizeString(execution.reference),
            timestamp: parsedTimestamp.toISOString(),
        },
        artifact: {
            reportId,
            reportHref,
            artifactPath,
            summary,
        },
    };
}
export function normalizeDirectiveSourceType(value) {
    const normalized = normalizeString(value).toLowerCase();
    const match = DIRECTIVE_SUPPORTED_SOURCE_TYPES.find((candidate) => candidate === normalized);
    if (match !== undefined) {
        return match;
    }
    throw new Error(`invalid_input: unsupported sourceType=${String(value || "")}; supported source types: ${DIRECTIVE_SUPPORTED_SOURCE_TYPES.join(", ")}`);
}
export function normalizeDirectiveRecommendation(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "ignore")
        return "ignore";
    if (normalized === "monitor")
        return "monitor";
    if (normalized === "test")
        return "test";
    throw new Error(`invalid_input: unsupported recommendation=${String(value || "")}`);
}
export function normalizeDirectiveEvaluationOutcome(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "positive")
        return "positive";
    if (normalized === "negative")
        return "negative";
    if (normalized === "mixed")
        return "mixed";
    if (normalized === "inconclusive")
        return "inconclusive";
    throw new Error(`invalid_input: unsupported evaluation outcome=${String(value || "")}`);
}
export function normalizeDirectiveDecision(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "adopt")
        return "adopt";
    if (normalized === "reject")
        return "reject";
    if (normalized === "defer")
        return "defer";
    if (normalized === "monitor")
        return "monitor";
    throw new Error(`invalid_input: unsupported decision=${String(value || "")}`);
}
export function normalizeDirectiveCapabilityStatus(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "intake")
        return "intake";
    if (normalized === "analyzed")
        return "analyzed";
    if (normalized === "experimenting")
        return "experimenting";
    if (normalized === "evaluated")
        return "evaluated";
    if (normalized === "decided")
        return "decided";
    if (normalized === "integrated")
        return "integrated";
    throw new Error(`invalid_input: unsupported capability status=${String(value || "")}`);
}
export function normalizeDirectiveExperimentStatus(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "proposed")
        return "proposed";
    if (normalized === "running")
        return "running";
    if (normalized === "completed")
        return "completed";
    if (normalized === "aborted")
        return "aborted";
    throw new Error(`invalid_input: unsupported experiment status=${String(value || "")}`);
}
export function normalizeDirectiveIntegrationStatus(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "planned")
        return "planned";
    if (normalized === "active")
        return "active";
    if (normalized === "parked")
        return "parked";
    if (normalized === "removed")
        return "removed";
    throw new Error(`invalid_input: unsupported integration status=${String(value || "")}`);
}
export function normalizeDirectiveFrameworkStatus(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "intake")
        return "intake";
    if (normalized === "analyzed")
        return "analyzed";
    if (normalized === "experimenting")
        return "experimenting";
    if (normalized === "evaluated")
        return "evaluated";
    if (normalized === "decided")
        return "decided";
    throw new Error(`invalid_input: unsupported framework status=${String(value || "")}`);
}
export function normalizeDirectiveRuntimeStatus(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "none")
        return "none";
    if (normalized === "planned")
        return "planned";
    if (normalized === "implementing")
        return "implementing";
    if (normalized === "callable")
        return "callable";
    if (normalized === "parked")
        return "parked";
    if (normalized === "removed")
        return "removed";
    throw new Error(`invalid_input: unsupported runtime status=${String(value || "")}`);
}
export function normalizeDirectiveIntegrationMode(value) {
    const normalized = normalizeString(value).toLowerCase();
    if (normalized === "reimplement")
        return "reimplement";
    if (normalized === "adapt")
        return "adapt";
    if (normalized === "wrap")
        return "wrap";
    throw new Error(`invalid_input: unsupported integrationMode=${String(value || "")}`);
}
export function normalizeDirectiveNotes(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => normalizeString(item))
        .filter(Boolean);
}
export function inferDirectiveCapabilityTitle(sourceRef) {
    const trimmed = normalizeString(sourceRef).replace(/\/+$/, "");
    if (!trimmed) {
        return "";
    }
    const slashParts = trimmed.split(/[\\/]/).filter(Boolean);
    const tail = slashParts[slashParts.length - 1] || trimmed;
    return tail.replace(/\.git$/i, "") || trimmed;
}
