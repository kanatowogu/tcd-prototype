# TCD Evidence Assets Directory (Dual-Track Pipeline)

Per Section 4.3 of `the_correction_department_frozen_v1_0.md`, the application attempts to load the following external evidence images from this directory first:

- `/assets/Photo_Initial.png` (Evidence #1 — Act I/II Family Photo)
- `/assets/CCTV_SectorB.png` (Evidence #2 — Act II Ink Bleed Surveillance Snapshot)
- `/assets/Photo_Truth.png` (Evidence #3 — Act III Stapled Truth Record)

If any of these files are not present in `public/assets/`, `<EvidenceArtwork />` automatically falls back to its built-in high-detail retro Analog Horror SVG illustrations with zero configuration required.
