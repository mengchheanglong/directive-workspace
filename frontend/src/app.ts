import { LitElement, css, html, nothing } from "lit";

type FrontendQueueEntry = {
  candidate_id: string;
  candidate_name: string;
  status: string;
  routing_target: string | null;
  result_record_path: string | null;
};

type FrontendQueueOverview = {
  entries: FrontendQueueEntry[];
  totalEntries: number;
};

type FrontendHandoffStub = {
  kind: "architecture_handoff" | "architecture_handoff_invalid" | "forge_follow_up";
  lane: "architecture" | "forge";
  relativePath: string;
  candidateId: string;
  title: string;
  status: string;
  startRelativePath: string | null;
  warning: string | null;
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
      } else if (url.pathname === "/handoffs") {
        this.page = { kind: "handoffs", data: await getJson<FrontendSnapshot>("/api/snapshot") };
      } else if (url.pathname === "/handoffs/view") {
        this.page = { kind: "handoff-detail", data: await getJson(`/api/handoffs/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-starts/view") {
        this.page = { kind: "architecture-start", data: await getJson<FrontendArchitectureStartDetail>(`/api/architecture-starts/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
      } else if (url.pathname === "/architecture-results/view") {
        this.page = { kind: "architecture-result", data: await getJson<FrontendArchitectureResultDetail>(`/api/architecture-results/detail?path=${encodeURIComponent(url.searchParams.get("path") || "")}`) };
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
      record_shape: "queue_only",
    };
    const processWithEngine = data.get("process_with_engine") === "on";

    try {
      const result: any = await getJson(
        processWithEngine ? "/api/discovery/submissions?process_with_engine=1" : "/api/discovery/submissions",
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
      );
      const queueEntry = await getJson<FrontendQueueEntry | null>(`/api/queue-entry?candidateId=${encodeURIComponent(candidateId)}`);
      this.submitResult = {
        request: body,
        processWithEngine,
        engineRunId: result.engine?.processed ? result.engine.record?.runId ?? null : null,
        queueEntry,
      };
      form.reset();
      const checkbox = form.querySelector<HTMLInputElement>('input[name="process_with_engine"]');
      if (checkbox) checkbox.checked = true;
    } catch (error) {
      this.submitError = String((error as Error).message || error);
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
      if (!resultSummary) {
        throw new Error("result_summary_required");
      }

      const result: any = await getJson("/api/architecture/bounded-closeout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startPath,
          resultSummary,
          nextDecision: String(data.get("next_decision") || "needs-more-evidence").trim(),
          valueShape: String(data.get("value_shape") || "working_document").trim(),
          adaptationQuality: String(data.get("adaptation_quality") || "adequate").trim(),
          improvementQuality: String(data.get("improvement_quality") || "skipped").trim(),
          proofExecuted: data.get("proof_executed") === "on",
          targetArtifactClarified: data.get("target_artifact_clarified") === "on",
          deltaEvidencePresent: data.get("delta_evidence_present") === "on",
          productArtifactMaterialized: data.get("product_artifact_materialized") === "on",
        }),
      });
      navTo(`/architecture-results/view?path=${encodeURIComponent(result.resultRelativePath)}`);
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
        <section class="panel"><h2>Standalone frontend scope</h2><p class="muted">Use this frontend to operate the real loop directly in Directive Workspace: source submit -> Engine run -> queue or handoff inspection -> Architecture bounded start -> bounded Architecture result. This standalone path still does not materialize downstream handoff stubs from its own submit flow the way the richer Mission Control integration currently does.</p></section>
        ${snapshot.handoffWarnings?.length ? html`<section class="panel warning"><h3>Handoff artifact warnings</h3><ul>${snapshot.handoffWarnings.map((warning: string) => html`<li>${warning}</li>`)}</ul></section>` : nothing}
        <section class="grid">
          <section class="panel"><h3>Engine runs</h3><div>${snapshot.engineRuns.totalRuns}</div><div class="muted">Persisted Engine-native runs.</div></section>
          <section class="panel"><h3>Queue entries</h3><div>${snapshot.queue.totalEntries}</div><div class="muted">Discovery intake queue.</div></section>
          <section class="panel"><h3>Handoff stubs</h3><div>${snapshot.handoffStubs.length}</div><div class="muted">Architecture handoffs and Forge follow-ups.</div></section>
        </section>
      `;
    }

    if (this.page.kind === "submit") {
      const result = this.submitResult;
      const handoffPath = result?.queueEntry?.result_record_path ?? null;
      const honesty = result ? (result.engineRunId && !handoffPath
        ? "This frontend path produced an Engine run but did not materialize a downstream handoff stub. Queue advancement and lane handoff materialization still depend on the richer Mission Control integration path."
        : handoffPath ? `A downstream handoff artifact is linked at ${handoffPath}.` : "No downstream handoff artifact was produced from this submission path.") : "";
      return html`
        <section class="panel">
          <h2>Source submission</h2>
          <p class="muted">Discovery remains the front door. This frontend can write a queue-only submission and optionally process it through the Engine. It does not yet materialize downstream handoff stubs from this path.</p>
          <form @submit=${this.onSubmit}>
            <div class="grid">
              <div class="row"><label>candidate name</label><input name="candidate_name" required /></div>
              <div class="row"><label>candidate id (optional)</label><input name="candidate_id" /></div>
              <div class="row"><label>source type</label><select name="source_type"><option value="internal-signal">internal-signal</option><option value="github-repo">github-repo</option><option value="paper">paper</option><option value="product-doc">product-doc</option><option value="technical-essay">technical-essay</option><option value="workflow-writeup">workflow-writeup</option></select></div>
              <div class="row"><label>capability gap id (optional)</label><input name="capability_gap_id" /></div>
            </div>
            <div class="row"><label>source reference</label><input name="source_reference" required /></div>
            <div class="row"><label>mission alignment</label><textarea name="mission_alignment"></textarea></div>
            <div class="row"><label>notes</label><textarea name="notes"></textarea></div>
            <div class="actions"><label><input type="checkbox" name="process_with_engine" checked /> process with Engine</label><button type="submit">Submit source</button></div>
          </form>
        </section>
        ${this.submitError ? html`<section class="panel warning"><h3>Submission error</h3><pre>${this.submitError}</pre></section>` : nothing}
        ${result ? html`
          <section class="panel message"><h2>Submission result</h2><table><tbody>
            <tr><th>candidate id</th><td>${result.request.candidate_id}</td></tr>
            <tr><th>candidate name</th><td>${result.request.candidate_name}</td></tr>
            <tr><th>source reference</th><td>${result.request.source_reference}</td></tr>
            <tr><th>Engine processing</th><td>${result.processWithEngine ? (result.engineRunId ? "processed" : "requested but no run produced") : "disabled"}</td></tr>
            <tr><th>queue status</th><td>${result.queueEntry?.status ?? "pending"}</td></tr>
            <tr><th>routing target</th><td>${result.queueEntry?.routing_target ?? "n/a"}</td></tr>
            <tr><th>result artifact path</th><td>${this.artifactLink(handoffPath)}</td></tr>
          </tbody></table></section>
          <section class=${handoffPath ? "panel good" : "panel warning"}>
            <h3>Downstream state honesty</h3>
            <p>${honesty}</p>
            <div class="actions">
              ${result.engineRunId ? html`<a href=${`/engine-runs/${encodeURIComponent(result.engineRunId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(result.engineRunId)}`); }}>Open Engine run detail</a>` : nothing}
              <a href="/queue" @click=${(event: Event) => { event.preventDefault(); navTo("/queue"); }}>Open queue view</a>
              <a href="/handoffs" @click=${(event: Event) => { event.preventDefault(); navTo("/handoffs"); }}>Open handoff list</a>
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
          <div class="muted">queue result artifact: ${queueEntry?.result_record_path ?? "n/a"}</div>
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
      return html`<section class="panel"><h2>Discovery queue</h2><table><thead><tr><th>candidate</th><th>status</th><th>advanced</th><th>routing target</th><th>Engine run</th><th>linked artifact</th></tr></thead><tbody>
        ${this.page.queue.entries.length ? this.page.queue.entries.map((entry: any) => {
          const run = runByCandidateId.get(entry.candidate_id);
          const handoff = handoffByCandidateId.get(entry.candidate_id);
          const advanced = entry.status !== "pending" || Boolean(entry.routing_target) || Boolean(entry.result_record_path);
          const handoffPath = entry.result_record_path ?? handoff?.relativePath ?? null;
          return html`<tr><td>${entry.candidate_name}</td><td>${entry.status}</td><td>${advanced ? "yes" : "no"}</td><td>${entry.routing_target ?? "n/a"}</td><td>${run ? html`<a href=${`/engine-runs/${encodeURIComponent(run.runId)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/engine-runs/${encodeURIComponent(run.runId)}`); }}>${run.runId}</a>` : html`<span class="muted">n/a</span>`}</td><td>${handoffPath ? html`<a href=${`/handoffs/view?path=${encodeURIComponent(handoffPath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(handoffPath)}`); }}>${handoffPath}</a>` : html`<span class="muted">n/a</span>`}</td></tr>`;
        }) : html`<tr><td colspan="6" class="muted">No queue entries found.</td></tr>`}
      </tbody></table></section>`;
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
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Handoff not found</h2><pre>${detail.error}</pre></section>`;
      if (detail.kind === "forge_follow_up") {
        return html`<section class="panel"><h2>Forge follow-up stub</h2><div class="muted mono">${detail.relativePath}</div><table><tbody><tr><th>title</th><td>${detail.title}</td></tr><tr><th>candidate id</th><td>${detail.candidateId}</td></tr><tr><th>status</th><td>${detail.status}</td></tr></tbody></table></section><section class="panel warning"><h3>Current product seam</h3><p>Forge follow-up stubs are visible here as real artifacts, but no Forge start-path is implemented in this frontend yet. That missing path is shown honestly instead of implied.</p></section><section class="panel"><h3>Raw follow-up artifact</h3><pre>${detail.content}</pre></section>`;
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

    if (this.page.kind === "architecture-start") {
      const detail = this.page.data;
      if (!detail.ok) return html`<section class="panel warning"><h2>Bounded start not found</h2><pre>${detail.error}</pre></section>`;
      return html`
        <section class="panel good"><h2>Architecture bounded start</h2><div class="muted mono">${detail.relativePath}</div><table><tbody><tr><th>candidate id</th><td>${detail.candidateId}</td></tr><tr><th>candidate name</th><td>${detail.candidateName}</td></tr><tr><th>objective</th><td>${detail.objective}</td></tr><tr><th>start approval</th><td>${detail.startApproval}</td></tr><tr><th>result summary</th><td>${detail.resultSummary}</td></tr><tr><th>handoff stub</th><td><a href=${`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/handoffs/view?path=${encodeURIComponent(detail.handoffStubPath || "")}`); }}>${detail.handoffStubPath}</a></td></tr><tr><th>bounded result</th><td>${detail.resultRelativePath ? html`<a href=${`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>Open bounded result</a>` : html`<span class="muted">not recorded yet</span>`}</td></tr></tbody></table></section>
        <section class=${detail.resultRelativePath ? "panel good" : "panel message"}>
          <h3>Bounded closeout</h3>
          <p>${detail.resultRelativePath ? "A bounded Architecture result has been recorded for this start artifact." : "Execution still remains manual, but bounded result/closeout can now be recorded directly from this start artifact without rebuilding the context by hand again."}</p>
          ${detail.resultRelativePath ? html`<div class="actions"><a href=${`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/architecture-results/view?path=${encodeURIComponent(detail.resultRelativePath || "")}`); }}>Open bounded result</a>${detail.decisionRelativePath ? html`<a href=${`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath)}`} @click=${(event: Event) => { event.preventDefault(); navTo(`/artifacts?path=${encodeURIComponent(detail.decisionRelativePath || "")}`); }}>Open closeout decision JSON</a>` : nothing}</div>` : html`
            <form @submit=${(event: SubmitEvent) => { event.preventDefault(); void this.closeArchitectureStart(event.currentTarget as HTMLFormElement, detail.relativePath || ""); }}>
              <div class="row"><label>result summary</label><textarea name="result_summary">Bounded Architecture slice clarified the next engine-owned adaptation target and should stay experimental until the product-owned implementation artifact is materialized.</textarea></div>
              <div class="grid">
                <div class="row"><label>next decision</label><select name="next_decision"><option value="needs-more-evidence">needs-more-evidence</option><option value="defer">defer</option><option value="reject">reject</option></select></div>
                <div class="row"><label>value shape</label><select name="value_shape"><option value="working_document">working_document</option><option value="design_pattern">design_pattern</option><option value="executable_logic">executable_logic</option><option value="behavior_rule">behavior_rule</option><option value="data_shape">data_shape</option><option value="interface_or_handoff">interface_or_handoff</option><option value="operating_model_change">operating_model_change</option></select></div>
                <div class="row"><label>adaptation quality</label><select name="adaptation_quality"><option value="adequate">adequate</option><option value="strong">strong</option><option value="weak">weak</option><option value="skipped">skipped</option></select></div>
                <div class="row"><label>improvement quality</label><select name="improvement_quality"><option value="skipped">skipped</option><option value="adequate">adequate</option><option value="strong">strong</option><option value="weak">weak</option></select></div>
              </div>
              <div class="actions">
                <label><input type="checkbox" name="proof_executed" /> proof executed</label>
                <label><input type="checkbox" name="target_artifact_clarified" checked /> target artifact clarified</label>
                <label><input type="checkbox" name="delta_evidence_present" checked /> delta evidence present</label>
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
        </tbody></table></section>
        <section class="panel message"><h3>Current boundary</h3><p>This bounded result now closes out the Architecture start slice in a structured product-owned way. Adoption, Architecture-to-Forge handoff, and downstream execution still remain manual.</p></section>
        <section class="panel"><h3>Raw bounded-result artifact</h3><pre>${detail.content}</pre></section>
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
