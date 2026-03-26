import { LitElement, css, html, nothing } from "lit";

type FrontendCurrentHead = {
  artifact_path: string;
  artifact_kind: string;
  artifact_stage: string;
  artifact_lane: string;
  view_path: string;
};

type FrontendQueueEntry = {
  candidate_id: string;
  candidate_name: string;
  status: string;
  routing_target: string | null;
  routing_record_path?: string | null;
  result_record_path: string | null;
  integrity_state: "ok" | "broken" | null;
  current_case_stage: string | null;
  current_case_next_legal_step: string | null;
  current_head: FrontendCurrentHead | null;
};

type FrontendQueueOverview = {
  entries: FrontendQueueEntry[];
  totalEntries: number;
};

type FrontendHandoffStub = {
  kind: "architecture_handoff" | "architecture_handoff_invalid" | "runtime_follow_up";
  lane: "architecture" | "runtime";
  relativePath: string;
  candidateId: string;
  title: string;
  status: string;
  startRelativePath: string | null;
  warning: string | null;
};

type FrontendDiscoveryRoutingDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  sourceType?: string;
  decisionState?: string;
  adoptionTarget?: string;
  routeDestination?: string;
  whyThisRoute?: string;
  whyNotAlternatives?: string;
  requiredNextArtifact?: string;
  linkedIntakeRecord?: string;
  linkedTriageRecord?: string | null;
  reviewCadence?: string | null;
  engineRunId?: string | null;
  engineRunRecordPath?: string | null;
  engineRunReportPath?: string | null;
  usefulnessLevel?: string | null;
  usefulnessRationale?: string | null;
  matchedGapId?: string | null;
  downstreamStubRelativePath?: string | null;
  approvalAllowed?: boolean;
  content?: string;
};

type FrontendRuntimeFollowUpDetail = {
  ok: boolean;
  error?: string;
  kind?: "runtime_follow_up";
  relativePath?: string;
  content?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  status?: string;
  runtimeValueToOperationalize?: string;
  proposedHost?: string;
  proposedIntegrationMode?: string;
  reviewCadence?: string;
  linkedRoutingPath?: string | null;
  runtimeRecordRelativePath?: string;
  runtimeRecordExists?: boolean;
  approvalAllowed?: boolean;
};

type FrontendRuntimeRecordDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  runtimeObjective?: string;
  proposedHost?: string;
  proposedRuntimeSurface?: string;
  requiredProofSummary?: string;
  currentStatus?: string;
  linkedFollowUpRecord?: string;
  linkedRoutingPath?: string | null;
  runtimeProofRelativePath?: string;
  proofExists?: boolean;
  approvalAllowed?: boolean;
  content?: string;
};

type FrontendRuntimeProofDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  runtimeObjective?: string;
  proposedHost?: string;
  proposedRuntimeSurface?: string;
  currentStatus?: string;
  linkedRuntimeRecordPath?: string;
  linkedFollowUpPath?: string;
  linkedRoutingPath?: string | null;
  runtimeCapabilityBoundaryRelativePath?: string;
  runtimeCapabilityBoundaryExists?: boolean;
  approvalAllowed?: boolean;
  content?: string;
};

type FrontendRuntimeRuntimeCapabilityBoundaryDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  runtimeObjective?: string;
  proposedHost?: string;
  proposedRuntimeSurface?: string;
  currentProofStatus?: string;
  linkedRuntimeProofPath?: string;
  linkedRuntimeRecordPath?: string;
  linkedFollowUpPath?: string;
  linkedRoutingPath?: string | null;
  promotionReadinessRelativePath?: string;
  promotionReadinessExists?: boolean;
  approvalAllowed?: boolean;
  content?: string;
};

type FrontendArchitectureStartDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  objective?: string;
  startApproval?: string;
  resultSummary?: string;
  handoffStubPath?: string;
  resultRelativePath?: string | null;
  decisionRelativePath?: string | null;
  closeoutAssist?: {
    missionFitSummary: string;
    primaryAdoptionQuestion: string;
    extractedValue: string[];
    excludedBaggage: string[];
    directiveOwnedForm: string;
    adaptedValue: string[];
    improvementGoals: string[];
    intendedDelta: string;
    structuralStages: string[];
    stagePreservationExpectation: "preserve_explicit_stages" | "not_applicable";
    stagePreservationSummary: string;
    decisionGuidance: string;
    readinessGuidance: string[];
    suggestedResultSummary: string;
  };
  resultEvidence?: {
    availability: "direct_evidence" | "artifact_only" | "not_available";
    primaryKind: "code_path" | "artifact_path" | "none";
    primaryPath: string | null;
    primaryLabel: string;
    summary: string;
    supportingEvidence: Array<{
      kind: "bounded_result" | "closeout_decision" | "engine_run_record";
      path: string;
      label: string;
    }>;
  };
  content?: string;
};

type FrontendArchitectureResultDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  objective?: string;
  closeoutApproval?: string;
  resultSummary?: string;
  nextDecision?: string;
  verdict?: string;
  rationale?: string;
  startRelativePath?: string;
  handoffStubPath?: string;
  decisionRelativePath?: string;
  continuationStartRelativePath?: string | null;
  adoptionRelativePath?: string | null;
  resultEvidence?: {
    availability: "direct_evidence" | "artifact_only" | "not_available";
    primaryKind: "code_path" | "artifact_path" | "none";
    primaryPath: string | null;
    primaryLabel: string;
    summary: string;
    supportingEvidence: Array<{
      kind: "bounded_result" | "closeout_decision" | "engine_run_record";
      path: string;
      label: string;
    }>;
  };
  content?: string;
};

type FrontendArchitectureAdoptionDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  finalStatus?: string;
  sourceResultRelativePath?: string;
  decisionRelativePath?: string;
  implementationTargetRelativePath?: string | null;
  content?: string;
};

type FrontendArchitectureImplementationTargetDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  title?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  artifactType?: string;
  finalStatus?: string;
  objective?: string;
  expectedOutcome?: string;
  adoptionRelativePath?: string;
  decisionRelativePath?: string;
  sourceResultRelativePath?: string;
  implementationResultRelativePath?: string | null;
  content?: string;
};

type FrontendArchitectureImplementationResultDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  objective?: string;
  outcome?: "success" | "failure";
  resultSummary?: string;
  validationResult?: string;
  rollbackNote?: string;
  targetRelativePath?: string;
  adoptionRelativePath?: string;
  sourceResultRelativePath?: string;
  retainedRelativePath?: string | null;
  content?: string;
};

type FrontendArchitectureRetentionDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  objective?: string;
  stabilityLevel?: string;
  reuseScope?: string;
  confirmationDecision?: string;
  rollbackBoundary?: string;
  resultRelativePath?: string;
  targetRelativePath?: string;
  adoptionRelativePath?: string;
  sourceResultRelativePath?: string;
  integrationRecordRelativePath?: string | null;
  content?: string;
};

type FrontendArchitectureIntegrationRecordDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  objective?: string;
  integrationTargetSurface?: string;
  readinessSummary?: string;
  expectedEffect?: string;
  validationBoundary?: string;
  integrationDecision?: string;
  rollbackBoundary?: string;
  retainedRelativePath?: string;
  resultRelativePath?: string;
  targetRelativePath?: string;
  adoptionRelativePath?: string;
  sourceResultRelativePath?: string;
  consumptionRelativePath?: string | null;
  content?: string;
};

type FrontendArchitectureConsumptionRecordDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  objective?: string;
  appliedSurface?: string;
  applicationSummary?: string;
  observedEffect?: string;
  validationResult?: string;
  outcome?: "success" | "failure";
  rollbackNote?: string;
  integrationRelativePath?: string;
  retainedRelativePath?: string;
  resultRelativePath?: string;
  targetRelativePath?: string;
  adoptionRelativePath?: string;
  sourceResultRelativePath?: string;
  evaluationRelativePath?: string | null;
  content?: string;
};

type FrontendArchitecturePostConsumptionEvaluationDetail = {
  ok: boolean;
  error?: string;
  relativePath?: string;
  absolutePath?: string;
  candidateId?: string;
  candidateName?: string;
  usefulnessLevel?: string;
  objective?: string;
  decision?: "keep" | "reopen";
  rationale?: string;
  observedStability?: string;
  retainedUsefulnessAssessment?: string;
  nextBoundedAction?: string;
  rollbackNote?: string;
  reopenedStartRelativePath?: string | null;
  consumptionRelativePath?: string;
  integrationRelativePath?: string;
  retainedRelativePath?: string;
  resultRelativePath?: string;
  targetRelativePath?: string;
  adoptionRelativePath?: string;
  sourceResultRelativePath?: string;
  content?: string;
};

type FrontendEngineRunRecord = {
  runId: string;
  receivedAt: string;
  candidate: {
    candidateId: string;
    candidateName: string;
    usefulnessLevel: string;
  };
  selectedLane: {
    laneId: string;
  };
  analysis: {
    usefulnessRationale: string;
  };
  decision: {
    decisionState: string;
  };
  proofPlan: {
    proofKind: string;
  };
  integrationProposal: {
    integrationMode: string;
  };
  reportPlan: {
    summary: string;
  };
};

type FrontendEngineRunsOverview = {
  recentRuns: Array<{
    record: FrontendEngineRunRecord;
  }>;
  totalRuns: number;
};

type FrontendEngineRunDetail = {
  ok: boolean;
  error?: string;
  record?: FrontendEngineRunRecord;
  recordPath?: string | null;
  reportPath?: string | null;
  reportContent?: string | null;
  reportExcerpt?: string | null;
};

type FrontendSnapshot = {
  engineRuns: FrontendEngineRunsOverview;
  queue: FrontendQueueOverview;
  handoffStubs: FrontendHandoffStub[];
  handoffWarnings: string[];
};

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error((await response.text()) || `request_failed:${response.status}`);
  }
  return response.json() as Promise<T>;
}

function navTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function artifactPathToViewPath(relativePath: string) {
  if (relativePath.startsWith("architecture/02-experiments/") && relativePath.endsWith("-bounded-start.md")) {
    return `/architecture-starts/view?path=${encodeURIComponent(relativePath)}`;
  }
  if (
    (relativePath.startsWith("architecture/02-experiments/") || relativePath.startsWith("architecture/01-bounded-starts/"))
    && relativePath.endsWith("-bounded-result.md")
  ) {
    return `/architecture-results/view?path=${encodeURIComponent(relativePath)}`;
  }
  return `/artifacts?path=${encodeURIComponent(relativePath)}`;
}

class DirectiveFrontendApp extends LitElement {
  static properties = {
    route: { state: true },
    page: { state: true },
    loading: { state: true },
    error: { state: true },
    submitResult: { state: true },
    submitError: { state: true },
  };

