const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    decription:{
        type:String,
        trim:true,
        default:"No Decription"
    },
    
     completed: {
        type: Boolean,
        default: false
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate:{
        type:Date,
        default:Date.now()
    },
    category:{
        type:String,
        default:"No Category"
    },
    updatedAt:{
        type:Date,
        timestamps:true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Todo',todoSchema)
