// Importing the required modules
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TaskModel from './models/TaskModel.js';

// Create an Express app
const app = express();

// configuring dotenv
dotenv.config();

const port = process.env.PORT;

// configuring the view engine
app.set('view engine', 'ejs')

// setting up middleware
app.use(morgan('dev')); // logging middleware
app.use(bodyParser.json()) // JSON parsing middleware

// Serving Static file from 'public' directory
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
    TaskModel.find({})
        .then((task) => {
            res.render('index.ejs', { todos: task })
        })
});

app.post('/tasks/', (req, res) => {
    const newTodo = new TaskModel({
        task: req.body.task
    });

    newTodo.save();
    res.redirect('/');
})

app.post('/tasks/:id/complete', (req, res) => {
    TaskModel.findById(req.params.id)
        .then((todo) => {
            todo.is_completed = !todo.is_completed;
            todo.save();
            res.redirect('/');
        });
})

app.post('/tasks/:id/update', (req, res) => {
    TaskModel.findById(req.params.id)
        .then((todo) => {
            todo.task = req.body.task;
            todo.save();
            res.redirect('/');
        });
});

app.post('/tasks/:id/delete', (req, res) => {
    TaskModel.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/')
        })
})

app.listen(port || 3000, () => {
    console.log(`Server is listening to port ${port}`);

    mongoose.connect(process.env.MONGO_URL)
    try {
        console.log('Database Connected');
    } catch (error) {
        console.log('Database not connnected');
    }
})

export default mongoose;