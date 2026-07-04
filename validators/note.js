const yup = require("yup");
const createNoteValidator = yup.object({
  content: yup
    .string()
    .trim()
    .required("Note is required")
    .min(1, "Note cannot be empty")
    .max(255, "Note cannot exceed 255 characters"),
});
const editNoteValidator = yup.object({
  content: yup
    .string()
    .trim()
    .min(1, "Note cannot be empty")
    .max(255, "Note cannot exceed 255 characters"),
});

module.exports = {
  createNoteValidator,
  editNoteValidator,
};
