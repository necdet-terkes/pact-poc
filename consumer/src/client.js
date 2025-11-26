const axios = require("axios");

/**
 * Simple API client that calls the provider's /users/:id endpoint.
 * baseUrl is injected so we can point to Pact mock server in tests.
 */
async function getUser(id, baseUrl) {
  const url = `${baseUrl}/users/${id}`;
  const res = await axios.get(url, {
    headers: { Accept: "application/json" }
  });
  return res.data;
}

module.exports = { getUser };