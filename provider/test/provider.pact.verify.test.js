const { Verifier } = require("@pact-foundation/pact");
const { createApp } = require("../src/server");

let server;
const PORT = process.env.PORT || 8080;
const PROVIDER_BASE_URL = `http://localhost:${PORT}`;

describe("Pact Provider Verification", () => {
  beforeAll((done) => {
    const app = createApp();
    server = app.listen(PORT, () => {
      console.log(`Test provider running on ${PROVIDER_BASE_URL}`);
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("validates the expectations of poc-consumer from PactFlow", async () => {
    const isCI = process.env.CI === "true";

    const opts = {
      providerBaseUrl: PROVIDER_BASE_URL,
      provider: "poc-provider",
      logLevel: "info",

      // 🔗 Her zaman PactFlow üzerinden kontrat oku
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,

      consumerVersionSelectors: [
        {
          branch: process.env.CONSUMER_BRANCH || "main",
          latest: true,
        },
      ],

      providerVersion: process.env.PROVIDER_VERSION || "dev",
      providerVersionBranch: process.env.PROVIDER_BRANCH || "local",

      // ✅ CI'da verification sonucunu PactFlow'a publish et
      publishVerificationResult: isCI,
    };

    const output = await new Verifier(opts).verifyProvider();
    console.log("Pact verification complete:", output);
  });
});