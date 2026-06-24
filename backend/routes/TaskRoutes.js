const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


// ======================
// GET ALL TASKS + SEARCH + FILTER
// ======================
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status === "completed") {
      query.completed = true;
    }

    if (status === "pending") {
      query.completed = false;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// GET SINGLE TASK
// ======================
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// CREATE TASK
// ======================
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Title is required (min 3 characters)",
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description || "",
    });

    const saved = await task.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// TOGGLE COMPLETED
// ======================
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;

    const updated = await task.save();
    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// DELETE TASK
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;