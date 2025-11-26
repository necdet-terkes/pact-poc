const path = require("path");
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

  it("validates the expectations of poc-consumer", async () => {
    const hasBroker = !!process.env.PACT_BROKER_BASE_URL;
    const isCI = process.env.CI === "true";

    const commonOpts = {
      providerBaseUrl: PROVIDER_BASE_URL,
      provider: "poc-provider",
      logLevel: "info",
    };

    const opts = hasBroker
      ? {
          // PactFlow / broker mode
          ...commonOpts,
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

          // Publish verification result to PactFlow in CI
          publishVerificationResult: isCI,
        }
      : {
          // Local file mode (no broker env)
          ...commonOpts,
          pactUrls: [
            path.resolve(
              __dirname,
              "../../consumer/pacts/poc-consumer-poc-provider.json"
            ),
          ],
        };

    const output = await new Verifier(opts).verifyProvider();
    console.log("Pact verification complete:", output);
  });
});
