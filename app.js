const express = require('express')
const bodyParser = require('body-parser')
const Promise = require('bluebird')

const app = express()
const port = process.env.PORT || 3000
const taskRepository = require('./src/taskRepository')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    let defaultTaks = [
        {
            name: 'Welcome to Tasks API',
            description: 'Here you can save temporally your tasks'
        },
        {
            name: 'Create account in Heroku',
            description: 'Enable account and create the fisrt app'
        }
    ]

    try {
        await taskRepository.findById(1)
    } catch (error) {
        await taskRepository.createTable()
            .then(() => Promise.all(defaultTaks.map(task => taskRepository.store(task.name, task.description))))
    }

    res.json({name: 'Todo Application', version: '1.0.0'})
})

app.get('/tasks', (req, res) => {
    taskRepository.all()
        .then(rows => {
            res.json(rows)
        })
        .catch(err => {
            res.json({message: err.code}).status(400)
        })
})

app.post('/tasks', (req, res) => {
    taskRepository.store(req.body.name, req.body.description)
        .then(() => {
            res.status(201).json({message: 'Task created'})
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);



