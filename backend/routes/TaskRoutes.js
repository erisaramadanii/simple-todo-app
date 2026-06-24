const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

const normalizeTaskResponse = (task) => {
  const data = task.toObject ? task.toObject() : task;
  const isCompleted = data.status === "completed" || data.completed === true;

  return {
    ...data,
    status: isCompleted ? "completed" : "not_completed",
    completed: isCompleted,
  };
};

router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status === "completed") {
      query.$or = [{ status: "completed" }, { completed: true }];
    }

    if (status === "not_completed") {
      query.$and = [
        {
          $or: [
            { status: "not_completed" },
            { status: { $exists: false }, completed: false },
          ],
        },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks.map(normalizeTaskResponse));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(normalizeTaskResponse(task));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
      status: "not_completed",
      completed: false,
    });

    const saved = await task.save();
    res.status(201).json(normalizeTaskResponse(saved));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.body.status &&
      !["completed", "not_completed"].includes(req.body.status)
    ) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    if (req.body.status) {
      task.status = req.body.status;
      task.completed = req.body.status === "completed";
    }

    if (typeof req.body.completed === "boolean") {
      task.completed = req.body.completed;
      task.status = req.body.completed ? "completed" : "not_completed";
    }

    const updated = await task.save();
    res.json(normalizeTaskResponse(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isCompleted = task.status === "completed" || task.completed === true;
    task.status = isCompleted ? "not_completed" : "completed";
    task.completed = !isCompleted;

    const updated = await task.save();
    res.json(normalizeTaskResponse(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
