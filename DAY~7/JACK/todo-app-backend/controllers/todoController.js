const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {

    const todo = await Todo.create({

        title: req.body.title,

        user: req.user._id
    });

    res.status(201).json(todo);
};

exports.getTodos = async (req, res) => {

    const todos =
        await Todo.find({
            user: req.user._id
        });

    res.json(todos);
};

exports.updateTodo = async (req, res) => {

    const todo = await Todo.findById(req.params.id);

    if (!todo)
        return res.status(404).json({
            message: 'Todo not found'
        });

    if (
        todo.user.toString() !== req.user._id.toString()
    ) {

        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    todo.completed = !todo.completed;

    await todo.save();

    res.json(todo);
};

exports.deleteTodo = async (req, res) => {

    const todo = await Todo.findById(req.params.id);

    if (!todo)
        return res.status(404).json({
            message: 'Todo not found'
        });

    await todo.deleteOne();

    res.json({
        message: 'Deleted'
    });
};