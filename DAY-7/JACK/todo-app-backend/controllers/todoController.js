// backend/controllers/todoController.js

const Todo = require('../models/Todo');
const TeamMember = require('../models/TeamMember');

exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, category, teamId } = req.body;

    // Validate required field
    if (!title) {
      return res.status(400).json({
        message: 'Title is required'
      });
    }

    if (teamId) {
      const membership = await TeamMember.findOne({
        teamId,
        userId: req.user._id
      });

      if (!membership) {
        return res.status(403).json({
          message: 'Not a member of this team'
        });
      }
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      dueDate: dueDate || null,
      category: category || '',
      completed: false,
      user: req.user._id,
      teamId: teamId || null
    });

    res.status(201).json({
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create todo',
      error: error.message
    });
  }
};

//  GET ALL TODOS
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load todos',
      error: error.message
    });
  }
};

// ✅ GET SINGLE TODO BY ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    res.json({
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load todo',
      error: error.message
    });
  }
};

// ✅ UPDATE TODO
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body;

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    // Check authorization
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // Update fields if provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (category !== undefined) todo.category = category;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.json({
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update todo',
      error: error.message
    });
  }
};

// ✅ TOGGLE COMPLETED STATUS (separate endpoint)
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    // Check authorization
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // Toggle completed
    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to toggle todo',
      error: error.message
    });
  }
};

// ✅ DELETE TODO
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    // Check authorization
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    await todo.deleteOne();

    res.json({
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete todo',
      error: error.message
    });
  }
};

exports.searchTodos = async (req, res) => {
  try {
    const query = req.query.q || '';

    const todos = await Todo.find({
      user: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      message: 'Search failed',
      error: error.message
    });
  }
};