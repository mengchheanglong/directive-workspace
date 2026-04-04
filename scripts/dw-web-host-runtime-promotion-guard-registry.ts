export type DwWebHostRuntimePromotionGuardCase = {
  contractPath: string;
  profileId: string;
  title: string;
  candidateId: string;
  surfaceLabel: string;
  candidateLabel: string;
  purposeLine: string;
  nonImplicationList: string[];
};

export const DW_WEB_HOST_RUNTIME_PROMOTION_GUARD_CASES: readonly DwWebHostRuntimePromotionGuardCase[] = [
  {
    contractPath: "shared/contracts/openmoss-dw-web-host-runtime-promotion-guard.md",
    profileId: "openmoss_dw_web_host_manual_promotion_guard/v1",
    title: "OpenMOSS DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-mission-openmoss-runtime-orchestration-2026-03-26",
    surfaceLabel: "OpenMOSS",
    candidateLabel: "OpenMOSS candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the OpenMOSS Runtime Orchestration Surface.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "callable implementation",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/scientify-dw-web-host-runtime-promotion-guard.md",
    profileId: "scientify_dw_web_host_manual_promotion_guard/v1",
    title: "Scientify DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-live-scientify-engine-pressure-2026-03-24",
    surfaceLabel: "Scientify live-pressure",
    candidateLabel: "Scientify live-pressure candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the Scientify live-pressure Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/openmoss-pressure-dw-web-host-runtime-promotion-guard.md",
    profileId: "openmoss_pressure_dw_web_host_manual_promotion_guard/v1",
    title: "OpenMOSS Pressure DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-pressure-openmoss-architecture-loop-2026-03-26",
    surfaceLabel: "OpenMOSS pressure",
    candidateLabel: "OpenMOSS pressure candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the OpenMOSS pressure Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/puppeteer-pressure-dw-web-host-runtime-promotion-guard.md",
    profileId: "puppeteer_pressure_dw_web_host_manual_promotion_guard/v1",
    title: "Puppeteer Pressure DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-pressure-puppeteer-bounded-tool-2026-03-25",
    surfaceLabel: "Puppeteer pressure",
    candidateLabel: "Puppeteer pressure candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the Puppeteer pressure Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/real-mini-swe-agent-runtime-route-dw-web-host-runtime-promotion-guard.md",
    profileId: "real_mini_swe_agent_runtime_route_dw_web_host_manual_promotion_guard/v1",
    title: "mini-swe-agent Runtime Route Proof DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-real-mini-swe-agent-runtime-route-v0-2026-03-25",
    surfaceLabel: "mini-swe route",
    candidateLabel: "mini-swe route candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the mini-swe route Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/scientify-pressure-dw-web-host-runtime-promotion-guard.md",
    profileId: "scientify_pressure_dw_web_host_manual_promotion_guard/v1",
    title: "Scientify Pressure DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-pressure-scientify-2026-03-25",
    surfaceLabel: "Scientify pressure",
    candidateLabel: "Scientify pressure candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the Scientify pressure Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
  {
    contractPath: "shared/contracts/temporal-durable-execution-dw-web-host-runtime-promotion-guard.md",
    profileId: "temporal_durable_execution_dw_web_host_manual_promotion_guard/v1",
    title: "Temporal Durable Execution DW Web-Host Runtime Promotion Guard",
    candidateId: "dw-source-temporal-durable-execution-2026-04-01",
    surfaceLabel: "Temporal Durable Execution Platform",
    candidateLabel: "Temporal durable-execution candidate",
    purposeLine:
      "Define one bounded manual host-facing promotion record for the Temporal Durable Execution Platform Runtime surface on the Directive Workspace web host.",
    nonImplicationList: [
      "registry acceptance",
      "host integration",
      "runtime execution",
      "promotion automation",
    ],
  },
] as const;
