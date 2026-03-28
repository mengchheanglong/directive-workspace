/**
 * Directive-owned literature-access tool bundle.
 *
 * Adapted from Scientify Research Workflow Plugin under the bounded
 * Runtime proof for candidate dw-source-scientify-research-workflow-plugin-2026-03-27.
 *
 * This bundle contains exactly 4 tools:
 * - arxivSearch: Search arXiv papers by query
 * - arxivDownload: Download arXiv papers (tex source with PDF fallback)
 * - openalexSearch: Search academic works across all disciplines via OpenAlex
 * - unpaywallDownload: Download open-access PDFs via Unpaywall
 *
 * Excluded from this bundle:
 * - Scientify orchestrator, skills, hooks, metabolism, knowledge-state system
 * - github-search, paper-browser, openreview-lookup tools
 * - OpenClaw plugin registration infrastructure
 */

export { arxivSearch } from "./arxiv-search.js";
export type {
  ArxivSearchInput,
  ArxivSearchResult,
  ArxivPaperResult,
} from "./arxiv-search.js";

export { arxivDownload } from "./arxiv-download.js";
export type {
  ArxivDownloadInput,
  ArxivDownloadResult,
  ArxivDownloadItemResult,
} from "./arxiv-download.js";

export { openalexSearch } from "./openalex-search.js";
export type {
  OpenAlexSearchInput,
  OpenAlexSearchResult,
  OpenAlexWorkResult,
} from "./openalex-search.js";

export { unpaywallDownload } from "./unpaywall-download.js";
export type {
  UnpaywallDownloadInput,
  UnpaywallDownloadResult,
  UnpaywallDownloadItemResult,
} from "./unpaywall-download.js";
