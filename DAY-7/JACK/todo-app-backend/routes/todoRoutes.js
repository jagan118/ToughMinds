const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const Todo = require('../models/Todo');
const TeamMember = require('../models/TeamMember');
const protect = require('../middlewear/authMiddlewear');

router.use(protect);

// Frontend: this.http.get<{ data: Todo[] }>(`${this.apiUrl}`)
router.get('/', todoController.getTodos);

// Frontend: this.http.get<{ data: Todo[] }>(`${this.apiUrl}/search`, { params })
router.get('/search', todoController.searchTodos);

// ========== GET TEAM TODOS ==========
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    const membership = await TeamMember.findOne({
      teamId,
      userId: req.user._id
    });

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this team' });
    }

    const todos = await Todo.find({ teamId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Team todos fetched',
      todos,
      count: todos.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend: this.http.get<{ data: Todo }>(`${this.apiUrl}/${id}`)
router.get('/:id', todoController.getTodoById);

// Frontend: this.http.post<{ data: Todo }>(`${this.apiUrl}`, { ... })
router.post('/', todoController.createTodo);

// Frontend: this.http.put<{ data: Todo }>(`${this.apiUrl}/${id}`, updates)
router.put('/:id', todoController.updateTodo);

// Frontend: this.http.patch<{ data: Todo }>(`${this.apiUrl}/${id}/toggle`, {})
router.patch('/:id/toggle', todoController.toggleTodo);

// Frontend: this.http.delete(`${this.apiUrl}/${id}`)
router.delete('/:id', todoController.deleteTodo);

module.exports = router;