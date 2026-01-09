const Student = require("../models/StudentModel");

// CREATE
const createStudent = async (req, res) => {
  try {
    const { rollno, name, city, fees } = req.body;
    await Student.create({ rollno, name, city, fees });
    res.send("Data saved successfully");
  } catch (error) {
    res.status(500).send("Error saving data");
  }
};

// READ (DISPLAY)
const dataDisplay = async (req, res) => {
  try {
    const data = await Student.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
};

// SEARCH
const dataSearch = async (req, res) => {
  try {
    const { rno } = req.body;
    const data = await Student.find({ rollno: rno });
    res.send(data);
  } catch (error) {
    res.status(500).send("Search failed");
  }
};

// UPDATE PAGE DISPLAY
const updateDisplay = async (req, res) => {
  try {
    const data = await Student.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Error loading update data");
  }
};

// DELETE
const updateDelete = async (req, res) => {
  try {
    const { id } = req.query;
    await Student.findByIdAndDelete(id);
    res.send({ msg: "Data Successfully Deleted!" });
  } catch (error) {
    res.status(500).send("Delete failed");
  }
};

// GET SINGLE STUDENT (EDIT)
const getStudentById = async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);
    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching student");
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { rollno, name, city, fees } = req.body;
    await Student.findByIdAndUpdate(req.params.id, {
      rollno,
      name,
      city,
      fees,
    });
    res.send("Data updated successfully");
  } catch (error) {
    res.status(500).send("Update failed");
  }
};

module.exports = {
  createStudent,
  dataDisplay,
  dataSearch,
  updateDisplay,
  updateDelete,
  getStudentById,
  updateStudent,
};
