const express = require('express');

const router = express.Router();

const protect =
    require('../middlewear/authMiddlewear');

const {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

router.use(protect);

router.route('/')
    .post(createTodo)
    .get(getTodos);

router.route('/:id')
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;