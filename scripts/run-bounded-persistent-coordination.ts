import { buildDirectiveBoundedPersistentCoordinationReport } from "../shared/lib/bounded-persistent-coordination.ts";

const report = buildDirectiveBoundedPersistentCoordinationReport();

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
