## Pact POC (Node.js)

A tiny Pact example with a consumer (Axios client + Jest contract tests) and a provider (Express API + Pact verification). Uses npm workspaces to keep both sides together.

### Project layout
- `consumer/` – contract tests in `test/consumer.pact.test.js` generate `consumer/pacts/poc-consumer-poc-provider.json`
- `provider/` – Express app in `src/server.js` plus Pact verification in `test/provider.pact.verify.test.js`
- Root `package.json` – workspaces and convenience scripts

### Setup
1. Install Node 18+.
2. From the repo root: `npm install` (installs both workspaces).

### Run tests
- Consumer contract tests (creates the pact file): `npm run test:consumer`
- Provider verification (requires PactFlow env vars): `npm run test:provider`
- Everything: `npm test`

### Provider verification (PactFlow-only)
- The verifier now **always** pulls contracts from PactFlow; there is no local file fallback.
- Required env vars when running locally: `PACT_BROKER_BASE_URL`, `PACT_BROKER_TOKEN`, `CONSUMER_BRANCH` (defaults to `main` if omitted), `PROVIDER_VERSION` (any string, e.g. `dev`), and `PROVIDER_BRANCH` (e.g. `local`). Set `CI=true` to publish verification results back to PactFlow.

### GitHub Actions and secrets
- Secrets needed in Repo settings > Secrets and variables > Actions: `PACT_BROKER_BASE_URL` (PactFlow URL) and `PACT_BROKER_TOKEN` (API token).
- `.github/workflows/consumer-ci.yml`: runs on main/PRs, installs deps, runs consumer tests, and publishes pacts to PactFlow only on `main`.
- `.github/workflows/provider-ci.yml`: runs on main/PRs, installs deps, and verifies against PactFlow using the latest consumer contract from `CONSUMER_BRANCH` (default `main`).

### Run the provider API manually
- `npm run start --workspace provider` (defaults to port 8080)
- Endpoints: `GET /users/:id` (only id `1` exists) and `GET /users` (returns `400`).
