import fs from "node:fs";
import path from "node:path";

export type DirectiveArtifactLinkValidationState = {
  missingExpectedArtifacts: string[];
  inconsistentLinks: string[];
};

function pushUnique(target: string[], value: string) {
  if (value && !target.includes(value)) {
    target.push(value);
  }
}

export function fileExistsInDirectiveWorkspace(
  directiveRoot: string,
  relativePath: string | null | undefined,
) {
  if (!relativePath) {
    return false;
  }
  return fs.existsSync(path.join(directiveRoot, relativePath));
}

export function readLinkedArtifactIfPresent<T>(input: {
  directiveRoot: string;
  relativePath: string | null | undefined;
  read: (relativePath: string) => T;
}) {
  if (!input.relativePath || !fileExistsInDirectiveWorkspace(input.directiveRoot, input.relativePath)) {
    return null;
  }
  return input.read(input.relativePath);
}

export function recordMissingExpectedArtifact(
  state: DirectiveArtifactLinkValidationState,
  relativePath: string | null | undefined,
) {
  if (!relativePath) {
    return;
  }
  pushUnique(state.missingExpectedArtifacts, relativePath);
}

export function recordInconsistentLink(
  state: DirectiveArtifactLinkValidationState,
  message: string | null | undefined,
) {
  if (!message) {
    return;
  }
  pushUnique(state.inconsistentLinks, message);
}

export function recordMissingLinkedArtifactIfAbsent(input: {
  directiveRoot: string;
  state: DirectiveArtifactLinkValidationState;
  relativePath: string | null | undefined;
  label: string;
}) {
  if (!input.relativePath) {
    return;
  }
  if (!fileExistsInDirectiveWorkspace(input.directiveRoot, input.relativePath)) {
    recordInconsistentLink(input.state, `missing linked ${input.label}: ${input.relativePath}`);
  }
}

export function recordExpectedArtifactIfMissing(input: {
  directiveRoot: string;
  state: DirectiveArtifactLinkValidationState;
  relativePath: string | null | undefined;
}) {
  if (!input.relativePath) {
    return;
  }
  if (!fileExistsInDirectiveWorkspace(input.directiveRoot, input.relativePath)) {
    recordMissingExpectedArtifact(input.state, input.relativePath);
  }
}
