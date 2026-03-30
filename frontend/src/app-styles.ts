import { css } from "lit";

export const appStyles = css`
  :host { display:block; color:#1f1c16; }
  main { max-width:1180px; margin:0 auto; padding:20px; }
  .panel { background:#fffdf7; border:1px solid #d9d0bf; border-radius:10px; padding:16px; margin:0 0 16px; }
  .grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
  .queue-summary-grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); margin:0 0 16px; }
  .queue-card-list { display:grid; gap:14px; }
  .queue-card { border:1px solid #e2d9c8; border-radius:12px; padding:16px; background:linear-gradient(180deg,#fffdf9 0%,#fcf8ef 100%); }
  .queue-card.runtime { border-color:#b8ccef; box-shadow:0 0 0 1px rgba(17,85,170,0.08) inset; }
  .queue-card.architecture { border-color:#d6c1e8; box-shadow:0 0 0 1px rgba(94,57,145,0.06) inset; }
  .queue-card.monitor { border-color:#d9d0bf; background:#fcfaf4; }
  .queue-card-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin:0 0 12px; }
  .queue-card-title { margin:0; font-size:24px; line-height:1.2; }
  .queue-card-subtitle { margin:4px 0 0; font-size:12px; color:#5c5548; word-break:break-word; }
  .queue-tag-row { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
  .queue-kv-grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); margin:0 0 12px; }
  .queue-kv { border:1px solid #e7dfd1; border-radius:10px; padding:12px; background:#fffdfa; min-width:0; }
  .queue-kv h4 { margin:0 0 6px; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#6a624f; }
  .queue-kv p { margin:0; }
  .queue-stage { font-size:14px; font-weight:700; word-break:break-word; }
  .queue-step { font-size:14px; line-height:1.5; }
  .queue-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; padding-top:12px; border-top:1px solid #ece3d2; }
  .queue-link-list { display:flex; gap:10px; flex-wrap:wrap; }
  .queue-highlight { border:1px solid #d5c8b1; border-radius:12px; padding:14px; background:#f9f3e7; }
  .queue-highlight h3 { margin:0 0 8px; }
  .queue-highlight p { margin:0; }
  .queue-count { font-size:28px; font-weight:700; line-height:1; margin:0 0 6px; }
  .queue-empty { text-align:center; padding:24px; border:1px dashed #d9d0bf; border-radius:12px; background:#fcfaf4; }
  .lane-case-strip { border:1px solid #d9d0bf; border-radius:14px; padding:16px; background:linear-gradient(180deg,#fffdf9 0%,#f8f2e6 100%); overflow:hidden; min-width:0; }
  .lane-case-strip.runtime { border-color:#b8ccef; background:linear-gradient(180deg,#f7fbff 0%,#edf4ff 100%); }
  .lane-case-strip.architecture { border-color:#d6c1e8; background:linear-gradient(180deg,#fbf7ff 0%,#f3ecfb 100%); }
  .lane-case-strip h3 { margin:0 0 8px; }
  .lane-case-strip p, .lane-case-strip li { margin:0; overflow-wrap:anywhere; }
  .lane-case-strip-grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); margin-top:14px; }
  .lane-case-strip-card { border:1px solid #e6dcc8; border-radius:12px; background:#fff; padding:12px; min-width:0; overflow:hidden; }
  .lane-case-strip.runtime .lane-case-strip-card { border-color:#d5e3f7; }
  .lane-case-strip.architecture .lane-case-strip-card { border-color:#e2d4f0; }
  .lane-case-strip-card h4 { margin:0 0 6px; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#5b6170; }
  .lane-case-strip-card p, .lane-case-strip-card li { overflow-wrap:anywhere; }
  .runtime-lane-grid { display:grid; gap:14px; grid-template-columns:1.2fr 0.8fr; align-items:start; }
  .runtime-lane-stack { display:grid; gap:12px; }
  .runtime-anchor-list { display:grid; gap:10px; }
  .runtime-anchor-item { border:1px solid #d5e3f7; border-radius:12px; background:#fff; padding:12px; min-width:0; overflow:hidden; }
  .runtime-anchor-item h4 { margin:0 0 6px; font-size:15px; }
  .runtime-anchor-item p { margin:0; overflow-wrap:anywhere; }
  .lane-overview-grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); }
  .lane-overview-card { border:1px solid #d9d0bf; border-radius:14px; background:linear-gradient(180deg,#fffdf9 0%,#f8f2e6 100%); padding:16px; min-width:0; overflow:hidden; }
  .lane-overview-card.runtime { border-color:#b8ccef; background:linear-gradient(180deg,#f7fbff 0%,#edf4ff 100%); }
  .lane-overview-card.architecture { border-color:#d6c1e8; background:linear-gradient(180deg,#fbf7ff 0%,#f3ecfb 100%); }
  .lane-overview-card.discovery { border-color:#d9d0bf; background:linear-gradient(180deg,#fffdf9 0%,#f8f2e6 100%); }
  .lane-overview-card h3 { margin:0 0 8px; }
  .lane-overview-card p { margin:0; overflow-wrap:anywhere; }
  .lane-overview-stats { display:grid; gap:10px; grid-template-columns:repeat(2,minmax(0,1fr)); margin:14px 0; }
  .lane-overview-stat { border:1px solid #e6dcc8; border-radius:10px; background:#fffdfa; padding:10px; min-width:0; overflow:hidden; }
  .lane-overview-stat h4 { margin:0 0 4px; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; color:#6a624f; }
  .lane-overview-stat p { margin:0; }
  .lane-page-grid { display:grid; gap:14px; grid-template-columns:1.15fr 0.85fr; align-items:start; }
  .lane-page-stack { display:grid; gap:12px; }
  .lane-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
  .lane-case-list { display:grid; gap:12px; }
  .hero { background:linear-gradient(180deg,#fffdfa 0%,#f7f1e5 100%); border:1px solid #d7ccb6; border-radius:14px; padding:18px; }
  .hero h2 { margin:0 0 8px; }
  .hero p { margin:0; }
  .hero-meta { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 0; }
  .lane-head-strip-grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); }
  .seam-grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
  .seam-card { border:1px solid #e4dbc9; border-radius:12px; background:#fffdfa; padding:14px; min-width:0; }
  .seam-card h3 { margin:0 0 8px; font-size:15px; }
  .seam-card p { margin:0; }
  .seam-card ul { margin:0; }
  .seam-value { font-size:16px; font-weight:700; line-height:1.4; word-break:break-word; }
  .link-stack { display:grid; gap:8px; }
  .seam-note { border-left:4px solid #b8ccef; padding-left:12px; }
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
  .panel, .queue-card, .queue-kv, .queue-highlight, .hero, .seam-card { overflow:hidden; }
  .queue-card-title, .queue-card-subtitle, .queue-stage, .queue-step, .seam-value, .pill { overflow-wrap:anywhere; }
  @media (max-width: 720px) {
    main { padding:14px; }
    .queue-card-header { flex-direction:column; }
    .queue-tag-row { justify-content:flex-start; }
    .hero-meta { flex-direction:column; align-items:flex-start; }
    .runtime-lane-grid { grid-template-columns:1fr; }
    .lane-page-grid { grid-template-columns:1fr; }
  }
`;
