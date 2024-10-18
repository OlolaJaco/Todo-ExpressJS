import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    is_completed: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {Timestamp: true})

const TaskModel = mongoose.model('tasks', taskSchema);

export default TaskModel