const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: "Creation failed" });
  }
};

exports.getDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};