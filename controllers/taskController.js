const { sendResponse } = require("../helpers/responseHelper");
const { validateTaskInput, VALID_STATUSES } = require("../helpers/validationHelper");

let tasks = [];

// generate next id safely
function generateId() {
  return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

//  GET all tasks (with filter, search, sort)
function getAllTasks(req, res) {
  try {
    let result = [...tasks];

    // Filter by status
    if (req.query.status) {
      const status = req.query.status.toLowerCase();
      result = result.filter(t => t.status.toLowerCase() === status);
    }

    // Filter by tittle
    if (req.query.title) {
      const title = req.query.title.toLowerCase();
      result = result.filter(t => t.title.toLowerCase() === title);
    }

    // Filter by description
    if (req.query.description) {
      const description = req.query.description.toLowerCase();
      result = result.filter(t => t.description.toLowerCase() === description);
    }

    // Search in title/description
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search))
      );
    }

    // Sorting
    if (req.query.sortBy) {
      const { sortBy, order = "asc" } = req.query;
      result.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    sendResponse(res, true, "Tasks retrieved successfully", result, result.length);
  } catch (err) {
    sendResponse(res.status(500), false, "Server error", null, null, null, err.message);
  }
}

//  GET single task
function getTaskById(req, res) {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return sendResponse(res.status(404), false, "Task not found");
  sendResponse(res, true, "Task retrieved successfully", task);
}

//  CREATE new task
function createTask(req, res) {
  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return sendResponse(res.status(400), false, "Validation failed", null, null, errors);
  }

  const { title, description, status } = req.body;
  const newTask = {
    id: generateId(),
    title,
    description: description || "",
    status,
  };

  tasks.push(newTask);
  sendResponse(res.status(201), true, "Task created successfully", newTask);
}

//  UPDATE task (PUT)
function updateTask(req, res) {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return sendResponse(res.status(404), false, "Task not found");

  const errors = validateTaskInput(req.body, true);
  if (errors.length > 0) {
    return sendResponse(res.status(400), false, "Validation failed", null, null, errors);
  }

  const { title, description, status } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  sendResponse(res, true, "Task updated successfully", task);
}

//  PATCH task status
function updateTaskStatus(req, res) {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return sendResponse(res.status(404), false, "Task not found");

  const { status , title , description } = req.body;

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return sendResponse(res.status(400), false, "Invalid status value");
    }
    task.status = status;
  }

  if (title !== undefined) {
    if (title.trim() === "") {
      return sendResponse(res.status(400), false, "Title cannot be empty");
    }
    task.title = title;
  }

  if (description !== undefined) {
    task.description = description;
  }


  sendResponse(res, true, "Task status updated successfully", task);
}

//  DELETE task
function deleteTask(req, res) {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return sendResponse(res.status(404), false, "Task not found");

  const deletedTask = tasks.splice(index, 1)[0];
  sendResponse(res, true, "Task deleted successfully", deletedTask);
}

//  STATS
function getStats(req, res) {
  const stats = {
    total: tasks.length,
    toDo: tasks.filter(t => t.status === "To Do").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length,
  };
  sendResponse(res, true, "Task statistics retrieved successfully", stats);
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getStats,
};
