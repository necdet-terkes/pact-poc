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
- Provider verification: `npm run test:provider`
- Everything: `npm test`

### Provider verification modes
- **Local file (default)**: if no broker env vars are set, the verifier reads `consumer/pacts/poc-consumer-poc-provider.json`.
- **PactFlow / broker**: set at least `PACT_BROKER_BASE_URL` and `PACT_BROKER_TOKEN`. Optional: `CONSUMER_BRANCH` (defaults to `main`), `PROVIDER_VERSION`, `PROVIDER_BRANCH`, and `CI=true` to publish verification results.

### Run the provider API manually
- `npm run start --workspace provider` (defaults to port 8080)
- Endpoints: `GET /users/:id` (only id `1` exists) and `GET /users` (returns `400`).
