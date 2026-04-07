import { buildDirectiveBoundedPersistentCoordinationReport } from "../engine/coordination/bounded-persistent-coordination.ts";

const report = buildDirectiveBoundedPersistentCoordinationReport();

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