  static styles = css`
    :host { display:block; color:#1f1c16; }
    main { max-width:1180px; margin:0 auto; padding:20px; }
    .panel { background:#fffdf7; border:1px solid #d9d0bf; border-radius:10px; padding:16px; margin:0 0 16px; }
    .grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
    .nav { display:inline-block; margin:6px 8px 0 0; padding:6px 10px; border:1px solid #cfc5b4; border-radius:999px; text-decoration:none; color:#1f1c16; background:#fcf9f1; }
    .nav.active { background:#1f1c16; color:#fff; border-color:#1f1c16; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th, td { text-align:left; padding:8px; border-bottom:1px solid #e7dfd1; vertical-align:top; }
    input, textarea, select, button { font:inherit; }
    input, textarea, select { width:100%; box-sizing:border-box; padding:8px; border:1px solid #bfb39d; border-radius:6px; background:#fff; }
    textarea { min-height:96px; resize:vertical; }
    button { padding:8px 12px; border-radius:6px; border:1px solid #1f1c16; background:#1f1c16; color:#fff; cursor:pointer; }
    button.secondary { background:#fffdf7; color:#1f1c16; }
    .row { display:grid; gap:8px; margin:0 0 10px; }
    label, .muted { font-size:12px; color:#5c5548; }
    .pill { display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid #cabb9e; font-size:12px; }
    .actions { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .message { background:#eef6ff; border-color:#b7d4ff; }
    .warning { background:#fff7e8; border-color:#e7c88d; }
    .good { background:#eef8ef; border-color:#a8d1ad; }
    pre { white-space:pre-wrap; word-break:break-word; background:#faf7ef; padding:12px; border:1px solid #e1d8c7; border-radius:8px; overflow-x:auto; }
    a { color:#1155aa; text-decoration:none; }
    a:hover { text-decoration:underline; }
    ul { margin:0; padding-left:18px; }
    .mono { word-break:break-all; }
  `;

  declare route: string;
  declare page: any;
  declare loading: boolean;
  declare error: string;
  declare submitResult: any;
  declare submitError: string;

