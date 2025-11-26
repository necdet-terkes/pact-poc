const path = require("path");
const { PactV3 } = require("@pact-foundation/pact");
const { getUser } = require("../src/client");

describe("Consumer Pact - poc-consumer -> poc-provider", () => {
  const provider = new PactV3({
    consumer: "poc-consumer",
    provider: "poc-provider",
    dir: path.resolve(__dirname, "../pacts"),
    logLevel: "info",
  });

  describe("GET /users/:id", () => {
    it("returns the user data", async () => {
      // Interaction tanımı (V3 API)
      provider
        .given("user with id 1 exists")
        .uponReceiving("a request for user 1")
        .withRequest({
          method: "GET",
          path: "/users/1",
          headers: { Accept: "application/json" },
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
          },
        });

      // executeTest mock server'ı ayağa kaldırıyor, test bitince otomatik stop + pact dosyası yazıyor
      await provider.executeTest(async (mockServer) => {
        const baseUrl = mockServer.url; // Örn: http://127.0.0.1:1234

        const user = await getUser(1, baseUrl);

        expect(user.id).toBe(1);
        expect(user.name).toBe("John Doe");
      });
    });
  });
});