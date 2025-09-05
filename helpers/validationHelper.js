const VALID_STATUSES = ["To Do", "In Progress", "Completed"];

function validateTaskInput({ title, status }, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!title || title.trim() === "") errors.push("Title is required");
    if (!status || !VALID_STATUSES.includes(status)) errors.push("Invalid status");
  } else {
    if (title !== undefined && title.trim() === "") errors.push("Title cannot be empty");
    if (status !== undefined && !VALID_STATUSES.includes(status)) errors.push("Invalid status");
  }

  return errors;
}

module.exports = { validateTaskInput, VALID_STATUSES };