  constructor() {
    super();
    this.route = "";
    this.page = null;
    this.loading = true;
    this.error = "";
    this.submitResult = null;
    this.submitError = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.handleRoute);
    this.handleRoute();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.handleRoute);
    super.disconnectedCallback();
  }

  private handleRoute = async () => {
    const url = new URL(window.location.href);
    this.route = `${url.pathname}${url.search}`;
    this.loading = true;
    this.error = "";
    try {
      if (url.pathname === "/") {
        this.page = { kind: "home", data: await getJson<FrontendSnapshot>("/api/snapshot") };
      } else if (url.pathname === "/submit") {
        this.page = { kind: "submit" };
      } else if (url.pathname === "/engine-runs") {
        this.page = { kind: "engine-runs", data: await getJson<FrontendEngineRunsOverview>("/api/engine-runs") };
      } else if (url.pathname.startsWith("/engine-runs/")) {
        const runId = decodeURIComponent(url.pathname.replace(/^\/engine-runs\//, ""));
        const [detail, queue, handoffs] = await Promise.all([
          getJson<FrontendEngineRunDetail>(`/api/engine-runs/${encodeURIComponent(runId)}`),
          getJson<FrontendQueueOverview>("/api/queue"),
          getJson<FrontendHandoffStub[]>("/api/handoffs"),
        ]);
        this.page = { kind: "engine-run-detail", detail, queue, handoffs };
      } else if (url.pathname === "/queue") {
        const [queue, runs, handoffs] = await Promise.all([
          getJson<FrontendQueueOverview>("/api/queue"),
          getJson<FrontendEngineRunsOverview>("/api/engine-runs"),
          getJson<FrontendHandoffStub[]>("/api/handoffs"),
        ]);
        this.page = { kind: "queue", queue, runs, handoffs };
      } else if (url.pathname === "/discovery-routing-records/view") {
        this.page = {
          kind: "discovery-routing-detail",
          data: await getJson<FrontendDiscoveryRoutingDetail>(
            `/api/discovery-routing-records/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`,
          ),
        };
      } else if (url.pathname === "/handoffs") {
        this.page = { kind: "handoffs", data: await getJson<FrontendSnapshot>("/api/snapshot") };
      } else if (url.pathname === "/handoffs/view") {
        this.page = { kind: "handoff-detail", data: await getJson(`/api/handoffs/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/runtime-records/view") {
        this.page = { kind: "runtime-record-detail", data: await getJson<FrontendRuntimeRecordDetail>(`/api/runtime-records/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/runtime-proofs/view") {
        this.page = { kind: "runtime-proof-detail", data: await getJson<FrontendRuntimeProofDetail>(`/api/runtime-proofs/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/runtime-runtime-capability-boundaries/view") {
        this.page = {
          kind: "runtime-runtime-capability-boundary-detail",
          data: await getJson<FrontendRuntimeRuntimeCapabilityBoundaryDetail>(
            `/api/runtime-runtime-capability-boundaries/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`,
          ),
        };
      } else if (url.pathname === "/architecture-starts/view") {
        this.page = { kind: "architecture-start", data: await getJson<FrontendArchitectureStartDetail>(`/api/architecture-starts/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-results/view") {
        this.page = { kind: "architecture-result", data: await getJson<FrontendArchitectureResultDetail>(`/api/architecture-results/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-adoptions/view") {
        this.page = { kind: "architecture-adoption", data: await getJson<FrontendArchitectureAdoptionDetail>(`/api/architecture-adoptions/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-implementation-targets/view") {
        this.page = { kind: "architecture-implementation-target", data: await getJson<FrontendArchitectureImplementationTargetDetail>(`/api/architecture-implementation-targets/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-implementation-results/view") {
        this.page = { kind: "architecture-implementation-result", data: await getJson<FrontendArchitectureImplementationResultDetail>(`/api/architecture-implementation-results/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-retained/view") {
        this.page = { kind: "architecture-retained", data: await getJson<FrontendArchitectureRetentionDetail>(`/api/architecture-retained/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-integration-records/view") {
        this.page = { kind: "architecture-integration-record", data: await getJson<FrontendArchitectureIntegrationRecordDetail>(`/api/architecture-integration-records/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-consumption-records/view") {
        this.page = { kind: "architecture-consumption-record", data: await getJson<FrontendArchitectureConsumptionRecordDetail>(`/api/architecture-consumption-records/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-post-consumption-evaluations/view") {
        this.page = { kind: "architecture-post-consumption-evaluation", data: await getJson<FrontendArchitecturePostConsumptionEvaluationDetail>(`/api/architecture-post-consumption-evaluations/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/artifacts") {
        this.page = { kind: "artifact", data: await getJson(`/api/artifacts?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else {
        this.page = { kind: "not-found", path: url.pathname };
      }
    } catch (error) {
      this.error = String((error as Error).message || error);
    } finally {
      this.loading = false;
    }
  };

  private link(path: string, label: string, active = false) {
    return html`<a class=${active ? "nav active" : "nav"} href=${path} @click=${(event: Event) => { event.preventDefault(); navTo(path); }}>${label}</a>`;
  }

  private artifactLink(pathValue: string | null | undefined) {
    if (!pathValue) return html`<span class="muted">n/a</span>`;
    const href = `/artifacts?path=${encodeURIComponent(pathValue)}`;
    return html`<a href=${href} @click=${(event: Event) => { event.preventDefault(); navTo(href); }}>${pathValue}</a>`;
  }

  private currentHeadLink(entry: FrontendQueueEntry) {
    const head = entry.current_head;
    if (!head) {
      return html`<span class="muted">n/a</span>`;
    }

    return html`<a href=${head.view_path} @click=${(event: Event) => { event.preventDefault(); navTo(head.view_path); }}>${head.artifact_path}</a>`;
  }

  private currentHeadSummary(entry: FrontendQueueEntry) {
    const head = entry.current_head;
    if (!head) {
      return html`<span class="muted">not resolved yet</span>`;
    }

    return html`
      <div>${this.currentHeadLink(entry)}</div>
      <div class="muted">${head.artifact_stage} | ${head.artifact_lane}</div>
    `;
  }

  private async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.submitResult = null;
    this.submitError = "";
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const candidateName = String(data.get("candidate_name") || "").trim();
    const candidateId = String(data.get("candidate_id") || "").trim()
      || candidateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      || `candidate-${Date.now()}`;
    const body = {
      candidate_id: candidateId,
      candidate_name: candidateName || candidateId,
      source_type: String(data.get("source_type") || "internal-signal").trim() || "internal-signal",
      source_reference: String(data.get("source_reference") || "").trim(),
      mission_alignment: String(data.get("mission_alignment") || "").trim() || null,
      capability_gap_id: String(data.get("capability_gap_id") || "").trim() || null,
      notes: String(data.get("notes") || "").trim() || null,
    };

    try {
      const result: any = await getJson("/api/discovery/front-door", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      this.submitResult = {
        ...result,
        request: body,
      };
      form.reset();
    } catch (error) {
      this.submitError = String((error as Error).message || error);
    }
  }

  private async approveDiscoveryRoute(routingPath: string) {
    try {
      const result: any = await getJson("/api/discovery/open-route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          routingPath,
          approved: true,
        }),
      });
      navTo(`/handoffs/view?path=${encodeURIComponent(result.stubRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async approveRuntimeFollowUp(followUpPath: string) {
    try {
      const result: any = await getJson("/api/runtime/open-follow-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          followUpPath,
          approved: true,
        }),
      });
      navTo(`/runtime-records/view?path=${encodeURIComponent(result.runtimeRecordRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async approveRuntimeRecordProof(runtimeRecordPath: string) {
    try {
      const result: any = await getJson("/api/runtime/open-proof", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          runtimeRecordPath,
          approved: true,
        }),
      });
      navTo(`/runtime-proofs/view?path=${encodeURIComponent(result.runtimeProofRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async approveRuntimeProofRuntimeCapabilityBoundary(runtimeProofPath: string) {
    try {
      const result: any = await getJson("/api/runtime/open-runtime-capability-boundary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          runtimeProofPath,
          approved: true,
        }),
      });
      navTo(`/runtime-runtime-capability-boundaries/view?path=${encodeURIComponent(result.runtimeCapabilityBoundaryRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async approveRuntimePromotionReadiness(capabilityBoundaryPath: string) {
    try {
      const result: any = await getJson("/api/runtime/open-promotion-readiness", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          capabilityBoundaryPath,
          approved: true,
        }),
      });
      navTo(`/artifacts?path=${encodeURIComponent(result.promotionReadinessRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async startArchitecture(handoffPath: string) {
    try {
      const result: any = await getJson("/api/architecture/handoff-start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ handoffPath }),
      });
      navTo(`/architecture-starts/view?path=${encodeURIComponent(result.startRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async closeArchitectureStart(form: HTMLFormElement, startPath: string) {
    try {
      const data = new FormData(form);
      const resultSummary = String(data.get("result_summary") || "").trim();
      const primaryEvidencePath = String(data.get("primary_evidence_path") || "").trim();
      const transformedArtifactsProduced = String(
        data.get("transformed_artifacts_produced") || "",
      )
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
      if (!resultSummary) {
        throw new Error("result_summary_required");
      }

      const result: any = await getJson("/api/architecture/bounded-closeout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startPath,
          resultSummary,
          primaryEvidencePath: primaryEvidencePath || undefined,
          transformedArtifactsProduced,
          nextDecision: String(data.get("next_decision") || "needs-more-evidence").trim(),
          valueShape: String(data.get("value_shape") || "working_document").trim(),
          adaptationQuality: String(data.get("adaptation_quality") || "adequate").trim(),
          improvementQuality: String(data.get("improvement_quality") || "skipped").trim(),
          proofExecuted: data.get("proof_executed") === "on",
          targetArtifactClarified: data.get("target_artifact_clarified") === "on",
          deltaEvidencePresent: data.get("delta_evidence_present") === "on",
          noUnresolvedBaggage: data.get("no_unresolved_baggage") === "on",
          productArtifactMaterialized: data.get("product_artifact_materialized") === "on",
        }),
      });
      navTo(`/architecture-results/view?path=${encodeURIComponent(result.resultRelativePath)}`);
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async continueArchitectureResult(resultPath: string) {
    try {
      const result: any = await getJson("/api/architecture/bounded-continuation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resultPath }),
      });
      navTo(
        `/architecture-starts/view?path=${encodeURIComponent(result.continuationStartRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async adoptArchitectureResult(resultPath: string) {
    try {
      const result: any = await getJson("/api/architecture/adopt-result", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resultPath }),
      });
      navTo(
        `/architecture-adoptions/view?path=${encodeURIComponent(result.adoptedRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async createArchitectureImplementationTarget(adoptionPath: string) {
    try {
      const result: any = await getJson("/api/architecture/create-implementation-target", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adoptionPath }),
      });
      navTo(
        `/architecture-implementation-targets/view?path=${encodeURIComponent(result.targetRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async completeArchitectureImplementation(form: HTMLFormElement, targetPath: string) {
    try {
      const data = new FormData(form);
      const resultSummary = String(data.get("result_summary") || "").trim();
      if (!resultSummary) {
        throw new Error("result_summary_required");
      }

      const result: any = await getJson("/api/architecture/create-implementation-result", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetPath,
          resultSummary,
          outcome: String(data.get("outcome") || "success").trim(),
          deviations: String(data.get("deviations") || "").trim(),
          evidence: String(data.get("evidence") || "").trim(),
          validationResult: String(data.get("validation_result") || "").trim(),
          rollbackNote: String(data.get("rollback_note") || "").trim(),
        }),
      });
      navTo(
        `/architecture-implementation-results/view?path=${encodeURIComponent(result.resultRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async confirmArchitectureRetention(form: HTMLFormElement, resultPath: string) {
    try {
      const data = new FormData(form);
      const result: any = await getJson("/api/architecture/confirm-retention", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resultPath,
          usefulnessAssessment: String(data.get("usefulness_assessment") || "").trim(),
          stabilityLevel: String(data.get("stability_level") || "bounded-stable").trim(),
          reuseScope: String(data.get("reuse_scope") || "").trim(),
          confirmationDecision: String(data.get("confirmation_decision") || "").trim(),
          rollbackBoundary: String(data.get("rollback_boundary") || "").trim(),
        }),
      });
      navTo(
        `/architecture-retained/view?path=${encodeURIComponent(result.retainedRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async createArchitectureIntegrationRecord(form: HTMLFormElement, retainedPath: string) {
    try {
      const data = new FormData(form);
      const result: any = await getJson("/api/architecture/create-integration-record", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          retainedPath,
          integrationTargetSurface: String(data.get("integration_target_surface") || "").trim(),
          readinessSummary: String(data.get("readiness_summary") || "").trim(),
          expectedEffect: String(data.get("expected_effect") || "").trim(),
          validationBoundary: String(data.get("validation_boundary") || "").trim(),
          integrationDecision: String(data.get("integration_decision") || "").trim(),
          rollbackBoundary: String(data.get("rollback_boundary") || "").trim(),
        }),
      });
      navTo(
        `/architecture-integration-records/view?path=${encodeURIComponent(result.integrationRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async recordArchitectureConsumption(form: HTMLFormElement, integrationPath: string) {
    try {
      const data = new FormData(form);
      const result: any = await getJson("/api/architecture/record-consumption", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          integrationPath,
          appliedSurface: String(data.get("applied_surface") || "").trim(),
          applicationSummary: String(data.get("application_summary") || "").trim(),
          observedEffect: String(data.get("observed_effect") || "").trim(),
          validationResult: String(data.get("validation_result") || "").trim(),
          outcome: String(data.get("outcome") || "success").trim(),
          rollbackNote: String(data.get("rollback_note") || "").trim(),
        }),
      });
      navTo(
        `/architecture-consumption-records/view?path=${encodeURIComponent(result.consumptionRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async evaluateArchitectureConsumption(form: HTMLFormElement, consumptionPath: string) {
    try {
      const data = new FormData(form);
      const result: any = await getJson("/api/architecture/evaluate-consumption", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          consumptionPath,
          decision: String(data.get("decision") || "keep").trim(),
          rationale: String(data.get("rationale") || "").trim(),
          observedStability: String(data.get("observed_stability") || "").trim(),
          retainedUsefulnessAssessment: String(data.get("retained_usefulness_assessment") || "").trim(),
          nextBoundedAction: String(data.get("next_bounded_action") || "").trim(),
          rollbackNote: String(data.get("rollback_note") || "").trim(),
        }),
      });
      navTo(
        `/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(result.evaluationRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private async reopenArchitectureFromEvaluation(evaluationPath: string) {
    try {
      const result: any = await getJson("/api/architecture/reopen-from-evaluation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ evaluationPath }),
      });
      navTo(
        `/architecture-starts/view?path=${encodeURIComponent(result.reopenedStartRelativePath)}`,
      );
    } catch (error) {
      this.error = String((error as Error).message || error);
    }
  }

  private renderContent() {
    if (this.loading) {
      return html`<section class="panel message"><h2>Loading</h2><p>Reading live Directive Workspace state.</p></section>`;
    }
    if (this.error) {
      return html`<section class="panel warning"><h2>Frontend error</h2><pre>${this.error}</pre></section>`;
    }
    if (!this.page) return nothing;

    if (this.page.kind === "home") {
      const snapshot = this.page.data;
      return html`
        <section class="panel"><h2>Standalone frontend scope</h2><p class="muted">Use this frontend to operate the real loop directly in Directive Workspace: source submit through Discovery -> Engine-backed usefulness and routing -> inspectable Discovery intake/triage/routing outputs -> explicit route approval -> bounded downstream stub inspection. Downstream Architecture or Runtime execution still does not happen automatically.</p></section>
        ${snapshot.handoffWarnings?.length ? html`<section class="panel warning"><h3>Handoff artifact warnings</h3><ul>${snapshot.handoffWarnings.map((warning: string) => html`<li>${warning}</li>`)}</ul></section>` : nothing}
        <section class="grid">
          <section class="panel"><h3>Engine runs</h3><div>${snapshot.engineRuns.totalRuns}</div><div class="muted">Persisted Engine-native runs.</div></section>
          <section class="panel"><h3>Queue entries</h3><div>${snapshot.queue.totalEntries}</div><div class="muted">Discovery intake queue.</div></section>
          <section class="panel"><h3>Handoff stubs</h3><div>${snapshot.handoffStubs.length}</div><div class="muted">Architecture handoffs and Runtime follow-ups.</div></section>
        </section>
      `;
    }

    if (this.page.kind === "submit") {
      const result = this.submitResult;
      const intakePath = result?.createdPaths?.intakeRecordPath ?? null;
      const triagePath = result?.createdPaths?.triageRecordPath ?? null;
      const routingPath = result?.createdPaths?.routingRecordPath ?? null;
      const engineRunId = result?.engine?.record?.runId ?? null;
      return html`
        <section class="panel">
          <h2>Source submission</h2>
          <p class="muted">Discovery is the front door. This form submits one real source through the shared Engine, records mission-aware usefulness and routing, writes Discovery intake/triage/routing artifacts, and advances the queue to an inspectable routed state.</p>
          <form @submit=${this.onSubmit}>
            <div class="grid">
              <div class="row"><label>candidate name</label><input name="candidate_name" required /></div>
              <div class="row"><label>candidate id (optional)</label><input name="candidate_id" /></div>
              <div class="row"><label>source type</label><select name="source_type"><option value="internal-signal">internal-signal</option><option value="github-repo">github-repo</option><option value="paper">paper</option><option value="product-doc">product-doc</option><option value="technical-essay">technical-essay</option><option value="workflow-writeup">workflow-writeup</option><option value="theory">theory</option><option value="external-system">external-system</option></select></div>
              <div class="row"><label>capability gap id (optional)</label><input name="capability_gap_id" /></div>
            </div>
            <div class="row"><label>source reference</label><input name="source_reference" required /></div>
            <div class="row"><label>mission alignment</label><textarea name="mission_alignment"></textarea></div>
            <div class="row"><label>notes</label><textarea name="notes"></textarea></div>
            <div class="actions"><button type="submit">Submit Through Discovery</button></div>
          </form>
        </section>
        ${this.submitError ? html`<section class="panel warning"><h3>Submission error</h3><pre>${this.submitError}</pre></section>` : nothing}
        ${result ? html`
          <section class="panel message"><h2>Discovery result</h2><table><tbody>
            <tr><th>candidate id</th><td>${result.request.candidate_id}</td></tr>
            <tr><th>candidate name</th><td>${result.request.candidate_name}</td></tr>
            <tr><th>source reference</th><td>${result.request.source_reference}</td></tr>
            <tr><th>source type</th><td>${result.sourceType?.canonicalType ?? result.queueEntry?.source_type ?? result.request.source_type ?? "n/a"}</td></tr>
            ${result.sourceType?.normalizedFrom ? html`<tr><th>normalized from source type</th><td>${result.sourceType.normalizedFrom}</td></tr>` : nothing}
            <tr><th>usefulness level</th><td>${result.discovery?.usefulnessLevel ?? "n/a"}</td></tr>
            <tr><th>usefulness rationale</th><td>${result.discovery?.usefulnessRationale ?? "n/a"}</td></tr>
            <tr><th>routing target</th><td>${result.discovery?.routingTarget ?? result.queueEntry?.routing_target ?? "n/a"}</td></tr>
            <tr><th>decision state</th><td>${result.discovery?.decisionState ?? "n/a"}</td></tr>
            <tr><th>routing confidence</th><td>${result.discovery?.confidence ?? "n/a"}</td></tr>
            <tr><th>matched capability gap</th><td>${result.discovery?.matchedGapId ?? result.queueEntry?.capability_gap_id ?? "n/a"}</td></tr>
            <tr><th>proof kind</th><td>${result.discovery?.proofKind ?? "n/a"}</td></tr>
            <tr><th>proof objective</th><td>${result.discovery?.proofObjective ?? "n/a"}</td></tr>
            <tr><th>queue status</th><td>${result.queueEntry?.status ?? "pending"}</td></tr>
            <tr><th>Discovery intake record</th><td>${this.artifactLink(intakePath)}</td></tr>
            <tr><th>Discovery triage record</th><td>${this.artifactLink(triagePath)}</td></tr>
            <tr><th>Discovery routing record</th><td>${routingPath ? html`<a href=${`/discovery-routing-records/view?path=${encodeURIComponent(routingPath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/discovery-routing-records/view?path=${encodeURIComponent(routingPath)}`); }}>${routingPath}</a>` : html`<span class="muted">n/a</span>`}</td></tr>
          </tbody></table></section>
          <section class="panel good">
            <h3>Current boundary</h3>
            <p>This source has now entered through Discovery first, with inspectable intake, triage, routing, queue, and Engine outputs. Opening the next Architecture or Runtime stub still requires explicit human approval from the Discovery routing record.</p>
            <div class="actions">
              ${engineRunId ? html`<a href=${`/engine-runs/${encodeURIComponent(engineRunId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(engineRunId)}`); }}>Open Engine run detail</a>` : nothing}
              <a href="/queue" @click=${(event: Event) => { event.preventDefault(); navTo("/queue"); }}>Open queue view</a>
              ${routingPath ? html`<a href=${`/discovery-routing-records/view?path=${encodeURIComponent(routingPath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/discovery-routing-records/view?path=${encodeURIComponent(routingPath)}`); }}>Open Discovery routing record</a>` : nothing}
            </div>
          </section>` : nothing}
      `;
    }

    if (this.page.kind === "engine-runs") {
      const overview = this.page.data;
      return html`<section class="panel"><h2>Engine runs</h2><table><thead><tr><th>run id</th><th>candidate</th><th>lane</th><th>usefulness</th><th>decision</th><th>created</th></tr></thead><tbody>
        ${overview.recentRuns.length ? overview.recentRuns.map((run: any) => html`<tr><td><a href=${`/engine-runs/${encodeURIComponent(run.record.runId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(run.record.runId)}`); }}>${run.record.runId}</a></td><td>${run.record.candidate.candidateName}</td><td><span class="pill">${run.record.selectedLane.laneId}</span></td><td>${run.record.candidate.usefulnessLevel}</td><td>${run.record.decision.decisionState}</td><td>${run.record.receivedAt}</td></tr>`) : html`<tr><td colspan="6" class="muted">No Engine runs found.</td></tr>`}
      </tbody></table></section>`;
    }

    if (this.page.kind === "engine-run-detail") {
      const detail = this.page.detail;
      if (!detail.ok || !detail.record) return html`<section class="panel warning"><h2>Run not found</h2><pre>${detail.error ?? "run_not_found"}</pre></section>`;
      const record = detail.record;
      const queueEntry = (this.page.queue.entries || []).find((entry: any) => entry.candidate_id === record.candidate.candidateId) ?? null;
      const relatedHandoffs = (this.page.handoffs || []).filter((stub: any) => stub.candidateId === record.candidate.candidateId);
      const noDownstream = queueEntry && !queueEntry.result_record_path ? "No downstream handoff was materialized from this path yet. The Engine run exists, but this frontend submission flow still stops before queue advancement into a lane-native handoff artifact." : "";
      return html`
        <section class="panel"><h2>Engine run detail</h2><table><tbody>
          <tr><th>run id</th><td>${record.runId}</td></tr>
          <tr><th>candidate</th><td>${record.candidate.candidateName}</td></tr>
          <tr><th>lane</th><td><span class="pill">${record.selectedLane.laneId}</span></td></tr>
          <tr><th>usefulness level</th><td>${record.candidate.usefulnessLevel}</td></tr>
          <tr><th>usefulness rationale</th><td>${record.analysis.usefulnessRationale}</td></tr>
          <tr><th>decision state</th><td>${record.decision.decisionState}</td></tr>
          <tr><th>proof kind</th><td>${record.proofPlan.proofKind}</td></tr>
          <tr><th>integration mode</th><td>${record.integrationProposal.integrationMode}</td></tr>
          <tr><th>report summary</th><td>${record.reportPlan.summary}</td></tr>
          <tr><th>record path</th><td>${this.artifactLink(detail.recordPath)}</td></tr>
          <tr><th>report path</th><td>${this.artifactLink(detail.reportPath)}</td></tr>
        </tbody></table></section>
        <section class=${noDownstream ? "panel warning" : "panel message"}>
          <h3>Related queue and handoff state</h3>
          <div class="muted">queue status: ${queueEntry?.status ?? "n/a"} | routing target: ${queueEntry?.routing_target ?? "n/a"}</div>
          <div class="muted">first downstream stub: ${queueEntry?.result_record_path ?? "n/a"}</div>
          <div class="muted">current case stage: ${queueEntry?.current_case_stage ?? "n/a"} | integrity: ${queueEntry?.integrity_state ?? "n/a"}</div>
          <div class="muted">current live artifact: ${queueEntry?.current_head ? html`<a href=${queueEntry.current_head.view_path} @click=${(event: Event) => { event.preventDefault(); navTo(queueEntry.current_head?.view_path || ""); }}>${queueEntry.current_head.artifact_path}</a>` : "n/a"}</div>
          <div class="muted">current live artifact stage: ${queueEntry?.current_head?.artifact_stage ?? "n/a"}</div>
          <div class="muted">continue from here: ${queueEntry?.current_case_next_legal_step ?? "n/a"}</div>
          ${relatedHandoffs.length ? html`<ul>${relatedHandoffs.map((stub: any) => html`<li><a href=${`/handoffs/view?path=${encodeURIComponent(stub.relativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(stub.relativePath)}`); }}>${stub.title}</a></li>`)}</ul>` : html`<div class="muted">No routed handoff stub found for this run.</div>`}
          ${noDownstream ? html`<p>${noDownstream}</p>` : nothing}
        </section>
        <section class="panel"><h3>Paired markdown report</h3><pre>${detail.reportContent ?? detail.reportExcerpt ?? "No report content."}</pre></section>
      `;
    }

    if (this.page.kind === "queue") {
      const runByCandidateId = new Map<string, FrontendEngineRunRecord>(
        (this.page.runs.recentRuns || []).map((run: { record: FrontendEngineRunRecord }) => [run.record.candidate.candidateId, run.record]),
      );
      const handoffByCandidateId = new Map<string, FrontendHandoffStub>(
        (this.page.handoffs || []).map((stub: FrontendHandoffStub) => [stub.candidateId, stub]),
      );
      return html`<section class="panel"><h2>Discovery queue</h2><table><thead><tr><th>candidate</th><th>status</th><th>routing target</th><th>Engine run</th><th>first downstream stub</th><th>current live artifact</th><th>current case stage</th><th>continue from here</th></tr></thead><tbody>
        ${this.page.queue.entries.length ? this.page.queue.entries.map((entry: any) => {
          const run = runByCandidateId.get(entry.candidate_id);
          const handoff = handoffByCandidateId.get(entry.candidate_id);
          const handoffPath = entry.result_record_path ?? handoff?.relativePath ?? null;
          return html`<tr>
            <td>${entry.candidate_name}</td>
            <td>
              <div>${entry.status}</div>
              <div class="muted">${entry.integrity_state ?? "n/a"}</div>
            </td>
            <td>${entry.routing_target ?? "n/a"}</td>
            <td>${run ? html`<a href=${`/engine-runs/${encodeURIComponent(run.runId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(run.runId)}`); }}>${run.runId}</a>` : html`<span class="muted">n/a</span>`}</td>
            <td>${handoffPath ? html`<a href=${`/handoffs/view?path=${encodeURIComponent(handoffPath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(handoffPath)}`); }}>${handoffPath}</a>` : html`<span class="muted">n/a</span>`}</td>
            <td>${this.currentHeadSummary(entry)}</td>
            <td>${entry.current_case_stage ?? "n/a"}</td>
            <td>${entry.current_case_next_legal_step ?? "n/a"}</td>
          </tr>`;
        }) : html`<tr><td colspan="8" class="muted">No queue entries found.</td></tr>`}
      </tbody></table></section>`;
    }

    if (this.page.kind === "discovery-routing-detail") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Discovery routing record not found</h2><pre>${detail.error}</pre></section>`;
      const openLabel = detail.routeDestination === "runtime"
        ? "Approve Runtime follow-up"
        : "Approve Architecture handoff";
      return html`
        <section class="panel"><h2>Discovery routing record</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>source type</th><td>${detail.sourceType}</td></tr>
          <tr><th>decision state</th><td>${detail.decisionState}</td></tr>
          <tr><th>route destination</th><td><span class="pill">${detail.routeDestination}</span></td></tr>
          <tr><th>adoption target</th><td>${detail.adoptionTarget}</td></tr>
          <tr><th>why this route</th><td>${detail.whyThisRoute}</td></tr>
          <tr><th>why not alternatives</th><td>${detail.whyNotAlternatives}</td></tr>
          <tr><th>required next artifact</th><td>${detail.requiredNextArtifact}</td></tr>
          <tr><th>review cadence</th><td>${detail.reviewCadence ?? "n/a"}</td></tr>
          <tr><th>matched capability gap</th><td>${detail.matchedGapId ?? "n/a"}</td></tr>
          <tr><th>Engine usefulness level</th><td>${detail.usefulnessLevel ?? "n/a"}</td></tr>
          <tr><th>Engine usefulness rationale</th><td>${detail.usefulnessRationale ?? "n/a"}</td></tr>
          <tr><th>linked intake record</th><td>${this.artifactLink(detail.linkedIntakeRecord)}</td></tr>
          <tr><th>linked triage record</th><td>${this.artifactLink(detail.linkedTriageRecord)}</td></tr>
          <tr><th>Engine run record</th><td>${detail.engineRunRecordPath ? this.artifactLink(detail.engineRunRecordPath) : html`<span class="muted">not resolved</span>`}</td></tr>
          <tr><th>Engine run report</th><td>${detail.engineRunReportPath ? this.artifactLink(detail.engineRunReportPath) : html`<span class="muted">not resolved</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.downstreamStubRelativePath ? "panel good" : detail.approvalAllowed ? "panel message" : "panel warning"}>
          <h3>Route approval</h3>
          <p>${detail.downstreamStubRelativePath
            ? "This Discovery routing decision has already been approved and opened into one downstream bounded stub."
            : detail.approvalAllowed
              ? "Discovery stays first and inspectable here. Opening the next bounded Architecture or Runtime stub requires this explicit approval action and stops before any downstream execution."
              : "This routing record does not currently open a downstream Architecture or Runtime stub."}</p>
          <div class="actions">
            ${detail.engineRunId ? html`<a href=${`/engine-runs/${encodeURIComponent(detail.engineRunId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(detail.engineRunId || "")}`); }}>Open Engine run detail</a>` : nothing}
            ${detail.downstreamStubRelativePath
              ? html`<a href=${`/handoffs/view?path=${encodeURIComponent(detail.downstreamStubRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(detail.downstreamStubRelativePath || "")}`); }}>Open downstream stub</a>`
              : detail.approvalAllowed
                ? html`<button @click=${() => this.approveDiscoveryRoute(detail.relativePath || "")}>${openLabel}</button>`
                : nothing}
          </div>
        </section>
        <section class="panel"><h3>Raw routing artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "handoffs") {
      const data = this.page.data;
      return html`
        ${data.handoffWarnings?.length ? html`<section class="panel warning"><h3>Invalid handoff artifacts</h3><p class="muted">These are shown as raw files so the frontend remains operable even when one handoff artifact is malformed.</p></section>` : nothing}
        <section class="panel"><h2>Handoff stubs</h2><table><thead><tr><th>title</th><th>lane</th><th>status</th><th>candidate id</th><th>artifact</th><th>bounded start</th></tr></thead><tbody>
          ${data.handoffStubs.length ? data.handoffStubs.map((stub: any) => html`
            <tr>
              <td>${stub.kind === "architecture_handoff_invalid" ? this.artifactLink(stub.relativePath) : html`<a href=${`/handoffs/view?path=${encodeURIComponent(stub.relativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(stub.relativePath)}`); }}>${stub.title}</a>`}${stub.warning ? html`<div class="muted">${stub.warning}</div>` : nothing}</td>
              <td><span class="pill">${stub.lane}</span></td>
              <td>${stub.status}</td>
              <td>${stub.candidateId}</td>
              <td>${this.artifactLink(stub.relativePath)}</td>
              <td>${stub.lane === "architecture" ? (stub.kind === "architecture_handoff_invalid" ? html`<span class="muted">invalid handoff artifact</span>` : stub.startRelativePath ? html`<a href=${`/architecture-starts/view?path=${encodeURIComponent(stub.startRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(stub.startRelativePath)}`); }}>view bounded start</a>` : html`<button class="secondary" @click=${() => this.startArchitecture(stub.relativePath)}>start bounded work</button>`) : html`<span class="muted">no start path yet</span>`}</td>
            </tr>`) : html`<tr><td colspan="6" class="muted">No handoff stubs found.</td></tr>`}
        </tbody></table></section>
      `;
    }

    if (this.page.kind === "handoff-detail") {
      const detail = this.page.data as FrontendRuntimeFollowUpDetail | any;
      if (!detail.ok) return html`<section class="panel warning"><h2>Handoff not found</h2><pre>${detail.error}</pre></section>`;
      if (detail.kind === "runtime_follow_up") {
        return html`
          <section class="panel"><h2>Runtime follow-up stub</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
            <tr><th>title</th><td>${detail.title}</td></tr>
            <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
            <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
            <tr><th>status</th><td>${detail.status}</td></tr>
            <tr><th>runtime value</th><td>${detail.runtimeValueToOperationalize}</td></tr>
            <tr><th>proposed host</th><td>${detail.proposedHost}</td></tr>
            <tr><th>proposed integration mode</th><td>${detail.proposedIntegrationMode}</td></tr>
            <tr><th>review cadence</th><td>${detail.reviewCadence}</td></tr>
            <tr><th>linked Discovery routing record</th><td>${detail.linkedRoutingPath ? this.artifactLink(detail.linkedRoutingPath) : html`<span class="muted">n/a</span>`}</td></tr>
            <tr><th>next Runtime record</th><td>${detail.runtimeRecordExists ? html`<a href=${`/runtime-records/view?path=${encodeURIComponent(detail.runtimeRecordRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-records/view?path=${encodeURIComponent(detail.runtimeRecordRelativePath || "")}`); }}>Open Runtime record</a>` : html`<span class="muted">${detail.runtimeRecordRelativePath}</span>`}</td></tr>
          </tbody></table></section>
          <section class=${detail.runtimeRecordExists ? "panel good" : detail.approvalAllowed ? "panel message" : "panel warning"}>
            <h3>Runtime review/open boundary</h3>
            <p>${detail.runtimeRecordExists
              ? "This Runtime follow-up has already been explicitly reviewed and opened into one bounded non-executing Runtime record."
              : detail.approvalAllowed
                ? "This review step stays explicit and human-controlled. Approving here opens exactly one bounded non-executing Runtime artifact and stops before proof execution, host integration, or runtime work."
                : "This Runtime follow-up is not in a reviewable state for opening the next bounded Runtime artifact."}</p>
            <div class="actions">
              ${detail.runtimeRecordExists
                ? html`<a href=${`/runtime-records/view?path=${encodeURIComponent(detail.runtimeRecordRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-records/view?path=${encodeURIComponent(detail.runtimeRecordRelativePath || "")}`); }}>Open Runtime record</a>`
                : detail.approvalAllowed
                  ? html`<button @click=${() => this.approveRuntimeFollowUp(detail.relativePath || "")}>Approve Runtime record</button>`
                  : nothing}
            </div>
          </section>
          <section class="panel"><h3>Raw follow-up artifact</h3><pre>${detail.content}</pre></section>
        `;
      }
      const artifact = detail.artifact;
      return html`
        <section class="panel"><h2>Architecture handoff detail</h2><div class="muted mono">${artifact.handoffRelativePath}</div><table><tbody>
          <tr><th>status</th><td>${artifact.status}</td></tr>
          <tr><th>candidate id</th><td>${artifact.candidateId}</td></tr>
          <tr><th>source reference</th><td>${artifact.sourceReference}</td></tr>
          <tr><th>usefulness level</th><td>${artifact.usefulnessLevel}</td></tr>
          <tr><th>usefulness rationale</th><td>${artifact.usefulnessRationale}</td></tr>
          <tr><th>objective</th><td>${artifact.objective}</td></tr>
          <tr><th>Engine run record</th><td>${this.artifactLink(artifact.engineRunRecordPath)}</td></tr>
          <tr><th>Engine run report</th><td>${this.artifactLink(artifact.engineRunReportPath)}</td></tr>
          <tr><th>Discovery routing record</th><td>${this.artifactLink(artifact.discoveryRoutingRecordPath)}</td></tr>
          <tr><th>rollback</th><td>${artifact.rollback}</td></tr>
        </tbody></table></section>
        <section class="grid">
          <section class="panel"><h3>Bounded scope</h3><ul>${artifact.boundedScope.map((item: string) => html`<li>${item}</li>`)}</ul></section>
          <section class="panel"><h3>Inputs</h3><ul>${artifact.inputs.map((item: string) => html`<li>${item}</li>`)}</ul></section>
          <section class="panel"><h3>Validation gates</h3><ul>${artifact.validationGates.map((item: string) => html`<li>${item}</li>`)}</ul></section>
          <section class="panel"><h3>Next decision</h3><ul>${artifact.nextDecision.map((item: string) => html`<li>${item}</li>`)}</ul></section>
        </section>
        <section class=${artifact.startExists ? "panel good" : "panel message"}>
          <h3>Architecture bounded start</h3>
          <p class="muted">Human review and explicit start approval remain required. This path opens the bounded-start artifact only; it does not execute the Architecture work.</p>
          <div class="actions">${artifact.startExists && artifact.startRelativePath ? html`<a href=${`/architecture-starts/view?path=${encodeURIComponent(artifact.startRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(artifact.startRelativePath)}`); }}>Open bounded start</a>` : html`<button @click=${() => this.startArchitecture(artifact.handoffRelativePath)}>Approve bounded start</button>`}</div>
        </section>
        <section class="panel"><h3>Raw handoff artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "runtime-record-detail") {
      const detail = this.page.data as FrontendRuntimeRecordDetail;
      if (!detail.ok) return html`<section class="panel warning"><h2>Runtime record not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel"><h2>Runtime v0 record</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>runtime objective</th><td>${detail.runtimeObjective}</td></tr>
          <tr><th>proposed host</th><td>${detail.proposedHost}</td></tr>
          <tr><th>proposed runtime surface</th><td>${detail.proposedRuntimeSurface}</td></tr>
          <tr><th>required proof summary</th><td>${detail.requiredProofSummary}</td></tr>
          <tr><th>current status</th><td>${detail.currentStatus}</td></tr>
          <tr><th>source Runtime follow-up</th><td>${this.artifactLink(detail.linkedFollowUpRecord)}</td></tr>
          <tr><th>linked Discovery routing record</th><td>${detail.linkedRoutingPath ? this.artifactLink(detail.linkedRoutingPath) : html`<span class="muted">n/a</span>`}</td></tr>
          <tr><th>next Runtime proof artifact</th><td>${detail.proofExists ? html`<a href=${`/runtime-proofs/view?path=${encodeURIComponent(detail.runtimeProofRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-proofs/view?path=${encodeURIComponent(detail.runtimeProofRelativePath || "")}`); }}>Open Runtime proof artifact</a>` : html`<span class="muted">${detail.runtimeProofRelativePath}</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.proofExists ? "panel good" : detail.approvalAllowed ? "panel message" : "panel warning"}>
          <h3>Runtime proof opening boundary</h3>
          <p>${detail.proofExists
            ? "This Runtime v0 record has already been explicitly reviewed and opened into one Runtime proof artifact."
            : detail.approvalAllowed
              ? "This approval step stays explicit and bounded. Approving here opens exactly one Runtime proof artifact and stops before execution, host integration, callable implementation, or promotion work."
              : "This Runtime v0 record is not in an approval state for opening the proof artifact."}</p>
          <div class="actions">
            ${detail.proofExists
              ? html`<a href=${`/runtime-proofs/view?path=${encodeURIComponent(detail.runtimeProofRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-proofs/view?path=${encodeURIComponent(detail.runtimeProofRelativePath || "")}`); }}>Open Runtime proof artifact</a>`
              : detail.approvalAllowed
                ? html`<button @click=${() => this.approveRuntimeRecordProof(detail.relativePath || "")}>Approve Runtime proof artifact</button>`
                : nothing}
          </div>
        </section>
        <section class="panel"><h3>Raw Runtime record</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "runtime-proof-detail") {
      const detail = this.page.data as FrontendRuntimeProofDetail;
      if (!detail.ok) return html`<section class="panel warning"><h2>Runtime proof artifact not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel"><h2>Runtime proof artifact</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>runtime objective</th><td>${detail.runtimeObjective}</td></tr>
          <tr><th>proposed host</th><td>${detail.proposedHost}</td></tr>
          <tr><th>proposed runtime surface</th><td>${detail.proposedRuntimeSurface}</td></tr>
          <tr><th>current status</th><td>${detail.currentStatus}</td></tr>
          <tr><th>Runtime v0 record</th><td>${this.artifactLink(detail.linkedRuntimeRecordPath)}</td></tr>
          <tr><th>source Runtime follow-up</th><td>${this.artifactLink(detail.linkedFollowUpPath)}</td></tr>
          <tr><th>linked Discovery routing record</th><td>${detail.linkedRoutingPath ? this.artifactLink(detail.linkedRoutingPath) : html`<span class="muted">n/a</span>`}</td></tr>
          <tr><th>bounded runtime capability boundary</th><td>${detail.runtimeCapabilityBoundaryExists ? html`<a href=${`/runtime-runtime-capability-boundaries/view?path=${encodeURIComponent(detail.runtimeCapabilityBoundaryRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-runtime-capability-boundaries/view?path=${encodeURIComponent(detail.runtimeCapabilityBoundaryRelativePath || "")}`); }}>Open bounded runtime capability boundary</a>` : html`<span class="muted">${detail.runtimeCapabilityBoundaryRelativePath}</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.runtimeCapabilityBoundaryExists ? "panel good" : detail.approvalAllowed ? "panel message" : "panel warning"}>
          <h3>Bounded runtime capability boundary</h3>
          <p>${detail.runtimeCapabilityBoundaryExists
            ? "This Runtime proof artifact has already been explicitly reviewed and opened into one bounded runtime capability boundary."
            : detail.approvalAllowed
              ? "This approval step stays explicit and bounded. Approving here opens exactly one bounded runtime capability boundary and stops before execution, host integration, callable implementation, or promotion work."
              : "This Runtime proof artifact is not in an approval state for opening the bounded runtime capability boundary."}</p>
          <div class="actions">
            ${detail.runtimeCapabilityBoundaryExists
              ? html`<a href=${`/runtime-runtime-capability-boundaries/view?path=${encodeURIComponent(detail.runtimeCapabilityBoundaryRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-runtime-capability-boundaries/view?path=${encodeURIComponent(detail.runtimeCapabilityBoundaryRelativePath || "")}`); }}>Open bounded runtime capability boundary</a>`
              : detail.approvalAllowed
                ? html`<button @click=${() => this.approveRuntimeProofRuntimeCapabilityBoundary(detail.relativePath || "")}>Approve runtime capability boundary</button>`
                : nothing}
          </div>
        </section>
        <section class="panel"><h3>Raw Runtime proof artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "runtime-runtime-capability-boundary-detail") {
      const detail = this.page.data as FrontendRuntimeRuntimeCapabilityBoundaryDetail;
      if (!detail.ok) return html`<section class="panel warning"><h2>Runtime capability boundary not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel"><h2>Runtime runtime capability boundary</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>runtime objective</th><td>${detail.runtimeObjective}</td></tr>
          <tr><th>proposed host</th><td>${detail.proposedHost}</td></tr>
          <tr><th>proposed runtime surface</th><td>${detail.proposedRuntimeSurface}</td></tr>
          <tr><th>current Runtime proof status</th><td>${detail.currentProofStatus}</td></tr>
          <tr><th>Runtime proof artifact</th><td><a href=${`/runtime-proofs/view?path=${encodeURIComponent(detail.linkedRuntimeProofPath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/runtime-proofs/view?path=${encodeURIComponent(detail.linkedRuntimeProofPath || "")}`); }}>${detail.linkedRuntimeProofPath}</a></td></tr>
          <tr><th>Runtime v0 record</th><td>${this.artifactLink(detail.linkedRuntimeRecordPath)}</td></tr>
          <tr><th>source Runtime follow-up</th><td>${this.artifactLink(detail.linkedFollowUpPath)}</td></tr>
          <tr><th>linked Discovery routing record</th><td>${detail.linkedRoutingPath ? this.artifactLink(detail.linkedRoutingPath) : html`<span class="muted">n/a</span>`}</td></tr>
          <tr><th>promotion-readiness artifact</th><td>${detail.promotionReadinessExists ? html`<a href=${`/artifacts?path=${encodeURIComponent(detail.promotionReadinessRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.promotionReadinessRelativePath || "")}`); }}>Open promotion-readiness artifact</a>` : html`<span class="muted">${detail.promotionReadinessRelativePath}</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.promotionReadinessExists ? "panel good" : detail.approvalAllowed ? "panel message" : "panel warning"}>
          <h3>Promotion-readiness boundary</h3>
          <p>${detail.promotionReadinessExists
            ? "This bounded runtime capability boundary has already been explicitly reviewed and opened into one non-executing promotion-readiness artifact."
            : detail.approvalAllowed
              ? "This approval step stays explicit and bounded. Approving here opens exactly one non-executing promotion-readiness artifact and stops before host-facing promotion, host integration, runtime execution, or callable implementation."
              : "This runtime capability boundary is not in an approval state for opening the promotion-readiness artifact."}</p>
          <div class="actions">
            ${detail.promotionReadinessExists
              ? html`<a href=${`/artifacts?path=${encodeURIComponent(detail.promotionReadinessRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.promotionReadinessRelativePath || "")}`); }}>Open promotion-readiness artifact</a>`
              : detail.approvalAllowed
                ? html`<button @click=${() => this.approveRuntimePromotionReadiness(detail.relativePath || "")}>Approve promotion-readiness artifact</button>`
                : nothing}
          </div>
        </section>
        <section class="panel"><h3>Raw runtime capability boundary</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-start") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Bounded start not found</h2><pre>${detail.error}</pre></section>`;
      const assist = detail.closeoutAssist;
      const resultEvidence = detail.resultEvidence;
      return html`
        <section class="panel good"><h2>Architecture bounded start</h2><div class="muted mono">${detail.relativePath}</div><table><tbody><tr><th>candidate id</th><td>${detail.candidateId}</td></tr><tr><th>candidate name</th><td>${detail.candidateName}</td></tr><tr><th>objective</th><td>${detail.objective}</td></tr><tr><th>start approval</th><td>${detail.startApproval}</td></tr><tr><th>result summary</th><td>${detail.resultSummary}</td></tr><tr><th>handoff stub</th><td><a href=${`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`); }}>${detail.handoffStubPath}</a></td></tr><tr><th>bounded result</th><td>${detail.resultRelativePath ? html`<a href=${`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>Open bounded result</a>` : html`<span class="muted">not recorded yet</span>`}</td></tr></tbody></table></section>
        ${resultEvidence ? html`
          <section class=${resultEvidence.availability === "not_available" ? "panel message" : "panel good"}>
            <h3>Result evidence</h3>
            <p>${resultEvidence.summary}</p>
            <table><tbody>
              <tr><th>evidence kind</th><td>${resultEvidence.primaryKind}</td></tr>
              <tr><th>availability</th><td>${resultEvidence.availability}</td></tr>
              <tr><th>${resultEvidence.primaryLabel}</th><td>${resultEvidence.primaryPath ? html`<a href=${artifactPathToViewPath(resultEvidence.primaryPath)} @click=${(event: Event) => { event.preventDefault(); navTo(artifactPathToViewPath(resultEvidence.primaryPath || "")); }}>${resultEvidence.primaryPath}</a>` : html`<span class="muted">not available</span>`}</td></tr>
            </tbody></table>
            ${resultEvidence.supportingEvidence.length > 0 ? html`
              <div class="panel" style="margin-top:12px;">
                <h4>Supporting evidence</h4>
                <ul>${resultEvidence.supportingEvidence.map((item: { kind: string; path: string; label: string }) => html`<li>${item.label}: <a href=${artifactPathToViewPath(item.path)} @click=${(event: Event) => { event.preventDefault(); navTo(artifactPathToViewPath(item.path)); }}>${item.path}</a></li>`)}</ul>
              </div>
            ` : nothing}
          </section>
        ` : nothing}
        ${assist ? html`
          <section class="panel message">
            <h3>Closeout assist</h3>
            <p>Derived from the bounded start and linked Engine run. Review it, then keep the final closeout decision explicit.</p>
            <table><tbody>
              <tr><th>mission fit summary</th><td>${assist.missionFitSummary}</td></tr>
              <tr><th>primary adoption question</th><td>${assist.primaryAdoptionQuestion}</td></tr>
              <tr><th>directive-owned form</th><td>${assist.directiveOwnedForm}</td></tr>
              <tr><th>intended delta</th><td>${assist.intendedDelta}</td></tr>
              <tr><th>structural stages</th><td>${assist.structuralStages.length > 0 ? assist.structuralStages.join(" -> ") : html`<span class="muted">none detected</span>`}</td></tr>
              <tr><th>stage-preservation expectation</th><td>${assist.stagePreservationExpectation}</td></tr>
              <tr><th>stage-preservation guidance</th><td>${assist.stagePreservationSummary}</td></tr>
              <tr><th>closeout decision guidance</th><td>${assist.decisionGuidance}</td></tr>
            </tbody></table>
            <div class="grid" style="margin-top:12px;">
              <div class="panel">
                <h4>Extracted value</h4>
                ${assist.extractedValue.length > 0 ? html`<ul>${assist.extractedValue.map((item: string) => html`<li>${item}</li>`)}</ul>` : html`<p class="muted">No extracted-value guidance available.</p>`}
              </div>
              <div class="panel">
                <h4>Excluded baggage</h4>
                ${assist.excludedBaggage.length > 0 ? html`<ul>${assist.excludedBaggage.map((item: string) => html`<li>${item}</li>`)}</ul>` : html`<p class="muted">No excluded-baggage guidance available.</p>`}
              </div>
              <div class="panel">
                <h4>Adapted value</h4>
                ${assist.adaptedValue.length > 0 ? html`<ul>${assist.adaptedValue.map((item: string) => html`<li>${item}</li>`)}</ul>` : html`<p class="muted">No adapted-value guidance available.</p>`}
              </div>
              <div class="panel">
                <h4>Improvement goals</h4>
                ${assist.improvementGoals.length > 0 ? html`<ul>${assist.improvementGoals.map((item: string) => html`<li>${item}</li>`)}</ul>` : html`<p class="muted">No improvement-goal guidance available.</p>`}
              </div>
            </div>
            <div class="panel" style="margin-top:12px;">
              <h4>Readiness guidance</h4>
              <ul>${assist.readinessGuidance.map((item: string) => html`<li>${item}</li>`)}</ul>
            </div>
          </section>
        ` : nothing}
        <section class=${detail.resultRelativePath ? "panel good" : "panel message"}>
          <h3>Bounded closeout</h3>
          <p>${detail.resultRelativePath ? "A bounded Architecture result has been recorded for this start artifact." : "Execution still remains manual, but bounded result/closeout can now be recorded directly from this start artifact without rebuilding the context by hand again."}</p>
          ${detail.resultRelativePath ? html`<div class="actions"><a href=${`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>Open bounded result</a>${detail.decisionRelativePath ? html`<a href=${`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`); }}>Open closeout decision JSON</a>` : nothing}</div>` : html`
            <form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.closeArchitectureStart(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
              <div class="row"><label>result summary</label><textarea name="result_summary">${assist?.suggestedResultSummary || "Bounded Architecture slice clarified the next engine-owned adaptation target and should stay experimental until the product-owned implementation artifact is materialized."}</textarea></div>
              <div class="row"><label>primary evidence path</label><input name="primary_evidence_path" placeholder="shared/lib/example.ts or architecture/.../artifact.md" /></div>
              <div class="row"><label>transformed artifacts produced</label><textarea name="transformed_artifacts_produced" placeholder="One workspace-relative path per line when this slice actually materialized concrete artifacts. Leave blank when none were produced."></textarea></div>
              <div class="grid">
                <div class="row"><label>next decision</label><select name="next_decision"><option value="needs-more-evidence">needs-more-evidence</option><option value="adopt">adopt</option><option value="defer">defer</option><option value="reject">reject</option></select></div>
                <div class="row"><label>value shape</label><select name="value_shape"><option value="working_document">working_document</option><option value="design_pattern">design_pattern</option><option value="executable_logic">executable_logic</option><option value="behavior_rule">behavior_rule</option><option value="data_shape">data_shape</option><option value="interface_or_handoff">interface_or_handoff</option><option value="operating_model_change">operating_model_change</option></select></div>
                <div class="row"><label>adaptation quality</label><select name="adaptation_quality"><option value="adequate">adequate</option><option value="strong">strong</option><option value="weak">weak</option><option value="skipped">skipped</option></select></div>
                <div class="row"><label>improvement quality</label><select name="improvement_quality"><option value="skipped">skipped</option><option value="adequate">adequate</option><option value="strong">strong</option><option value="weak">weak</option></select></div>
              </div>
              <div class="actions">
                <label><input type="checkbox" name="proof_executed" /> proof executed</label>
                <label><input type="checkbox" name="target_artifact_clarified" checked /> target artifact clarified</label>
                <label><input type="checkbox" name="delta_evidence_present" checked /> delta evidence present</label>
                <label><input type="checkbox" name="no_unresolved_baggage" /> unresolved baggage cleared</label>
                <label><input type="checkbox" name="product_artifact_materialized" /> product artifact materialized</label>
                <button type="submit">Record bounded closeout</button>
              </div>
            </form>
          `}
        </section>
        <section class="panel"><h3>Raw bounded-start artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-result") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Bounded result not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture bounded result</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>objective</th><td>${detail.objective}</td></tr>
          <tr><th>closeout approval</th><td>${detail.closeoutApproval}</td></tr>
          <tr><th>result summary</th><td>${detail.resultSummary}</td></tr>
          <tr><th>next decision</th><td>${detail.nextDecision}</td></tr>
          <tr><th>closeout verdict</th><td>${detail.verdict}</td></tr>
          <tr><th>closeout rationale</th><td>${detail.rationale}</td></tr>
          <tr><th>bounded start</th><td><a href=${`/architecture-starts/view?path=${encodeURIComponent(detail.startRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(detail.startRelativePath || "")}`); }}>${detail.startRelativePath}</a></td></tr>
          <tr><th>handoff stub</th><td><a href=${`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`); }}>${detail.handoffStubPath}</a></td></tr>
          <tr><th>closeout decision artifact</th><td><a href=${`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`); }}>${detail.decisionRelativePath}</a></td></tr>
          <tr><th>next bounded start</th><td>${detail.continuationStartRelativePath ? html`<a href=${`/architecture-starts/view?path=${encodeURIComponent(detail.continuationStartRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(detail.continuationStartRelativePath || "")}`); }}>Open continuation start</a>` : html`<span class="muted">not opened yet</span>`}</td></tr>
          <tr><th>adoption artifact</th><td>${detail.adoptionRelativePath ? html`<a href=${`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`); }}>Open adoption artifact</a>` : html`<span class="muted">not materialized yet</span>`}</td></tr>
        </tbody></table></section>
        ${detail.resultEvidence ? html`
          <section class=${detail.resultEvidence.availability === "not_available" ? "panel message" : "panel good"}>
            <h3>Result evidence</h3>
            <p>${detail.resultEvidence.summary}</p>
            <table><tbody>
              <tr><th>evidence kind</th><td>${detail.resultEvidence.primaryKind}</td></tr>
              <tr><th>availability</th><td>${detail.resultEvidence.availability}</td></tr>
              <tr><th>${detail.resultEvidence.primaryLabel}</th><td>${detail.resultEvidence.primaryPath ? html`<a href=${artifactPathToViewPath(detail.resultEvidence.primaryPath)} @click=${(event: Event) => { event.preventDefault(); navTo(artifactPathToViewPath(detail.resultEvidence?.primaryPath || "")); }}>${detail.resultEvidence.primaryPath}</a>` : html`<span class="muted">not available</span>`}</td></tr>
            </tbody></table>
            ${detail.resultEvidence.supportingEvidence.length > 0 ? html`
              <div class="panel" style="margin-top:12px;">
                <h4>Supporting evidence</h4>
                <ul>${detail.resultEvidence.supportingEvidence.map((item: { kind: string; path: string; label: string }) => html`<li>${item.label}: <a href=${artifactPathToViewPath(item.path)} @click=${(event: Event) => { event.preventDefault(); navTo(artifactPathToViewPath(item.path)); }}>${item.path}</a></li>`)}</ul>
              </div>
            ` : nothing}
          </section>
        ` : nothing}
        <section class=${detail.continuationStartRelativePath ? "panel good" : "panel message"}>
          <h3>Bounded continuation</h3>
          <p>${detail.continuationStartRelativePath
            ? "A next bounded Architecture start has already been opened from this result artifact."
            : "This bounded result can now seed the next bounded Architecture start directly, so the operator does not have to reconstruct the continuation slice by hand again."}</p>
          ${detail.verdict === "stay_experimental" && detail.nextDecision === "needs-more-evidence"
            ? html`<div class="actions">${detail.continuationStartRelativePath
              ? html`<a href=${`/architecture-starts/view?path=${encodeURIComponent(detail.continuationStartRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(detail.continuationStartRelativePath || "")}`); }}>Open continuation start</a>`
              : html`<button @click=${() => this.continueArchitectureResult(detail.relativePath || "")}>Open next bounded start</button>`}</div>`
            : html`<p class="muted">Continuation is only available for stay-experimental results whose next decision is needs-more-evidence.</p>`}
        </section>
        <section class=${detail.adoptionRelativePath ? "panel good" : "panel message"}>
          <h3>Adopt / Materialize</h3>
          <p>${detail.adoptionRelativePath
            ? "This bounded result has already been materialized into a product-owned Architecture adoption artifact."
            : "This bounded result can now be retained as a product-owned Architecture adoption artifact without reconstructing the result chain by hand."}</p>
          <div class="actions">${detail.adoptionRelativePath
            ? html`<a href=${`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`); }}>Open adoption artifact</a>`
            : html`<button @click=${() => this.adoptArchitectureResult(detail.relativePath || "")}>Adopt / Materialize</button>`}</div>
        </section>
        <section class="panel"><h3>Raw bounded-result artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-adoption") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Adoption artifact not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture adoption artifact</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>final status</th><td>${detail.finalStatus}</td></tr>
          <tr><th>source bounded result</th><td><a href=${`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`); }}>${detail.sourceResultRelativePath}</a></td></tr>
          <tr><th>paired decision artifact</th><td><a href=${`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`); }}>${detail.decisionRelativePath}</a></td></tr>
          <tr><th>implementation target</th><td>${detail.implementationTargetRelativePath ? html`<a href=${`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.implementationTargetRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.implementationTargetRelativePath || "")}`); }}>Open implementation target</a>` : html`<span class="muted">not created yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.implementationTargetRelativePath ? "panel good" : "panel message"}><h3>Create Implementation Target</h3><p>${detail.implementationTargetRelativePath ? "A bounded Architecture implementation target has already been opened from this adoption artifact." : "This adoption artifact can now open one bounded Architecture implementation target directly, without reconstructing the adopted result chain by hand."}</p><div class="actions">${detail.implementationTargetRelativePath ? html`<a href=${`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.implementationTargetRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.implementationTargetRelativePath || "")}`); }}>Open implementation target</a>` : html`<button @click=${() => this.createArchitectureImplementationTarget(detail.relativePath || "")}>Create Implementation Target</button>`}</div></section>
        <section class="panel"><h3>Raw adoption artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-implementation-target") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Implementation target not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture implementation target</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>artifact type intent</th><td>${detail.artifactType}</td></tr>
          <tr><th>final adoption status</th><td>${detail.finalStatus}</td></tr>
          <tr><th>objective</th><td>${detail.objective}</td></tr>
          <tr><th>expected outcome</th><td>${detail.expectedOutcome}</td></tr>
          <tr><th>source adoption artifact</th><td><a href=${`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`); }}>${detail.adoptionRelativePath}</a></td></tr>
          <tr><th>paired adoption decision</th><td><a href=${`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`); }}>${detail.decisionRelativePath}</a></td></tr>
          <tr><th>source bounded result</th><td><a href=${`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`); }}>${detail.sourceResultRelativePath}</a></td></tr>
          <tr><th>implementation result</th><td>${detail.implementationResultRelativePath ? html`<a href=${`/architecture-implementation-results/view?path=${encodeURIComponent(detail.implementationResultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-results/view?path=${encodeURIComponent(detail.implementationResultRelativePath || "")}`); }}>Open implementation result</a>` : html`<span class="muted">not recorded yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.implementationResultRelativePath ? "panel good" : "panel message"}><h3>Complete Implementation</h3><p>${detail.implementationResultRelativePath ? "A bounded implementation result has already been recorded for this target." : "This implementation target can now close out into one bounded implementation result artifact without reconstructing the adopted chain by hand."}</p>${detail.implementationResultRelativePath ? html`<div class="actions"><a href=${`/architecture-implementation-results/view?path=${encodeURIComponent(detail.implementationResultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-results/view?path=${encodeURIComponent(detail.implementationResultRelativePath || "")}`); }}>Open implementation result</a></div>` : html`<form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.completeArchitectureImplementation(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
          <div class="row"><label>actual result summary</label><textarea name="result_summary">Bounded implementation slice completed the retained Architecture target and kept the materialization boundary explicit.</textarea></div>
          <div class="grid">
            <div class="row"><label>outcome</label><select name="outcome"><option value="success">success</option><option value="failure">failure</option></select></div>
            <div class="row"><label>validation result</label><input name="validation_result" value="Implementation stayed within the bounded target and remained aligned with the adopted artifact." /></div>
          </div>
          <div class="row"><label>deviations</label><textarea name="deviations"></textarea></div>
          <div class="row"><label>evidence</label><textarea name="evidence"></textarea></div>
          <div class="row"><label>rollback note</label><textarea name="rollback_note">Return to the implementation target artifact and adjust the bounded slice before attempting another completion.</textarea></div>
          <div class="actions"><button type="submit">Complete Implementation</button></div>
        </form>`}</section>
        <section class="panel"><h3>Raw implementation target artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-implementation-result") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Implementation result not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture implementation result</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>objective</th><td>${detail.objective}</td></tr>
          <tr><th>outcome</th><td>${detail.outcome}</td></tr>
          <tr><th>actual result summary</th><td>${detail.resultSummary}</td></tr>
          <tr><th>validation result</th><td>${detail.validationResult}</td></tr>
          <tr><th>rollback note</th><td>${detail.rollbackNote}</td></tr>
          <tr><th>source implementation target</th><td><a href=${`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`); }}>${detail.targetRelativePath}</a></td></tr>
          <tr><th>source adoption artifact</th><td><a href=${`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`); }}>${detail.adoptionRelativePath}</a></td></tr>
          <tr><th>source bounded result</th><td><a href=${`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.sourceResultRelativePath || "")}`); }}>${detail.sourceResultRelativePath}</a></td></tr>
          <tr><th>retained output</th><td>${detail.retainedRelativePath ? html`<a href=${`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`); }}>Open retained artifact</a>` : html`<span class="muted">not confirmed yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.retainedRelativePath ? "panel good" : "panel message"}><h3>Confirm Retention</h3><p>${detail.retainedRelativePath ? "This implementation result has already been confirmed as retained Directive Workspace Architecture output." : "This implementation result can now be confirmed as retained Directive Workspace Architecture output without reconstructing the full chain by hand."}</p>${detail.retainedRelativePath ? html`<div class="actions"><a href=${`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`); }}>Open retained artifact</a></div>` : html`<form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.confirmArchitectureRetention(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
          <div class="row"><label>final usefulness assessment</label><textarea name="usefulness_assessment">This completed implementation result is worth retaining as Directive-owned Architecture output within the current bounded engine-improvement scope.</textarea></div>
          <div class="grid">
            <div class="row"><label>stability level</label><select name="stability_level"><option value="bounded-stable">bounded-stable</option><option value="stable">stable</option><option value="provisional">provisional</option></select></div>
            <div class="row"><label>reuse scope</label><input name="reuse_scope" value="Retain for Directive Workspace Architecture use within the current engine-improvement boundary." /></div>
          </div>
          <div class="row"><label>confirmation decision</label><textarea name="confirmation_decision">Retain this implementation result as valid Directive Workspace Architecture output for the current bounded scope.</textarea></div>
          <div class="row"><label>rollback boundary</label><textarea name="rollback_boundary">If this retained output proves unstable or premature, return to the implementation result or implementation target and reopen a bounded Architecture slice.</textarea></div>
          <div class="actions"><button type="submit">Confirm Retention</button></div>
        </form>`}</section>
        <section class="panel"><h3>Raw implementation-result artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-retained") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Retained artifact not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Retained Architecture output</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>retained objective</th><td>${detail.objective}</td></tr>
          <tr><th>stability level</th><td>${detail.stabilityLevel}</td></tr>
          <tr><th>reuse scope</th><td>${detail.reuseScope}</td></tr>
          <tr><th>confirmation decision</th><td>${detail.confirmationDecision}</td></tr>
          <tr><th>rollback boundary</th><td>${detail.rollbackBoundary}</td></tr>
          <tr><th>source implementation result</th><td><a href=${`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>${detail.resultRelativePath}</a></td></tr>
          <tr><th>source implementation target</th><td><a href=${`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`); }}>${detail.targetRelativePath}</a></td></tr>
          <tr><th>source adoption artifact</th><td><a href=${`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-adoptions/view?path=${encodeURIComponent(detail.adoptionRelativePath || "")}`); }}>${detail.adoptionRelativePath}</a></td></tr>
          <tr><th>integration record</th><td>${detail.integrationRecordRelativePath ? html`<a href=${`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRecordRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRecordRelativePath || "")}`); }}>Open integration record</a>` : html`<span class="muted">not created yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.integrationRecordRelativePath ? "panel good" : "panel message"}><h3>Create Integration Record</h3><p>${detail.integrationRecordRelativePath ? "An integration-ready Architecture record has already been opened from this retained output." : "This retained output can now be recorded as integration-ready Directive Workspace Architecture output without reconstructing the full chain by hand."}</p>${detail.integrationRecordRelativePath ? html`<div class="actions"><a href=${`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRecordRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRecordRelativePath || "")}`); }}>Open integration record</a></div>` : html`<form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.createArchitectureIntegrationRecord(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
          <div class="row"><label>integration target/surface</label><textarea name="integration_target_surface">Directive Workspace engine-owned product logic within the current Architecture boundary.</textarea></div>
          <div class="row"><label>readiness summary</label><textarea name="readiness_summary">This retained Architecture output is stable enough within the bounded scope to be recorded as integration-ready product input.</textarea></div>
          <div class="row"><label>expected effect</label><textarea name="expected_effect">Directive Workspace can consume this retained output as an explicit engine-owned integration candidate without re-reading the prior Architecture chain.</textarea></div>
          <div class="row"><label>validation boundary</label><textarea name="validation_boundary">Validate against the retained artifact, implementation result, and bounded source chain only; do not imply execution or downstream automation.</textarea></div>
          <div class="row"><label>integration decision</label><textarea name="integration_decision">Record this retained output as integration-ready Directive Workspace Architecture output for the current bounded scope.</textarea></div>
          <div class="row"><label>rollback boundary</label><textarea name="rollback_boundary">If this integration-ready record proves premature, fall back to the retained artifact and reopen a bounded Architecture slice before any further integration step.</textarea></div>
          <div class="actions"><button type="submit">Create Integration Record</button></div>
        </form>`}</section>
        <section class="panel"><h3>Raw retained artifact</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-integration-record") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Integration record not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture integration record</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>retained objective</th><td>${detail.objective}</td></tr>
          <tr><th>integration target/surface</th><td>${detail.integrationTargetSurface}</td></tr>
          <tr><th>readiness summary</th><td>${detail.readinessSummary}</td></tr>
          <tr><th>expected effect</th><td>${detail.expectedEffect}</td></tr>
          <tr><th>validation boundary</th><td>${detail.validationBoundary}</td></tr>
          <tr><th>integration decision</th><td>${detail.integrationDecision}</td></tr>
          <tr><th>rollback boundary</th><td>${detail.rollbackBoundary}</td></tr>
          <tr><th>source retained artifact</th><td><a href=${`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`); }}>${detail.retainedRelativePath}</a></td></tr>
          <tr><th>source implementation result</th><td><a href=${`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>${detail.resultRelativePath}</a></td></tr>
          <tr><th>source implementation target</th><td><a href=${`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-targets/view?path=${encodeURIComponent(detail.targetRelativePath || "")}`); }}>${detail.targetRelativePath}</a></td></tr>
          <tr><th>consumption record</th><td>${detail.consumptionRelativePath ? html`<a href=${`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath || "")}`); }}>Open consumption record</a>` : html`<span class="muted">not recorded yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.consumptionRelativePath ? "panel good" : "panel message"}><h3>Record Consumption</h3><p>${detail.consumptionRelativePath ? "A bounded applied-integration record has already been created from this integration record." : "This integration-ready Architecture record can now be marked as actually consumed by Directive Workspace without reconstructing the retained chain by hand."}</p>${detail.consumptionRelativePath ? html`<div class="actions"><a href=${`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath || "")}`); }}>Open consumption record</a></div>` : html`<form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.recordArchitectureConsumption(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
          <div class="row"><label>where it was applied</label><textarea name="applied_surface">Directive Workspace engine-owned product logic within the current bounded Architecture surface.</textarea></div>
          <div class="row"><label>application summary</label><textarea name="application_summary">This integration-ready Architecture output has now been explicitly consumed as engine-owned Directive Workspace product input within the bounded scope.</textarea></div>
          <div class="row"><label>observed effect</label><textarea name="observed_effect">Directive Workspace now has an explicit applied-integration record for this retained Architecture output without re-reading the prior chain.</textarea></div>
          <div class="grid">
            <div class="row"><label>outcome</label><select name="outcome"><option value="success">success</option><option value="failure">failure</option></select></div>
            <div class="row"><label>validation result</label><input name="validation_result" value="Consumption stayed within the integration-ready boundary and remained linked to the retained Architecture chain." /></div>
          </div>
          <div class="row"><label>rollback note</label><textarea name="rollback_note">If this applied integration proves premature or inaccurate, fall back to the integration record and reopen a bounded Architecture review before any further step.</textarea></div>
          <div class="actions"><button type="submit">Record Consumption</button></div>
        </form>`}</section>
        <section class="panel"><h3>Raw integration record</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-consumption-record") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Consumption record not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture consumption record</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>retained objective</th><td>${detail.objective}</td></tr>
          <tr><th>where it was applied</th><td>${detail.appliedSurface}</td></tr>
          <tr><th>application summary</th><td>${detail.applicationSummary}</td></tr>
          <tr><th>observed effect</th><td>${detail.observedEffect}</td></tr>
          <tr><th>validation result</th><td>${detail.validationResult}</td></tr>
          <tr><th>outcome</th><td>${detail.outcome}</td></tr>
          <tr><th>rollback note</th><td>${detail.rollbackNote}</td></tr>
          <tr><th>source integration record</th><td><a href=${`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRelativePath || "")}`); }}>${detail.integrationRelativePath}</a></td></tr>
          <tr><th>source retained artifact</th><td><a href=${`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`); }}>${detail.retainedRelativePath}</a></td></tr>
          <tr><th>source implementation result</th><td><a href=${`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-implementation-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>${detail.resultRelativePath}</a></td></tr>
          <tr><th>post-consumption evaluation</th><td>${detail.evaluationRelativePath ? html`<a href=${`/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(detail.evaluationRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(detail.evaluationRelativePath || "")}`); }}>Open evaluation</a>` : html`<span class="muted">not evaluated yet</span>`}</td></tr>
        </tbody></table></section>
        <section class=${detail.evaluationRelativePath ? "panel good" : "panel message"}><h3>Evaluate After Use</h3><p>${detail.evaluationRelativePath ? "A post-consumption keep/reopen decision has already been recorded for this applied-integration artifact." : "This consumption record can now be evaluated as keep or reopen without reconstructing the applied Architecture chain by hand."}</p>${detail.evaluationRelativePath ? html`<div class="actions"><a href=${`/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(detail.evaluationRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-post-consumption-evaluations/view?path=${encodeURIComponent(detail.evaluationRelativePath || "")}`); }}>Open evaluation</a></div>` : html`<form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.evaluateArchitectureConsumption(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
          <div class="grid">
            <div class="row"><label>keep or reopen</label><select name="decision"><option value="keep">keep</option><option value="reopen">reopen</option></select></div>
            <div class="row"><label>observed stability</label><input name="observed_stability" value="Observed behavior stayed stable within the applied integration boundary." /></div>
          </div>
          <div class="row"><label>rationale</label><textarea name="rationale">Real bounded use validated this applied Architecture output strongly enough to keep it as valid retained Directive Workspace Architecture output.</textarea></div>
          <div class="row"><label>retained usefulness assessment</label><textarea name="retained_usefulness_assessment">The retained Architecture output still appears useful and valid after real bounded consumption.</textarea></div>
          <div class="row"><label>next bounded action if reopen</label><textarea name="next_bounded_action">No reopen action required within the current bounded scope.</textarea></div>
          <div class="row"><label>rollback note</label><textarea name="rollback_note">If this evaluation later proves inaccurate, return to the consumption record and reassess keep versus reopen before any further step.</textarea></div>
          <div class="actions"><button type="submit">Evaluate After Use</button></div>
        </form>`}</section>
        <section class="panel"><h3>Raw consumption record</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "architecture-post-consumption-evaluation") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Post-consumption evaluation not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Post-consumption evaluation</h2><div class="muted mono">${detail.relativePath}</div><table><tbody>
          <tr><th>candidate id</th><td>${detail.candidateId}</td></tr>
          <tr><th>candidate name</th><td>${detail.candidateName}</td></tr>
          <tr><th>usefulness level</th><td>${detail.usefulnessLevel}</td></tr>
          <tr><th>retained objective</th><td>${detail.objective}</td></tr>
          <tr><th>decision</th><td>${detail.decision}</td></tr>
          <tr><th>rationale</th><td>${detail.rationale}</td></tr>
          <tr><th>observed stability</th><td>${detail.observedStability}</td></tr>
          <tr><th>retained usefulness assessment</th><td>${detail.retainedUsefulnessAssessment}</td></tr>
          <tr><th>next bounded action if reopen</th><td>${detail.nextBoundedAction}</td></tr>
          <tr><th>rollback note</th><td>${detail.rollbackNote}</td></tr>
          <tr><th>source consumption record</th><td><a href=${`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-consumption-records/view?path=${encodeURIComponent(detail.consumptionRelativePath || "")}`); }}>${detail.consumptionRelativePath}</a></td></tr>
          <tr><th>source integration record</th><td><a href=${`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-integration-records/view?path=${encodeURIComponent(detail.integrationRelativePath || "")}`); }}>${detail.integrationRelativePath}</a></td></tr>
          <tr><th>source retained artifact</th><td><a href=${`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-retained/view?path=${encodeURIComponent(detail.retainedRelativePath || "")}`); }}>${detail.retainedRelativePath}</a></td></tr>
          <tr><th>reopened bounded start</th><td>${detail.reopenedStartRelativePath ? html`<a href=${`/architecture-starts/view?path=${encodeURIComponent(detail.reopenedStartRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(detail.reopenedStartRelativePath || "")}`); }}>Open reopened start</a>` : html`<span class="muted">${detail.decision === "reopen" ? "not created yet" : "not applicable for keep"}</span>`}</td></tr>
        </tbody></table></section>
        ${detail.decision === "reopen"
          ? html`<section class=${detail.reopenedStartRelativePath ? "panel good" : "panel message"}><h3>Reopen Architecture Work</h3><p>${detail.reopenedStartRelativePath ? "A reopened bounded Architecture start has already been created from this evaluation." : "This post-consumption evaluation can now reopen one bounded Architecture slice directly, without reconstructing the retained and applied chain by hand."}</p>${detail.reopenedStartRelativePath ? html`<div class="actions"><a href=${`/architecture-starts/view?path=${encodeURIComponent(detail.reopenedStartRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-starts/view?path=${encodeURIComponent(detail.reopenedStartRelativePath || "")}`); }}>Open reopened start</a></div>` : html`<div class="actions"><button @click=${() => this.reopenArchitectureFromEvaluation(detail.relativePath || "")}>Reopen Architecture Work</button></div>`}</section>`
          : html`<section class="panel message"><h3>Current boundary</h3><p>This evaluation keeps the applied Architecture output retained. No reopen action is exposed for keep decisions.</p></section>`}
        <section class="panel"><h3>Raw post-consumption evaluation</h3><pre>${detail.content}</pre></section>
      `;
    }

    if (this.page.kind === "artifact") {
      return html`<section class="panel"><h2>Artifact view</h2><div class="muted mono">${this.page.data.relativePath}</div></section><section class="panel"><pre>${this.page.data.content}</pre></section>`;
    }

    return html`<section class="panel warning"><h2>Not found</h2><p>${this.page.path}</p></section>`;
  }

  render() {
    const current = window.location.pathname;
    return html`
      <main>
        <section class="panel">
          <h1>Directive Workspace Frontend</h1>
          <div class="muted">Thin Vite + Lit standalone frontend over real Directive Workspace artifacts and workflows.</div>
          ${this.link("/", "Overview", current === "/")}
          ${this.link("/submit", "Source Submission", current === "/submit")}
          ${this.link("/engine-runs", "Engine Runs", current === "/engine-runs")}
          ${this.link("/queue", "Queue", current === "/queue")}
          ${this.link("/handoffs", "Handoffs", current === "/handoffs")}
        </section>
        ${this.renderContent()}
      </main>
    `;
  }
}

customElements.define("directive-frontend-app", DirectiveFrontendApp);
