const path = require("path");
const { PactV3, MatchersV3 } = require("@pact-foundation/pact");
const { getUser, getUserWithoutId } = require("../src/client");

const { integer, string, regex } = MatchersV3;

describe("Consumer Pact - poc-consumer -> poc-provider", () => {
  const provider = new PactV3({
    consumer: "poc-consumer",
    provider: "poc-provider",
    dir: path.resolve(__dirname, "../pacts"),
    logLevel: "info",
  });

  describe("GET /users/:id", () => {
    it("returns the user data when the user exists", async () => {
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
            id: integer(1), // numeric id
            name: string("John Doe"), // any string
            email: regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,   // email format
            "john.doe@example.com"          // example value
          ),
        },
      });

      await provider.executeTest(async (mockServer) => {
        const baseUrl = mockServer.url;

        const user = await getUser(1, baseUrl);

        expect(user.id).toBe(1);
        expect(typeof user.id).toBe("number");
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("returns 404 when the user does not exist", async () => {
      provider
        .given("user with id 999 does not exist")
        .uponReceiving("a request for a non-existing user")
        .withRequest({
          method: "GET",
          path: "/users/999",
          headers: { Accept: "application/json" },
        })
        .willRespondWith({
          status: 404,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            message: string("User not found"),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const baseUrl = mockServer.url;

        await expect(getUser(999, baseUrl)).rejects.toMatchObject({
          response: {
            status: 404,
            data: { message: "User not found" },
          },
        });
      });
    });

    it("returns 400 when user id is missing", async () => {
      provider
        .given("no user id is provided")
        .uponReceiving("a request for a user without id")
        .withRequest({
          method: "GET",
          path: "/users",
          headers: { Accept: "application/json" },
        })
        .willRespondWith({
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            message: string("userId is required"),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const baseUrl = mockServer.url;

        await expect(getUserWithoutId(baseUrl)).rejects.toMatchObject({
          response: {
            status: 400,
            data: { message: "userId is required" },
          },
        });
      });
    });
  });
});