const express = require("express");

function createApp() {
  const app = express();

  app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Hard-coded data for the PoC
    if (id === 1) {
      return res.json({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      });
    }

    return res.status(404).json({ message: "User not found" });
  });

  app.get("/users", (req, res) => {
    return res.status(400).json({ message: "userId is required" });
  });

  return app;
}

// Start server only if this file is run directly
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Provider listening on port ${port}`);
  });
}

module.exports = { createApp };
