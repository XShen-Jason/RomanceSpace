# RomanceSpace Project Rules & Conventions

## 1. Cloudflare Domains and Environments
- **Main Engine (Worker)**:
  - Custom Domain (Active): `romancespace.885201314.xyz`
  - Fallback/Dev Domain (Inactive): `romancespace.leeyukiho.workers.dev`
- **Documentation Site (Pages)**: 
  - Domain: `document.885201314.xyz` (and `*.pages.dev` aliases)

## 2. CI/CD Deployment Rules
- **romancespace Worker**: Integrated with GitHub. Pushing code to the `main` branch will automatically trigger a build and deployment.
- **document Pages**: Deployment is currently not fully synced via GitHub. Any changes to documentation must be manually deployed using `npx wrangler pages deploy public` from the `document/` directory.

## 3. KV Storage Rules
- KV Namespace Binding is strictly named `ROMANCESPACE_KV` (or a similar project-specific naming).
- The KV holds project routing information (`{[subdomain]: {type, data}}`).

## 4. API & Data Integration
- Subdomains map to physical templates inside `src/projects/`.
- Developer conventions and integration steps are maintained in the Documentation Pages (`/pages/developer-guide.html`).
- The default root page (e.g. `romancespace.885201314.xyz` without subdomains) should act as a catalog/landing page explaining the available templates.
