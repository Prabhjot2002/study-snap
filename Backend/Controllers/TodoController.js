const Todo = require("../Models/Todo");
const User = require("../Models/User");
const mongoose = require("mongoose");

const createTodo = async (req, res) => {
  try {
    const { task, email, order } = req.body;
    if (!task || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Task and email are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const todo = new Todo({
      task,
      order,
    });
    await todo.save();

    await User.findOneAndUpdate(
      { email: email },
      { $push: { todos: todo._id } }
    );

    res.status(201).json({ success: true, todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { todoId, task } = req.body;

    if (!todoId) {
      return res
        .status(400)
        .json({ success: false, message: "TodoId is required" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { task },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, updatedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateTodoStatus = async (req, res) => {
  try {
    const { todoId } = req.body;

    if (!todoId) {
      return res
        .status(400)
        .json({ success: false, message: "TodoId is required" });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    todo.isCompleted = !todo.isCompleted;
    const updatedTodo = await todo.save();

    res.json({
      success: true,
      message: "Todo status updated successfully",
      updatedTodo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoId, email } = req.body;

    if (!todoId || !email) {
      return res
        .status(400)
        .json({ success: false, message: "TodoId and email are required" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    await User.findOneAndUpdate({ email: email }, { $pull: { todos: todoId } });

    res.json({ success: true, deletedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const reorderTodo = async (req, res) => {
  try {
    const newOrder = req.body.newOrder;
    await Promise.all(
      newOrder.map(async (todoId, index) => {
        await Todo.updateOne({ _id: todoId }, { $set: { order: index } });
      })
    );
    res
      .status(200)
      .json({ success: true, message: "Todos reordered successfully" });
  } catch (err) {
    console.error("Error reordering todos:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodo,
  updateTodoStatus,
};
