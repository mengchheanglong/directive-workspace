import fs from "node:fs";
import path from "node:path";

export function listCandidateMarkdownFiles(input: {
  directiveRoot: string;
  relativeDir: string;
  candidateId: string;
}) {
  const absoluteDir = path.join(input.directiveRoot, input.relativeDir);
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs.readdirSync(absoluteDir, { withFileTypes: true }).filter((entry) =>
    entry.isFile() && entry.name.endsWith(".md") && entry.name.includes(input.candidateId)
  );
}
