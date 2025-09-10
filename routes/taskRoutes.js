const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id/patch", taskController.updateTaskStatus);
router.delete("/:id", taskController.deleteTask);
router.get("/stats/data", taskController.getStats);

module.exports = router;
