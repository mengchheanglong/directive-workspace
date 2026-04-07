# Runtime Meta

This folder holds Runtime-wide inventories, policy catalogs, and accounting surfaces that describe the lane but are not themselves lifecycle steps or capability code.

Contents:
- `BOUNDARY_INVENTORY.json` - Runtime package/mirror boundary inventory
- `EXTRACTION_CANDIDATES.md` - retained extraction candidate reference notes
- `IMPORT_SOURCE_POLICY.json` - source-pack and import eligibility policy
- `LIVE_RUNTIME_ACCOUNTING.json` - legacy live-runtime accounting inventory
- `PROMOTION_PROFILES.json` - canonical promotion profile catalog

These stay under `runtime/` because they are Runtime-owned authority surfaces.
They stay out of the numbered flow because they are metadata, not lifecycle artifacts.
