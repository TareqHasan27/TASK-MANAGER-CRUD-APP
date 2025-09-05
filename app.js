const express = require("express");
const app = express();
const PORT = 3000;

const taskRoutes = require("./routes/taskRoutes");
const { sendResponse } = require("./helpers/responseHelper");

app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Handle 404
app.use((req, res) => {
  sendResponse(res.status(404), false, "Route not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
