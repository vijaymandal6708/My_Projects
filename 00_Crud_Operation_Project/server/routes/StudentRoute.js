const express = require("express");
const {
  createStudent,
  dataDisplay,
  dataSearch,
  updateDisplay,
  updateDelete,
  getStudentById,
  updateStudent,
} = require("../controllers/StudentController");

const router = express.Router();

router.post("/create", createStudent);
router.get("/display", dataDisplay);
router.post("/search", dataSearch);
router.get("/updatedata", updateDisplay);
router.delete("/updatedelete", updateDelete);
router.get("/edit/:id", getStudentById);
router.put("/edit/:id", updateStudent);

module.exports = router;
