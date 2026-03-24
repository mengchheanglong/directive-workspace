# Puppeteer for OpenClaw

Use this repo as a browser automation backend for OpenClaw and n8n.

Do not treat it as an active product repo. Treat it as tooling.

## Best Role

- real browser rendering
- screenshot capture
- JS-heavy page extraction
- UI flows that APIs do not cover
- smoke checks for web apps

## Recommended Architecture

- `Mission Control` defines the task or stores the result
- `n8n` routes or schedules the work
- `OpenClaw` decides when to run the browser task
- `puppeteer` performs the actual browser interaction

Keep Puppeteer outside OpenClaw core runtime. Use it as an external worker.

## Browser Task Contract

Use a small structured payload.

```json
{
  "task": "capture_page",
  "url": "https://example.com",
  "waitFor": {
    "selector": "body",
    "timeoutMs": 10000
  },
  "actions": [],
  "output": {
    "screenshotPath": "C:/path/to/output.png",
    "jsonPath": "C:/path/to/output.json"
  }
}
```

Supported task styles to standardize around:

- `capture_page`
- `extract_text`
- `fill_form`
- `smoke_check`

## OpenClaw Prompt Pattern

```text
Use Puppeteer as the browser automation backend.

Task
<what browser action to perform>

Target
<url or site>

Output
Return a short operational result with:
- outcome
- any important page data
- screenshot path if captured
- failure reason if blocked
```

## n8n Payload Pattern

```json
{
  "tool": "puppeteer",
  "mode": "browser_task",
  "project": "mission-control",
  "source": "openclaw",
  "task": {
    "task": "smoke_check",
    "url": "http://localhost:3000/dashboard",
    "waitFor": {
      "selector": "body",
      "timeoutMs": 10000
    },
    "output": {
      "screenshotPath": "C:/Users/User/.openclaw/workspace/logs/browser-check.png"
    }
  }
}
```

## Guardrails

- prefer local/dev targets first
- do not automate destructive flows without explicit intent
- store screenshots or extracted output in predictable local paths
- log outcomes back into Mission Control reports when the task matters
- use API routes directly when a browser is not actually needed
